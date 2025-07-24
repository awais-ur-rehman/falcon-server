import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import {
    getAnnouncementsController,
    createAnnouncementController,
    updateAnnouncementController,
    updateAnnouncementStatusController,
    deleteAnnouncementController,
} from "../../controllers/announcement.controller";

const router = express.Router();

/**
 * @swagger
 * /announcement:
 *   get:
 *     summary: Get all announcements (paginated, filterable)
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Announcement ID
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by title
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: Filter by content
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Page size
 *     responses:
 *       200:
 *         description: A list of announcements
 */
router.get("/", getAnnouncementsController);

/**
 * @swagger
 * /announcement:
 *   post:
 *     summary: Create an announcement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Announcement created
 */
router.post("/", createAnnouncementController);

/**
 * @swagger
 * /announcement/{id}:
 *   put:
 *     summary: Update announcement title, content, or images
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Announcement ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Announcement updated
 *       404:
 *         description: Announcement not found
 */
router.put("/:id", updateAnnouncementController);

/**
 * @swagger
 * /announcement/{id}/status:
 *   put:
 *     summary: Update announcement status (active/inactive)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Announcement ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Announcement status updated
 *       404:
 *         description: Announcement not found
 */
router.put("/:id/status", updateAnnouncementStatusController);

/**
 * @swagger
 * /announcement/{id}:
 *   delete:
 *     summary: Delete an announcement
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Announcement ID
 *     responses:
 *       200:
 *         description: Announcement deleted
 *       404:
 *         description: Announcement not found
 */
router.delete("/:id", deleteAnnouncementController);

export default router;