module.exports = function (models) {
    const {
        Photo,
        User
    } = models;

    return {
        searchPhotos(pattern) {
            return new Promise((resolve, reject) => {
                Photo.find({
                        'title': new RegExp(pattern, 'i')
                    },
                    (err, photos) => {

                        if (err) {
                            reject(err);
                        }

                        resolve(photos);
                    })
            });
        },
        searchUsers(pattern) {
            return new Promise((resolve, reject) => {
                User.find({
                        'username': new RegExp(pattern, 'i')
                    },
                    (err, users) => {

                        if (err) {
                            reject(err);
                        }

                        resolve(users);
                    })
            });
        }
    };
};