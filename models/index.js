const Charge_Log = require("./Charge_Log");
const Conversation = require("./Conversation");
const DID_Purchase_Log = require("./DID_Purchase_Log");
const Message = require("./Message");
const DID = require("./DID");
const Group = require("./group");
const User = require("./User");
const SMS_Plan = require("./SMS_Plan");
const Voice_Plan = require("./Voice_Plan");
const DID_Plan = require("./DID_Plan");
const Usage = require("./Usage");
const Contact = require("./Contact");
const Member = require("./Member");
const Field = require("./Field");
const Field_Values = require("./Field_Values");
const DNC = require("./DNC");

Member.belongsTo(User, { foreignKey: "_user_email", targetKey: "email" });
Member.belongsTo(Group, { foreignKey: "id" });
Group.hasMany(Member, { foreignKey: "_group" });
Group.belongsTo(User, { foreignKey: "_user" });
Conversation.belongsTo(User, { as: "user", foreignKey: "assignee" });
Field.belongsTo(User, { as: "user", foreignKey: "_user" });
Field_Values.belongsTo(Contact, { foreignKey: "_contact" });
Contact.hasMany(Field_Values, { foreignKey: "_contact" });
Field_Values.belongsTo(Field, { foreignKey: "_field" });
DNC.belongsTo(Group, { foreignKey: "_group", targetKey: "id" });
DNC.belongsTo(Contact, { foreignKey: "_contact", targetKey: "id" });

module.exports = () => {
  return {
    Charge_Log,
    Conversation,
    DID_Purchase_Log,
    Message,
    DID,
    Group,
    User,
    SMS_Plan,
    Voice_Plan,
    DID_Plan,
    Usage,
    Member,
    Contact,
    Field,
    Field_Values,
    DNC,
  };
};
