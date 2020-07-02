const config = require("../config");
const stripe = require("stripe")(config.stripeSecretKey);
let express = require("express");
let app = express.Router();

module.exports = (db) => {
  /* ------------------------------------------------- */
  /* Fetching current plan costs */
  /* ------------------------------------------------- */
  app.get("/current", async (req, res) => {
    let sms_plan = await db.SMS_Plan.findOne({
      where: { id: req.body.sms_plan },
    });
    let voice_plan = await db.Voice_Plan.findOne({
      where: { id: req.body.voice_plan },
    });
    let did_plan = await db.DID_Plan.findOne({
      where: { id: req.body.did_plan },
    });
    res.send({ sms_plan, voice_plan, did_plan });
  });

  app.get("/", async (req, res) => {
    res.send(await _getPlans());
  });

  app.post("/user", async (req, res) => {
    const plans = await _getPlans();
    const price = await _calculatePrice(req.user, plans, req.body.plans);
    let updateDates = {};
    if (
      req.body.plans.sms_plan &&
      (!req.user.sms_plan || req.user.sms_plan !== req.body.plans.sms_plan)
    ) {
      updateDates.sms_plan_date = new Date();
    }

    if (
      req.body.plans.voice_plan &&
      (!req.user.voice_plan ||
        req.user.voice_plan !== req.body.plans.voice_plan)
    ) {
      updateDates.voice_plan_date = new Date();
    }
    if (
      req.body.plans.sms_plan &&
      (!req.user.sms_plan || req.user.sms_plan !== req.body.plans.sms_plan)
    ) {
      updateDates.sms_plan_date = new Date();
    }

    if (
      req.body.plans.did_plan &&
      (!req.user.did_plan ||
        req.user.did_plan !== req.body.plans.did_plan)
    ) {
      updateDates.did_plan_date = new Date();
    }

    await stripe.charges.create({
      amount: price * 100,
      currency: "usd",
      description: "Chatchilla Plan Subscription",
      source: req.body.token.id,
    });

    await db.Charge_Log.create({
      user_id: req.user.id,
      given_name: req.user.given_name,
      family_name: req.user.family_name,
      google_id: req.user.google_id,
      email: req.user.email,
      sms_plan: req.body.plans.sms_plan,
      voice_plan: req.body.plans.voice_plan,
      did_plan: req.body.plans.did_plan,
      purchase_amount: price,
      charge_token_id: req.body.token.id,
      charge_ip_address: req.body.token.client_ip,
      email_receipt: req.body.token.email,
      stripe_response: req.body.token,
    });
    db.User.update(
      {
        ...req.body.plans,
        ...updateDates,
      },
      { where: { id: req.user.id } }
    );
    return res.send({});
  });

  const _getPlanPrice = (plans, id) => {
    if (plans.filter((pl) => pl.id === id)[0])
      return plans.filter((pl) => pl.id === id)[0].price;
    return 0;
  };

  const getSlashing = (user) => {
    if (!user.sms_plan_date) {
      return 1;
    }
    return (
      (31556926000 - (new Date() - new Date(user.sms_plan_date))) / 31556926000
    );
  };

  const _calculatePrice = async (user, plans, updatedPlans) => {
    let price = 0;
    if (!user.sms_plan) {
      price += _getPlanPrice(plans.sms_plan, updatedPlans.sms_plan);
    } else {
      if (user.sms_plan !== updatedPlans.sms_plan) {
        price +=
          _getPlanPrice(plans.sms_plan, updatedPlans.sms_plan) -
          _getPlanPrice(plans.sms_plan, user.sms_plan);
      }
    }
    if (!user.voice_plan) {
      price += parseInt(
        _getPlanPrice(plans.voice_plan, updatedPlans.voice_plan) *
          getSlashing(user)
      );
    } else {
      if (user.voice_plan !== updatedPlans.voice_plan) {
        price +=
          parseInt(
            _getPlanPrice(plans.voice_plan, updatedPlans.voice_plan) *
              getSlashing(user)
          ) -
          parseInt(
            _getPlanPrice(plans.voice_plan, user.voice_plan) * getSlashing(user)
          );
      }
    }
    if (!user.did_plan) {
      price += parseInt(
        _getPlanPrice(plans.did_plan, updatedPlans.did_plan) *
          getSlashing(user)
      );
    } else {
      if (user.did_plan !== updatedPlans.did_plan) {
        price +=
          parseInt(
            _getPlanPrice(
              plans.did_plan,
              updatedPlans.did_plan
            ) * getSlashing(user)
          ) -
          parseInt(
            _getPlanPrice(plans.did_plan, user.did_plan) *
              getSlashing(user)
          );
      }
    }
    return price;
  };

  const _getPlans = async (user) => {
    let sms_plan = await db.SMS_Plan.findAll({});
    let voice_plan = await db.Voice_Plan.findAll({ where: {} });
    let did_plan = await db.DID_Plan.findAll({});
    return { sms_plan, voice_plan, did_plan };
  };

  return app;
};
