const Sequelize = require("sequelize");
const connection = require("../config").db;

class DID_Purchase_Log extends Sequelize.Model { }
DID_Purchase_Log.init(
   {
      id: {
         allowNull: false,
         type: Sequelize.UUID,
         primaryKey: true
      },
      number: Sequelize.STRING,
      event: Sequelize.STRING,
      outcome: Sequelize.STRING, // Sucess or failure
      monthly_cost: Sequelize.STRING,
      _user: Sequelize.STRING,
      purchase_response: Sequelize.JSONB //Every attept should be logged
      // eventDate: Sequelize.DATE
   },
   {
      sequelize: connection,
      modelName: "did_purchase_log"
   }
);

module.exports = DID_Purchase_Log;
