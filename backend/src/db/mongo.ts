import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isConnected = false;

export const connectMongo = async () => {
  if (isConnected) {
    console.log('=> MongoDB is already connected');
    return;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('=> WARNING: MONGODB_URI is not defined. Database will not connect.');
    return;
  }

  try {
    const db = await mongoose.connect(uri);
    isConnected = db.connections[0].readyState === 1;
    console.log(`=> Connected to MongoDB Cluster: ${db.connection.host}`);
  } catch (error) {
    console.error('=> Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};

export const getMongoStats = async () => {
  if (!isConnected) return { connected: false };
  
  return {
    connected: true,
    host: mongoose.connection.host,
    name: mongoose.connection.name,
    models: Object.keys(mongoose.models)
  };
};

export const disconnectMongo = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('=> Disconnected from MongoDB');
  }
};
