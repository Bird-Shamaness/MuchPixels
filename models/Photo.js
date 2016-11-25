const mongoose = require('mongoose');
//  Comment = require('./Comment');

const photoSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  author: String,
  date: {
    type: Date,
    default: Date.now
  },
  upvotes: [{
    username: String
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
}, {
  timestamps: true
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
