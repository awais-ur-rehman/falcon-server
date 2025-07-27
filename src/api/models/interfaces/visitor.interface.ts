import { Document } from "mongoose";
import { IResident } from "./resident.interface.js";

export interface IVisitor extends Document {
  residentId: IResident['_id'];
  visitorName: string;
  visitorType: "Guest" | "Delivery" | "Cab Driver" | "Service Provider";
  vehicleType: "Car" | "Bike" | "Pickup" | "Rickshaw";
  vehcileNumber: string;
  date: Date;
  entryCode: string;
  createdAt: Date;
  updatedAt: Date;
}