import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import * as authController from "../../controllers/auth.controller.js";

const router = express.Router();

/**
 * @swagger
 * /auth/check-phone:
 *   post:
 *     summary: Check if a phone number exists
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Phone check result
 */
router.post("/check-phone", authController.checkPhone);

/**
 * @swagger
 * /auth/complete-setup:
 *   post:
 *     summary: Complete user setup
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Setup completed
 */
router.post("/complete-setup", authController.completeSetup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: User signup
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Signup successful
 */
router.post("/signup", authController.signup);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post("/logout", authenticateToken, authController.logout);

export default router;