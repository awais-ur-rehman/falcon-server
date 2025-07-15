import mongoose, { Schema } from "mongoose";

export const announcementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        images: {
            type: [String],
            default: [],
        },
        createdBy: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ["admin", "moderator"],
            required: true,
            default: "admin",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        date: {
            type: Date,
            required: true,
        }
    },
    {
        timestamps: true, 
    }
)