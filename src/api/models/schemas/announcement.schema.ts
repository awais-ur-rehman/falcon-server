import mongoose, { Schema } from "mongoose";

export const announcementSchema = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
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