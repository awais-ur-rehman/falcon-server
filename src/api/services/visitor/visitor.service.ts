import { Visitor } from "../../models/Visitor.js";
import { Employee, Resident } from "../../models/User.js";
import { IVisitor } from "../../models/interfaces/visitor.interface.js";
import { APIError } from "../../utils/apiError.js";
import crypto from 'crypto';

interface GetVisitorsQuery {
  userId?: string;
  visitorName?: string;
  visitorType?: string;
  vehicleType?: string;
  entryCode?: string;
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

const generateUniqueEntryCode = async (): Promise<string> => {
  const timestamp = process.hrtime.bigint();
  const randomBytes = crypto.randomBytes(4);

  const combined = Number(timestamp % 10000n) + randomBytes.readUInt32BE(0);
  let entryCode = (combined % 10000).toString().padStart(4, '0');

  if (entryCode === '0000') {
    entryCode = '0001';
  }

  let attempts = 0;
  while (attempts < 10) {
    const existing = await Visitor.findOne({ entryCode });
    if (!existing) {
      return entryCode;
    }

    const nextCode = ((parseInt(entryCode) + 1) % 10000).toString().padStart(4, '0');
    entryCode = nextCode === '0000' ? '0001' : nextCode;
    attempts++;
  }

  const fallbackCode = (Date.now() % 9999 + 1).toString().padStart(4, '0');
  return fallbackCode;
};

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

  if (!visitorData.residentId) {
    visitorData.residentId = requestingUserId;
  }

  const entryCode = await generateUniqueEntryCode();

  const visitor = new Visitor({
    ...visitorData,
    residentId: visitorData.residentId,
    entryCode
  });

  const savedVisitor = await visitor.save();
  await savedVisitor.populate('residentId', 'username phoneNumber houseNumber');

  return savedVisitor;
};

export const getVisitors = async (
  query: GetVisitorsQuery,
  requestingUserId: string
): Promise<PaginatedVisitors> => {
  const {
    userId,
    visitorName,
    visitorType,
    vehicleType,
    entryCode,
    page = "1",
    limit = "30",
    sortBy = "createdAt",
    sortOrder = "desc",
    startDate,
    endDate
  } = query;

  // Check if the requesting user is an employee (admin portal) or resident (mobile app)
  const currentEmployee = await Employee.findById(requestingUserId);
  const currentResident = await Resident.findById(requestingUserId);

  const filters: any = {};

  if (currentEmployee) {
    // Employee (admin portal) can see all visitors
    if (userId) {
      filters.residentId = userId;
    }
  } else if (currentResident) {
    // Resident (mobile app) can only see their own visitors
    if (!userId) {
      filters.residentId = requestingUserId;
    } else if (userId) {
      if (userId !== requestingUserId) {
        throw new APIError("Access denied. You can only access your own records.", 403);
      }
      filters.residentId = userId;
    }
  } else {
    throw new APIError("User not found", 404);
  }

  if (visitorName) filters.visitorName = new RegExp(visitorName, 'i');
  if (visitorType) filters.visitorType = visitorType;
  if (vehicleType) filters.vehicleType = vehicleType;
  if (entryCode) filters.entryCode = entryCode;

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
    .populate('residentId', 'username phoneNumber houseNumber')
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