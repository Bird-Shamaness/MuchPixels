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
    },
    getHotPhotos(count) {
      const photos = Photo.find()
        .sort({ upvoats: -1 })
        .limit(count);

      return new Promise((resolve, reject) => {
        resolve(photos);
      });
    },
    getTrendingPhotos(count) {
      const photos = Photo.find()
        .sort({ date: -1 })
        .limit(count);

      return new Promise((resolve, reject) => {
        resolve(photos);
      });
    }
  };
};