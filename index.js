require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const mongoURI = 'mongodb+srv://dragme:HBXrSHZaJqemsDtW@cluster0.oadoa02.mongodb.net/?retryWrites=true&w=majority'; // Ganti dengan URL MongoDB Anda
const cors = require('cors');

app.use(cors());

// Koneksi ke MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => console.error('Error connecting to MongoDB', error));

// Middleware untuk parsing body request
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Import rute
const userRoutes = require('./src/routes/userRoutes');

// Gunakan rute
app.use('/api/users', userRoutes);

// Tangani kesalahan jika rute tidak ditemukan
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(3002,() => {
    console.log(`Server running in port 3002`)
})
