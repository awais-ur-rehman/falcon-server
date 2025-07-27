import mongoose from "mongoose";
import { IMap } from "./interfaces/map.interface";
import { mapSchema } from "./schemas/map.schema";

export const Map = mongoose.model<IMap>("Map", mapSchema);