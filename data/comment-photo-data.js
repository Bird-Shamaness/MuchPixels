module.exports = function (models) {
    const {
        Photo
    } = models;

    return {
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