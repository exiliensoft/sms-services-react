const Sequelize = require("sequelize");
const connection = require("../config").db;
class Member extends Sequelize.Model { }

Member.init(
    {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        _group: Sequelize.UUID,
        _user_email: Sequelize.STRING,
        status: Sequelize.INTEGER,
        queue_name: {
            type: Sequelize.STRING,
        },
        interface: {
            type: Sequelize.STRING,
        },
        membername: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        state_interface: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        penalty: {
            type: Sequelize.INTEGER,
            defaultValue: null
        },
        paused: {
            type: Sequelize.INTEGER,
            defaultValue: null
        },
        uniqueid: {
            type: Sequelize.INTEGER,
            autoIncrement: true
        }
    },
    {
        sequelize: connection,
        modelName: "member",
    }
);

module.exports = Member;