module.exports = function (models) {
  const {
        User,
        Photo
    } = models;

  return {
      getProfileByUsername(username) {
          return new Promise((resolve, reject) => {
              User.findOne({
                  username
                }, (err, user) => {
                  if (err) {
                      reject(err);
                    }

                  resolve(user);
                });
            });
        },
      getUserPhotos(username) {
          return Photo.find({
              author: username
            });
        }
    };
};
