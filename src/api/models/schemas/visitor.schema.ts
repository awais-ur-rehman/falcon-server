import mongoose, { Schema } from "mongoose";

export const visitorSchema = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        visitorName: {
            type: String,
            required: true,
            trim: true,
        },
        visitorType: {
            type: String,
            enum: ["Guest", "Delivery", "Cab Driver", "Service Provider"],
            default: "Guest",
        },
        vehicleType: {
            type: String,
            enum: ["Car", "Bike", "Pickup", "Rickshaw"],
            default: "Car",
        },
        vehcileNumber: {
            type: String,
            required: false,
        },
        date: {
            type: Date,
            required: true,
        },
        entryCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        }
    },
    {
        timestamps: true, 
    }
)