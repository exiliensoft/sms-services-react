const Sequelize = require("sequelize");
const connection = require("../config").db;

class Message extends Sequelize.Model {}
Message.init(
  {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    message: Sequelize.STRING,
    _conversation: Sequelize.STRING,
    _from: Sequelize.STRING,
    sms_response: {
      type: Sequelize.JSONB,
    },
    callback_response: {
      type: Sequelize.JSONB,
      set: function (data) {
        try {
          return JSON.parse(data);
        } catch (e) {
          return data;
        }
      },
    },
    internal: {
      type: Sequelize.BOOLEAN,
      default: false,
    },
    sent: Sequelize.BOOLEAN,
    sent_date: Sequelize.DATE,
    date: Sequelize.DATE,
    failed: Sequelize.BOOLEAN,
    attachment: {
      type: Sequelize.BOOLEAN,
      default: false,
    },
    attachment_name: Sequelize.STRING,
    attachment_size: Sequelize.INTEGER,
    filename: Sequelize.STRING,
    close_type: {
      type: Sequelize.BOOLEAN,
      default: false,
    },
  },
  {
    sequelize: connection,
    modelName: "message",
  }
);

module.exports = Message;
