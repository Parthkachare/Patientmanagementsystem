const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Make sure this path is correct
require('dotenv').config();

async function createUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ 
      $or: [{ username: 'superadmin' }, { email: 'superadmin@example.com' }]
    });
    if (existing) {
      console.log('⚠️ User with this username or email already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash('newpass123', 10);

    const user = new User({
      username: 'superadmin',
      fullName: 'Super Admin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      role: 'admin',
    });

    await user.save();
    console.log('✅ New admin user created with username "superadmin" and password "newpass123"');
  } catch (err) {
    console.error('❌ Error creating user:', err.message);
  } finally {
    mongoose.disconnect();
  }
}

createUser();
