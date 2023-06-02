const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3 },
  password: { type: String, required: true, minlength: 5 },
  // tambahkan lebih banyak field sesuai kebutuhan
});

module.exports = mongoose.model('User', userSchema);