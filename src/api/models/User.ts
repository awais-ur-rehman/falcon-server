import mongoose from "mongoose";
import { IUser } from "./interfaces/user.interface.js";
import { userSchema } from "./schemas/user.schema.js";

export const User = mongoose.model<IUser>("User", userSchema);