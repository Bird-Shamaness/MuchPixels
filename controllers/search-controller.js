module.exports = function (data) {
    return {
        index(req, res) {
            res.render('search');
        },
        searchPhotos(req, res) {
            const pattern = req.params.pattern;

            data.searchPhotos(pattern)
                .then(photos => {
                    res.render('photo-list', {
                        photos
                    });
                });
        },
        searchUsers(req, res) {
            const pattern = req.params.pattern;

            data.searchUsers(pattern)
                .then(users => {
                    res.render('user-list', {
                        users
                    });
                });
        }
    };
}