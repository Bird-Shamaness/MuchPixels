module.exports = function (data) {
  return {
      getUserProfile(req, res) {
          data.getProfileByUsername(req.params.username)
                .then((user) => {
                  console.log(user);
                  const userModel = {
                      username: user.username
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
