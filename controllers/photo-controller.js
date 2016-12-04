const listCount = 5;
const timeConverter = require('../utils/time-converter');

module.exports = function (data) {
    return {
        getPhotoDetails(req, res) {
            let photoModel = {};
            data.getPhotoById(req.params.id)
                .then((photo) => {
                    let canUpvote = false;
                    let canEdit = false;

                    const comments = [];

                    if (req.user) {
                        canUpvote = !photo.upvotes.find(v => v.user === req.user.email);

                        canEdit = photo.author === req.user.username || req.user.roles.indexOf('admin') > -1;

                        photo.comments.forEach(function (comment) {
                            let canDeleteComment = comment.user === req.user.username || photo.author === req.user.username || req.user.roles.indexOf('admin') > -1;

                            comments.push({
                                comment,
                                canDeleteComment
                            });

                        }, this);
                    }

                    photoModel = {
                        url: photo.url,
                        canUpvote,
                        votes: photo.upvotes.length,
                        comments: comments,
                        date: photo.date,
                        author: photo.author,
                        id: photo._id,
                        hasUser: !!req.user,
                        title: photo.title,
                        description: photo.description,
                        tags: photo.tags,
                        canEdit
                    };

                    return timeConverter.convertTime(photoModel.date, new Date());
                })
                .then((convertedTime) => {
                    photoModel.date = convertedTime;

                    return timeConverter.convertMultipleComments(photoModel.comments, new Date());
                })
                .then((convertedCommentDates) => {
                    photoModel.comments = convertedCommentDates;

                    res.render('photo/photo-details', {
                        photoModel
                    });
                })
                .catch((err) => {
                    res.redirect('/error/non-existing-photo');
                });
        },
        getHotPhotos(req, res) {
            data.getHotPhotos(listCount, 1)
                .then((photos) => {
                    return timeConverter.convertMultiple(photos, new Date());
                })
                .then((photos) => {
                    res.render('photo/photo-list', {
                        photos
                    });
                });
        },
        getTrendingPhotos(req, res) {
            data.getTrendingPhotos(listCount, 1)
                .then((photos) => {
                    return timeConverter.convertMultiple(photos, new Date());
                })
                .then((photos) => {
                    res.render('photo/photo-list', {
                        photos
                    });
                });
        },
        getEdit(req, res) {
            data.getPhotoById(req.params.id)
                .then((foundPhoto) => {
                    const canEdit = foundPhoto.author === req.user.username || req.user.roles.indexOf('admin') > -1;

                    if (!canEdit) {
                        res.redirect(`/photo/details/${req.params.id}`);
                    }

                    const photoModel = {
                        url: foundPhoto.url,
                        id: req.params.id,
                        description: foundPhoto.description,
                        title: foundPhoto.title
                    };

                    res.render('photo/edit', {
                        photo: photoModel
                    });
                })
                .catch(
                    (err) => {
                        console.log(err);
                    }
                );
        },
        postEdit(req, res) {
            data.updatePhoto(req.params.id, req.body.title, req.body.description)
                .then((photo) => {
                    res.redirect(`/photo/details/${req.params.id}`);
                });
        },
        getPaged(req, res) {
            const page = +req.params.page + 1;
            const take = page * listCount;

            data.getPhotoCount()
                .then((count) => {
                    const canTake = count + listCount > take;
                    if (canTake) {
                        if (req.params.type === 'trending') {
                            return data.getTrendingPhotos(listCount, page);
                        }

                        return data.getHotPhotos(listCount, page);
                    }
                })
                .then((photos) => {
                    return timeConverter.convertMultiple(photos, new Date());
                })
                .then((photos) => {
                    if (photos) {
                        res.send;
                        res.render('photo/photo-list', {
                            photos
                        });
                    }
                });
        },
        getType(req, res) {
            const type = req.route.path.indexOf('trending') < 0 ? 'hot' : 'trending';

            res.redirect(`/photo/${type}/1`);
        },
        deletePhoto(req, res) {
            data.deletePhoto(req.params.id)
                .then(() => {
                    res.redirect('/photo/hot');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };
};