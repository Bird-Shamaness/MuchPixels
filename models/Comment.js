const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  username: {
      type: String,
      required: true
    },
  content: {
      type: String,
      required: true
    },
  date: Date
}, {
  timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
