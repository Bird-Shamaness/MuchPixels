module.exports = function (models) {
    const {
        Photo
    } = models;

    return {
        getAllPhotos() {
            return new Promise((resolve, reject) => {
                Photo.find((err, photos) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(photos);
                });
            });
        },
        createPhoto(url, author, title, description, tags) {
            return new Promise((resolve, reject) => {

                tags = tags.split(',');

                for (let tag of tags) {
                    tag = tag.trim();
                }

                const photo = new Photo({
                    url,
                    author,
                    title,
                    description,
                    tags
                });
                photo.save();

                return resolve(photo);
            });
        },
        getPhotoById(id) {
            return Photo.findById(id).exec();
        },
        getHotPhotos(count, page) {
            const photos = Photo.find()
                .sort({
                    upvotes: -1
                })
                .limit(count * page);

            return new Promise((resolve, reject) => {
                resolve(photos);
            });
        },
        getTrendingPhotos(count, page) {
            const photos = Photo.find()
                .sort({
                    date: -1
                })
                .limit(count * page);

            return new Promise((resolve, reject) => {
                resolve(photos);
            });
        },
        createComment(id, content, user) {
            const comment = {
                user: user.username,
                content,
                photoId: id
            };

            return Photo.findByIdAndUpdate(id, {
                $push: {
                    comments: comment
                }
            });
        },
        upvote(id, user) {
            const upvote = {
                user: user.email
            };

            return Photo.findByIdAndUpdate(id, {
                $push: {
                    upvotes: upvote
                }
            });
        },
        unvote(id, user) {
            return Photo.findByIdAndUpdate(id, {
                $pull: {
                    upvotes: {
                        user: user.email
                    }
                }
            });
        },
        updatePhoto(id, newTitle, newDescription) {
            return Photo.findByIdAndUpdate(id, {
                title: newTitle,
                description: newDescription
            });
        },
        changePhotosUsername(oldUsername, newUsername) {
            Photo.find({
                author: oldUsername
            }, (err, data) => new Promise((resolve, reject) => {
                if (err) {
                    reject(err);
                }

                data.forEach((photo) => {
                    photo.author = newUsername;
                    photo.save();
                }, this);

                resolve();
            }));
        },
        getPhotoCount() {
            return Photo.count({}, (err, count) => new Promise((resolve, reject) => {
                if (err) {
                    reject(err);
                }

                resolve(count);
            }));
        },
        deletePhoto(id) {
            return Photo.remove({
                _id: id
            });
        },
        getPhotoCount() {
            return Photo.count({}, (err, count) => new Promise((resolve, reject) => {
                if (err) {
                    reject(err);
                }

                resolve(count);
            }));
        },
        deletePhoto(id) {
            return Photo.remove({
                _id: id
            });
        },
        deleteComment(id, commentDate) {
            const dateOfComment = new Date(commentDate);

            return new Promise((resolve, reject) => {
                Photo.findById(id, (err, photo) => {
                    if (err) {
                        reject(err);
                    }

                    var comment = photo.comments.find(x => x.date.toString() === dateOfComment.toString());
                    var commentId = photo.comments.indexOf(comment);
                    photo.comments.splice(commentId)

                    photo.save((err, photo) => {
                        if (err) {
                            reject(err);
                        }

                        resolve(photo);
                    });
                });
            });
        }
    };
};