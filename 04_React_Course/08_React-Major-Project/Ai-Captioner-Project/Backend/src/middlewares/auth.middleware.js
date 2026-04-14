const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided. Please login first"
      });
    }

    // Verify token
    console.log("   --- [AUTH] Verifying Token...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("   --- [AUTH] Decoded ID:", decoded.id);

    // Find user
    const user = await userModel.findById(decoded.id);
    console.log("   --- [AUTH] User search result:", user ? "USER FOUND" : "USER NOT FOUND");

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized - User not found"
      });
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired - Please login again"
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token - Please login again"
      });
    }

    console.error("Auth middleware error:", error);
    return res.status(401).json({
      message: "Unauthorized - Invalid credentials"
    });
  }
}

module.exports = authMiddleware;