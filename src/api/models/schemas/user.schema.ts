import mongoose, { Schema } from "mongoose";

export const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
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
      required: false, // Will be set during first login
      default: null,
    },
    password: {
      type: String,
      required: false, // Will be set during first login
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "user", "moderator"],
      default: "user",
    },
    isFirstLogin: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    onboardingCompletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ phoneNumber: 1 });
userSchema.index({ role: 1 });