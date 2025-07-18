import mongoose from "mongoose";
import { IResident, IUser } from "./interfaces/user.interface.js";
import { ResidentSchema, userSchema } from "./schemas/user.schema.js";

export const User = mongoose.model<IUser>("User", userSchema);
export const Resident = mongoose.model<IResident>("Resident", ResidentSchema);