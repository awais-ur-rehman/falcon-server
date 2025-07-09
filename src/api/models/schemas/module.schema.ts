import mongoose, { Schema } from "mongoose";

export const moduleSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

moduleSchema.index({ isActive: 1 });