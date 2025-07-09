import { Request, Response } from "express";
import * as UserService from "../services/user/user.service.js";

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
}

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

    const users = await UserService.getAllUsers(req.user.id);

    res.json({
      success: true,
      data: { users }
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

    const userId = req.params.id || req.user.id;
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

    const userId = req.params.id;
    if (!userId) {
      res.status(400).json({
        success: false,
        error: "User ID is required"
      });
      return;
    }

    await UserService.deleteUser(userId, req.user.id);

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