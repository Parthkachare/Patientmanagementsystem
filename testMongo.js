const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/healthcare'; // Your MongoDB URI

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
});

const User = mongoose.model('User', userSchema);

async function testConnection() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB!');

    const users = await User.find();
    console.log('Users in DB:', users);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

testConnection();
