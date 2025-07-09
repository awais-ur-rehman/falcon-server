import { Request, Response, NextFunction } from "express";
import { APIError } from "../utils/apiError.js";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Global error handler:", error);

  if (error.code === "LIMIT_FILE_SIZE") {
    res.status(400).json({
      success: false,
      error: "File too large. Maximum size is 50MB.",
    });
    return;
  }

  if (error.message && error.message.includes("Invalid file type")) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
    return;
  }

  if (error.message && error.message.includes("file format not allowed")) {
    res.status(400).json({
      success: false,
      error: "File format not supported. Please upload ZIP, PDF, DOC, DOCX, or image files only.",
    });
    return;
  }

  if (error instanceof APIError) {
    res.status(error.statusCode).json({
      success: false,
      error: error.message,
      errorCode: error.errorCode,
    });
    return;
  }

  if (error.http_code) {
    res.status(error.http_code).json({
      success: false,
      error: error.message || "Upload failed",
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: "Something went wrong!",
    details: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
};