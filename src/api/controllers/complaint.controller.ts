import { Request, Response } from "express";
import * as ComplaintService from "../services/complaints/complaints.service.js";

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

export const createComplaint = async (
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

    const complaintData = req.body;
    const complaint = await ComplaintService.createComplaint(complaintData, req.user.id);

    res.status(201).json({
      success: true,
      data: { complaint },
      message: "Complaint created successfully"
    });
  } catch (error: any) {
    console.error("Create complaint error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

export const updateComplaint = async (
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
    const updateData = req.body;
    
    const complaint = await ComplaintService.updateComplaint(id, updateData, req.user.id);

    res.json({
      success: true,
      data: { complaint },
      message: "Complaint updated successfully"
    });
  } catch (error: any) {
    console.error("Update complaint error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

export const deleteComplaint = async (
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
    
    await ComplaintService.deleteComplaint(id, req.user.id);

    res.json({
      success: true,
      message: "Complaint deleted successfully"
    });
  } catch (error: any) {
    console.error("Delete complaint error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

export const updateComplaintStatus = async (
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
    const { status } = req.body;
    
    if (!status) {
      res.status(400).json({
        success: false,
        error: "Status is required"
      });
      return;
    }

    const complaint = await ComplaintService.updateComplaintStatus(id, status, req.user.id);

    res.json({
      success: true,
      data: { complaint },
      message: "Complaint status updated successfully"
    });
  } catch (error: any) {
    console.error("Update complaint status error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

export const getComplaints = async (
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

    const result = await ComplaintService.getComplaints(req.query, req.user.id);

    res.json({
      success: true,
      data: {
        complaints: result.complaints,
        pagination: result.pagination
      }
    });
  } catch (error: any) {
    console.error("Get complaints error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};