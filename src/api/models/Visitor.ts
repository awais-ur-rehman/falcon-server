import mongoose from "mongoose";
import { IVisitor } from "./interfaces/visitor.interface";
import { visitorSchema } from "./schemas/visitor.schema";

export const Visitor = mongoose.model<IVisitor>("Visitor", visitorSchema);