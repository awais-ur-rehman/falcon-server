import express from "express";
import { authenticateToken, requireRole } from "../../middleware/auth.middleware.js";
import * as userController from "../../controllers/user.controller.js";

const router = express.Router();

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
router.get("/me", authenticateToken, userController.getCurrentUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", authenticateToken, requireRole(["admin"]), userController.getAllUsers);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update current user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User updated
 */
router.put("/me", authenticateToken, userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user (admin only)
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
 *         description: User updated
 */
router.put("/:id", authenticateToken, requireRole(["admin"]), userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user (admin only)
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
 *         description: User deleted
 */
router.delete("/:id", authenticateToken, requireRole(["admin"]), userController.deleteUser);

export default router;