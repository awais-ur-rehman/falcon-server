import express from "express";
import { authenticateToken, requireRole } from "../../middleware/auth.middleware.js";
import {
    getRole,
    getAllRoles,
    createRole,
    updateRole,
    deleteRole,
} from "../../controllers/role.colntroller.js";

const router = express.Router();

/**
 * @swagger
 * /roles/{roleId}:
 *   get:
 *     summary: Get role by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role object with module permissions
 *       404:
 *         description: Role not found
 */
router.get("/:roleId", authenticateToken, getRole);

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Get all roles (admin only) - PAGINATED
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
 *         description: Array of role objects with module permissions
 *       403:
 *         description: Access denied. Admin role required.
 */
router.get("/", authenticateToken, requireRole(["admin"]), getAllRoles);

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create new role with module permissions (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               modulePermissions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     module:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           value:
 *                             type: boolean
 *     responses:
 *       201:
 *         description: Role created successfully
 *       403:
 *         description: Access denied. Admin role required.
 */
router.post("/", authenticateToken, requireRole(["admin"]), createRole);

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Update role and its permissions (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       403:
 *         description: Access denied. Admin role required.
 */
router.put("/:id", authenticateToken, requireRole(["admin"]), updateRole);

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Soft delete role (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       403:
 *         description: Access denied. Admin role required.
 */
router.delete("/:id", authenticateToken, requireRole(["admin"]), deleteRole);

export default router;