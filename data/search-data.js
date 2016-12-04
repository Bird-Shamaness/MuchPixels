module.exports = function (models) {
    const {
        Photo,
        User
    } = models;

    return {
        searchPhotos(pattern) {
            let regex = new RegExp(pattern, 'i');

            return new Promise((resolve, reject) => {
                Photo.find({
                        $or: [{
                            'title': regex
                        }, {
                            'description': regex
                        }]
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
            let regex = new RegExp(pattern, 'i');

            return new Promise((resolve, reject) => {
                User.find({
                        $or: [{
                            'username': regex
                        }, {
                            'description': regex
                        }, {
                            'name': regex
                        }]
                    },
                    (err, users) => {

                        if (err) {
                            reject(err);
                        }

                        resolve(users);
                    })
            });
        },
        searchTags(tag) {
            return new Promise((resolve, reject) => {

                Photo.find({
                        $or: [{
                            'tags': tag
                        }]
                    },
                    (err, photos) => {

                        if (err) {
                            reject(err);
                        }

                        resolve(photos);
                    })
            });
        },
    };
};