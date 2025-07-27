import mongoose from "mongoose";
import { IEmployee } from "./interfaces/employee.interface.js";
import { IResident } from "./interfaces/resident.interface.js";
import { employeeSchema, residentSchema } from "./schemas/user.schema.js";

// Check if model already exists to prevent overwriting
export const Employee = mongoose.models.Employee || mongoose.model<IEmployee>("Employee", employeeSchema);
export const Resident = mongoose.models.Resident || mongoose.model<IResident>("Resident", residentSchema);

// Legacy export for backward compatibility
export const User = Employee;