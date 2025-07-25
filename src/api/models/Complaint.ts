import mongoose from "mongoose";
import { IComplaint } from "./interfaces/complaint.interface";
import { complaintSchema } from "./schemas/complaint.schema";

export const Complaint = mongoose.model<IComplaint>("Complaint", complaintSchema);