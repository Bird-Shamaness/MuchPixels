module.exports = function (app, passportConfig, controllers, upload) {
  const homeController = controllers.homeController;
  const userController = controllers.userController;
  const contactController = controllers.contactController;
  const uploadController = controllers.uploadController;
  const photoController = controllers.photoController;
  const profileController = controllers.profileController;
  const errorController = controllers.errorController;

  const passport = passportConfig.passport;

  app.get('/', homeController.index);
  app.get('/login', userController.getLogin);
  app.post('/login', userController.postLogin);
  app.get('/logout', userController.logout);
  app.get('/forgot', userController.getForgot);
  app.post('/forgot', userController.postForgot);
  app.get('/reset/:token', userController.getReset);
  app.post('/reset/:token', userController.postReset);
  app.get('/signup', userController.getSignup);
  app.post('/signup', userController.postSignup);
  app.get('/contact', contactController.getContact);
  app.post('/contact', contactController.postContact);
  app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
  app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
  app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
  app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
  app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

  app.get('/upload', uploadController.getPhotoUpload);
  app.post('/upload', upload.single('myFile'), uploadController.postPhotoUpload);

  app.get('/photo/details/:id', photoController.getPhotoDetails);
  app.post('/api/photo/:id', passportConfig.isAuthenticated, photoController.postComment);
  app.get('/api/photo/:id/upvote', passportConfig.isAuthenticated, photoController.putUpvote);
  app.get('/api/photo/:id/unvote', passportConfig.isAuthenticated, photoController.removeUpvote);

  app.get('/photo/hot', photoController.getType);
  app.get('/photo/trending', photoController.getType);

  app.get('/photo/hot/:page', photoController.getHotPhotos);
  app.get('/photo/trending/:page', photoController.getTrendingPhotos);

  app.get('/photo/edit/:id', passportConfig.isAuthenticated, photoController.getEdit);
  app.post('/photo/edit/:id', passportConfig.isAuthenticated, photoController.postEdit);

  app.get('/profile/:username', profileController.getUserProfile);

  app.get('/error/non-existing-user', errorController.getNonExistingUser);
  app.get('/error/non-existing-photo', errorController.getNonExistingPhoto);

  app.get('/api/:type/:page', photoController.getPaged);

  // OAuth authentication routes. (Sign in)
  app.get('/auth/instagram', passport.authenticate('instagram'));
  app.get('/auth/instagram/callback', passport.authenticate('instagram', {
    failureRedirect: '/login'
  }), (req, res) => {
    res.redirect(req.session.returnTo || '/');
  });
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'user_location']
  }));
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/login'
  }), (req, res) => {
    res.redirect(req.session.returnTo || '/');
  });
  app.get('/auth/google', passport.authenticate('google', {
    scope: 'profile email'
  }));
  app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login'
  }), (req, res) => {
    res.redirect(req.session.returnTo || '/');
  });
  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/login'
  }), (req, res) => {
    res.redirect(req.session.returnTo || '/');
  });
};
