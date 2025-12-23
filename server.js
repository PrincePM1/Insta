const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const User = require("./User");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/instaDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


// ================= SIGNUP =================
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ message: "Username already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user
    const user = new User({
      username,
      password: hashedPassword
    });

    await user.save();
    res.json({ message: "Signup successful" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= LOGIN =================
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      "SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
