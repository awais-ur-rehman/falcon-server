import { Response } from "express";

interface ApiResponseOptions {
    success?: boolean;
    data?: any;
    error?: string;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export class ApiResponse {
    static success(
        res: Response,
        data?: any,
        message?: string,
        statusCode: number = 200
    ) {
        return res.status(statusCode).json({
            success: true,
            data,
            message,
        });
    }

    static error(
        res: Response,
        error: string,
        statusCode: number = 500
    ) {
        return res.status(statusCode).json({
            success: false,
            error,
        });
    }

    static paginated(
        res: Response,
        data: any[],
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        },
        message?: string
    ) {
        return res.json({
            success: true,
            data,
            message,
            pagination,
        });
    }

    static created(
        res: Response,
        data?: any,
        message?: string
    ) {
        return this.success(res, data, message, 201);
    }

    static noContent(res: Response) {
        return res.status(204).send();
    }

    static badRequest(
        res: Response,
        error: string
    ) {
        return this.error(res, error, 400);
    }

    static unauthorized(
        res: Response,
        error: string = "Unauthorized"
    ) {
        return this.error(res, error, 401);
    }

    static forbidden(
        res: Response,
        error: string = "Forbidden"
    ) {
        return this.error(res, error, 403);
    }

    static notFound(
        res: Response,
        error: string = "Resource not found"
    ) {
        return this.error(res, error, 404);
    }

    static conflict(
        res: Response,
        error: string = "Conflict"
    ) {
        return this.error(res, error, 409);
    }

    static validationError(
        res: Response,
        error: string
    ) {
        return this.error(res, error, 422);
    }
} 