import { Complaint } from "../../models/Complaint.js";
import { User } from "../../models/User.js";
import { IComplaint } from "../../models/interfaces/complaint.interface.js";
import { APIError } from "../../utils/apiError.js";

interface GetComplaintsQuery {
  userId?: string;
  status?: string;
  title?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  startDate?: string;
  endDate?: string;
}

interface PaginatedComplaints {
  complaints: IComplaint[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const createComplaint = async (
  complaintData: Partial<IComplaint>,
  requestingUserId: string
): Promise<IComplaint> => {
  if (!complaintData.title) {
    throw new APIError("Title is required", 400);
  }
  
  if (!complaintData.description) {
    throw new APIError("Description is required", 400);
  }

  if (!complaintData.date) {
    throw new APIError("Date is required", 400);
  }

  const complaint = new Complaint({
    ...complaintData,
    userId: requestingUserId,
    status: "Pending" 
  });

  const savedComplaint = await complaint.save();
  await savedComplaint.populate('userId', 'name email');
  
  return savedComplaint;
};

export const updateComplaint = async (
  complaintId: string,
  updateData: Partial<IComplaint>,
  requestingUserId: string
): Promise<IComplaint> => {
  const complaint = await Complaint.findById(complaintId);
  
  if (!complaint) {
    throw new APIError("Complaint not found", 404);
  }

  if (complaint.id.toString() !== requestingUserId) {
    throw new APIError("Access denied. You can only update your own complaints.", 403);
  }

  if (complaint.status !== "Pending") {
    throw new APIError("Only pending complaints can be updated", 400);
  }

  if (updateData.status) {
    delete updateData.status;
  }

  if (updateData.id) {
    delete updateData.id;
  }

  const updatedComplaint = await Complaint.findByIdAndUpdate(
    complaintId,
    updateData,
    { new: true, runValidators: true }
  ).populate('userId', 'name email');

  if (!updatedComplaint) {
    throw new APIError("Failed to update complaint", 500);
  }

  return updatedComplaint;
};

export const deleteComplaint = async (
  complaintId: string,
  requestingUserId: string
): Promise<void> => {
  const complaint = await Complaint.findById(complaintId);
  
  if (!complaint) {
    throw new APIError("Complaint not found", 404);
  }

  if (complaint.id.toString() !== requestingUserId) {
    throw new APIError("Access denied. You can only delete your own complaints.", 403);
  }

  await Complaint.findByIdAndDelete(complaintId);
};

export const updateComplaintStatus = async (
  complaintId: string,
  newStatus: string,
  requestingUserId: string
): Promise<IComplaint> => {
  const currentUser = await User.findById(requestingUserId);
  if (!currentUser || currentUser.role !== "admin") {
    throw new APIError("Access denied. Only admins can update complaint status.", 403);
  }

  const validStatuses = ["Pending", "In Progress", "Resolved", "Rejected"];
  if (!validStatuses.includes(newStatus)) {
    throw new APIError("Invalid status. Must be one of: Pending, In Progress, Resolved, Rejected", 400);
  }

  const updatedComplaint = await Complaint.findByIdAndUpdate(
    complaintId,
    { status: newStatus },
    { new: true, runValidators: true }
  ).populate('userId', 'name email');

  if (!updatedComplaint) {
    throw new APIError("Complaint not found", 404);
  }

  return updatedComplaint;
};

export const getComplaints = async (
  query: GetComplaintsQuery,
  requestingUserId: string
): Promise<PaginatedComplaints> => {
  const {
    userId,
    status,
    title,
    page = "1",
    limit = "30",
    sortBy = "createdAt",
    sortOrder = "desc",
    startDate,
    endDate
  } = query;

  const currentUser = await User.findById(requestingUserId);
  if (!currentUser) {
    throw new APIError("User not found", 404);
  }

  const filters: any = {};
  
  if (currentUser.role !== "admin" && !userId) {
    filters.userId = requestingUserId;
  } else if (userId) {
    if (currentUser.role !== "admin" && userId !== requestingUserId) {
      throw new APIError("Access denied. You can only access your own records.", 403);
    }
    filters.userId = userId;
  }

  if (status) filters.status = status;
  if (title) filters.title = new RegExp(title, 'i');
  
  if (startDate || endDate) {
    filters.date = {};
    if (startDate) filters.date.$gte = new Date(startDate);
    if (endDate) filters.date.$lte = new Date(endDate);
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;
  
  const sort: any = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
  
  const totalRecords = await Complaint.countDocuments(filters);
  const complaints = await Complaint.find(filters)
    .populate('userId', 'name email')
    .sort(sort)
    .skip(skip)
    .limit(limitNum)
    .lean();
  
  const totalPages = Math.ceil(totalRecords / limitNum);
  const hasNext = pageNum < totalPages;
  const hasPrev = pageNum > 1;
  
  return {
    complaints: complaints as IComplaint[],
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalRecords,
      hasNext,
      hasPrev
    }
  };
};