const mongoose = require('mongoose');
const User = require('./models/User');  // Make sure this path is correct
require('dotenv').config();

async function checkUser() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ username: 'admin' });
  console.log(user);
  await mongoose.disconnect();
}

checkUser();
