import { Request, Response } from "express";
import * as EmployeeService from "../services/employee/employee.service.js";
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

export const createEmployee = async (
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

        const { username, email, phoneNumber, cnic, password, role } = req.body;

        if (!username || !email || !phoneNumber || !password || !role) {
            res.status(400).json({
                success: false,
                error: "Username, email, phone number, password, and role are required"
            });
            return;
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const employeeData = {
            username,
            email,
            phoneNumber,
            cnic,
            password: hashedPassword,
            role,
            isFirstLogin: false
        };

        const employee = await EmployeeService.createEmployee(employeeData);

        res.status(201).json({
            success: true,
            data: employee,
            message: "Employee created successfully"
        });
    } catch (error: any) {
        console.error("Create employee error:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Internal server error"
        });
    }
};

export const getEmployeeById = async (
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
        const employee = await EmployeeService.getEmployeeById(id);

        res.json({
            success: true,
            data: employee
        });
    } catch (error: any) {
        console.error("Get employee by ID error:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Internal server error"
        });
    }
};

export const getAllEmployees = async (
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

        const result = await EmployeeService.getAllEmployeesPaginated(page, limit);

        res.json({
            success: true,
            data: result.employees,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages
            }
        });
    } catch (error: any) {
        console.error("Get employees error:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Internal server error"
        });
    }
};

export const updateEmployee = async (
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

        const employeeId = req.params.id;
        const updateData = req.body;

        const employee = await EmployeeService.updateEmployee(employeeId, updateData);

        res.json({
            success: true,
            data: { employee },
            message: "Employee updated successfully"
        });
    } catch (error: any) {
        console.error("Update employee error:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Internal server error"
        });
    }
};

export const updateEmployeeRole = async (
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

        const employeeId = req.params.id;
        const { role } = req.body;

        if (!role) {
            res.status(400).json({
                success: false,
                error: "Role ID is required"
            });
            return;
        }

        const employee = await EmployeeService.updateEmployeeRole(employeeId, role);

        res.json({
            success: true,
            data: { employee },
            message: "Employee role updated successfully"
        });
    } catch (error: any) {
        console.error("Update employee role error:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Internal server error"
        });
    }
};

export const deleteEmployee = async (
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

        const employeeId = req.params.id;
        if (!employeeId) {
            res.status(400).json({
                success: false,
                error: "Employee ID is required"
            });
            return;
        }

        await EmployeeService.deleteEmployee(employeeId);

        res.json({
            success: true,
            message: "Employee deleted successfully"
        });
    } catch (error: any) {
        console.error("Delete employee error:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Internal server error"
        });
    }
}; 