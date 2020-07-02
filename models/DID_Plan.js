const Sequelize = require("sequelize");
const connection = require("../config").db;
class DID_Plan extends Sequelize.Model {}

DID_Plan.init(
  {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    price: Sequelize.INTEGER,
    did_limit: Sequelize.INTEGER,
  },
  {
    sequelize: connection,
    modelName: "did_plan",
  }
);

module.exports = DID_Plan;
