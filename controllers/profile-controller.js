module.exports = function (data) {
  return {
    getUserProfile(req, res) {
      let user = {};
      data.getProfileByUsername(req.params.username)
        .then((foundUser) => {
          user = foundUser;

          return data.getUserPhotos(foundUser.username);
        })
        .then((userPhotos) => {
          const userModel = {
            username: user.username,
            photos: userPhotos
          };

          res.render('profile', {
            userModel
          });
        })
        .catch(err => res.redirect('/error/non-existing-user'));
    }
  };
};
