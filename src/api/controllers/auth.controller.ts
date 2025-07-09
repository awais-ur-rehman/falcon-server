import { Request, Response } from "express";
import * as AuthService from "../services/auth/auth.service.js";

interface CheckUserBody {
  email: string;
}

interface UpdatePasswordBody {
  email: string;
  newPassword: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface SignupBody {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const checkUser = async (
  req: Request<{}, ApiResponse, CheckUserBody>,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { email } = req.body;
    
    if (!email) {
      res.status(400).json({
        success: false,
        error: "Email is required"
      });
      return;
    }

    const result = await AuthService.checkUserExists(email);
    
    if (!result.exists) {
      res.status(404).json({
        success: false,
        error: "User not found"
      });
      return;
    }

    res.json({
      success: true,
      data: {
        isFirstLogin: result.isFirstLogin
      },
      message: result.isFirstLogin ? "Please set up your password" : "User found",
    });
  } catch (error) {
    console.error("Check user error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};

export const updatePassword = async (
  req: Request<{}, ApiResponse, UpdatePasswordBody>,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
      res.status(400).json({
        success: false,
        error: "Email and new password are required"
      });
      return;
    }

    await AuthService.updateUserPassword({ email, newPassword });

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error: any) {
    console.error("Update password error:", error);
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
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: "Email and password are required"
      });
      return;
    }

    const result = await AuthService.loginUser({ email, password });

    res.json({
      success: true,
      data: {
        token: result.token,
        user: result.user
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