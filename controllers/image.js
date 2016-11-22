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

    console.log(req);

    req.flash('success', {
        msg: 'File was uploaded successfully.'
    });
    res.redirect('/upload');
};