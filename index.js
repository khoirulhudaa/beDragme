const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

app.use(cors({
  origin: 'http://localhost:3000', // Atur asal yang diizinkan
  methods: ['GET', 'POST', 'OPTIONS'], // Atur metode yang diizinkan
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(session({ secret: 'YOUR_SESSION_SECRET', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Atur mesin templat EJS
app.set('view engine', 'ejs');

// Atur folder tampilan (views) sebagai tempat untuk file EJS
app.set('views', __dirname + '/src/views');

// Serialize user object
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user object
passport.deserializeUser((user, done) => {
  done(null, user);
});


// Koneksi ke MongoDB
const mongoURI = 'mongodb+srv://dragme:HBXrSHZaJqemsDtW@cluster0.oadoa02.mongodb.net/?retryWrites=true&w=majority'; // Ganti dengan URL MongoDB Anda
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
const authRoutes = require('./src/routes/authRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const viewsRoutes = require('./src/routes/viewsRoutes');

// Gunakan rute
app.use('/payment', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/views', viewsRoutes);
app.use('/', authRoutes);

// Tangani kesalahan jika rute tidak ditemukan
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(3002,() => {
    console.log(`Server running in port 3002`)
})
