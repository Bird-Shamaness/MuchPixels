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
                  console.log(userPhotos);

                  return bufferConverter.convertCollectionOfBuffersto64Array(userPhotos);
                })
                .then((convertedPhotos) => {

                  console.log(convertedPhotos);

                  const userModel = {
                      username: user.username,
                      photos: convertedPhotos
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
