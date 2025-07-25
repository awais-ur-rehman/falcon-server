import mongoose, { Schema } from "mongoose";

export const complaintSchema = new mongoose.Schema(
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
        description: {
            type: String,
            required: true,
            trim: true,
        },
        images: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Resolved", "Rejected"],
            default: "Pending",
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