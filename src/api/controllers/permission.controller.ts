import { Request, Response } from "express";
import { Employee } from "../models/User.js";
import { Role } from "../models/Role.js";
import { Module } from "../models/Module.js";
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

        const user = await Employee.findById(req.user.id);
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

        const userId = req.params.id === 'current' ? req.user.id : req.params.id;

        // Users can only check their own permissions, or admin can check any user's permissions
        if (req.user.role !== "admin" && req.user.role !== "employee" && req.user.id !== userId) {
            res.status(403).json({
                success: false,
                error: "Access denied"
            });
            return;
        }

        const user = await Employee.findById(userId).populate('role', 'name modulePermissions');
        if (!user) {
            res.status(404).json({
                success: false,
                error: "User not found"
            });
            return;
        }

        // Check if user has admin role
        let isAdmin = false;
        if (user.role) {
            if (typeof user.role === 'string') {
                isAdmin = user.role === 'admin';
            } else if (user.role.name) {
                isAdmin = user.role.name === 'Admin';
            }
        }

        console.log('User role check:', {
            userId: user._id,
            jwtRole: req.user.role,
            dbRole: user.role,
            roleType: typeof user.role,
            roleName: typeof user.role === 'object' ? user.role.name : 'N/A',
            isAdmin
        });

        // Admin has all permissions
        if (isAdmin) {
            // Get all modules for admin
            const allModules = await Module.find({ isActive: true });
            const allPermissions = allModules.map(module => ({
                moduleId: module._id,
                moduleName: module.name,
                permissions: {
                    read: true,
                    create: true,
                    update: true,
                    delete: true
                }
            }));

            res.json({
                success: true,
                data: {
                    userId: user._id,
                    role: typeof user.role === 'string' ? user.role : user.role.name,
                    permissions: allPermissions
                }
            });
            return;
        }

        // Get role permissions
        if (!user.role || typeof user.role === 'string') {
            res.json({
                success: true,
                data: {
                    userId: user._id,
                    role: 'Unknown',
                    permissions: []
                }
            });
            return;
        }

        // Convert role permissions to the expected format
        const permissions = user.role.modulePermissions.map((mp: any) => ({
            moduleId: mp.module._id,
            moduleName: mp.module.name || mp.module._id,
            permissions: {
                read: mp.permissions.find((p: any) => p.name === 'read')?.value || false,
                create: mp.permissions.find((p: any) => p.name === 'create')?.value || false,
                update: mp.permissions.find((p: any) => p.name === 'update')?.value || false,
                delete: mp.permissions.find((p: any) => p.name === 'delete')?.value || false
            }
        }));

        res.json({
            success: true,
            data: {
                userId: user._id,
                role: user.role.name,
                permissions
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