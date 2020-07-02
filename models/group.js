const Sequelize = require("sequelize");
const connection = require("../config").db;
class Group extends Sequelize.Model {}

Group.init(
  {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    status: Sequelize.STRING,
    group_name: Sequelize.STRING,
    group_description: Sequelize.STRING,
    owner: Sequelize.STRING,
    _user: Sequelize.UUID,
    fields: Sequelize.ARRAY(Sequelize.STRING),
    checked_fields: Sequelize.ARRAY(Sequelize.STRING),
    // name: { // Unsure if we need this for it to work
    //   type: Sequelize.STRING,
    //   allowNull: false
    // },
    musiconhold: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    announce: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    context: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    timeout: {
      type: Sequelize.INTEGER,
      defaultValue: null
    },
    ringinuse: {
      type: Sequelize.ENUM,
      values: ['yes','no'],
      defaultValue: null
    },
    setinterfacevar: {
      type: Sequelize.ENUM,
      values: ['yes','no'],
      defaultValue: null
    },
    setqueuevar: {
      type: Sequelize.ENUM,
      values: ['yes','no'],
      defaultValue: null
    },
    setqueueentryvar: {
      type: Sequelize.ENUM,
      values: ['yes','no'],
      defaultValue: null
    },
    monitor_format: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    membermacro: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    membergosub: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    queue_youarenext: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    queue_thereare: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    queue_callswaiting: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    queue_quantity1: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    queue_quantity2: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    queue_holdtime: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    queue_minutes: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    queue_minute: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    queue_seconds: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    queue_thankyou: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    queue_callerannounce: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    queue_reporthold: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    announce_frequency: {
      type: Sequelize.INTEGER,
      defaultValue: null
    },
    announce_to_first_user: {
      type: Sequelize.ENUM,
      values: ['yes','no'],
      defaultValue: null
    },
    min_announce_frequency: {
      type: Sequelize.INTEGER,
      defaultValue: null
    },
    announce_round_seconds: {
      type: Sequelize.INTEGER,
      defaultValue: null
    },
    announce_holdtime: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    announce_position: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    announce_position_limit: {
      type: Sequelize.INTEGER,
      defaultValue: null
    },
    periodic_announce: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    periodic_announce_frequency: {
      type: Sequelize.INTEGER,
      defaultValue: null
    },
    relative_periodic_announce: {
      type: Sequelize.ENUM,
      values: ['yes','no'],
      defaultValue: null
    },
    random_periodic_announce: {
      type: Sequelize.ENUM,
      values: ['yes','no'],
      defaultValue: null
    },
    retry: {
      type: Sequelize.INTEGER,
      defaultValue: null
    },
    wrapuptime: {
      type: Sequelize.INTEGER,
      defaultValue: null
    },
    penaltymemberslimit: {
      type: Sequelize.INTEGER,
      defaultValue: null
    },
    autofill: {
      type: Sequelize.ENUM,
      values: ['yes','no'],
      defaultValue: null
    },
    monitor_type: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    autopause: {
      type: Sequelize.ENUM,
      values: ['yes','no',],
      defaultValue: null
    },
    autopausedelay: {
      type: Sequelize.INTEGER,
      defaultValue: null
    },
    autopausebusy: {
      type: Sequelize.ENUM,
      values: ['yes','no'],
      defaultValue: null
    },
    autopauseunavail: {
      type: Sequelize.ENUM,
      values: ['yes','no'],
      defaultValue: null
    },
    maxlen: {
      type: Sequelize.INTEGER,
      defaultValue: null
    },
    servicelevel: {
      type: Sequelize.INTEGER,
      defaultValue: null
    },
    strategy: {
      type: Sequelize.ENUM,
      values: ['ringall','leastrecent','fewestcalls','random','rrmemory','linear','wrandom','rrordered'],
      defaultValue: null
    },
    joinempty: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    leavewhenempty: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    reportholdtime: {
      type: Sequelize.ENUM,
      values: ['yes','no'],
      defaultValue: null
    },
    memberdelay: {
      type: Sequelize.INTEGER,
      defaultValue: null
    },
    weight: {
      type: Sequelize.INTEGER,
      defaultValue: null
    },
    timeoutrestart: {
      type: Sequelize.ENUM,
      values: ['yes','no'],
      defaultValue: null
    },
    defaultrule: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    timeoutpriority: {
      type: Sequelize.STRING,
      defaultValue: null
    }
  },
  {
    sequelize: connection,
    modelName: "group",
  }
);

module.exports = Group;
