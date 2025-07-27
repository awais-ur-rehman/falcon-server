import { Document } from "mongoose";

export interface IMap extends Document {
  name: string;
  lat: number;
  long: number;
  tag: string;
  createdAt: Date;
  updatedAt: Date;
}