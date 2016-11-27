const bufferConverter = require('../utils/buffer-converter');

const listCount = 5;

module.exports = function (data) {
  return {
    getPhotoDetails(req, res) {
      let foundPhoto = {};

      data.getPhotoById(req.params.id)
        .then((photo) => {
          foundPhoto = photo;

          return bufferConverter.convertBufferTo64Array(photo.data);
        })
        .then((convertedString) => {
          let canUpvote = false;
          if (req.user) {
            canUpvote = !foundPhoto.upvotes.find(v => v.user === req.user.email);
          }

          const photoModel = {
            contentType: foundPhoto.contentType,
            data: convertedString,
            canUpvote,
            votes: foundPhoto.upvotes.length,
            comments: foundPhoto.comments,
            date: foundPhoto.date,
            author: foundPhoto.author,
            id: foundPhoto._id,
            hasUser: !!req.user
          };

          res.render('photo-details', {
            photoModel
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getHotPhotos(req, res) {
      data.getHotPhotos(listCount)
      .then((photos) => {
        res.render('photo-list', {
          photos
        });
      });
    },
    getTrendingPhotos(req, res) {
      data.getTrendingPhotos(listCount)
      .then((photos) => {
        res.render('photo-list', {
          photos
        });
      });
    },
    postComment(req, res) {
      data.createComment(req.params.id, req.body.content, req.user)
        .then((successPhoto) => {
          res.redirect(`/photo/details/${req.params.id}`);
        });
    },
    putUpvote(req, res) {
      data.upvote(req.params.id, req.user)
      .then((successPhoto) => {
        res.redirect(`/photo/details/${req.params.id}`);
      });
    },
    removeUpvote(req, res) {
      data.unvote(req.params.id, req.user)
       .then((successPhoto) => {
         res.redirect(`/photo/details/${req.params.id}`);
       });
    }
  };
};
