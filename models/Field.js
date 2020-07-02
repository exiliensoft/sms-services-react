const Sequelize = require("sequelize");
const connection = require("../config").db;

class Field extends Sequelize.Model {}
Field.init(
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    _user: Sequelize.STRING,
    fieldName: Sequelize.STRING,
    type: Sequelize.INTEGER,
    options: Sequelize.ARRAY(Sequelize.STRING),
  },
  {
    sequelize: connection,
    modelName: "field",
  }
);

module.exports = Field;
