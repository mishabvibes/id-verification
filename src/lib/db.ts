import mongoose from 'mongoose';
import clientPromise from './mongodb';

// Global is used here to maintain a cached connection across hot reloads
// in development. This prevents connection pool exhaustion.
let isConnected = false;

export async function dbConnect() {
    if (isConnected) {
      console.log("Already connected to MongoDB");
      return;
    }
  
    try {
      const dbClient = await clientPromise;
      const db = dbClient.db();
      
      // Set mongoose connection
      if (!isConnected) {
        await mongoose.connect(process.env.MONGODB_URI!);
        isConnected = true;
        console.log('✅ Connected to MongoDB via Mongoose');
      }
      
      return { dbClient, db };
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw new Error('Failed to connect to database');
    }
  }