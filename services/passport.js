const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const config = require('../config')
module.exports = (db) => {
  const User = db.User;

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    const existingUser = await User.findOne({
      where: { id: id }
    });
    done(null, existingUser)
  })


  // PASSPORT GOOGLE STRATEGY
  passport.use(new GoogleStrategy({
    clientID: config.googleClientID,
    clientSecret: config.googleClientSecret,
    callbackURL: config.frontendUrl + '/authorization/google/callback',
    proxy: true
  },
    async (accessToken, refreshToken, profile, done) => {
      const existingGoogleUser = await User.findOne({
        where: { google_id: profile.id }
      });
      const existingLocalUser = await db.User.findOne(
        { where: { email: profile._json.email } }
      );
      if (existingGoogleUser) {
        done(null, existingGoogleUser)
      } else if (!existingGoogleUser && existingLocalUser) {
        const updateUser = await db.User.update(
          { google_id: profile.id },
          {
            where: { email: profile._json.email }
          })
        done(null, existingLocalUser);
      } else {
        const newUser = await User.create({
          google_id: profile.id,
          picture: profile._json.picture,
          family_name: profile._json.family_name,
          given_name: profile._json.given_name,
          email: profile._json.email,
          cell_phone: null,
          complimentary_sms: 50,
          complimentary_phone: 1,
          carriers: ['Ytel', 'Questblue'],
          local_email_confirmed: "unconfirmed"
          // createdAt: Date()
        });
        done(null, newUser)
      }
    }))

  // PASSPORT LOCAL STRATEGY
  passport.use(new LocalStrategy(async (username, password, done) => {
    const existingLocalUser = await User.findOne({ where: { email: username } })
    try {
      if (!existingLocalUser) {
        console.log("Account doesnt exist")
        return done(null, false, { authError: "nonExistentAccount", email: username })
      }
      if (existingLocalUser.dataValues.local_email_confirmed === "unconfirmed" && existingLocalUser.dataValues.google_id !== null) {
        console.log("Email Unverified with Google ID")
        return done(null, false, { authError: "unverifiedEmailVerifiedGoogle", email: existingLocalUser.dataValues.email })
      }
      if (existingLocalUser.dataValues.local_email_confirmed === "pending") {
        console.log("Email Unverified")
        return done(null, false, { authError: "unverifiedEmail", email: existingLocalUser.dataValues.email })
      }
      const match = await bcrypt.compare(password, existingLocalUser.dataValues.password);
      if (match) {
        console.log("LOGGEDIN")
        return done(null, existingLocalUser);
      } else {
        console.log("Password Incorrect")
        return done(null, false, { authError: "incorrectPassword", email: existingLocalUser.dataValues.email });
      }
    } catch (error) {
      return done(error);
    }
  }
  ))
  return passport;
}
