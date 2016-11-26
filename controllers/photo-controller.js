const Photo = require('./../models/Photo'),
  bufferConverter = require('../utils/buffer-converter');


exports.getPhotoDetails = (req, res) => {
  let foundPhoto = {};

  Photo.findById(req.params.id).exec()
        .then((photo) => {
          foundPhoto = photo;

          return bufferConverter.convertBufferTo64Array(photo.data);
        })
        .then((convertedString) => {
          const photoModel = {
              contentType: foundPhoto.contentType,
              data: convertedString
            };

          res.render('photo-details', {
              photoModel
            });
        })
        .catch((err) => {
          console.log(err);
        });
};
