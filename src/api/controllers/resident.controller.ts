import { Request, Response } from "express";
import * as ResidentService from "../services/resident/resident.service.js";
import bcrypt from "bcryptjs";

interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export const createResident = async (
    req: AuthRequest,
    res: Response<ApiResponse>
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: "Authentication required"
            });
            return;
        }

        const { username, phoneNumber, cnic, password, deviceID, houseNumber } = req.body;

        if (!username || !phoneNumber || !password || !deviceID || !houseNumber) {
            res.status(400).json({
                success: false,
                error: "Username, phone number, password, device ID, and house number are required"
            });
            return;
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const residentData = {
            username,
            phoneNumber,
            cnic,
            password: hashedPassword,
            deviceID,
            houseNumber,
            isFirstLogin: false
        };

        const resident = await ResidentService.createResident(residentData);

        res.status(201).json({
            success: true,
            data: resident,
            message: "Resident created successfully"
        });
    } catch (error: any) {
        console.error("Create resident error:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Internal server error"
        });
    }
};

export const getResidentById = async (
    req: AuthRequest,
    res: Response<ApiResponse>
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: "Authentication required"
            });
            return;
        }

        const { id } = req.params;
        const resident = await ResidentService.getResidentById(id);

        res.json({
            success: true,
            data: resident
        });
    } catch (error: any) {
        console.error("Get resident by ID error:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Internal server error"
        });
    }
};

export const getAllResidents = async (
    req: AuthRequest,
    res: Response<ApiResponse>
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: "Authentication required"
            });
            return;
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const result = await ResidentService.getAllResidentsPaginated(page, limit);

        res.json({
            success: true,
            data: result.residents,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages
            }
        });
    } catch (error: any) {
        console.error("Get residents error:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Internal server error"
        });
    }
};

export const updateResident = async (
    req: AuthRequest,
    res: Response<ApiResponse>
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: "Authentication required"
            });
            return;
        }

        const residentId = req.params.id;
        const updateData = req.body;

        const resident = await ResidentService.updateResident(residentId, updateData);

        res.json({
            success: true,
            data: { resident },
            message: "Resident updated successfully"
        });
    } catch (error: any) {
        console.error("Update resident error:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Internal server error"
        });
    }
};

export const deleteResident = async (
    req: AuthRequest,
    res: Response<ApiResponse>
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: "Authentication required"
            });
            return;
        }

        const residentId = req.params.id;
        if (!residentId) {
            res.status(400).json({
                success: false,
                error: "Resident ID is required"
            });
            return;
        }

        await ResidentService.deleteResident(residentId);

        res.json({
            success: true,
            message: "Resident deleted successfully"
        });
    } catch (error: any) {
        console.error("Delete resident error:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Internal server error"
        });
    }
}; 