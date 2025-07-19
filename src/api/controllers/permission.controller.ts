import { Request, Response } from "express";
import { User } from "../models/User.js";
import { Role } from "../models/Role.js";
import { APIError } from "../utils/apiError.js";

interface AuthRequest extends Request {
    user?: {
        id: string;
        phoneNumber: string;
        role: string;
    };
}

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export const checkPermission = async (
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

        const { moduleId, action } = req.query;

        if (!moduleId || !action) {
            res.status(400).json({
                success: false,
                error: "Module ID and action are required"
            });
            return;
        }

        // Admin has all permissions by default
        if (req.user.role === "admin") {
            res.json({
                success: true,
                data: { hasPermission: true }
            });
            return;
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            res.status(404).json({
                success: false,
                error: "User not found"
            });
            return;
        }

        // Find role by the role string (not ObjectId)
        const role = await Role.findById(user.role);
        if (!role) {
            res.json({
                success: true,
                data: { hasPermission: false }
            });
            return;
        }

        const modulePermission = role.modulePermissions.find(
            (mp) => mp.module._id.toString() === moduleId
        );

        if (!modulePermission) {
            res.json({
                success: true,
                data: { hasPermission: false }
            });
            return;
        }

        const permission = modulePermission.permissions.find(
            (p) => p.name === action
        );

        const hasPermission = permission ? permission.value : false;

        res.json({
            success: true,
            data: { hasPermission }
        });
    } catch (error: any) {
        console.error("Check permission error:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

export const getUserPermissions = async (
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

        const userId = req.params.id;

        // Users can only check their own permissions, or admin can check any user's permissions
        if (req.user.role !== "admin" && req.user.id !== userId) {
            res.status(403).json({
                success: false,
                error: "Access denied"
            });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                error: "User not found"
            });
            return;
        }

        // Admin has all permissions
        if (user.role === "admin") {
            res.json({
                success: true,
                data: {
                    userId: user._id,
                    role: user.role,
                    permissions: "all" // Admin has all permissions
                }
            });
            return;
        }

        // Find role by the role string (not ObjectId)
        const role = await Role.findById(user.role);
        if (!role) {
            res.json({
                success: true,
                data: {
                    userId: user._id,
                    role: user.role,
                    permissions: []
                }
            });
            return;
        }

        res.json({
            success: true,
            data: {
                userId: user._id,
                role: user.role,
                permissions: role.modulePermissions
            }
        });
    } catch (error: any) {
        console.error("Get user permissions error:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
}; 