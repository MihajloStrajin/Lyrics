const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  url: {type: String, required: true},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

module.exports = mongoose.model('Song', songSchema);
