module.exports = function (data) {
    return {
        postComment(req, res) {
            data.createComment(req.params.id, req.body.content, req.user)
                .then((successPhoto) => {
                    res.send;
                    res.redirect(`/photo/details/${req.params.id}`);
                });
        },
        putUpvote(req, res) {
            data.upvote(req.params.id, req.user)
                .then((successPhoto) => {
                    res.send;
                    res.redirect(`/photo/details/${req.params.id}`);
                });
        },
        removeUpvote(req, res) {
            data.unvote(req.params.id, req.user)
                .then((successPhoto) => {
                    res.send;
                    res.redirect(`/photo/details/${req.params.id}`);
                });
        },
        removeComment(req, res) {
            const dateToString = req.body.content;
            data.deleteComment(req.params.id, dateToString)
                .then(photo => {
                    const comments = [];

                    photo.comments.forEach(function (comment) {
                        let canDeleteComment = comment.user === req.user.username || photo.author === req.user.username || req.user.roles.indexOf('admin') > -1;

                        comments.push({
                            comment,
                            canDeleteComment
                        });

                    }, this);

                    const model = {
                        comments
                    };

                    res.render('partials/comments', {
                        photo: model
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };
};