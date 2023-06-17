const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3, },
  date: { type: Date, default: null },
  feedack: { type: String, required: true }
});

module.exports = mongoose.model('Feedback', feedbackSchema);