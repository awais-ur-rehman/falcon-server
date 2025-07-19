import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/apiResponse.js";

export const validateRequiredFields = (fields: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const missingFields: string[] = [];

        fields.forEach(field => {
            if (!req.body[field] || req.body[field] === "") {
                missingFields.push(field);
            }
        });

        if (missingFields.length > 0) {
            return ApiResponse.badRequest(
                res,
                `Missing required fields: ${missingFields.join(", ")}`
            );
        }

        next();
    };
};

export const validateQueryParams = (params: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const missingParams: string[] = [];

        params.forEach(param => {
            if (!req.query[param]) {
                missingParams.push(param);
            }
        });

        if (missingParams.length > 0) {
            return ApiResponse.badRequest(
                res,
                `Missing required query parameters: ${missingParams.join(", ")}`
            );
        }

        next();
    };
};

export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    if (page < 1) {
        return ApiResponse.badRequest(res, "Page must be greater than 0");
    }

    if (limit < 1 || limit > 100) {
        return ApiResponse.badRequest(res, "Limit must be between 1 and 100");
    }

    req.query.page = page.toString();
    req.query.limit = limit.toString();

    next();
};

export const validateObjectId = (paramName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const id = req.params[paramName];

        if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
            return ApiResponse.badRequest(res, `Invalid ${paramName} format`);
        }

        next();
    };
}; 