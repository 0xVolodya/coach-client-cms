var LocalStrategy = require('passport-local').Strategy;

import User from '../models/user'

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, email, password, cb) {
      if (email)
        email = email.toLowerCase();

      process.nextTick(function() {
        if (!req.user) {
          User.findOne({ 'local.email': email }, function(err, user) {
            if (err)
              return cb(err);

            if (user) {
              return cb(null, false, req.flash(500, 'That email is already taken.'));
            } else {

              var newUser = new User();

              newUser.local.email = email;
              newUser.local.password = newUser.generateHash(password);

              newUser.save(function(err) {
                if (err)
                  return cb(err);

                return cb(null, newUser);
              });
            }

          });
        } else if (!req.user.local.email) {
          User.fincb({ 'local.email': email }, function(err, user) {
            if (err)
              return cb(err);

            if (user) {
              return cb(null, false, req.flash(400, 'That email is already taken.'));
            } else {
              var user = req.user;
              user.local.email = email;
              user.local.password = user.generateHash(password);
              user.save(function(err) {
                if (err)
                  return cb(err);

                return cb(null, user);
              });
            }
          });
        } else {
          return cb(null, req.user);
        }

      });

    }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, cb) {
    User.findOne({'local.email': email},function(err, user){
      console.log('email')
      console.log(email)
      console.log(user)
      if(err) return cb(null, false, req.flash(400, 'Error occurred in login'))

      if(!user) return cb(null, false, req.flash(400, 'No user was found'))

      if(user.validatePassword(password)) return cb(null, false, req.flash(400, 'Wrong password'))

      return cb(null, user)
    })
  }));
}
