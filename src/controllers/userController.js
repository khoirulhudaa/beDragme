const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const nodemailer = require('nodemailer');

// Reset password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Cek apakah email pengguna ada di database
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'Email not found', status: 404 });
    }

    // Generate token untuk reset password
    const generateRandomString = (length) => {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
      }

      return result;
    };
    user.resetPasswordToken = generateRandomString(5);
    user.resetPasswordExpires = Date.now() + 3600000; // Token akan kadaluarsa dalam 1 jam
    await user.save();

    // Kirim email reset password
    const transporter = nodemailer.createTransport({
      // Konfigurasi SMTP transporter (sesuaikan dengan penyedia email Anda)
      service: 'Gmail', 
      auth: {
        user: 'swiftveler@gmail.com',
      }
    });

    const mailOptions = {
      from: 'swiftveler@gmail.com',
      to: user.email,
      subject: 'Reset Password',
      text: `
        <p>
          Please click the following link to reset your password: ${req.headers.origin}/reset-password/swfitveler1635dsd3290
        </p>
        <br />
        <p>Token reset password: ${generateRandomString(5)}</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.json({ message: error, status: 500 });
      } else {
        return res.json({ message: 'Email sent for password reset', status: 201 });
      }
    });
  } catch (error) {
    return res.json({ message: 'Internal server error', status: 500 });
  }
}

// Mengambil daftar semua pengguna
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.json({users});
  } catch (error) {
    return res.json({ message: error, status: 500 });
  }
};

const getUserOne = async (req, res) => {
  try {
    const {email} = req.params
    const users = await User.findOne({ email });

    if (!users) {
      return res.json({ message: 'User not found', status: 404, data: email });
    }

    return res.json({ message: users, status: 201 });
  
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
    if(user) {

       // Periksa apakah tanggal login telah kadaluarsa setelah 1 hari
      const expirationDate = moment(user.date).add(30, 'day');
      const isExpired = moment().isAfter(expirationDate);
  
      if (isExpired) {
        // Update status user menjadi "standar" jika telah kadaluarsa
        user.status = 'standar';
        await user.save();
      }

      // Simpan data user
      
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
    }

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
  getUserOne,
  forgotPassword
};
