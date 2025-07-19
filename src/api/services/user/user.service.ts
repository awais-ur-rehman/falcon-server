import { User } from "../../models/User.js";
import { IUser } from "../../models/interfaces/user.interface.js";
import { APIError } from "../../utils/apiError.js";

export const createUser = async (userData: Partial<IUser>): Promise<Omit<IUser, 'password'>> => {
  const existingUser = await User.findOne({
    $or: [
      { username: userData.username?.toLowerCase() },
      { phoneNumber: userData.phoneNumber },
    ],
  });

  if (existingUser) {
    if (existingUser.username === userData.username?.toLowerCase()) {
      throw new APIError("Username is already taken", 409);
    } else {
      throw new APIError("Phone number is already registered", 409);
    }
  }

  const newUser = new User({
    ...userData,
    username: userData.username?.toLowerCase(),
    isActive: true, // Explicitly set isActive to true
  });

  await newUser.save();

  const userResponse = await User.findById(newUser._id).select("-password");
  if (!userResponse) {
    throw new APIError("Failed to create user", 500);
  }

  return userResponse;
};

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

export const getAllUsersPaginated = async (page: number, limit: number): Promise<{
  users: Omit<IUser, 'password'>[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}> => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find({ isActive: true })
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments({ isActive: true }),
  ]);

  return {
    users,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
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

export const updateUserRole = async (
  userId: string,
  role: string
): Promise<Omit<IUser, 'password'>> => {
  if (!["admin", "user", "moderator"].includes(role)) {
    throw new APIError("Invalid role", 400);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role, updatedAt: new Date() },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new APIError("User not found", 404);
  }

  return user;
};

export const deleteUser = async (userId: string): Promise<void> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: false, updatedAt: new Date() },
    { new: true }
  );

  if (!user) {
    throw new APIError("User not found", 404);
  }
};