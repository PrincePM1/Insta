const bcrypt = require("bcrypt");
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Serve static files (HTML + CSS)
app.use(express.static(__dirname));

// Demo users file
const USERS_FILE = "users.json";

// --------- SIGNUP ROUTE ---------
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));

  // Check if user exists
  if (users.find(u => u.username === username)) {
    return res.json({ message: "User already exists ❌" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user
  users.push({ username, password: hashedPassword });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({ message: "Signup successful ✅" });
});

// --------- LOGIN ROUTE ---------
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.json({ message: "Invalid credentials ❌" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (match) {
    res.json({ message: "Login successful ✅" });
  } else {
    res.json({ message: "Invalid credentials ❌" });
  }
});

// --------- RANDOM USER CREATION ---------
function randomString(length) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

app.get("/create-random-user", async (req, res) => {
  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));

  const username = "user_" + randomString(6);
  const password = randomString(8); // plain password (shown once)
  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({ username, password: hashedPassword });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({
    message: "Random user created ✅",
    username,
    password // show ONLY for demo/testing
  });
});

// --------- START SERVER ---------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
