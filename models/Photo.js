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
  title:{
    type: String,
    required: true
  },
  description: {
    type: String
  },
  upvotes: [{
    user: String
  }],
  comments: [{
    user: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    postId: mongoose.Schema.Types.ObjectId
  }],
}, {
  timestamps: true
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
