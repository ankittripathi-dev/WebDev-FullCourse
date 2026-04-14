const express = require("express");
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");
const path = require("path");

const app = express();

// Trust proxy for Render/proxies to handle https correctly in OAuth/Sessions
app.set('trust proxy', 1);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Static Files (Frontend Build)
app.use(express.static(path.join(__dirname, "../public")));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working! ✅' });
});

app.use(session({
  secret: process.env.JWT_SECRET || 'snapscript_secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// SPA Catch-all: Route everything else to the frontend index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

module.exports = app;
