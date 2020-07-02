const Sequelize = require("sequelize");
const connection = require("../config").db;
class Usage extends Sequelize.Model { }

Usage.init(
    {
        id: {
            allowNull: false,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        user_id: Sequelize.UUID,
        month: Sequelize.INTEGER,
        messages: Sequelize.INTEGER,
        calls: Sequelize.INTEGER
    },
    {
        sequelize: connection,
        modelName: "usage",
    }
);

module.exports = Usage;