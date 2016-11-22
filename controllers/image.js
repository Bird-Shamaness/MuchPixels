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

    req.flash('success', {
        msg: 'File was uploaded successfully.'
    });
    res.redirect('/upload');
};