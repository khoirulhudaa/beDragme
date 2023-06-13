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
      return res.status(404).json({ message: 'User not found!' });
    }

    // Periksa kecocokan password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Wrong email or password!!' });
      }

      // Create and sign the JWT token
      const token = jwt.sign({ userId: user._id }, 'Swiftvel', { expiresIn: '1h' });

      // Return the token to the client
      return res.status(201).send({ token: token, data: user });
    });

    // Berhasil login
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error internal server!' });
  }
};

// Membuat pengguna baru
const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });
    if(username.length < 3) return res.status(401).json({ message: 'Username minimal 3 characters' });
    if(password.length < 5) return res.status(402 ).json({ message: 'Password minimal 5 characters' });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({ username, email, password: hashedPassword  });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  loginUser,
};
