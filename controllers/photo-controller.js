const listCount = 5;

module.exports = function (data) {
  return {
    getPhotoDetails(req, res) {
      data.getPhotoById(req.params.id)
        .then((photo) => {
          let canUpvote = false;
          let canEdit = false;

          if (req.user) {
            canUpvote = !photo.upvotes.find(v => v.user === req.user.email);

            canEdit = photo.author === req.user.username || req.user.roles.indexOf('admin') > -1;
          }

          const photoModel = {
            contentType: photo.contentType,
            data: photo.data,
            canUpvote,
            votes: photo.upvotes.length,
            comments: photo.comments,
            date: photo.date,
            author: photo.author,
            id: photo._id,
            hasUser: !!req.user,
            title: photo.title,
            description: photo.description,
            canEdit
          };

          res.render('photo-details', {
            photoModel
          });
        })
        .catch((err) => {
          res.redirect('/error/non-existing-photo');
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
    getEdit(req, res) {
      data.getPhotoById(req.params.id)
        .then((foundPhoto) => {
          const canEdit = foundPhoto.author !== req.user.username || req.user.roles.indexOf('admin') > -1;

          if (!canEdit) {
            res.redirect(`/photo/details/${req.params.id}`);
          }

          const photoModel = {
            contentType: foundPhoto.contentType,
            data: foundPhoto.data,
            description: foundPhoto.description,
            title: foundPhoto.title
          };

          res.render('edit', {
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
    }
  };
};
