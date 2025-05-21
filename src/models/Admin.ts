import { Schema, model, models, Model } from 'mongoose';
import { Admin } from '@/types';
import bcrypt from 'bcryptjs';

const AdminSchema = new Schema({
  username: { 
    type: String, 
    required: true,
    unique: true
  },
  password: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['admin', 'superadmin'],
    default: 'admin'
  },
}, { 
  timestamps: true 
});

// Hash password before saving
AdminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password
AdminSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const AdminModel = models.Admin || model<Admin & Document>('Admin', AdminSchema);

export default AdminModel as Model<Admin & Document>;