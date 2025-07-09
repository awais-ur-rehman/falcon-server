import { Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "user" | "moderator";
  isFirstLogin: boolean;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  onboardingCompleted: boolean;
  onboardingCompletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}