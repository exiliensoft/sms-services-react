const Sequelize = require("sequelize");
const connection = require("../config").db;

class Charge_Log extends Sequelize.Model {}
Charge_Log.init(
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    user_id: Sequelize.STRING,
    given_name: Sequelize.STRING,
    family_name: Sequelize.STRING,
    google_id: Sequelize.STRING,
    email: {
      type: Sequelize.STRING,
      isEmail: true,
      notNull: true,
    },
    sms_plan: Sequelize.STRING,
    voice_plan: Sequelize.STRING,
    did_plan: Sequelize.STRING,
    purchase_amount: Sequelize.STRING,
    charge_token_id: Sequelize.STRING,
    charge_ip_address: Sequelize.STRING,
    email_receipt: {
      type: Sequelize.STRING,
      isEmail: true,
      notNull: true,
    },
    stripe_response: Sequelize.JSONB,
  },
  {
    sequelize: connection,
    modelName: "charge_log",
  }
);

module.exports = Charge_Log;
