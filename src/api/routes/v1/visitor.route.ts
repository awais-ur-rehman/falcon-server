import express from "express";
import { authenticateToken, requireRole } from "../../middleware/auth.middleware.js";
import * as visitorController from "../../controllers/visitor.controller.js";

const router = express.Router();

/**
 * @swagger
 * /visitors:
 *   post:
 *     summary: Create a new visitor record
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
 *               visitorType:
 *                 type: string
 *                 enum: [Guest, Delivery, Cab Driver, Service Provider]
 *               vehicleType:
 *                 type: string
 *                 enum: [Car, Bike, Pickup, Rickshaw]
 *               vehcileNumber:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Visitor created successfully
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
 *       - in: query
 *         name: vehicleType
 *         schema:
 *           type: string
 *           enum: [Car, Bike, Pickup, Rickshaw]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of visitors with pagination
 */
router.get("/", authenticateToken, visitorController.getVisitors);

export default router;