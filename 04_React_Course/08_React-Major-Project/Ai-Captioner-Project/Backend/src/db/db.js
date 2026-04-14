const mongoose = require("mongoose")

function ConnectedToDB() {
  
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL;

  if (!mongoUri) {
    console.error("❌ Error: MONGODB_URI or MONGO_URL not found in .env file");
    return;
  }

  mongoose.connect(mongoUri)
    .then(() => {
      console.log("✅ MongoDB Connected Successfully");
      console.log("📊 Database: ai-captioner");
    })
    .catch((error) => {
      console.error("❌ MongoDB Connection Error:", error.message);
      console.log("💡 Make sure:");
      console.log("   - MongoDB Atlas cluster is active");
      console.log("   - MONGODB_URI is correct in .env file");
      console.log("   - Your IP is whitelisted in MongoDB Atlas");
    });
}

module.exports = ConnectedToDB;