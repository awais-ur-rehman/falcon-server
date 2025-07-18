import { Request, Response } from "express";
import * as AuthService from "../services/auth/auth.service.js";

interface CheckPhoneBody {
  phoneNumber: string;
}

interface CompleteSetupBody {
  phoneNumber: string;
  cnic: string;
  password: string;
}

interface LoginBody {
  phoneNumber: string;
  password: string;
}

interface SignupBody {
  username: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const checkPhone = async (
  req: Request<{}, ApiResponse, CheckPhoneBody>,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      res.status(400).json({
        success: false,
        error: "Phone number is required"
      });
      return;
    }

    const result = await AuthService.checkPhoneExists(phoneNumber);
    
    if (!result.exists) {
      res.status(404).json({
        success: false,
        error: "Phone number not found. Please contact administrator."
      });
      return;
    }

    res.json({
      success: true,
      data: {
        isFirstLogin: result.isFirstLogin
      },
      message: result.isFirstLogin ? "Please complete your setup" : "Please enter your password",
    });
  } catch (error) {
    console.error("Check phone error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};

export const completeSetup = async (
  req: Request<{}, ApiResponse, CompleteSetupBody>,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { phoneNumber, cnic, password } = req.body;
    
    if (!phoneNumber || !cnic || !password) {
      res.status(400).json({
        success: false,
        error: "Phone number, CNIC and password are required"
      });
      return;
    }

    const result = await AuthService.completeUserSetup({ phoneNumber, cnic, password });

    res.json({
      success: true,
      data: {
        token: result.token,
        user: result.user,
        residentUser: result.residentUser
      },
      message: "Setup completed successfully",
    });
  } catch (error: any) {
    console.error("Complete setup error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

export const login = async (
  req: Request<{}, ApiResponse, LoginBody>,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { phoneNumber, password } = req.body;
    
    if (!phoneNumber || !password) {
      res.status(400).json({
        success: false,
        error: "Phone number and password are required"
      });
      return;
    }

    const result = await AuthService.loginUser({ phoneNumber, password });

    res.json({
      success: true,
      data: {
        token: result.token,
        user: result.user,
        residentUser: result.residentUser
      },
      message: "Login successful",
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

export const signup = async (
  req: Request<{}, ApiResponse, SignupBody>,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const signupData = req.body;

    const result = await AuthService.signupUser(signupData);

    res.status(201).json({
      success: true,
      data: {
        token: result.token,
        user: result.user
      },
      message: "User created successfully",
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(409).json({
        success: false,
        error: `${field} already exists`
      });
      return;
    }
    
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Internal server error"
    });
  }
};

export const logout = (
  req: Request,
  res: Response<ApiResponse>
): void => {
  try {
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};