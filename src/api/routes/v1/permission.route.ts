import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import {
    checkPermission,
    getUserPermissions,
} from "../../controllers/permission.controller.js";

const router = express.Router();

/**
 * @swagger
 * /permissions/check:
 *   get:
 *     summary: Check if current user can access specific module/action
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *       - in: query
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           enum: [read, create, update, delete]
 *         description: Action to check
 *     responses:
 *       200:
 *         description: Permission check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     hasPermission:
 *                       type: boolean
 *       400:
 *         description: Module ID and action are required
 *       401:
 *         description: Authentication required
 */
router.get("/check", authenticateToken, checkPermission);

/**
 * @swagger
 * /permissions/users/{id}:
 *   get:
 *     summary: Get all permissions for specific user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Array of module permissions for that user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     role:
 *                       type: string
 *                     permissions:
 *                       description: '"all" for admin users, or array of module permissions for regular users'
 *                       oneOf:
 *                         - type: string
 *                         - type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               module:
 *                                 type: object
 *                                 properties:
 *                                   _id:
 *                                     type: string
 *                               permissions:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     name:
 *                                       type: string
 *                                     value:
 *                                       type: boolean
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 */
router.get("/users/:id", authenticateToken, getUserPermissions);

export default router; 