import { Request, Response } from "express";
import * as MapService from "../services/map/map.service.js";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const createMap = async (
  req: Request,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const mapData = req.body;
    const map = await MapService.createMap(mapData);

    res.status(201).json({
      success: true,
      data: { map },
      message: "Map created successfully"
    });
  } catch (error: any) {
    console.error("Create map error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

export const updateMap = async (
  req: Request,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const map = await MapService.updateMap(id, updateData);

    res.json({
      success: true,
      data: { map },
      message: "Map updated successfully"
    });
  } catch (error: any) {
    console.error("Update map error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

export const deleteMap = async (
  req: Request,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { id } = req.params;
    
    await MapService.deleteMap(id);

    res.json({
      success: true,
      message: "Map deleted successfully"
    });
  } catch (error: any) {
    console.error("Delete map error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

export const getMaps = async (
  req: Request,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const maps = await MapService.getMaps();

    res.json({
      success: true,
      data: { maps }
    });
  } catch (error: any) {
    console.error("Get maps error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};