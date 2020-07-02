const Sequelize = require("sequelize");
const connection = require("../config").db;

class DNC extends Sequelize.Model {}
DNC.init(
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    _group: Sequelize.STRING,
    _contact: Sequelize.STRING,
  },
  {
    sequelize: connection,
    modelName: "dnc",
  }
);

module.exports = DNC;
