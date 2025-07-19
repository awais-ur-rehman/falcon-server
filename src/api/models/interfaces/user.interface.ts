import { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  phoneNumber: string;
  cnic: string;
  password: string;
  role: "admin" | "user" | "moderator";
  isFirstLogin: boolean;
  isActive: boolean;
  avatar?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  houseNumber: String;
}

export interface IResident extends Document {
  user: IUser['_id'];
  deviceID: string;
  createdAt: Date;
  updatedAt: Date;
}