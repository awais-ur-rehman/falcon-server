import { Document } from "mongoose";
import { IUser } from "../index";

export interface IVisitor extends Document {
  id: IUser['_id'];
  visitorName: string;
  visitorType: "Guest" | "Delivery" | "Cab Driver" | "Service Provider";
  vehicleType: "Car" | "Bike" | "Pickup" | "Rickshaw";
  vehcileNumber: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}