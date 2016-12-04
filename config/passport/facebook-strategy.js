module.exports = function (passport, User) {
  const FacebookStrategy = require('passport-facebook').Strategy;

  const strategy = new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['name', 'email', 'link', 'locale', 'timezone'],
    passReqToCallback: true
  }, (req, accessToken, refreshToken, profile, done) => {
    if (req.user) {
      User.findOne({
        facebook: profile.id
      }, (err, existingUser) => {
        if (err) {
          return done(err);
        }
        if (existingUser) {
          req.flash('errors', {
            msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
          });
          done(err);
        } else {
          User.findById(req.user.id, (err, user) => {
            if (err) {
              return done(err);
            }
            user.facebook = profile.id;
            user.tokens.push({
              kind: 'facebook',
              accessToken
            });
            user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
            user.profile.gender = user.profile.gender || profile._json.gender;
            user.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
            user.save((err) => {
              req.flash('info', {
                msg: 'Facebook account has been linked.'
              });
              done(err, user);
            });
          });
        }
      });
    } else {
      User.findOne({
        facebook: profile.id
      }, (err, existingUser) => {
        if (err) {
          return done(err);
        }
        if (existingUser) {
          return done(null, existingUser);
        }
        User.findOne({
          email: profile._json.email
        }, (err, existingEmailUser) => {
          if (err) {
            return done(err);
          }
          if (existingEmailUser) {
            req.flash('errors', {
              msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.'
            });
            done(err);
          } else {
            const user = new User();
            user.email = profile._json.email;
            user.username = `${profile.name.givenName}${profile.name.familyName}.${profile._json.email.split('@')[0]}`;
            user.facebook = profile.id;
            user.tokens.push({
              kind: 'facebook',
              accessToken
            });
            user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
            user.profile.gender = profile._json.gender;
            user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
            user.profile.location = (profile._json.location) ? profile._json.location.name : '';
            user.save((err) => {
              done(err, user);
            });
          }
        });
      });
    }
  });

  passport.use(strategy);
};
