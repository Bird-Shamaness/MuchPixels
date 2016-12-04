module.exports = function (models) {
  const {
    Message
  } = models;

  return {
    createMessage(author, content, date) {
      return new Promise((resolve, reject) => {
        const message = new Message({
          author,
          content,
          date
        });
        message.save();

        return resolve(message);
      });
    }
  };
};