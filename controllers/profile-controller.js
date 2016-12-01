const bufferConverter = require('../utils/buffer-converter');

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
            registered: user.createdAt
          };
          
          res.render('profile', {
            userModel
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
};
