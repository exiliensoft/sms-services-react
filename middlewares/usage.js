const Sequelize = require("sequelize");
const Op = Sequelize.Op;
module.exports = (globals, db) => {
  return {
    smsLimit: async (req, res, next) => {
      if (!req.userAdmin.sms_plan) {
        if (req.userAdmin.complimentary_sms <= 0)
          return res
            .status(403)
            .json({ msg: "Please buy an SMS plan to continue" });
        else {
          req.isFreePlan = true;
          return next();
        }
      }
      req.month = parseInt(
        (new Date() - req.userAdmin.sms_plan_date) / (1000 * 3600 * 30 * 24)
      );
      let usageEntry = await db.Usage.findOne({
        where: {
          user_id: req.userAdmin.id,
          month: req.month,
        },
      });
      const plans = await globals.getPlans();
      let userPlan = plans.sms_plan.filter(
        (pl) => pl.id === req.userAdmin.sms_plan
      );
      if (userPlan && userPlan[0]) {
        userPlan = userPlan[0];
      } else {
        return res.status(403).json({ msg: "Plan doesn't exist" });
      }

      if (!usageEntry) {
        await db.Usage.create({
          user_id: req.userAdmin.id,
          month: req.month,
          messages: 0,
          calls: 0,
        });
        return next();
      }
      if (usageEntry.messages >= userPlan.sms_limit) {
        return res
          .status(403)
          .json({ msg: "You have exceeded your monthly limit" });
      }
      return next();
    },
    phoneLimit: async (req, res, next) => {
      if (!req.user.did_plan && !req.user.sms_plan) {
        if (req.user.complimentary_phone <= 0)
          return res
            .status(403)
            .json({ msg: "Please buy an Phone plan to continue" });
        else {
          req.isFreePlan = true;
          return next();
        }
      }
      const did_count = await globals.getDidCount(req.user.id);
      let allowedCount = 0;
      const plans = await globals.getPlans();
      if (req.user.did_plan) {
        let userPlan = plans.did_plan.filter(
          (pl) => pl.id === req.user.did_plan
        );
        if (userPlan && userPlan[0]) {
          userPlan = userPlan[0];
        } else {
          res
            .status(500)
            .json({ msg: "Internal Error, Please contact website admin" });
        }
        allowedCount = userPlan.did_limit;
      } else {
        let userPlan = plans.sms_plan.filter(
          (pl) => pl.id === req.user.sms_plan
        );
        if (userPlan && userPlan[0]) {
          userPlan = userPlan[0];
        } else {
          res
            .status(500)
            .json({ msg: "Internal Error, Please contact website admin" });
        }
        allowedCount = userPlan.complimentary_dids;
      }
      if (did_count >= allowedCount) {
        return res
          .status(411)
          .json({ msg: "Please upgrade your DID plan" });
      }
      next();
    },
    extractAdmin: async (req, res, next) => {
      if (!req.body.conversation) {
        return res.status(411).json({
          msg: "Please send a valid conversation to add the message to",
        });
      }
      const conversation = await db.Conversation.findOne({
        where: { id: req.body.conversation },
      });
      if (!conversation) {
        return res.status(411).json({
          msg: "Please send a valid conversation to add the message to",
        });
      }
      const group = await db.Group.findOne({
        where: { id: conversation._group },
      });
      if (!group) {
        return res
          .status(411)
          .json({ msg: "Conversation doesn't belong to an group" });
      }
      req.userAdmin = await db.User.findOne({ where: { id: group._user } });
      return next();
    },
    extractAdminGroup: async (req, res, next) => {
      const group = await db.Group.findOne({
        where: {
          id: req.body.group,
        },
      });
      if (!group) {
        return res.status(411).json({ msg: "Incorrect group" });
      }
      req.group = group;
      next();
    },
    extractGroups: async (req, res, next) => {
      const members = await db.Member.findAll({
        where: {
          _user_email: req.user.email,
          status: 1,
        },
      });

      const groups = await db.Group.findAll({
        where: { id: members.map((member) => member._group) },
      });

      const ownGroup = await db.Group.findAll({
        where: { _user: req.user.id },
      });

      req.allGroups = [...ownGroup, ...groups];
      return next();
    },
    shouldDeleteNumber: async (req, res, next) => {
      const { number, id } = req.body;
      const associatedGroupCount = await db.Conversation.count({
        where: { _did: String(id), is_close: false },
      });
      if (associatedGroupCount > 0) {
        return res.status(411).json({
          msg: `DID associated to ${associatedGroupCount} open conversation(s)`,
        });
      }
      return next();
    },
  };
};
