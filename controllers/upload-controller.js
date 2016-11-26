const fs = require('fs');

module.exports = function (data) {
  return {
    getPhotoUpload(req, res) {
      if (!req.user) {
        return res.redirect('/');
      }

      res.render('upload', {
        title: 'Photo Upload'
      });
    },
    postPhotoUpload(req, res) {
      if (!req.user) {
        return res.redirect('/');
      }

      const photoDestination = req.file.path;

      data.createPhoto(fs.readFileSync(photoDestination), req.file.mimetype, req.user.email)
      .then((photo) => {
        fs.unlinkSync(photoDestination);

        req.flash('success', {
          msg: 'File was uploaded successfully.'
        });

        res.redirect('/upload');
      });
    }
  };
};
