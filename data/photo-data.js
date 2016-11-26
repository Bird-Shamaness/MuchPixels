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
    createPhoto(data, contentType, author) {
      return new Promise((resolve, reject) => {
        const photo = new Photo({
          data,
          contentType,
          author
        });

        photo.save();

        return resolve(photo);
      });
    },
    getPhotoById(id) {
      return Photo.findById(id).exec();
    }
  };
};
