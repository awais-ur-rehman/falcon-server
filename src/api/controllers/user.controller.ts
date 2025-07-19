import { Request, Response } from "express";
import * as UserService from "../services/user/user.service.js";
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

export const createUser = async (
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

    if (req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        error: "Access denied. Admin role required."
      });
      return;
    }

    const { username, phoneNumber, cnic, password, role, houseNumber } = req.body;

    if (!username || !phoneNumber || !password || !role || !houseNumber) {
      res.status(400).json({
        success: false,
        error: "Username, phone number, password, role, and house number are required"
      });
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const userData = {
      username,
      phoneNumber,
      cnic,
      password: hashedPassword,
      role,
      houseNumber,
      isFirstLogin: false
    };

    const user = await UserService.createUser(userData);

    res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully"
    });
  } catch (error: any) {
    console.error("Create user error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

export const getCurrentUser = async (
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

    const user = await UserService.getCurrentUser(req.user.id);

    res.json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    console.error("Get user error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

export const getAllUsers = async (
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

    if (req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        error: "Access denied. Admin role required."
      });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await UserService.getAllUsersPaginated(page, limit);

    res.json({
      success: true,
      data: result.users,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      }
    });
  } catch (error: any) {
    console.error("Get users error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

export const updateUser = async (
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

    if (req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        error: "Access denied. Admin role required."
      });
      return;
    }

    const userId = req.params.id;
    const updateData = req.body;

    const user = await UserService.updateUser(userId, updateData);

    res.json({
      success: true,
      data: { user },
      message: "User updated successfully"
    });
  } catch (error: any) {
    console.error("Update user error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

export const updateUserRole = async (
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

    if (req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        error: "Access denied. Admin role required."
      });
      return;
    }

    const userId = req.params.id;
    const { role } = req.body;

    if (!role || !["admin", "user", "moderator"].includes(role)) {
      res.status(400).json({
        success: false,
        error: "Valid role is required (admin, user, moderator)"
      });
      return;
    }

    const user = await UserService.updateUserRole(userId, role);

    res.json({
      success: true,
      data: { user },
      message: "User role updated successfully"
    });
  } catch (error: any) {
    console.error("Update user role error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

export const deleteUser = async (
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

    if (req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        error: "Access denied. Admin role required."
      });
      return;
    }

    const userId = req.params.id;
    if (!userId) {
      res.status(400).json({
        success: false,
        error: "User ID is required"
      });
      return;
    }

    await UserService.deleteUser(userId);

    res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error: any) {
    console.error("Delete user error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};