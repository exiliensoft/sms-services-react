const Sequelize = require("sequelize");
const connection = require("../config").db;

class DID extends Sequelize.Model {}
DID.init(
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    number: Sequelize.STRING,
    description: Sequelize.STRING,
    _group: Sequelize.STRING,
    state: Sequelize.STRING,
    _user: Sequelize.STRING,
    voice_enabled: Sequelize.BOOLEAN,
    sms_enabled: Sequelize.BOOLEAN,
    mms_enabled: Sequelize.BOOLEAN,
    carrier: {
      type: Sequelize.ENUM,
      values: ["Ytel", "Questblue"],
    },
  },
  {
    sequelize: connection,
    modelName: "did",
  }
);

module.exports = DID;
