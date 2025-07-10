import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import * as authController from "../../controllers/auth.controller.js";

const router = express.Router();

router.post("/check-phone", authController.checkPhone);
router.post("/complete-setup", authController.completeSetup);
router.post("/login", authController.login);

router.post("/signup", authController.signup);

router.post("/logout", authenticateToken, authController.logout);

export default router;