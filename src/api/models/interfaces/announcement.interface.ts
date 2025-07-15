import { Document } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  images: string[];
  createdBy: string;
  role: "admin" | "moderator";
  isActive: boolean;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}