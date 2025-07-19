import { Request, Response } from "express";
import * as VisitorService from "../services/visitor/visitor.service.js";

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

export const createVisitor = async (
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

    const visitorData = req.body;
    const visitor = await VisitorService.createVisitor(visitorData, req.user.id);

    res.status(201).json({
      success: true,
      data: { visitor },
      message: "Visitor created successfully"
    });
  } catch (error: any) {
    console.error("Create visitor error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

export const getVisitors = async (
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

    const result = await VisitorService.getVisitors(req.query, req.user.id);

    res.json({
      success: true,
      data: {
        visitors: result.visitors,
        pagination: result.pagination
      }
    });
  } catch (error: any) {
    console.error("Get visitors error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};