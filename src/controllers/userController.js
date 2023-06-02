const User = require('../models/User');

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
  const { username, password } = req.body;

  try {
    // Cek apakah pengguna ada dalam database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    // Periksa kecocokan password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Password salah' });
    }

    // Berhasil login
    return res.status(200).json({ message: 'Login berhasil' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// Membuat pengguna baru
const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
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
