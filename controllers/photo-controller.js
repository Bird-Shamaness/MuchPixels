const Photo = require('./../models/Photo'),
  bufferConverter = require('../utils/buffer-converter');

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
          const canUpvote = foundPhoto.upvotes.find(v => v.username === req.user.username);

          const photoModel = {
            contentType: foundPhoto.contentType,
            data: convertedString,
            canUpvote,
            comments: foundPhoto.comments,
            date: foundPhoto.date,
            author: foundPhoto.author
          };

          res.render('photo-details', {
            photoModel
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
};
