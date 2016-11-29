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
      } else if (!req) {
        req.flash('errors', {
          msg: 'You have to put valid path to your photo.'
        });
        return res.redirect('/upload');
      } else if (!req.file) {
        req.flash('errors', {
          msg: 'You have to put valid path to your photo.'
        });

        return res.redirect('/upload');
      } else if (!req.body.title) {
        req.flash('errors', {
          msg: 'You have to choose a title of your photo.'
        });

        return res.redirect('/upload');
      }

      const photoDestination = req.file.path;

      data.createPhoto(fs.readFileSync(photoDestination), req.file.mimetype, req.user.username, req.body.title, req.body.description)
        .then((photo) => {
          fs.unlinkSync(photoDestination);

          req.flash('success', {
            msg: 'Your photo was uploaded successfully.'
          });

          res.redirect(`/photo/details/${photo._id}`);
        });
    }
  };
};
