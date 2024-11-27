const mongoose = require('mongoose');

// Replace `<database_name>` with your actual database name
const uri = "mongodb+srv://akarshanghosh28:7UkufoU1nnadac9s@cluster0.1kxw1.mongodb.net/Data?retryWrites=true&w=majority";

const connectToMongo = async () => {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
    });
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    throw err;
  }
};

module.exports = connectToMongo;
