import { User } from "../../models/User.js";
import { IUser } from "../../models/interfaces/user.interface.js";
import { APIError } from "../../utils/apiError.js";

export const getCurrentUser = async (userId: string): Promise<Omit<IUser, 'password'>> => {
  const user = await User.findById(userId).select("-password");
  
  if (!user) {
    throw new APIError("User not found", 404);
  }

  return user;
};

export const getAllUsers = async (requestingUserId: string): Promise<Omit<IUser, 'password'>[]> => {
  const currentUser = await User.findById(requestingUserId);
  
  if (!currentUser || currentUser.role !== "admin") {
    throw new APIError("Access denied. Admin role required.", 403);
  }

  const users = await User.find({ isActive: true })
    .select("-password")
    .sort({ createdAt: -1 });

  return users;
};

export const updateUser = async (
  userId: string, 
  updateData: Partial<IUser>
): Promise<Omit<IUser, 'password'>> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { ...updateData, updatedAt: new Date() },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new APIError("User not found", 404);
  }

  return user;
};

export const deleteUser = async (userId: string, requestingUserId: string): Promise<void> => {
  const currentUser = await User.findById(requestingUserId);
  
  if (!currentUser || currentUser.role !== "admin") {
    throw new APIError("Access denied. Admin role required.", 403);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: false, updatedAt: new Date() },
    { new: true }
  );

  if (!user) {
    throw new APIError("User not found", 404);
  }
};