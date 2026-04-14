require("dotenv").config();
const app = require("./src/app");
const ConnectedToDB = require("./src/db/db");

// Connect to database
ConnectedToDB();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Base URL: http://localhost:${PORT}`);
  console.log(`🔗 Test endpoint: http://localhost:${PORT}/api/test\n`);
});

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
});