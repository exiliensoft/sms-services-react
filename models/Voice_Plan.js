const Sequelize = require("sequelize");
const connection = require("../config").db;
class Voice_Plan extends Sequelize.Model {}

Voice_Plan.init(
  {
    id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
     },
    name: Sequelize.STRING,
    price: Sequelize.INTEGER,
    voice_limit: Sequelize.INTEGER
  },
  {
    sequelize: connection,
    modelName: "voice_plan",
  }
);

module.exports = Voice_Plan;