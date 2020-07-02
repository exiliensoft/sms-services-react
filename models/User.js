const Sequelize = require("sequelize");
const connection = require("../config").db;

class User extends Sequelize.Model {}
User.init(
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    given_name: Sequelize.STRING,
    family_name: Sequelize.STRING,
    google_id: Sequelize.STRING,
    picture: Sequelize.STRING,
    cell_phone: Sequelize.STRING,
    password: Sequelize.STRING,
    email: {
      type: Sequelize.STRING,
      isEmail: true,
      notNull: true,
      //unique: true
    },
    plan_type: {
      type: Sequelize.ENUM,
      values: ["monthly", "annual"],
      defaultValue: "annual",
    },
    sms_plan: Sequelize.STRING,
    sms_plan_date: Sequelize.DATE,
    voice_plan: Sequelize.STRING,
    voice_plan_date: Sequelize.DATE,
    did_plan: Sequelize.STRING,
    did_plan_date: Sequelize.DATE,
    complimentary_sms: Sequelize.INTEGER,
    complimentary_phone: Sequelize.INTEGER,
    carriers: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
      defaultValue: ["Ytel"],
    },
    local_email_confirmed: {
      type: Sequelize.ENUM,
      values: ["confirmed", "pending", "unconfirmed"],
    },
    name: {
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.STRING,
      defaultValue: 'friend'
    },
    defaultuser: {
      type: Sequelize.STRING,
    },
    host: {
      type: Sequelize.STRING,
      defaultValue: 'dynamic'
    },
    secret: {
      type: Sequelize.STRING,
    },
    encryption: {
      type: Sequelize.STRING,
      defaultValue: 'yes'
    },
    avpf: {
      type: Sequelize.STRING,
      defaultValue: 'yes'
    },
    icesupport: {
      type: Sequelize.STRING,
      defaultValue: 'yes'
    },
    context: {
      type: Sequelize.STRING,
      defaultValue: 'my-context'
    },
    directmedia: {
      type: Sequelize.STRING,
      defaultValue: 'no'
    },
    transport: {
      type: Sequelize.STRING,
      defaultValue: 'udp,ws,wss'
    },
    force_avp: {
      type: Sequelize.STRING,
      defaultValue: 'yes'
    },
    dtlsenable: {
      type: Sequelize.STRING,
      defaultValue: 'yes'
    },
    dtlsverify: {
      type: Sequelize.STRING,
      defaultValue: 'fingerprint'
    },
    dtlscertfile: {
      type: Sequelize.STRING,
      defaultValue: '/etc/asterisk/keys/asterisk.pem'
    },
    tlsprivatekey: {
      type: Sequelize.STRING,
      defaultValue: '/etc/asterisk/keys/asterisk.pem'
    },
    dtlssetup: {
      type: Sequelize.STRING,
      defaultValue: 'actpass'
    },
    rtcp_mux: {
      type: Sequelize.STRING,
      defaultValue: 'yes'
    },
    qualify: {
      type: Sequelize.STRING,
      defaultValue: 'yes'
    },
    disallow: {
      type: Sequelize.STRING,
      defaultValue: 'all'
    },
    allow: {
      type: Sequelize.STRING,
      defaultValue: 'ulaw,alaw'
    },
    sendrpid: {
      type: Sequelize.STRING,
      defaultValue: 'yes'
    },
    ipaddr: {
      type: Sequelize.STRING,
    },
  },
  {
    sequelize: connection,
    modelName: "user",
    hooks: {
      afterFind: (result) => {
        if (!result) {
          return result;
        }
        if (result.constructor === Array) {
          var arrayLength = result.length;
          for (var i = 0; i < arrayLength; i++) {
            if (new Date(result[i].sms_plan_date) - new Date() >= 31556926000) {
              result[i].sms_plan = null;
              result[i].voice_plan = null;
              result[i].did_plan = null;
              result[i].sms_plan_date = null;
            }
          }
        } else {
          if (new Date(result.sms_plan_date) - new Date() >= 31556926000) {
            result.sms_plan = null;
            result.voice_plan = null;
            result.did_plan = null;
            result.sms_plan_date = null;
          }
        }
        return result;
      },
    },
  }
);

module.exports = User;
