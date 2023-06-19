const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3, },
  idAccount: {type: String, default: null},
  email: { type: String, required: true, unique: true,
    validate: {
      validator: function (value) {
        // Use a regular expression to validate the email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      message: 'Invalid email format',
    },
  },
  password: { type: String, required: true, minlength: 5 },
  status: { type: String, default: 'standar' },
  paymentType: { type: String, default: null },
  date: { type: Date, default: null },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

module.exports = mongoose.model('User', userSchema);