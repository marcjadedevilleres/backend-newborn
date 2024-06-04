const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // For password hashing

const app = express();
const port = 3000;

// Database Connection
mongoose
  .connect('mongodb+srv://maryjoyquibedo44:3OITKHLOrXzRzl9I@newborn.3vj16ut.mongodb.net/?authSource=Newborn&authMechanism=SCRAM-SHA-1', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// User Model (Schema)
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  middleName: { type: String },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  medicalProfession: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// Signup Route
app.post('/api/signup', async (req, res) => {
  const {
    firstName,
    lastName,
    middleName,
    age,
    gender,
    address,
    medicalProfession,
    username,
    password,
  } = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      middleName,
      age,
      gender,
      address,
      medicalProfession,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate a JWT token (if needed for authentication)
    // ...

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    onsole.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Start Server
app.listen(port, () => console.log(`Server listening on port ${port}`));