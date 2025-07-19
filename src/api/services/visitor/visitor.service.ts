import { Visitor } from "../../models/Visitor.js";
import { User } from "../../models/User.js";
import { IVisitor } from "../../models/interfaces/visitor.interface.js";
import { APIError } from "../../utils/apiError.js";

interface GetVisitorsQuery {
  userId?: string;
  visitorType?: string;
  vehicleType?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  startDate?: string;
  endDate?: string;
}

interface PaginatedVisitors {
  visitors: IVisitor[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const createVisitor = async (
  visitorData: Partial<IVisitor>,
  requestingUserId: string
): Promise<IVisitor> => {
  if (!visitorData.visitorName) {
    throw new APIError("Visitor name is required", 400);
  }
  
  if (!visitorData.date) {
    throw new APIError("Date is required", 400);
  }

  if (!visitorData.id) {
    visitorData.id = requestingUserId;
  }

  const visitor = new Visitor({
    ...visitorData,
    userId: visitorData.id
  });

  const savedVisitor = await visitor.save();
  await savedVisitor.populate('userId', 'name email');
  
  return savedVisitor;
};

export const getVisitors = async (
  query: GetVisitorsQuery,
  requestingUserId: string
): Promise<PaginatedVisitors> => {
  const {
    userId,
    visitorType,
    vehicleType,
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

  if (visitorType) filters.visitorType = visitorType;
  if (vehicleType) filters.vehicleType = vehicleType;
  
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
  
  const totalRecords = await Visitor.countDocuments(filters);
  const visitors = await Visitor.find(filters)
    .populate('userId', 'name email')
    .sort(sort)
    .skip(skip)
    .limit(limitNum)
    .lean();
  
  const totalPages = Math.ceil(totalRecords / limitNum);
  const hasNext = pageNum < totalPages;
  const hasPrev = pageNum > 1;
  
  return {
    visitors: visitors as IVisitor[],
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalRecords,
      hasNext,
      hasPrev
    }
  };
};