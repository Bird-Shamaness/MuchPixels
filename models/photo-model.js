const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  userId: mongoose.Schema.Types.ObjectId
}, {
  timestamps: true
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
