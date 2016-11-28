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
      console.log(req.body);
      data.createPhoto(fs.readFileSync(photoDestination), req.file.mimetype, req.user.email, req.body.title, req.body.description)
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
