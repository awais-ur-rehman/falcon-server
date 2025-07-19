import mongoose, { Schema } from "mongoose";

export const ResidentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deviceID: {
      type: String,
      required: true,
    },
    houseNumber: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export const userSchema = new Schema(
  {
    username: {
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
      type: String,
      enum: ["admin", "user", "moderator"],
      default: "user",
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

userSchema.index({ username: 1 });
userSchema.index({ phoneNumber: 1 });
userSchema.index({ role: 1 });

ResidentSchema.index({ user: 1 });
ResidentSchema.index({ deviceID: 1 });
ResidentSchema.index({ houseNumber: 1 });
