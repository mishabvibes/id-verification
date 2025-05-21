// This script can be used to seed the database with initial admin users
import mongoose from 'mongoose';
import AdminModel from '../src/models/Admin';
import { dbConnect } from '../src/lib/db';

async function seedAdmins() {
  try {
    await dbConnect();
    
    // Check if admin already exists
    const existingAdmin = await AdminModel.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists, skipping...');
      return;
    }
    
    // Create admin user
    const admin = new AdminModel({
      username: 'admin',
      password: 'admin123', // This will be hashed automatically in the model
      name: 'Admin User',
      role: 'admin',
    });
    
    await admin.save();
    
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmins()
  .then(() => console.log('Database seeding completed'))
  .catch((error) => console.error('Database seeding failed:', error));