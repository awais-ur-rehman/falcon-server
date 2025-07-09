import express from "express";
import { authenticateToken, requireRole } from "../../middleware/auth.middleware.js";
import * as userController from "../../controllers/user.controller.js";

const router = express.Router();

router.get("/me", authenticateToken, userController.getCurrentUser);
router.get("/", authenticateToken, requireRole(["admin"]), userController.getAllUsers);
router.put("/me", authenticateToken, userController.updateUser);
router.put("/:id", authenticateToken, requireRole(["admin"]), userController.updateUser);
router.delete("/:id", authenticateToken, requireRole(["admin"]), userController.deleteUser);

export default router;