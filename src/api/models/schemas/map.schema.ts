import mongoose, { Schema } from "mongoose";

export const mapSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        lat: {
            type: Number,
            required: true,
            trim: true,
        },
        long: {
            type: Number,
            required: true,
            trim: true,
        },
        tag: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
)