const passport = require("passport");
const bcrypt = require("bcrypt");
const checkNotAuthenticated = require("../middlewares/checkNotAuthenticated");
const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");
let express = require("express");
let app = express.Router();
let local_email_confirmation = require("../utils/emailTemplates/local_email_confirmation");
let forgot_password_html = require("../utils/emailTemplates/forgot_password_email");
const config = require('../config')

module.exports = (db) => {
  /* ------------------------------------------------- */
  /* PassportJS Google OAuth */
  /* ------------------------------------------------- */
  app.get(
    "/google",
    checkNotAuthenticated,
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  /* ------------------------------------------------- */
  /* Google OAuth after login confirmation routing */
  /* ------------------------------------------------- */
  app.get("/google/callback", passport.authenticate("google"), (req, res) => {
    res.redirect("/app");
  });

  /* ------------------------------------------------- */
  /* Log out route */
  /* ------------------------------------------------- */
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  /* ------------------------------------------------- */
  /* Get current user details (NOT FOR PRODUCTION) */
  /* ------------------------------------------------- */
  app.get("/current_user", async (req, res) => {
    res.send(req.user);
  });

  /* ------------------------------------------------- */
  /* Forgot password SenGrid email */
  /* ------------------------------------------------- */
  app.post("/forgot_password", async (req, res) => {
    const { email } = req.body;
    const existingLocalUser =
      (await db.User.findOne({ where: { email } })) || undefined;
    if (existingLocalUser) {
      const token = jwt.sign({ email: email }, config.jwtForgotPassword, { expiresIn: "1h" });
      sgMail.setApiKey(config.sendGridKey);
      const message = {
        to: email,
        from: "ktruo010@gmail.com",
        subject: "Chatchilla: Forgot your password?",
        html: forgot_password_html.html(token),
      };
      res.send("resetPasswordEmailSent");
      return sgMail.send(message);
    } else {
      res.send("nonExistentAccount");
    }
  });

  /* ------------------------------------------------- */
  /* Forgot password SenGrid verification email */
  /* ------------------------------------------------- */
  app.get("/forgot_password_verification/:token", (req, res) => {
    try {
      res.redirect(`/reset-password?token=${req.params.token}`);
    } catch (error) {
      console.log(error);
    }
  });

  /* ------------------------------------------------- */
  /* Reset password */
  /* ------------------------------------------------- */
  app.post("/reset_password", async (req, res) => {
    const { token, password } = req.body;
    const hashedPassword = (await bcrypt.hash(password, 10)) || undefined;
    jwt.verify(
      req.body.token, config.jwtForgotPassword, async (err, decoded) => {
        try {
          await db.User.update(
            { password: hashedPassword },
            { where: { email: decoded.email } }
          );
          res.send({
            redirect: "/login",
            authError: "passwordReset",
            email: decoded.email,
          });
        } catch (error) {
          console.log(error);
        }
      }
    );
  });

  /* ------------------------------------------------- */
  /* LocalStrategy Account Confirmation SenGrid email
  /* ------------------------------------------------- */
  app.get("/check_email_confirmation/:token", (req, res) => {
    jwt.verify(
      req.params.token,
      config.jwtRegister,
      async (err, decoded) => {
        try {
          await db.User.update(
            { local_email_confirmed: "confirmed" },
            { where: { email: decoded.encryptedID } }
          );
          res.redirect("/login");
        } catch {
          if (err.message === "TokenExpiredError") {
            res.redirect("/login?expired=true");
          }
        }
      }
    );
  });

  /* ------------------------------------------------- */
  /* For adding new user to db using Local Strategy */
  /* ------------------------------------------------- */
  app.post("/register/local", checkNotAuthenticated, async (req, res) => {
    const hashedPassword =
      (await bcrypt.hash(req.body.password, 10)) || undefined;
    const existingLocalUser =
      (await db.User.findOne({ where: { email: req.body.email } })) ||
      undefined;
    if (!existingLocalUser) {
      try {
        const newUser = await db.User.create({
          given_name: req.body.given_name,
          family_name: req.body.family_name,
          email: req.body.email,
          password: hashedPassword,
          complimentary_sms: 50,
          complimentary_phone: 1,
          balance: 0,
          sms_rate: 0.03,
          number_rate: 5,
          local_email_confirmed: "pending",
        });

        const token = jwt.sign(
          { encryptedID: req.body.email },
          config.jwtRegister,
          { expiresIn: "1h" }
        );
        sgMail.setApiKey(
          config.sendGridKey
        );
        const message = {
          to: req.body.email,
          from: "ktruo010@gmail.com",
          subject: "Chatchilla Account Confirmation",
          html: local_email_confirmation.html(token),
        };
        sgMail.send(message);
        res.json({ redirect: "/login" });
      } catch {
        res.json({ redirect: "/register" });
      }
    } else if (existingLocalUser.dataValues.google_id) {
      const updateUser = await db.User.update(
        { password: hashedPassword, local_email_confirmed: "pending" },
        { where: { email: req.body.email } }
      );

      const token = jwt.sign(
        { encryptedID: req.body.email },
        config.jwtRegister,
        { expiresIn: "1h" }
      );
      sgMail.setApiKey(
        config.sendGridKey
      );
      const message = {
        to: req.body.email,
        from: "ktruo010@gmail.com",
        subject: "Chatchilla Account Confirmation",
        html: local_email_confirmation.html(token),
      };
      sgMail.send(message);

      res.json({ redirect: "/login" });
    } else {
      console.log("You already have an account. Please login.");
      res.json({ redirect: "/login" });
    }
  });

  /* ------------------------------------------------- */
  /* For Resending confirmation email */
  /* ------------------------------------------------- */
  app.post(
    "/email_confirmation_resend",
    checkNotAuthenticated,
    async (req, res) => {
      const token = jwt.sign(
        { encryptedID: req.body.email },
        config.jwtRegister,
        { expiresIn: "1h" }
      );
      sgMail.setApiKey(
        config.sendGridKey
      );
      const message = {
        to: req.body.email,
        from: "ktruo010@gmail.com",
        subject: "Chatchilla Account Confirmation",
        html: local_email_confirmation.html(token),
      };
      sgMail.send(message);
      res.json({ redirect: "/login" });
    }
  );

  /* ------------------------------------------------- */
  /* For Authorizing Local Strategy Login - NOT DONE */
  /* ------------------------------------------------- */
  app.post("/local", (req, res) => {
    passport.authenticate("local", function (err, user, info) {
      if (!user) {
        return res.json({
          authError: info.authError,
          email: info.email,
          redirect: "/login",
        });
      }
      req.logIn(user, (err) => {
        res.send({ redirect: "/app" });
      });
    })(req, res);
  });

  /* ------------------------------------------------- */
  /* For new Local Strategy registration email confirmation
  /* ------------------------------------------------- */
  app.post("/confirmation_email_verification", async (req, res) => {
    const updateUser = await db.User.update(
      { local_email_confirmed: "confirmed" },
      { where: { email: req.body.email } }
    );
  });
  return app;
};
