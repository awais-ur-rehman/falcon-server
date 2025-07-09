import express from "express";
import { authenticateToken, requireRole } from "../../middleware/auth.middleware.js";
import * as roleController from "../../controllers/role.colntroller.js";

const router = express.Router();

router.get("/:roleId", authenticateToken, roleController.getRole);
router.get("/", authenticateToken, requireRole(["admin"]), roleController.getAllRoles);
router.post("/", authenticateToken, requireRole(["admin"]), roleController.createRole);
router.put("/:roleId", authenticateToken, requireRole(["admin"]), roleController.updateRole);
router.delete("/:roleId", authenticateToken, requireRole(["admin"]), roleController.deleteRole);

export default router;