import mongoose from "mongoose";
import { IModule } from "./interfaces/module.interface.js";
import { moduleSchema } from "./schemas/module.schema.js";

export const Module = mongoose.model<IModule>("Module", moduleSchema);