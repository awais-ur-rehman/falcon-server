import mongoose from "mongoose";
import { IAnnouncement } from "./interfaces/announcement.interface";
import { announcementSchema } from "./schemas/announcement.schema";

export const User = mongoose.model<IAnnouncement>("User", announcementSchema);