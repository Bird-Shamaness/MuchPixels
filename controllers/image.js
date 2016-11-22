const User = require('../models/User');
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

    User.findOne({
        '_id': req.user._id
    }, (err, userWithId) => {
        if (err) {
            throw err;
        }

        var photoDestination = req.file.path;

        let photo = {
            img: {
                data: fs.readFileSync(photoDestination),
                contentType: req.file.mimetype
            }
        };

        userWithId.photos.push(photo);
        userWithId.save();

        fs.unlinkSync(photoDestination);
    });

    req.flash('success', {
        msg: 'File was uploaded successfully.'
    });
    res.redirect('/upload');
};