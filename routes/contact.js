const Sequelize = require("sequelize");
const requireLogin = require("../middlewares/requireLogin");
const Op = Sequelize.Op;
let express = require("express");
let app = express.Router();
const uuidv4 = require("uuid").v4;

module.exports = (db, globals, usageMiddleware) => {
  app.get(
    "/",
    [requireLogin, usageMiddleware.extractGroups],
    async (req, res) => {
      const allGroups = req.allGroups;
      if (allGroups.length === 0) {
        return res.send([]);
      }
      conversations = await db.Conversation.findAll({
        where: {
          _group: { [Op.or]: allGroups.map((s) => s.id) },
        },
        raw: true,
      });
      let contacts = await db.Contact.findAll({
        where: {
          id: {
            [Op.or]: conversations.map((conversation) => conversation._contact),
          },
        },
        include: [{ model: db.Field_Values, include: [{ model: db.Field }] }],
      });
      const messages = await db.Message.findAll({
        where: {
          _conversation: conversations.map((conversation) => conversation.id),
          attachment: true,
        },
        attributes: ["_conversation", "filename"],
      });

      contacts = contacts.map((contact) => {
        return {
          id: contact.id,
          _user: contact._user,
          phone_number: contact.phone_number,
          Field_Values: contact.Field_Values,
          links: messages.filter((message) =>
            conversations
              .filter((conversation) => conversation._contact == contact.id)
              .map((c) => c.id)
              .includes(message._conversation)
          ),
        };
      });
      return res.send(contacts);
    }
  );

  app.put("/values", [requireLogin], async (req, res) => {
    const fieldValues = req.body.fieldValues;
    await db.Field_Values.bulkCreate(
      fieldValues
        .filter((fieldValue) => fieldValue.new)
        .map((fieldValue) => {
          return {
            id: uuidv4(),
            _contact: req.body.contactId,
            _field: fieldValue.fieldId,
            value: fieldValue.fieldValue,
          };
        })
    );

    await fieldValues
      .filter((fieldValue) => !fieldValue.new)
      .map(async (fieldValue) => {
        return await db.Field_Values.update(
          {
            value: fieldValue.fieldValue,
          },
          {
            where: {
              id: fieldValue.fieldValueId,
            },
          }
        );
      });
    return res.json({});
  });
  return app;
};
