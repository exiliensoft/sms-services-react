const Sequelize = require("sequelize");
const connection = require("../config").db;

class Field_Values extends Sequelize.Model {}
Field_Values.init(
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    _contact: Sequelize.UUID,
    _field: Sequelize.UUID,
    value: Sequelize.STRING,
  },
  {
    sequelize: connection,
    modelName: "field_values",
  }
);

module.exports = Field_Values;
