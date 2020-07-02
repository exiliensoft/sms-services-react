const Sequelize = require("sequelize");
const connection = require("../config").db;
class Contact extends Sequelize.Model {}

Contact.init(
  {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    _user: Sequelize.UUID,
    phone_number: Sequelize.STRING,
    fieldValues: Sequelize.JSONB,
    _original_group: Sequelize.UUID,
    _last_conversation_group: Sequelize.UUID,
  },
  {
    sequelize: connection,
    modelName: "contact",
  }
);

module.exports = Contact;
