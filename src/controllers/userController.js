const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mengambil daftar semua pengguna
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.json({users});
  } catch (error) {
    return res.json({ message: 'Error retrieving users', status: 500 });
  }
};

const getUserOne = async (req, res) => {
  try {
    const {email} = req.body
    const users = await User.findOne({ email });

    if (!users) {
      return res.json({ message: 'User not found', status: 404, email: email });
    }
    return res.json({message: users, status: 201});
  
  } catch (error) {
    return res.json({ message: error })
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cek apakah pengguna ada dalam database
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: 'User not found!', status: 404 });
    }

    // Periksa kecocokan password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.json({ message: 'Internal server error', status: 500 });
      }

      if (!isMatch) {
        return res.json({ message: 'Wrong email or password!!', status: 401 });
      }

      // Create and sign the JWT token
      const token = jwt.sign({ userId: user._id }, 'Swiftvel', { expiresIn: '1h' });

      // Return the token to the client
      return res.json({ token: token, data: user, status: 201 });
    });

    // Berhasil login
  } catch (error) {
    console.error(error);
    return res.json({ message: 'Error internal server!', status: 500 });
  }
};

// Membuat pengguna baru
const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.json({ message: 'Username already exists', status: 400 });
    if(username.length < 3) return res.json({ message: 'Username minimal 3 characters', status: 401 });
    if(password.length < 5) return res.json({ message: 'Password minimal 5 characters', status: 402 });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({ username, email, password: hashedPassword  });
    await user.save();

    return res.json({user, status: 201});
  } catch (error) {
    return res.json({ message: error, status: 500 });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  loginUser,
  getUserOne
};
