import express from "express";
import * as mapController from "../../controllers/map.controller.js";

const router = express.Router();

/**
 * @swagger
 * /maps:
 *   post:
 *     summary: Create a new map location
 *     tags: [Maps]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - lat
 *               - long
 *               - tag
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the location
 *                 example: "Central Park"
 *               lat:
 *                 type: number
 *                 minimum: -90
 *                 maximum: 90
 *                 description: Latitude coordinate
 *                 example: 40.785091
 *               long:
 *                 type: number
 *                 minimum: -180
 *                 maximum: 180
 *                 description: Longitude coordinate
 *                 example: -73.968285
 *               tag:
 *                 type: string
 *                 description: Tag or category for the location
 *                 example: "park"
 *     responses:
 *       201:
 *         description: Map location created successfully
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
 *                     map:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "64f5c8a1b2e3d4f5e6789abc"
 *                         name:
 *                           type: string
 *                           example: "Central Park"
 *                         lat:
 *                           type: number
 *                           example: 40.785091
 *                         long:
 *                           type: number
 *                           example: -73.968285
 *                         tag:
 *                           type: string
 *                           example: "park"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                 message:
 *                   type: string
 *                   example: "Map created successfully"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Name is required"
 */
router.post("/", mapController.createMap);

/**
 * @swagger
 * /maps/{id}:
 *   put:
 *     summary: Update a map location
 *     tags: [Maps]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Map location ID
 *         example: "64f5c8a1b2e3d4f5e6789abc"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the location
 *                 example: "Central Park - Main Entrance"
 *               lat:
 *                 type: number
 *                 minimum: -90
 *                 maximum: 90
 *                 description: Updated latitude coordinate
 *                 example: 40.785091
 *               long:
 *                 type: number
 *                 minimum: -180
 *                 maximum: 180
 *                 description: Updated longitude coordinate
 *                 example: -73.968285
 *               tag:
 *                 type: string
 *                 description: Updated tag or category for the location
 *                 example: "recreational"
 *     responses:
 *       200:
 *         description: Map location updated successfully
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
 *                     map:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         lat:
 *                           type: number
 *                         long:
 *                           type: number
 *                         tag:
 *                           type: string
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                 message:
 *                   type: string
 *                   example: "Map updated successfully"
 *       404:
 *         description: Map location not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Map not found"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Latitude must be between -90 and 90"
 */
router.put("/:id", mapController.updateMap);

/**
 * @swagger
 * /maps/{id}:
 *   delete:
 *     summary: Delete a map location
 *     tags: [Maps]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Map location ID
 *         example: "64f5c8a1b2e3d4f5e6789abc"
 *     responses:
 *       200:
 *         description: Map location deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Map deleted successfully"
 *       404:
 *         description: Map location not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Map not found"
 *       400:
 *         description: Invalid map ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Map ID is required"
 */
router.delete("/:id", mapController.deleteMap);

/**
 * @swagger
 * /maps:
 *   get:
 *     summary: Get all map locations
 *     tags: [Maps]
 *     responses:
 *       200:
 *         description: List of all map locations
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
 *                     maps:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "64f5c8a1b2e3d4f5e6789abc"
 *                           name:
 *                             type: string
 *                             example: "Central Park"
 *                           lat:
 *                             type: number
 *                             example: 40.785091
 *                           long:
 *                             type: number
 *                             example: -73.968285
 *                           tag:
 *                             type: string
 *                             example: "park"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/", mapController.getMaps);

export default router;