const mongoose = require('mongoose');

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
}

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
  status: { type: String, default: 'standar' }
});

module.exports = mongoose.model('User', userSchema);

082318908291