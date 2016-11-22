exports.getFileUpload = (req, res) => {
    res.render('upload', {
        title: 'File Upload'
    });
};

exports.postFileUpload = (req, res) => {
    req.flash('success', {
        msg: 'File was uploaded successfully.'
    });
    res.redirect('/upload');
};