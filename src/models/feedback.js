const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now() },
  feedack: { type: String, required: true }
});

module.exports = mongoose.model('Feedback', feedbackSchema);