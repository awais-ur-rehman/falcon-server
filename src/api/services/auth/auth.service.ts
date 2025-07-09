import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/User.js";
import { IUser } from "../../models/interfaces/user.interface.js";
import vars from "../../../config/vars.js";
import { APIError } from "../../utils/apiError.js";
import { Types } from "mongoose";

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface UpdatePasswordData {
  email: string;
  newPassword: string;
}

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export const generateToken = (user: IUser): string => {
  const payload: TokenPayload = {
    id: (user._id as Types.ObjectId).toString(),
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, vars.jwtSecret, {
    expiresIn: parseInt(vars.jwtExpirationInterval) * 60,
  });
};

export const checkUserExists = async (email: string): Promise<{
  exists: boolean;
  isFirstLogin: boolean;
}> => {
  const user = await User.findOne({ email: email.toLowerCase() });
  
  if (!user) {
    return { exists: false, isFirstLogin: false };
  }

  return { 
    exists: true, 
    isFirstLogin: user.isFirstLogin || false 
  };
};

export const updateUserPassword = async (data: UpdatePasswordData): Promise<void> => {
  const { email, newPassword } = data;

  if (newPassword.length < 6) {
    throw new APIError("Password must be at least 6 characters long", 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new APIError("User not found", 404);
  }

  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);

  await User.findByIdAndUpdate(user._id, {
    password: hashedPassword,
    isFirstLogin: false,
    updatedAt: new Date(),
  });
};

export const loginUser = async (credentials: LoginCredentials): Promise<{
  token: string;
  user: Omit<IUser, 'password'>;
}> => {
  const { email, password } = credentials;

  const user = await User.findOne({
    email: email.toLowerCase(),
    isActive: true,
  });

  if (!user) {
    throw new APIError("Invalid email or password", 401);
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    throw new APIError("Invalid email or password", 401);
  }

  await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
  
  const token = generateToken(user);

  const userResponse = {
    _id: user._id,
    id: (user._id as Types.ObjectId).toString(),
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isActive: user.isActive,
    isFirstLogin: user.isFirstLogin,
    onboardingCompleted: user.onboardingCompleted,
    onboardingCompletedAt: user.onboardingCompletedAt,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  } as Omit<IUser, 'password'>;

  return { token, user: userResponse };
};

export const signupUser = async (signupData: SignupData): Promise<{
  token: string;
  user: Omit<IUser, 'password'>;
}> => {
  const { fullName, username, email, password, confirmPassword } = signupData;

  if (!fullName || !username || !email || !password) {
    throw new APIError("All fields are required", 400);
  }

  if (password !== confirmPassword) {
    throw new APIError("Passwords do not match", 400);
  }

  if (password.length < 6) {
    throw new APIError("Password must be at least 6 characters long", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new APIError("Invalid email format", 400);
  }

  const existingUser = await User.findOne({
    $or: [
      { email: email.toLowerCase() },
      { username: username.toLowerCase() },
    ],
  });

  if (existingUser) {
    if (existingUser.email === email.toLowerCase()) {
      throw new APIError("User with this email already exists", 409);
    } else {
      throw new APIError("Username is already taken", 409);
    }
  }

  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  const newUser = new User({
    fullName: fullName.trim(),
    username: username.trim().toLowerCase(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role: "user",
    isFirstLogin: false,
    onboardingCompleted: false,
  });

  await newUser.save();
  const token = generateToken(newUser);

  const userResponse = {
    _id: newUser._id,
    id: (newUser._id as Types.ObjectId).toString(),
    fullName: newUser.fullName,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
    avatar: newUser.avatar,
    isActive: newUser.isActive,
    isFirstLogin: newUser.isFirstLogin,
    onboardingCompleted: newUser.onboardingCompleted,
    onboardingCompletedAt: newUser.onboardingCompletedAt,
    lastLogin: newUser.lastLogin,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  } as Omit<IUser, 'password'>;

  return { token, user: userResponse };
};