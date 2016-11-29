const User = require('../models/User');

module.exports = function (models) {
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
        }
    };
};
