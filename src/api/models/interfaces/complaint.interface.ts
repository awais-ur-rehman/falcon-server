import { Document } from "mongoose";
import { IUser } from "../index";

export interface IComplaint extends Document {
  id: IUser['_id'];
  title: string;
  description: string;
  images: string[];
  status: "Pending" | "In Progress" | "Resolved" | "Rejected";
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}