module.exports = function (models) {
    const {
        Photo
    } = models;

    return {
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
        }
    };
};