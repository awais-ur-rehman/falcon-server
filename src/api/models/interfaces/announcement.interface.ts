import { Document } from "mongoose";
import { IUser } from "../index";

export interface IAnnouncement extends Document {
  id: IUser['_id'];
  title: string;
  content: string;
  images: string[];
  isActive: boolean;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}