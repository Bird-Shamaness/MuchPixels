const Photo = require('../models/Photo');

const fs = require('fs');

exports.getFileUpload = (req, res) => {
  if (!req.user) {
      return res.redirect('/');
    }

  res.render('upload', {
      title: 'File Upload'
    });
};

exports.postFileUpload = (req, res) => {
  if (!req.user) {
      return res.redirect('/');
    }

  const photoDestination = req.file.path;

  const photo = new Photo({
      data: fs.readFileSync(photoDestination),
      contentType: req.file.mimetype,
      userId: req.user._id,
      author: req.user.email
    });

  photo.save();

  fs.unlinkSync(photoDestination);

  req.flash('success', {
      msg: 'File was uploaded successfully.'
    });

  res.redirect('/upload');
};
