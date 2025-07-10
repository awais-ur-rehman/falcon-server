import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../../models/User.js";
import { IUser } from "../../models/interfaces/user.interface.js";
import vars from "../../../config/vars.js";
import { APIError } from "../../utils/apiError.js";
import { Types } from "mongoose";

interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

interface SignupData {
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

interface CompleteSetupData {
  phoneNumber: string;
  cnic: string;
  password: string;
}

interface TokenPayload {
  id: string;
  phoneNumber: string;
  role: string;
}

// Encryption key for CNIC (you should store this in environment variables)
const ENCRYPTION_KEY = process.env.CNIC_ENCRYPTION_KEY || 'your-32-character-secret-key-here';
const ALGORITHM = 'aes-256-cbc';

// Utility functions for CNIC encryption/decryption
const encryptCnic = (cnic: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
  let encrypted = cipher.update(cnic, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

const decryptCnic = (encryptedCnic: string): string => {
  const [ivHex, encrypted] = encryptedCnic.split(':');
  const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// Phone number validation
const validatePhoneNumber = (phoneNumber: string): boolean => {
  // Pakistani phone number format: +92XXXXXXXXXX or 03XXXXXXXXX
  const phoneRegex = /^(\+92|0)?3[0-9]{9}$/;
  return phoneRegex.test(phoneNumber);
};

// CNIC validation
const validateCnic = (cnic: string): boolean => {
  // Pakistani CNIC format: XXXXX-XXXXXXX-X
  const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
  return cnicRegex.test(cnic);
};

export const generateToken = (user: IUser): string => {
  const payload: TokenPayload = {
    id: (user._id as Types.ObjectId).toString(),
    phoneNumber: user.phoneNumber,
    role: user.role,
  };

  return jwt.sign(payload, vars.jwtSecret, {
    expiresIn: parseInt(vars.jwtExpirationInterval) * 60,
  });
};

export const checkPhoneExists = async (phoneNumber: string): Promise<{
  exists: boolean;
  isFirstLogin: boolean;
}> => {
  if (!validatePhoneNumber(phoneNumber)) {
    throw new APIError("Invalid phone number format", 400);
  }

  // Normalize phone number (remove +92 and add 0 if needed)
  const normalizedPhone = phoneNumber.startsWith('+92') 
    ? '0' + phoneNumber.slice(3)
    : phoneNumber;

  const user = await User.findOne({ phoneNumber: normalizedPhone });
  
  if (!user) {
    return { exists: false, isFirstLogin: false };
  }

  return { 
    exists: true, 
    isFirstLogin: user.isFirstLogin || false 
  };
};

export const completeUserSetup = async (data: CompleteSetupData): Promise<{
  token: string;
  user: Omit<IUser, 'password' | 'cnic'>;
}> => {
  const { phoneNumber, cnic, password } = data;

  if (!validatePhoneNumber(phoneNumber)) {
    throw new APIError("Invalid phone number format", 400);
  }

  if (!validateCnic(cnic)) {
    throw new APIError("Invalid CNIC format. Use XXXXX-XXXXXXX-X", 400);
  }

  if (password.length < 6) {
    throw new APIError("Password must be at least 6 characters long", 400);
  }

  // Normalize phone number
  const normalizedPhone = phoneNumber.startsWith('+92') 
    ? '0' + phoneNumber.slice(3)
    : phoneNumber;

  const user = await User.findOne({ phoneNumber: normalizedPhone });
  if (!user) {
    throw new APIError("User not found", 404);
  }

  if (!user.isFirstLogin) {
    throw new APIError("User setup already completed", 400);
  }

  // Encrypt CNIC and hash password
  const encryptedCnic = encryptCnic(cnic);
  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  // Update user with CNIC and password
  await User.findByIdAndUpdate(user._id, {
    cnic: encryptedCnic,
    password: hashedPassword,
    isFirstLogin: false,
    updatedAt: new Date(),
  });

  // Fetch updated user
  const updatedUser = await User.findById(user._id);
  if (!updatedUser) {
    throw new APIError("Failed to update user", 500);
  }

  const token = generateToken(updatedUser);

  const userResponse = {
    _id: updatedUser._id,
    id: (updatedUser._id as Types.ObjectId).toString(),
    fullName: updatedUser.fullName,
    username: updatedUser.username,
    email: updatedUser.email,
    phoneNumber: updatedUser.phoneNumber,
    role: updatedUser.role,
    avatar: updatedUser.avatar,
    isActive: updatedUser.isActive,
    isFirstLogin: updatedUser.isFirstLogin,
    onboardingCompleted: updatedUser.onboardingCompleted,
    onboardingCompletedAt: updatedUser.onboardingCompletedAt,
    lastLogin: updatedUser.lastLogin,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  } as Omit<IUser, 'password' | 'cnic'>;

  return { token, user: userResponse };
};

export const loginUser = async (credentials: LoginCredentials): Promise<{
  token: string;
  user: Omit<IUser, 'password' | 'cnic'>;
}> => {
  const { phoneNumber, password } = credentials;

  if (!validatePhoneNumber(phoneNumber)) {
    throw new APIError("Invalid phone number format", 400);
  }

  // Normalize phone number
  const normalizedPhone = phoneNumber.startsWith('+92') 
    ? '0' + phoneNumber.slice(3)
    : phoneNumber;

  const user = await User.findOne({
    phoneNumber: normalizedPhone,
    isActive: true,
  });

  if (!user) {
    throw new APIError("Invalid phone number or password", 401);
  }

  if (user.isFirstLogin) {
    throw new APIError("Please complete your setup first", 400);
  }

  if (!user.password) {
    throw new APIError("Account setup incomplete", 400);
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    throw new APIError("Invalid phone number or password", 401);
  }

  // Update last login
  await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
  
  const token = generateToken(user);

  const userResponse = {
    _id: user._id,
    id: (user._id as Types.ObjectId).toString(),
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    avatar: user.avatar,
    isActive: user.isActive,
    isFirstLogin: user.isFirstLogin,
    onboardingCompleted: user.onboardingCompleted,
    onboardingCompletedAt: user.onboardingCompletedAt,
    lastLogin: new Date(),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  } as Omit<IUser, 'password' | 'cnic'>;

  return { token, user: userResponse };
};

export const signupUser = async (signupData: SignupData): Promise<{
  token: string;
  user: Omit<IUser, 'password' | 'cnic'>;
}> => {
  const { fullName, username, email, phoneNumber, password, confirmPassword } = signupData;

  if (!fullName || !username || !email || !phoneNumber || !password) {
    throw new APIError("All fields are required", 400);
  }

  if (password !== confirmPassword) {
    throw new APIError("Passwords do not match", 400);
  }

  if (password.length < 6) {
    throw new APIError("Password must be at least 6 characters long", 400);
  }

  if (!validatePhoneNumber(phoneNumber)) {
    throw new APIError("Invalid phone number format", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new APIError("Invalid email format", 400);
  }

  // Normalize phone number
  const normalizedPhone = phoneNumber.startsWith('+92') 
    ? '0' + phoneNumber.slice(3)
    : phoneNumber;

  const existingUser = await User.findOne({
    $or: [
      { email: email.toLowerCase() },
      { username: username.toLowerCase() },
      { phoneNumber: normalizedPhone },
    ],
  });

  if (existingUser) {
    if (existingUser.email === email.toLowerCase()) {
      throw new APIError("User with this email already exists", 409);
    } else if (existingUser.username === username.toLowerCase()) {
      throw new APIError("Username is already taken", 409);
    } else {
      throw new APIError("Phone number is already registered", 409);
    }
  }

  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  const newUser = new User({
    fullName: fullName.trim(),
    username: username.trim().toLowerCase(),
    email: email.toLowerCase().trim(),
    phoneNumber: normalizedPhone,
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
    phoneNumber: newUser.phoneNumber,
    role: newUser.role,
    avatar: newUser.avatar,
    isActive: newUser.isActive,
    isFirstLogin: newUser.isFirstLogin,
    onboardingCompleted: newUser.onboardingCompleted,
    onboardingCompletedAt: newUser.onboardingCompletedAt,
    lastLogin: newUser.lastLogin,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  } as Omit<IUser, 'password' | 'cnic'>;

  return { token, user: userResponse };
};