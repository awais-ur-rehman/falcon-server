import { Document } from "mongoose";

// Resident Interface - for mobile app users
export interface IResident extends Document {
    username: string;
    phoneNumber: string;
    cnic?: string;
    password?: string;
    deviceID?: string;
    houseNumber: string;
    isFirstLogin: boolean;
    isActive: boolean;
    avatar?: string;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Resident creation data interface
export interface CreateResidentData {
    username: string;
    phoneNumber: string;
    cnic?: string;
    password: string; // Required for creation
    deviceID: string;
    houseNumber: string;
    isFirstLogin?: boolean;
}

// Resident update data interface
export interface UpdateResidentData {
    username?: string;
    phoneNumber?: string;
    cnic?: string;
    password?: string;
    deviceID?: string;
    houseNumber?: string;
    isActive?: boolean;
    avatar?: string;
}

// Resident filters interface
export interface ResidentFilters {
    username?: string;
    phoneNumber?: string;
    deviceID?: string;
    houseNumber?: string;
    isActive?: boolean;
}

// Resident summary interface (for lists)
export interface IResidentSummary {
    _id: string;
    username: string;
    phoneNumber: string;
    deviceID: string;
    houseNumber: string;
    isActive: boolean;
}

// Paginated resident result interface
export interface PaginatedResidentResult {
    residents: IResident[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// Resident by block interface
export interface ResidentByBlock {
    block: string;
    residents: IResidentSummary[];
    totalResidents: number;
}

// Resident device update interface
export interface ResidentDeviceUpdate {
    deviceID: string;
    lastUpdated: Date;
} 