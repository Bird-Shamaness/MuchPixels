module.exports = {
<<<<<<< HEAD
  getMessenger(req, res) {
<<<<<<< HEAD
    res.render('messenger');
  }
};

// module.exports = function(data) {
//   return {
//     getMessenger(req, res) {
//       res.render('messenger');
//     },
//     insertMessage(req, res) {
//       data.createMessage(req.params.author, req.body.content, req.date)
//         .then((successMessage) => {
//           res.send;
//         });
//     }
//   };
// };
=======
    res.render('messenger/messenger');
  }
};
>>>>>>> origin/master
=======
    getMessenger(req, res) {
      res.render('messenger');
    }
};
>>>>>>> parent of f06335f... Partialy implemented data
