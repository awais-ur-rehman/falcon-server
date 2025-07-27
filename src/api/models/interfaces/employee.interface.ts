import { Document } from "mongoose";

// Employee Interface - for admin portal users
export interface IEmployee extends Document {
    username: string;
    email: string;
    phoneNumber: string;
    cnic?: string;
    password?: string;
    role: string; // String reference to Role (since roles use string IDs)
    isFirstLogin: boolean;
    isActive: boolean;
    avatar?: string;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Employee creation data interface
export interface CreateEmployeeData {
    username: string;
    email: string;
    phoneNumber: string;
    cnic?: string;
    password?: string;
    role: string; // String reference to Role
    isFirstLogin?: boolean;
}

// Employee update data interface
export interface UpdateEmployeeData {
    username?: string;
    email?: string;
    phoneNumber?: string;
    cnic?: string;
    password?: string;
    role?: string; // String reference to Role
    isActive?: boolean;
    avatar?: string;
}

// Employee filters interface
export interface EmployeeFilters {
    username?: string;
    email?: string;
    phoneNumber?: string;
    role?: string;
    isActive?: boolean;
}

// Employee with populated role interface
export interface IEmployeeWithRole extends Omit<IEmployee, 'role'> {
    role: {
        _id: string;
        name: string;
        description?: string;
    };
}

// Paginated employee result interface
export interface PaginatedEmployeeResult {
    employees: IEmployeeWithRole[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
} 