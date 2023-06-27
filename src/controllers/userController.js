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
    const tokens = generateRandomString(5);
    user.resetPasswordToken = tokens;
    user.resetPassword = Date.now(); // Token akan kadaluarsa dalam 1 jam
    await user.save();

    // Kirim email reset password
    const transporter = nodemailer.createTransport({
      // Konfigurasi SMTP transporter (sesuaikan dengan penyedia email Anda)
      service: 'Gmail', 
      auth: {
        user: 'swiftveler@gmail.com',
        pass: 'tdanurqnqzeeappq'
      }
    });

    const mailOptions = {
      from: 'swiftveler@gmail.com',
      to: user.email,
      subject: 'Reset Password',
      html: ` 
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f2f2f2;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .content {
          background-color: #ffffff;
          padding: 30px;
          border-radius: 5px;
          box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .title2 {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .message {
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #007bff;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
        }
        .button:hover {
          background-color: #0056b3;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #888888;
          font-size: 12px;
        }
        .token {
          font-size: 40px;
          font-weight: bold;
          color: black;
        }
      </style>
      <div class="container">
        <div class="content">
          <h1 class="title">Reset Your Password</h1>
          <p class="message">Hello, Swiftveler</p>
          <p class="message">You have requested to reset your password. Click the button below to proceed:</p>
          <a href="${req.headers.origin}/reset-password/swfitveler1635dsd3290ADHGWYGDXVVXCV16215651HSCHXZCY67YCHSOCIXslskjdsh781d655cxhcjxmnkzcx" class="button">Reset Password</a>
          <br />
          <p class="token">Token:</p>
          <h3 class="title2">${tokens}</h3>
          </div>
        <div class="footer">
          This email was sent to you as part of the password reset process. If you did not request a password reset, please ignore this email.
        </div>
      </div>
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

    // Periksa apakah ada pengguna dengan email yang sesuai atau username yang sesuai
    const user = await User.findOne({
      $or: [{ email: email }, { username: email }]
    });

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

const updatePassword = async (req, res) => {
  const { password, token } = req.body;
  if(password.length < 5) return res.json({ message: 'Password minimal 5 characters', status: 402 });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await updateDatabase(hashedPassword, token)
  .then(() => {
    // Send a response to Midtrans indicating that the callback has been processed successfully
    return res.json({ status: 201 })
  })
  .catch((error) => {
    // Send an error response to Midtrans
    return res.json({ messae:error, status: 500 });
  });
}

const updateLimitReact = async (req, res) => {
  const { email } = req.params;

  try {
    // Cari pengguna berdasarkan email
    const user = await User.findOne({ email });

    // Jika pengguna ditemukan, tambahkan 1 ke nilai "limit"
    if (user) {
      if(user.limitReact !== 2) {
          user.limit = user.limit + 1;
          await user.save();
          console.log('limit update');
          return res.json({ message: 'success update limit', status: 201 })
        }else {
          console.log('Maximal limit');
          return res.json({ message: 'Limit maximum', status: 500 });
        }
      }else {
        console.log('Email not found!');
        return res.json({ message: 'Email not found!', status: 404 })
    }
  } catch (error) {
      console.error('Error message:', error);
  }
}

// Update the database based on the transaction status
const updateDatabase = (password, token) => {
  return new Promise((resolve, reject) => {
    // Perform the database update here
    // Update a document matching a specific condition

    const filter = { resetPasswordToken: token }; // Replace with your filter condition
    const update = { password }; // Replace with the fields you want to update

    User.updateOne(filter, update)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error('Error updating document:', error);
      });

    // Simulating a delay for the database update
    setTimeout(() => {
      if (Math.random() < 0.8) {
        // Database update is successful
        resolve();
      } else {
        // Database update failed
        reject(new Error('Failed to update database.'));
      }
    }, 1000);
  });
};

module.exports = {
  getAllUsers,
  createUser,
  loginUser,
  getUserOne,
  forgotPassword,
  updatePassword,
  updateLimitReact
};
