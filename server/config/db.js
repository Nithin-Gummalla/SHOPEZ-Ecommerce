const mongoose = require('mongoose');

let mongoServer;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopez';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected (Standard): ${conn.connection.host}`);
  } catch (error) {
    console.log(`Standard MongoDB connection to ${uri} failed. Initializing MongoMemoryServer...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create({
        binary: {
          version: '4.4.18'
        }
      });
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected (MemoryServer v4.4): ${conn.connection.host}`);
    } catch (memError) {
      console.error(`MongoDB Memory Server Error: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
