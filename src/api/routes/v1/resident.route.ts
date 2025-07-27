import express from "express";
import {
    createResident,
    getResidentById,
    getAllResidents,
    updateResident,
    deleteResident,
} from "../../controllers/resident.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Resident routes
router.post("/", createResident);
router.get("/", getAllResidents);
router.get("/:id", getResidentById);
router.put("/:id", updateResident);
router.delete("/:id", deleteResident);

export default router; 