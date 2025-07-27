import { Document } from "mongoose";

// Legacy interface for backward compatibility
// This maintains compatibility with existing code that might still reference IUser
export interface IUser extends Document {
  username: string;
  phoneNumber: string;
  cnic?: string;
  password?: string;
  role?: string;
  isFirstLogin: boolean;
  isActive: boolean;
  avatar?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Note: For new development, use the specific interfaces:
// - IEmployee from './employee.interface.js' for admin portal users
// - IResident from './resident.interface.js' for mobile app users