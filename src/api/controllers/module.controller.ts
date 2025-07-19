import { Request, Response } from "express";
import { Module } from "../models/Module.js";

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export const getAllModules = async (
    req: Request,
    res: Response<ApiResponse>
): Promise<void> => {
    try {
        const modules = await Module.find().sort({ name: 1 });

        res.json({
            success: true,
            data: modules
        });
    } catch (error: any) {
        console.error("Get modules error:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
}; 