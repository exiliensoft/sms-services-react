const Sequelize = require("sequelize");
const connection = require("../config").db;
// const group = require("./group");
class Conversation extends Sequelize.Model {}
Conversation.init(
  {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    name: Sequelize.STRING,
    _contact: Sequelize.UUID,
    _group: Sequelize.UUID,
    _did: Sequelize.STRING,
    date: Sequelize.DATE,
    tags: {
      type: Sequelize.JSONB,
    },
    is_close: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    unread: Sequelize.INTEGER,
    tags: Sequelize.JSONB,
    assignee: Sequelize.UUID,
    notRepliedTo: Sequelize.BOOLEAN,
  },
  {
    sequelize: connection,
    modelName: "conversation",
  }
);

module.exports = Conversation;
