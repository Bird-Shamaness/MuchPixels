module.exports = function (passport, User) {
  const LocalStrategy = require('passport-local').Strategy;

  const strategy = new LocalStrategy({
      usernameField: 'email'
    }, (email, password, done) => {
      User.findOne({
          email: email.toLowerCase()
        }, (err, user) => {
          if (err) {
              return done(err);
            }
          if (!user) {
              return done(null, false, {
                  msg: `Email ${email} not found.`
                });
            }
          user.comparePassword(password, (err, isMatch) => {
              if (err) {
                  return done(err);
                }
              if (isMatch) {
                  return done(null, user);
                }
              return done(null, false, {
                  msg: 'Invalid email or password.'
                });
            });
        });
    });

  passport.use(strategy);
};
