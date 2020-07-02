const request = require("request");
const prettyBytes = require("pretty-bytes");
const fs = require("fs");
const requireLogin = require("../middlewares/requireLogin");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const uploader = require("../services/uploader");
let express = require("express");
let app = express.Router();
const config = require("../config");

module.exports = (db, globals, usageMiddleware, token) => {
  /* ------------------------------------------------- */
  /* Create message */
  /* ------------------------------------------------- */
  app.post(
    "/",
    [requireLogin, usageMiddleware.extractAdmin, usageMiddleware.smsLimit],
    async (req, res) => {
      let newConversationCreated = false;
      let conversationRouted = false;
      const { chat, conversation, internal, sent, failed, tags } = req.body;
      let conversationData = await db.Conversation.findOne({
        where: { id: conversation },
      });
      if (conversationData.is_close) {
        let oldConversationData = await db.Conversation.findOne({
          where: {
            _contact: conversationData._contact,
            _group: conversationData._group,
            is_close: false,
          },
        });
        if (!oldConversationData) {
          let params = {
            _group: conversationData._group,
            _did: conversationData._did,
            _contact: conversationData._contact,
            notRepliedTo: false,
            unread: 0,
            assignee: req.user.id,
          };
          const conversation = new db.Conversation(params);
          conversationData = await conversation.save();
          newConversationCreated = true;
        } else {
          conversationData = oldConversationData;
          conversationRouted = true;
        }
      }

      const did = await db.DID.findOne({
        where: {
          id: conversationData._did,
        },
      });

      const from = did.number;
      if (!from) {
        return res.status(501).send("No from number available");
      }
      if (internal) {
        if (!conversationData.tags) {
          conversationData.tags = {};
        }
        tags.map((tag) => {
          let newObj = {};
          if (conversationData.tags[tag]) {
            newObj[tag] = conversationData.tags[tag] + 1;
          } else {
            newObj[tag] = 1;
          }
          conversationData.tags = { ...conversationData.tags, ...newObj };
        });
        const params = {
          date: Date(),
          message: chat,
          _conversation: conversationData.id,
          _from: req.user.id,
          internal,
          sent,
          failed,
        };
        const messageObj = new db.Message(params);

        await messageObj.save();
        await conversationData.save();
        if (!newConversationCreated && !conversationRouted)
          globals.publisher.publish(
            "UPDATE_CONVERSATION",
            JSON.stringify({
              room: conversationData._group,
              conversation: conversationData,
            })
          );
        else if (newConversationCreated)
          globals.publisher.publish(
            "CREATE_CONVERSATION",
            JSON.stringify({
              ...params,
              id: conversationData.id,
              room: conversationData._group,
              _group: conversationData._group,
              phone: conversationData.phone,
              _did: conversationData._did,
            })
          );
        else
          globals.publisher.publish(
            "ROUTE_CONVERSATION",
            JSON.stringify({
              ...params,
              id: conversationData.id,
              room: conversationData._group,
              _group: conversationData._group,
              phone: conversationData.phone,
              _did: conversationData._did,
            })
          );
        res.send({
          ...params,
          tags: conversationData.tags,
          from: req.user.given_name + " " + req.user.family_name,
        });
      } else {
        const contact = await db.Contact.findOne({
          where: {
            id: conversationData._contact,
          },
        });
        // ----------------------- Ytel SMS API ----------------------- //
        if (did.carrier === "Ytel") {
          const { accessToken } = token.token.data;
          var dataString = `{"from":${from}, "to":${contact.phone_number.replace(
            /\D/g,
            ""
          )}, "text": "${chat}", "MessageStatusCallback": "${
            config.backendUrl
          }/message/receiveStatus"}`;
          var options = {
            method: "POST",
            url: "https://api-beta.ytel.com/api/v4/sms/",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `bearer ${accessToken}`,
            },
            body: dataString,
          };
        }

        if (did.carrier === "Questblue") {
          var headers = {
            "Content-type": "application/json",
            "Security-Key": config.questBluekey,
            Authorization:
              "Basic " +
              new Buffer("harkirat" + ":" + "123random").toString("base64"),
          };
          var dataString = `{"did": ${from}, "did_to": ${contact.phone_number.replace(
            /\D/g,
            ""
          )}, "msg": "${chat}", "file": null, "fname": null}`;
          var options = {
            method: "POST",
            url: "https://api2.questblue.com/sms",
            headers: headers,
            body: dataString,
          };
        }

        request(options, async (error, response, body) => {
          if (error) throw new Error(error);
          const params = {
            date: Date(),
            message: chat,
            _conversation: conversationData.id,
            _from: req.user.id,
            sms_response: "",
            internal,
            sent,
            failed,
          };
          const messageObj = new db.Message(params);
          await messageObj.save();
          conversationData.unread = 0;
          conversationData.notRepliedTo = false;
          await conversationData.save();
          if (req.isFreePlan) {
            db.User.decrement(
              { complimentary_sms: 1 },
              { where: { id: req.userAdmin.id } }
            );
          } else {
            db.Usage.increment(
              { messages: 1 },
              { where: { user_id: req.userAdmin.id, month: req.month } }
            );
          }
          if (newConversationCreated) {
            globals.publisher.publish(
              "CREATE_CONVERSATION",
              JSON.stringify({
                ...params,
                id: conversationData.id,
                room: conversationData._group,
                _group: conversationData._group,
                phone: conversationData.phone,
                _did: conversationData._did,
              })
            );
          }
          if (conversationRouted) {
            globals.publisher.publish(
              "ROUTE_CONVERSATION",
              JSON.stringify({
                ...params,
                id: conversationData.id,
                room: conversationData._group,
                _group: conversationData._group,
                phone: conversationData.phone,
                _did: conversationData._did,
              })
            );
          }
          res.send({
            conversationRouted,
            newConversationCreated,
            id: messageObj.id,
            tags: conversationData.tags,
            ...params,
            from: req.user.given_name + " " + req.user.family_name,
          });
        });
      }
    }
  );

  /* ------------------------------------------------- */
  /* For getting all messages */
  /* ------------------------------------------------- */
  app.get("/:conversationId", requireLogin, async (req, res) => {
    const conversation = await db.Conversation.findOne({
      where: {
        id: req.params.conversationId,
      },
    });
    const contact = await db.Contact.findOne({
      where: {
        id: conversation._contact,
      },
    });

    const newMessages = await getMessagesForConversation(
      req.params.conversationId,
      conversation._group,
      conversation._did
    );
    const oldConversations = db.Conversation.findAll({
      where: {
        _contact: conversation._contact,
        is_close: true,
        _group: conversation._group,
        id: { [Sequelize.Op.not]: req.params.conversationId },
      },
    });
    let oldMessages = await oldConversations.map(async (conversation) => {
      return getMessagesForConversation(
        conversation.id,
        conversation._group,
        conversation._did
      );
    });
    res.send({ messages: newMessages, contact, oldMessages });
  });

  let getMessagesForConversation = async (id, _group, _did) => {
    const messages = await db.Message.findAll({
      where: {
        _conversation: id,
      },
    });
    const userDetails = await db.User.findAll({
      where: {
        id: {
          [Op.in]: messages.map((message) => message._from),
        },
      },
    });
    return messages.map((obj) => {
      const from = userDetails.filter((user) => user.id === obj._from)[0];
      return {
        id: obj.id,
        message: obj.message,
        message_type: obj._from ? "FROM" : "TO",
        from: from ? from.given_name + " " + from.family_name : "",
        from_email: from ? from.email : "",
        date: obj.date,
        internal: obj.internal,
        sent: obj.sent,
        failed: obj.failed,
        attachment: obj.attachment,
        attachment_name: obj.attachment_name,
        attachment_size: obj.attachment_size
          ? prettyBytes(obj.attachment_size)
          : null,
        filename: obj.filename,
        close_type: obj.close_type,
        _group,
        _did,
      };
    });
  };

  /* ------------------------------------------------- */
  /* For updating message status */
  /* ------------------------------------------------- */
  app.post("/receiveStatus", async (req, res) => {
    const MessageSid = req.body.MessageSid;
    const Status = req.body.Status;
    let message = await db.Message.findOne({
      where: {
        sms_response: {
          Message360: {
            Message: {
              MessageSid: MessageSid,
            },
          },
        },
      },
    });
    if (message) {
      if (Status === "sent") {
        await db.Message.update(
          { sent: true, sent_date: Date() },
          { where: { id: message.id } }
        );
      }
      globals.publisher.publish(
        "RECEIVE_MESSAGE_STATUS",
        JSON.stringify({ message, status: Status })
      );
    }

    res.send();
  });

  /* ------------------------------------------------- */
  /* For receiving SMS */
  /* ------------------------------------------------- */
  app.post("/ytel/receiveSMS", async (req, res) => {
    let From = req.body.From;
    let To = req.body.To;
    let Text = req.body.Text;
    let MediaUrl = req.body.MediaURL;
    await _setMessage(
      From.substr(2),
      To.substr(1),
      Text,
      req.body,
      req.body.MediaUrl
    );
    res.send();
  });

  /* ------------------------------------------------- */
  /* For receiving SMS from Questblue */
  /* ------------------------------------------------- */
  app.post(
    "/questblue/receiveSMS",
    uploader.array("media"),
    async (req, res) => {
      let From = req.body.from;
      let To = req.body.to;
      let Text = req.body.msg;
      if (req.files && req.files.length > 0) {
        for (let i = 1; i < req.files.length; i++) {
          await _setMessage(
            req.body.from.substr(2),
            req.body.to.substr(2),
            req.body.msg,
            req.body,
            `${config.backendUrl}/file/${req.files[i].filename}`
          );
        }
      } else
        _setMessage(
          req.body.from.substr(2),
          req.body.to.substr(2),
          req.body.msg,
          req.body
        );
      return res.json({});
    }
  );

  const _setMessage = async function (From, To, Text, body, MediaUrl) {
    if (From && To) {
      let newConversationCreated = false;
      let did = await db.DID.findOne({
        where: { number: To },
      });
      if (!did) {
        console.log("DID not found");
        return;
      }
      const group = did._group;
      if (!group) {
        return;
      }
      const groupData = await db.Group.findOne({
        where: {
          id: group,
        },
      });

      let contact = await db.Contact.findOne({
        where: {
          phone_number: From,
          _user: groupData._user,
        },
      });
      if (!contact) {
        contact = await db.Contact.create({
          phone_number: "1"+From.replace(/\D/g,""),
          _user: groupData._user,
          _original_group: did._group,
          _last_conversation_group: did._group,
        });
      } else {
        contact._last_conversation_group = did._group;
        contact.save();
      }

      let conversationData = await db.Conversation.findOne({
        where: {
          _did: did.id + "",
          _group: group + "",
          _contact: contact.id,
          is_close: false,
        },
      });

      if (!conversationData) {
        const params = {
          name: From,
          _group: group,
          _did: did.id,
          _contact: contact.id,
          notRepliedTo: true,
          unread: 1,
        };
        const conversation = new db.Conversation(params);
        conversationData = await conversation.save();
        newConversationCreated = true;
      } else {
        await db.Conversation.increment(
          { unread: 1 },
          { where: { id: conversationData.id } }
        );
      }

      const params = {
        date: Date(),
        message: Text,
        _conversation: conversationData.id,
        sms_response: JSON.stringify(body),
        attachment: MediaUrl ? true : false,
        attachment_name: MediaUrl ? MediaUrl : null,
        filename: MediaUrl ? MediaUrl : null,
      };
      await db.Message.create(params);
      if (newConversationCreated) {
        globals.publisher.publish(
          "CREATE_CONVERSATION",
          JSON.stringify({
            ...params,
            id: conversationData.id,
            room: conversationData._group,
            _group: conversationData._group,
            phone: conversationData.phone,
            _did: conversationData._did,
          })
        );
      } else
        globals.publisher.publish(
          "RECEIVE_MESSAGE",
          JSON.stringify({ ...params, room: did._group })
        );
    }
  };

  /* ------------------------------------------------- */
  /* For attachments? */
  /* ------------------------------------------------- */
  app.post(
    "/file",
    [requireLogin, uploader.single("file")],
    async (req, res) => {
      let { conversation, internal, sent, failed } = req.body;
      if (req.file.size >= 50 * 1000000) {
        return res.status(400).json({ message: "File exceeds 50 mb" });
      }
      const chat = req.file.filename;
      const conversationData = await db.Conversation.findOne({
        where: {
          id: conversation,
        },
      });
      if (!conversationData) {
        return res.status(501).send("Conversation not found");
      }
      const did = await db.DID.findOne({
        where: {
          id: conversationData._did,
        },
      });
      const from_phone = did ? did.number : null;
      if (!from_phone) {
        return res.status(501).send("No from number available");
      }
      var file_name = req.file.filename;
      internal = JSON.parse(internal);
      if (internal) {
        const messageObj = new db.Message({
          date: Date(),
          message: chat,
          _conversation: conversation,
          _from: req.user.id,
          internal,
          sent,
          failed,
          attachment: true,
          attachment_name: file_name,
          attachment_size: req.file.size,
          filename: `${config.backendUrl}/file/${file_name}`,
        });
        message_response = await messageObj.save();
        return res.send(message_response);
      }
      const contact = await db.Contact.findOne({
        where: {
          id: conversationData._contact,
        },
      });
      if (did.carrier === "Ytel") {
        const { accessToken } = token.token.data;
        var dataString =
          req.file.size < 1000000
            ? `{"from":${from_phone}, "to":1${contact.phone_number.replace(
                /\D/g,
                ""
              )}, "mediaUrl":"${
                config.backendUrl
              }/file/${file_name}", "MessageStatusCallback":"${
                config.backendUrl
              }/message/receiveStatus", "text":"${file_name}"}`
            : `{"from":${from_phone}, "to":1${contact.phone_number.replace(
                /\D/g,
                ""
              )}, "text":"${
                config.backendUrl
              }/file/${file_name}", "MessageStatusCallback":"${
                config.backendUrl
              }/message/receiveStatus"}`;

        var options = {
          method: "POST",
          url: "https://api-beta.ytel.com/api/v4/sms/",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `bearer ${accessToken}`,
          },
          body: dataString,
        };
      }

      if (did.carrier === "Questblue") {
        headers = {
          "Content-type": "application/json",
          "Security-Key": config.questBluekey,
          Authorization:
            "Basic " +
            new Buffer("augurs" + ":" + "Augurs@123").toString("base64"),
        };
        var dataString =
          req.file.size < 1000000
            ? `{"did": ${from_phone}, "did_to": ${contact.phone_number.replace(
                /\D/g,
                ""
              )}, "msg": "${req.file.filename}", "file": "${base64_encode(
                `./uploads/${file_name}`
              )}", "fname": "${Buffer.from(file_name).toString("base64")}"}`
            : `{"did": ${from_phone}, "did_to": ${contact.phone_number.replace(
                /\D/g,
                ""
              )}, "msg": "${
                config.backendUrl
              }/file/${file_name}", "file": null, "fname": null}`;

        var options = {
          method: "POST",
          url: "https://api2.questblue.com/sms",
          headers: headers,
          body: dataString,
        };
      }
      request(options, async (error, response, body) => {
        if (error) throw new Error(error);
        const messageObj = new db.Message({
          date: Date(),
          message: chat,
          _conversation: conversation,
          _from: req.user.id,
          sms_response: body,
          internal,
          sent,
          failed,
          attachment: true,
          attachment_name: file_name,
          attachment_size: req.file.size,
          filename: `${config.backendUrl}/file/${file_name}`,
        });
        message_response = await messageObj.save();
        return res.send(message_response);
      });
    }
  );

  function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString("base64");
  }

  return app;
};
