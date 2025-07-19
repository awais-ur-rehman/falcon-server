import express from "express";
import { authenticateToken, requireRole } from "../../middleware/auth.middleware.js";
import {
    getCurrentUser,
    getAllUsers,
    createUser,
    updateUser,
    updateUserRole,
    deleteUser,
} from "../../controllers/user.controller.js";

const router = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create new user (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               cnic:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, user, moderator]
 *               houseNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Required fields missing
 *       403:
 *         description: Access denied. Admin role required.
 */
router.post("/", authenticateToken, requireRole(["admin"]), createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (admin only) - PAGINATED
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: List of users with pagination
 *       403:
 *         description: Access denied. Admin role required.
 */
router.get("/", authenticateToken, requireRole(["admin"]), getAllUsers);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 */
router.get("/me", authenticateToken, getCurrentUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user details (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User updated successfully
 *       403:
 *         description: Access denied. Admin role required.
 */
router.put("/:id", authenticateToken, requireRole(["admin"]), updateUser);

/**
 * @swagger
 * /users/{id}/role:
 *   put:
 *     summary: Change user's role assignment (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, user, moderator]
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Valid role is required
 *       403:
 *         description: Access denied. Admin role required.
 */
router.put("/:id/role", authenticateToken, requireRole(["admin"]), updateUserRole);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Soft delete user (admin only)
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
 *         description: User deleted successfully
 *       403:
 *         description: Access denied. Admin role required.
 */
router.delete("/:id", authenticateToken, requireRole(["admin"]), deleteUser);

export default router;