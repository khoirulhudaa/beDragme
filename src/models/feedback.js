const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now() },
  feedback: { type: String, required: true }
});

module.exports = mongoose.model('Feedback', feedbackSchema);