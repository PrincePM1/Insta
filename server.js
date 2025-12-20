// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

// File to store users
const USERS_FILE = "users.json";

// Middleware to parse JSON
app.use(express.json());

// Serve static files (HTML + CSS)
app.use(express.static(__dirname));

// Serve index.html for root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Helper function to generate random strings
function randomString(length) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ----------------- SIGNUP -----------------
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  // Read existing users
  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  }

  // Check if username exists
  if (users.find(u => u.username === username)) {
    return res.json({ message: "User already exists ❌" });
  }

  // Save new user (plain password for testing)
  users.push({ username, password });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  // Respond with username & password
  res.json({
    message: "Signup successful ✅",
    username,
    password
  });
});

// ----------------- LOGIN -----------------
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!fs.existsSync(USERS_FILE)) {
    return res.json({ message: "Invalid credentials ❌" });
  }

  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.json({ message: "Login successful ✅" });
  } else {
    res.json({ message: "Invalid credentials ❌" });
  }
});

// ----------------- CREATE RANDOM USER -----------------
app.get("/create-random-user", (req, res) => {
  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  }

  const username = "user_" + randomString(6);
  const password = randomString(8); // plain password

  users.push({ username, password });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({
    message: "Random user created ✅",
    username,
    password
  });
});

// ----------------- START SERVER -----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
