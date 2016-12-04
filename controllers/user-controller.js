const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const supportEmail = 'pixels_cust_sup@yahoo.com';

module.exports = function (data, passport) {
  return {
    getLogin: (req, res) => {
      if (req.user) {
        return res.redirect('/');
      }

      res.render('account/login', {
        title: 'Login'
      });
    },
    postLogin: (req, res, next) => {
      req.assert('email', 'Email is not valid').isEmail();
      req.assert('password', 'Password cannot be blank').notEmpty();
      req.sanitize('email').normalizeEmail({
        remove_dots: false
      });

      const errors = req.validationErrors();

      if (errors) {
        req.flash('errors', errors);
        return res.redirect('/login');
      }

      passport.authenticate('local', (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          req.flash('errors', info);
          return res.redirect('/login');
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          req.flash('success', {
            msg: 'Success! You are logged in.'
          });
          res.redirect(req.session.returnTo || '/');
        });
      })(req, res, next);
    },
    logout: (req, res) => {
      req.logout();
      res.redirect('/');
    },
    getSignup: (req, res) => {
      if (req.user) {
        return res.redirect('/');
      }

      res.render('account/signup', {
        title: 'Create Account'
      });
    },
    postSignup: (req, res, next) => {
      req.assert('email', 'Email is not valid').isEmail();
      req.assert('password', 'Password must be at least 4 characters long').len(4);
      req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
      req.sanitize('email').normalizeEmail({
        remove_dots: false
      });

      const errors = req.validationErrors();

      if (errors) {
        req.flash('errors', errors);
        return res.redirect('/signup');
      }

      data.findUserByEmail(req.body.email)
        .then((existingUser) => {
          if (existingUser) {
            req.flash('errors', {
              msg: 'Account with that email address already exists.'
            });

            return res.redirect('/signup');
          }

          return data.findUserByUsername(req.body.username);
        })
        .then((existingUser) => {
          if (existingUser) {
            req.flash('errors', {
              msg: 'Account with that username already exists.'
            });

            return res.redirect('/signup');
          }

          return data.registerUser(req.body.email, req.body.password, req.body.username, req.body.description);
        })
        .then((user) => {
          req.logIn(user, (err) => {
            if (err) {
              return next(err);
            }
            res.redirect('/');
          });
        })
        .catch(err => next(err));
    },
    getAccount: (req, res) => {
      res.render('account/profile', {
        title: 'Account Management'
      });
    },
    postUpdateProfile: (req, res, next) => {
      req.assert('email', 'Please enter a valid email address.').isEmail();
      req.sanitize('email').normalizeEmail({
        remove_dots: false
      });

      const errors = req.validationErrors();

      if (errors) {
        req.flash('errors', errors);
        return res.redirect('/account');
      }

      let oldUsername = '';

      data.findUserById(req.user.id)
        .then((user) => {
          const options = {
            email: req.body.email || user.email,
            profileName: req.body.name || user.profile.name,
            profileGender: req.body.gender || user.profile.gender,
            profileLocation: req.body.location || user.profile.location,
            profileWebsite: req.body.website || user.profile.website,
            username: req.body.username || user.username,
            description: req.body.description || user.description
          };

          oldUsername = user.username;

          return data.updateUserById(user.id, options);
        })
        .then(user => data.changePhotosUsername(oldUsername, user.username))
        .then(() => {
          req.flash('success', {
            msg: 'Profile information has been updated.'
          });
          res.redirect('/account');
        })
        .catch((err) => {
          if (err.code === 11000) {
            req.flash('errors', {
              msg: 'The email address or username you have entered is already associated with an account.'
            });
            return res.redirect('/account');
          }

          next(err);
        });
    },
    postUpdatePassword: (req, res, next) => {
      req.assert('password', 'Password must be at least 4 characters long').len(4);
      req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

      const errors = req.validationErrors();

      if (errors) {
        req.flash('errors', errors);
        return res.redirect('/account');
      }

      data.updateUserPassword(req.user.id, req.body.password)
        .then((user) => {
          req.flash('success', {
            msg: 'Password has been changed.'
          });

          res.redirect('/account');
        })
        .catch(err => next(err));
    },
    postDeleteAccount: (req, res, next) => {
      data.deleteUser(req.user.id)
        .then(() => {
          req.logout();
          req.flash('info', {
            msg: 'Your account has been deleted.'
          });

          res.redirect('/');
        })
        .catch(err => next(err));
    },
    getOauthUnlink: (req, res, next) => {
      const provider = req.params.provider;

      data.findUserById(req.user.id)
        .then((user) => {
          const tokens = user.tokens.filter(token => token.kind !== provider);
          return data.updateTokensProvider(user.id, provider, tokens);
        })
        .then((user) => {
          req.flash('info', {
            msg: `${provider} account has been unlinked.`
          });

          res.redirect('/account');
        })
        .catch(err => next(err));
    },
    getReset: (req, res, next) => {
      if (req.isAuthenticated()) {
        return res.redirect('/');
      }

      data.findUserByResetToken(req.params.token, Date.now())
        .then((user) => {
          if (!user) {
            req.flash('errors', {
              msg: 'Password reset token is invalid or has expired.'
            });
            return res.redirect('/forgot');
          }

          res.render('account/reset', {
            title: 'Password Reset'
          });
        })
        .catch(err => next(err));
    },
    postReset: (req, res, next) => {
      req.assert('password', 'Password must be at least 4 characters long.').len(4);
      req.assert('confirm', 'Passwords must match.').equals(req.body.password);

      const errors = req.validationErrors();

      if (errors) {
        req.flash('errors', errors);
        return res.redirect('back');
      }

      async.waterfall([
        function resetPassword(done) {
          data.findUserByResetToken(req.params.token, Date.now())
            .then((user) => {
              if (!user) {
                req.flash('errors', {
                  msg: 'Password reset token is invalid or has expired.'
                });

                return res.redirect('back');
              }

              return data.updateUserPassword(user.id, req.body.password);
            })
            .then(user => data.updateUserPasswordReset(user.id, undefined, undefined))
            .then((user) => {
              req.logIn(user, (err) => {
                done(err, user);
              });
            })
            .catch(err => next(err));
        },
        function sendResetPasswordEmail(user, done) {
          const transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
              user: process.env.SENDGRID_USER,
              pass: process.env.SENDGRID_PASSWORD
            }
          });
          const mailOptions = {
            to: user.email,
            from: supportEmail,
            subject: 'Your password has been changed',
            text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
          };
          transporter.sendMail(mailOptions, (err) => {
            req.flash('success', {
              msg: 'Success! Your password has been changed.'
            });
            done(err);
          });
        }
      ], (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    },
    getForgot: (req, res) => {
      if (req.isAuthenticated()) {
        return res.redirect('/');
      }

      res.render('account/forgot', {
        title: 'Forgot Password'
      });
    },
    postForgot: (req, res, next) => {
      req.assert('email', 'Please enter a valid email address.').isEmail();
      req.sanitize('email').normalizeEmail({
        remove_dots: false
      });

      const errors = req.validationErrors();

      if (errors) {
        req.flash('errors', errors);
        return res.redirect('/forgot');
      }

      async.waterfall([
        function createRandomToken(done) {
          crypto.randomBytes(16, (err, buf) => {
            const token = buf.toString('hex');
            done(err, token);
          });
        },
        function setRandomToken(token, done) {
          data.findUserByEmail(req.body.email)
            .then((user) => {
              if (!user) {
                req.flash('errors', {
                  msg: 'Account with that email address does not exist.'
                });

                return res.redirect('/forgot');
              }

              return data.updateUserPasswordReset(user.id, token, Date.now() + 3600000);
            })
            .then((user) => {
              done(null, token, user);
            })
            .catch(err => done(err));
        },
        function sendForgotPasswordEmail(token, user, done) {
          const transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
              user: process.env.SENDGRID_USER,
              pass: process.env.SENDGRID_PASSWORD
            }
          });
          const mailOptions = {
            to: user.email,
            from: supportEmail,
            subject: 'Reset your password',
            text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${req.headers.host}/reset/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`
          };
          transporter.sendMail(mailOptions, (err) => {
            req.flash('info', {
              msg: `An e-mail has been sent to ${user.email} with further instructions.`
            });
            done(err);
          });
        }
      ], (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/forgot');
      });
    }
  };
};