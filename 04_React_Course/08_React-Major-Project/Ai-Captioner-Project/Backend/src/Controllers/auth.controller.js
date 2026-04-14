const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerController(req, res) {
  try {
    const { fullName, email, password } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields (full name, email, and password) are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long"
      });
    }

    // Check if user already exists
    const isUserAlreadyExists = await userModel.findOne({ email });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "This email is already registered"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword
    });

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h"
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        fullName: user.fullName,
        email: user.email,
        id: user._id
      }
    });

  } catch (error) {
    console.error("Register error:", error);
    
    // Check for MongoDB Duplicate Key Error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `This ${field} is already registered. Please use another one.`
      });
    }

    return res.status(500).json({
      message: "Error registering user",
      error: error.message
    });
  }
}

async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Find user
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h"
    });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        fullName: user.fullName,
        email: user.email,
        id: user._id
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Error logging in",
      error: error.message
    });
  }
}

async function logoutController(req, res) {
  try {
    res.clearCookie("token");
    res.status(200).json({
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Error logging out",
      error: error.message
    });
  }
}

module.exports = {
  registerController,
  loginController,
  logoutController
};