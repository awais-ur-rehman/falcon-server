import mongoose, { Schema } from "mongoose";

export const roleSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    modulePermissions: [
      {
        module: { _id: { type: String, required: true } },
        permissions: [
          {
            name: {
              type: String,
              enum: ["read", "create", "update", "delete"],
              required: true,
            },
            value: { type: Boolean, required: true },
          },
        ],
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

roleSchema.index({ isActive: 1 });
roleSchema.index({ "modulePermissions.module._id": 1 });