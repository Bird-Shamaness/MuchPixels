module.exports = {
  getNonExistingUser(req, res) {
      res.render('errors/non-existing-user');
    },
  getNonExistingPhoto(req, res) {
      res.render('errors/non-existing-photo');
    }
};
