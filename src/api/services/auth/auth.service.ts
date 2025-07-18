import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User, Resident } from "../../models/User.js";
import { IUser, IResident } from "../../models/interfaces/user.interface.js";
import vars from "../../../config/vars.js";
import { APIError } from "../../utils/apiError.js";
import { Types } from "mongoose";

interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

interface SignupData {
  username: string;
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

interface ResidentUser {
  user: IUser;
  deviceID: string;
  residentId: string;
}

const ENCRYPTION_KEY = process.env.CNIC_ENCRYPTION_KEY || 'your-32-character-secret-key-here';
const ALGORITHM = 'aes-256-cbc';

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

const validatePhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^(\+92|0)?3[0-9]{9}$/;
  return phoneRegex.test(phoneNumber);
};

const validateCnic = (cnic: string): boolean => {
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

const getResidentUser = async (userId: string): Promise<ResidentUser | null> => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    const resident = await Resident.findOne({ user: userId });
    if (!resident) return null;

    return {
      user: user,
      deviceID: resident.deviceID,
      residentId: (resident._id as Types.ObjectId).toString()
    };
  } catch (error) {
    console.error("Error fetching resident user:", error);
    return null;
  }
};

export const checkPhoneExists = async (phoneNumber: string): Promise<{
  exists: boolean;
  isFirstLogin: boolean;
}> => {
  if (!validatePhoneNumber(phoneNumber)) {
    throw new APIError("Invalid phone number format", 400);
  }

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
  user: IUser;
  residentUser: ResidentUser | null;
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

  const encryptedCnic = encryptCnic(cnic);
  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  await User.findByIdAndUpdate(user._id, {
    cnic: encryptedCnic,
    password: hashedPassword,
    isFirstLogin: false,
    updatedAt: new Date(),
  });

  const updatedUser = await User.findById(user._id);
  if (!updatedUser) {
    throw new APIError("Failed to update user", 500);
  }

  const token = generateToken(updatedUser);
  
  // Get resident user information
  const residentUser = await getResidentUser((updatedUser._id as Types.ObjectId).toString());

  return { token, user: updatedUser, residentUser };
};

export const loginUser = async (credentials: LoginCredentials): Promise<{
  token: string;
  user: IUser;
  residentUser: ResidentUser | null;
}> => {
  const { phoneNumber, password } = credentials;

  if (!validatePhoneNumber(phoneNumber)) {
    throw new APIError("Invalid phone number format", 400);
  }

  const normalizedPhone = phoneNumber.startsWith('+92') 
    ? '0' + phoneNumber.slice(3)
    : phoneNumber;

  const user = await User.findOne({
    phoneNumber: normalizedPhone,
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

  await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
  
  const token = generateToken(user);

  const updatedUser = await User.findById(user._id);
  if (!updatedUser) {
    throw new APIError("Failed to retrieve updated user", 500);
  }

  // Get resident user information
  const residentUser = await getResidentUser((updatedUser._id as Types.ObjectId).toString());

  return { token, user: updatedUser, residentUser };
};

export const signupUser = async (signupData: SignupData): Promise<{
  token: string;
  user: Omit<IUser, 'password' | 'cnic'>;
}> => {
  const { username, phoneNumber, password, confirmPassword } = signupData;

  if (!username || !phoneNumber || !password) {
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

  const normalizedPhone = phoneNumber.startsWith('+92') 
    ? '0' + phoneNumber.slice(3)
    : phoneNumber;

  const existingUser = await User.findOne({
    $or: [
      { username: username.toLowerCase() },
      { phoneNumber: normalizedPhone },
    ],
  });

  if (existingUser) {
    if (existingUser.username === username.toLowerCase()) {
      throw new APIError("Username is already taken", 409);
    } else {
      throw new APIError("Phone number is already registered", 409);
    }
  }

  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  const newUser = new User({
    username: username.trim().toLowerCase(),
    phoneNumber: normalizedPhone,
    password: hashedPassword,
    role: "user",
    isFirstLogin: false,
  });

  await newUser.save();
  const token = generateToken(newUser);

  const userResponse = {
    _id: newUser._id,
    id: (newUser._id as Types.ObjectId).toString(),
    username: newUser.username,
    phoneNumber: newUser.phoneNumber,
    role: newUser.role,
    avatar: newUser.avatar,
    isFirstLogin: newUser.isFirstLogin,
    lastLogin: newUser.lastLogin,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  } as Omit<IUser, 'password' | 'cnic'>;

  return { token, user: userResponse };
};