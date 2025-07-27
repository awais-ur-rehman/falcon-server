import mongoose, { Schema } from "mongoose";

// Employee Schema - for admin portal users
export const employeeSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    cnic: {
      type: String,
      required: false,
      default: null,
    },
    password: {
      type: String,
      required: false,
      default: null,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    isFirstLogin: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Resident Schema - for mobile app users
export const residentSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    cnic: {
      type: String,
      required: false,
      default: null,
    },
    password: {
      type: String,
      required: false,
      default: null,
    },
    deviceID: {
      type: String,
      required: false,
      default: null,
    },
    houseNumber: {
      type: String,
      required: true,
    },
    isFirstLogin: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for Employee
employeeSchema.index({ username: 1 });
employeeSchema.index({ email: 1 });
employeeSchema.index({ phoneNumber: 1 });
employeeSchema.index({ role: 1 });
employeeSchema.index({ isActive: 1 });

// Indexes for Resident
residentSchema.index({ username: 1 });
residentSchema.index({ phoneNumber: 1 });
residentSchema.index({ deviceID: 1 });
residentSchema.index({ houseNumber: 1 });
residentSchema.index({ isActive: 1 });
