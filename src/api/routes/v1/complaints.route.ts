import express from "express";
import { authenticateToken, requireRole } from "../../middleware/auth.middleware.js";
import * as complaintController from "../../controllers/complaint.controller.js";

const router = express.Router();

/**
 * @swagger
 * /complaints:
 *   post:
 *     summary: Create a new complaint
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the complaint
 *                 example: "Water leakage in building lobby"
 *               description:
 *                 type: string
 *                 description: Detailed description of the complaint
 *                 example: "There is continuous water leakage from the ceiling in the main lobby area"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of image URLs
 *                 example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the complaint
 *                 example: "2024-01-15"
 *     responses:
 *       201:
 *         description: Complaint created successfully
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
 *                     complaint:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                         status:
 *                           type: string
 *                           enum: [Pending, In Progress, Resolved, Rejected]
 *                           example: "Pending"
 *                         images:
 *                           type: array
 *                           items:
 *                             type: string
 *                         date:
 *                           type: string
 *                           format: date
 *                 message:
 *                   type: string
 *                   example: "Complaint created successfully"
 */
router.post("/", authenticateToken, complaintController.createComplaint);

/**
 * @swagger
 * /complaints/{id}:
 *   put:
 *     summary: Update a complaint (only by owner and only if status is pending)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Complaint ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title of the complaint
 *               description:
 *                 type: string
 *                 description: Updated description of the complaint
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Updated array of image URLs
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Updated date of the complaint
 *     responses:
 *       200:
 *         description: Complaint updated successfully
 *       403:
 *         description: Access denied or complaint not in pending status
 *       404:
 *         description: Complaint not found
 */
router.put("/:id", authenticateToken, complaintController.updateComplaint);

/**
 * @swagger
 * /complaints/{id}:
 *   delete:
 *     summary: Delete a complaint (only by owner)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Complaint ID
 *     responses:
 *       200:
 *         description: Complaint deleted successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Complaint not found
 */
router.delete("/:id", authenticateToken, complaintController.deleteComplaint);

/**
 * @swagger
 * /complaints/{id}/status:
 *   patch:
 *     summary: Update complaint status (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Complaint ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, In Progress, Resolved, Rejected]
 *                 description: New status for the complaint
 *                 example: "In Progress"
 *     responses:
 *       200:
 *         description: Complaint status updated successfully
 *       403:
 *         description: Access denied - Admin role required
 *       404:
 *         description: Complaint not found
 */
router.patch("/:id/status", authenticateToken, complaintController.updateComplaintStatus);

/**
 * @swagger
 * /complaints:
 *   get:
 *     summary: Get complaints with filtering and pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID (admin can access all, users can access their own)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, In Progress, Resolved, Rejected]
 *         description: Filter by complaint status
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by title (case-insensitive partial match)
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
 *         description: List of complaints with pagination
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
 *                     complaints:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           description:
 *                             type: string
 *                           status:
 *                             type: string
 *                             enum: [Pending, In Progress, Resolved, Rejected]
 *                           images:
 *                             type: array
 *                             items:
 *                               type: string
 *                           date:
 *                             type: string
 *                             format: date
 *                           userId:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
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
router.get("/", authenticateToken, complaintController.getComplaints);

export default router;