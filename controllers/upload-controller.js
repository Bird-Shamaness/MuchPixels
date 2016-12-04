const fs = require('fs');

module.exports = function (data, cloudinary) {
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

      cloudinary.uploader.upload(photoDestination, function (result) {
        data.createPhoto(result.url, req.user.username, req.body.title, req.body.description, req.body.tags)
          .then((photo) => {
            req.flash('success', {
              msg: 'Your photo was uploaded successfully.'
            });

            fs.unlinkSync(photoDestination);

            res.redirect(`/photo/details/${photo._id}`);
          });
      },
      {
        crop: 'limit',
        width: 2000,
        height: 2000,
        eager: [
           { width: 200, height: 200, crop: 'thumb', gravity: 'face',
             radius: 20, effect: 'sepia' },
          { width: 100, height: 150, crop: 'fit', format: 'png' }
        ],         
      });

    }
  };
};