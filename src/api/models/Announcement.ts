import mongoose from "mongoose";
import { IAnnouncement } from "./interfaces/announcement.interface";
import { announcementSchema } from "./schemas/announcement.schema";

export const Announcement = mongoose.model<IAnnouncement>("Announcement", announcementSchema);