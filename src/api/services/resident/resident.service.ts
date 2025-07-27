import { Resident } from "../../models/User.js";
import { IResident, CreateResidentData, UpdateResidentData, PaginatedResidentResult } from "../../models/interfaces/resident.interface.js";
import { APIError } from "../../utils/apiError.js";



export const createResident = async (residentData: CreateResidentData): Promise<IResident> => {
    try {
        // Check if resident with same username, phone number, device ID, or house number already exists
        const existingResident = await Resident.findOne({
            $or: [
                { username: residentData.username },
                { phoneNumber: residentData.phoneNumber },
                { deviceID: residentData.deviceID },
                { houseNumber: residentData.houseNumber }
            ]
        });

        if (existingResident) {
            throw new APIError("Resident with this username, phone number, device ID, or house number already exists", 400);
        }

        const resident = new Resident(residentData);
        await resident.save();

        return resident;
    } catch (error: any) {
        if (error instanceof APIError) throw error;
        throw new APIError("Failed to create resident", 500);
    }
};

export const getResidentById = async (id: string): Promise<IResident> => {
    try {
        const resident = await Resident.findById(id);

        if (!resident) {
            throw new APIError("Resident not found", 404);
        }

        return resident;
    } catch (error: any) {
        if (error instanceof APIError) throw error;
        throw new APIError("Failed to get resident", 500);
    }
};

export const getAllResidentsPaginated = async (page: number = 1, limit: number = 20): Promise<PaginatedResidentResult> => {
    try {
        const skip = (page - 1) * limit;

        const [residents, total] = await Promise.all([
            Resident.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Resident.countDocuments()
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            residents,
            page,
            limit,
            total,
            totalPages
        };
    } catch (error: any) {
        throw new APIError("Failed to get residents", 500);
    }
};

export const updateResident = async (id: string, updateData: UpdateResidentData): Promise<IResident> => {
    try {
        const resident = await Resident.findById(id);

        if (!resident) {
            throw new APIError("Resident not found", 404);
        }

        // Check if username, phone number, device ID, or house number is being updated and if it conflicts
        if (updateData.username || updateData.phoneNumber || updateData.deviceID || updateData.houseNumber) {
            const query: any = { _id: { $ne: id } };

            if (updateData.username) query.username = updateData.username;
            if (updateData.phoneNumber) query.phoneNumber = updateData.phoneNumber;
            if (updateData.deviceID) query.deviceID = updateData.deviceID;
            if (updateData.houseNumber) query.houseNumber = updateData.houseNumber;

            const existingResident = await Resident.findOne(query);

            if (existingResident) {
                throw new APIError("Resident with this username, phone number, device ID, or house number already exists", 400);
            }
        }

        // Hash password if it's being updated
        if (updateData.password) {
            const bcrypt = await import('bcryptjs');
            updateData.password = bcrypt.hashSync(updateData.password, 10);
        }

        const updatedResident = await Resident.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedResident) {
            throw new APIError("Resident not found", 404);
        }

        return updatedResident;
    } catch (error: any) {
        if (error instanceof APIError) throw error;
        throw new APIError("Failed to update resident", 500);
    }
};

export const deleteResident = async (id: string): Promise<void> => {
    try {
        const resident = await Resident.findByIdAndDelete(id);

        if (!resident) {
            throw new APIError("Resident not found", 404);
        }
    } catch (error: any) {
        if (error instanceof APIError) throw error;
        throw new APIError("Failed to delete resident", 500);
    }
}; 