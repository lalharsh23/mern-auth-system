const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password, role });
    await user.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "User" && decoded.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Invalid role." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// Middleware to authenticate admin
const authenticateAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// Dummy route for "User"
router.get("/user-dashboard", authenticateUser, (req, res) => {
  res.json({
    message: "Welcome to the User dashboard!",
    user: req.user,
  });
});

// Dummy route for "Admin"
router.get("/admin-dashboard", authenticateAdmin, (req, res) => {
  res.json({
    message: "Welcome to the Admin dashboard!",
    admin: req.user,
  });
});

module.exports = router;
