import express from "express";
import { getAllModules } from "../../controllers/module.controller.js";

const router = express.Router();

/**
 * @swagger
 * /modules:
 *   get:
 *     summary: Get all available modules for role assignment
 *     description: READ-ONLY - Admin cannot create/modify modules
 *     responses:
 *       200:
 *         description: Array of module objects with _id, name, description
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 */
router.get("/", getAllModules);

export default router; 