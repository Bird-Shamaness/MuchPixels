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
            name: user.profile.name || user.username,
            picture: user.profile.picture || user.gravatar,
            photos: userPhotos,
            description: user.description,
            registered: user.createdAt
          };

          res.render('user/profile', {
            userModel
          });
        })
        .catch(err => res.redirect('/error/non-existing-user'));
    }
  };
};