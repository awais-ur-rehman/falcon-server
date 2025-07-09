import mongoose from "mongoose";
import { IRole } from "./interfaces/role.interface.js";
import { roleSchema } from "./schemas/role.schema.js";

export const Role = mongoose.model<IRole>("Role", roleSchema);