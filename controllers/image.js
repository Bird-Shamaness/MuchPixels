const Photo = require('../models/photo-model');

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

    var photoDestination = req.file.path;

    var photo = new Photo({
        data: fs.readFileSync(photoDestination),
        contentType: req.file.mimetype,
        userId: req.user._id
    });

    photo.save();

    fs.unlinkSync(photoDestination);

    req.flash('success', {
        msg: 'File was uploaded successfully.'
    });
    res.redirect('/upload');
};