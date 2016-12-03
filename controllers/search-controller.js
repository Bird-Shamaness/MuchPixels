module.exports = function (data) {
    return {
        index(req, res) {
            res.render('search');
        },
        searchPhotos(req, res) {
            const pattern = req.params.pattern;

            data.searchPhotos(pattern)
                .then(photos => {
                    res.render('partials/photos-list', {
                        photos
                    });
                });
        },
        searchUsers(req, res) {
            const pattern = req.params.pattern;

            data.searchUsers(pattern)
                .then(users => {
                    res.render('partials/users-list', {
                        users
                    });
                });
        }
    };
}