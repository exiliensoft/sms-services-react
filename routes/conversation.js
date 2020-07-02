const Sequelize = require("sequelize");
const requireLogin = require("../middlewares/requireLogin");
const Op = Sequelize.Op;
let express = require("express");
let app = express.Router();

module.exports = (db, globals, usageMiddleware) => {
  /* ------------------------------------------------- */
  /* For creating a new conversation */
  /* ------------------------------------------------- */
  app.post(
    "/",
    [requireLogin, usageMiddleware.extractAdminGroup],
    async (req, res) => {
      const { name, group, phone, did } = req.body;
      const dids = await db.DID.findAll({
        where: { _group: group },
      });
      if (dids && dids.length > 0) {
        let did = dids.find(function (element) {
          return element.number.substring(1, 4) === phone.slice(3);
        });

        if (!did) {
          if (dids.length !== 1) {
            did = dids[getRandomInt(0, dids.length - 1)];
          } else {
            did = dids[0];
          }
        }
        if (req.body.did) {
          did = await db.DID.findOne({
            where: {
              id: req.body.did,
            },
          });
        }
        if (!did) {
          res.status(411).json({ msg: "Did doesnt exist" });
        }
        let contact = await db.Contact.findOne({
          where: {
            _user: req.group._user,
            phone_number: phone,
          },
        });

        if (!contact) {
          contact = await db.Contact.create({
            _user: req.group._user,
            phone_number: "1"+phone.replace(/\D/g,""),
            _original_group: group,
            _last_conversation_group: group,
          });
        } else {
          contact._last_conversation_group = group;
          contact.save();
          let existingConversation = await db.Conversation.findOne({
            where: {
              _contact: contact.id,
              _did: did.id + "",
              is_close: false,
            },
          });
          if (existingConversation) {
            return res.status(411).json({
              msg: "Conversation already exists",
              existingConversation,
            });
          }
        }

        const conversation = new db.Conversation({
          name,
          _group: group,
          _did: did.id,
          _contact: contact.id,
          date: Date(),
          assignee: req.user.id,
          notRepliedTo: false,
          unread: 0,
          tags: {},
        });
        await conversation.save();
        return res.send(conversation);
      }
      res.status(400).json({ msg: "DID doesnt exist" });
    }
  );

  /* ------------------------------------------------- */
  /* For grabbing all conversation */
  /* ------------------------------------------------- */
  app.get(
    "/",
    [requireLogin, usageMiddleware.extractGroups],
    async (req, res) => {
      const allGroups = req.allGroups;

      let conversations;
      if (allGroups.length === 0) {
        conversations = [];
      } else {
        conversations = await db.Conversation.findAll({
          where: {
            _group: allGroups.map((s) => s.id),
          },
          include: { model: db.User, as: "user", attributes: ["id"] },
          raw: true,
        });
      }

      const contacts = await db.Contact.findAll({
        where: {
          id: {
            [Op.or]: conversations.map((conversation) => conversation._contact),
          },
        },
      });

      const dids = await db.DID.findAll({
        where: {
          id: {
            [Op.or]: conversations.map((conversation) => conversation._did),
          },
        },
      });

      const newConversations = conversations
        ? conversations.map(async (conversation) => {
            const message = await db.Message.findOne({
              where: {
                _conversation: conversation.id,
              },
              order: [["date", "DESC"]],
            });

            const last_message = message ? message.message : null;
            let did = dids.filter((did) => did.id === conversation._did);
            let contact = contacts.find(
              (contact) => contact.id === conversation._contact
            );
            let phone = "";
            if (contact) {
              phone = contact.phone_number;
            }
            if (did && did[0] && did[0].number) {
              did = did[0].number;
            }
            return {
              id: conversation.id,
              ...conversation,
              phone,
              last_message,
              did: did,
            };
          })
        : null;
      const results = await Promise.all(newConversations);
      res.send(results);
    }
  );

  /* ------------------------------------------------- */
  /* For updating conversations */
  /* ------------------------------------------------- */
  app.put("/:conversation", requireLogin, async (req, res) => {
    const { conversation } = req.params;
    const response = await db.Conversation.update(req.body, {
      where: { id: conversation },
      returning: true,
      plain: true,
    });
    if (req.body.is_close) {
      let params = {
        _conversation: conversation,
        message: "closed conversation",
        _from: response[1].assignee,
        close_type: true,
        date: new Date(),
        _group: response[1]._group,
      };
      await db.Message.create(params);
      globals.publisher.publish(
        "RECEIVE_MESSAGE",
        JSON.stringify({
          ...params,
          room: response[1]._group,
          from: req.user.given_name,
          from_email: req.user.email,
          _did: response[1]._did,
        })
      );
    }
    globals.publisher.publish(
      "UPDATE_CONVERSATION",
      JSON.stringify({
        room: response[1]._group,
        conversation: response[1],
      })
    );
    res.send(response[1]);
  });

  app.get("/users", requireLogin, async (req, res) => {
    const conversation = await db.Conversation.findOne({
      where: { id: req.query.conversationId },
    });
    if (!conversation) {
      return res.status(411).json({ msg: "Invalid conversationid" });
    }
    const group = await db.Group.findOne({
      where: { id: conversation._group },
    });
    if (!group) {
      return res
        .status(411)
        .json({ msg: "Conversation not tied to any group" });
    }
    const members = await db.Member.findAll({
      where: {
        _group: group.id,
        status: 1,
      },
    });
    const users = await db.User.findAll({
      where: { email: members.map((member) => member._user_email) },
    });
    const admin = await db.User.findOne({ where: { id: group._user } });
    let ret = users.map((user) => {
      return { email: user.email, id: user.id, name: user.given_name };
    });
    ret = [
      ...ret,
      { email: admin.email, id: admin.id, name: admin.given_name },
    ];
    return res.json({ success: true, users: ret });
  });

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  app.post("/removeTag", requireLogin, async (req, res) => {
    let conversationData = await db.Conversation.findOne({
      where: { id: req.body.conversationId },
    });
    if (!conversationData) {
      return res.status(411).json({ msg: "Conversation not found" });
    }

    if (conversationData.tags && conversationData.tags[req.body.id] > 0) {
      let obj = {};
      obj[req.body.id] = 0;
      conversationData.tags = { ...conversationData.tags, ...obj };
    }

    const value = await conversationData.save();
    return res.json({ success: true });
  });
  return app;
};
