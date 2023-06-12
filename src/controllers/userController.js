const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mengambil daftar semua pengguna
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cek apakah pengguna ada dalam database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    // Periksa kecocokan password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Passsword salah!' });
      }

      // Create and sign the JWT token
      const token = jwt.sign({ userId: user._id }, 'Swiftvel', { expiresIn: '1h' });

      // Return the token to the client
      return res.status(200).json({ message: 'Login berhasil', token });
    });

    // Berhasil login
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Membuat pengguna baru
const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({ username, email, hashedPassword });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  loginUser
};
