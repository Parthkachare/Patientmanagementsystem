const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/userModel");  // Adjust if your user model file is named differently

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

const createUser = async () => {
  await connectDB();

  const hashedPassword = await bcrypt.hash("password123", 10); // Your password here

  const user = new User({
    username: "admin",
    password: hashedPassword,
    role: "doctor"  // or admin, nurse, etc.
  });

  try {
    const savedUser = await user.save();
    console.log("User created:", savedUser);
  } catch (err) {
    console.error("Error creating user:", err.message);
  }
  mongoose.connection.close();
};

createUser();
