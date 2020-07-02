const Sequelize = require("sequelize");
const connection = require("../config").db;
class SMS_Plan extends Sequelize.Model {}

SMS_Plan.init(
  {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    price: Sequelize.INTEGER,
    sms_limit: Sequelize.INTEGER,
    complimentary_dids: Sequelize.INTEGER,
  },
  {
    sequelize: connection,
    modelName: "sms_plan",
  }
);

module.exports = SMS_Plan;
