const mongoose = require('mongoose'),
  Comment = require('./Comment');

const photoSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  userId: mongoose.Schema.Types.ObjectId,
  author: String,
  date: {
    type: Date,
    default: Date.now
  },
  upvotes: [{
    username: String,
    required: true
  }],
  comments: [Comment.schema]
}, {
  timestamps: true
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
