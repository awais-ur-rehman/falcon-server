import { Request, Response } from "express";
import * as RoleService from "../services/role/role.service.js";

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

export const getRole = async (
  req: Request<{ roleId: string }>,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { roleId } = req.params;
    
    if (!roleId) {
      res.status(400).json({
        success: false,
        error: "Role ID is required"
      });
      return;
    }

    const role = await RoleService.getRoleById(roleId);

    res.json({
      success: true,
      data: role
    });
  } catch (error: any) {
    console.error("Get role error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

export const getAllRoles = async (
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

    const roles = await RoleService.getAllRoles();

    res.json({
      success: true,
      data: { roles }
    });
  } catch (error: any) {
    console.error("Get roles error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

export const createRole = async (
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

    const roleData = req.body;
    const role = await RoleService.createRole(roleData);

    res.status(201).json({
      success: true,
      data: role,
      message: "Role created successfully"
    });
  } catch (error: any) {
    console.error("Create role error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

export const updateRole = async (
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

    const { roleId } = req.params;
    const updateData = req.body;

    const role = await RoleService.updateRole(roleId, updateData);

    res.json({
      success: true,
      data: role,
      message: "Role updated successfully"
    });
  } catch (error: any) {
    console.error("Update role error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

export const deleteRole = async (
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

    const { roleId } = req.params;
    await RoleService.deleteRole(roleId);

    res.json({
      success: true,
      message: "Role deleted successfully"
    });
  } catch (error: any) {
    console.error("Delete role error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};