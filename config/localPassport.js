const LocalStrategy = require("passport-local").Strategy;
const {Users} = require("../models/Users");
const bcrypt = require("bcryptjs");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: "username" }, (username, password, done) => {
      Users.findOne({ username: username }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {message: 'No User Found'});
        }
  
        bcrypt.compare(password, user.password, (errr, isMatch) => {
          // if (err) throw err;
          if (!isMatch) {
            // req.flash('err', 'Incorrect Password')
            
            return done(null, false, {message: 'Incorrect Password'});
          }
        });
        return done(null, user);
      });
    })
  );

  passport.serializeUser(function (user, done) {
    return done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    Users.findById(id, function (err, user) {
      return done(err, user);
    });
  });
};