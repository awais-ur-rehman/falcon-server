import express from "express";
import { authenticateToken, requireRole } from "../../middleware/auth.middleware.js";
import * as visitorController from "../../controllers/visitor.controller.js";

const router = express.Router();

/**
 * @swagger
 * /visitors:
 *   post:
 *     summary: Create a new visitor record with auto-generated 4-digit entry code
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - visitorName
 *               - date
 *             properties:
 *               visitorName:
 *                 type: string
 *                 description: Name of the visitor
 *               visitorType:
 *                 type: string
 *                 enum: [Guest, Delivery, Cab Driver, Service Provider]
 *                 default: Guest
 *               vehicleType:
 *                 type: string
 *                 enum: [Car, Bike, Pickup, Rickshaw]
 *                 default: Car
 *               vehcileNumber:
 *                 type: string
 *                 description: Vehicle registration number
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Expected date of visit
 *     responses:
 *       201:
 *         description: Visitor created successfully with unique entry code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     visitor:
 *                       type: object
 *                       properties:
 *                         entryCode:
 *                           type: string
 *                           description: Auto-generated 4-digit entry code
 *                           example: "1234"
 *                         visitorName:
 *                           type: string
 *                           example: "John Doe"
 *                         visitorType:
 *                           type: string
 *                           example: "Guest"
 *                 message:
 *                   type: string
 *                   example: "Visitor created successfully"
 */
router.post("/", authenticateToken, visitorController.createVisitor);

/**
 * @swagger
 * /visitors:
 *   get:
 *     summary: Get visitors with filtering and pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID (admin can access all, users can access their own)
 *       - in: query
 *         name: visitorType
 *         schema:
 *           type: string
 *           enum: [Guest, Delivery, Cab Driver, Service Provider]
 *         description: Filter by visitor type
 *       - in: query
 *         name: vehicleType
 *         schema:
 *           type: string
 *           enum: [Car, Bike, Pickup, Rickshaw]
 *         description: Filter by vehicle type
 *       - in: query
 *         name: entryCode
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}$'
 *         description: Filter by 4-digit entry code
 *         example: "1234"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 30
 *         description: Number of records per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for date range filter
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for date range filter
 *     responses:
 *       200:
 *         description: List of visitors with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     visitors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           entryCode:
 *                             type: string
 *                             example: "1234"
 *                           visitorName:
 *                             type: string
 *                             example: "John Doe"
 *                           visitorType:
 *                             type: string
 *                             example: "Guest"
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalRecords:
 *                           type: integer
 *                         hasNext:
 *                           type: boolean
 *                         hasPrev:
 *                           type: boolean
 */
router.get("/", authenticateToken, visitorController.getVisitors);

export default router;