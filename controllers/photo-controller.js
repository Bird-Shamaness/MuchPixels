const Photo = require('./../models/Photo'),
  bufferConverter = require('../utils/buffer-converter');


exports.getPhotoDetails = (req, res) => {
  Photo.findById(req.params.id, (err, photo) => {
      bufferConverter.convertBufferTo64Array(photo.data)
            .then((convertedString) => {
              const photoModel = {
                  contentType: photo.contentType,
                  data: convertedString
                };

              res.render('photo-details', {
                  photoModel
                });
            });
    });
};
