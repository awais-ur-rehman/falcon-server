import express from "express";
import {
    createEmployee,
    getEmployeeById,
    getAllEmployees,
    updateEmployee,
    updateEmployeeRole,
    deleteEmployee,
} from "../../controllers/employee.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import { manuallyFixEmployeeRoles } from "../../services/employee/employee.service.js";
import { cleanupAndReinitialize } from "../../services/app/cleanupAndReinitialize.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Employee routes
router.post("/", createEmployee);
router.get("/", getAllEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployee);
router.put("/:id/role", updateEmployeeRole);
router.delete("/:id", deleteEmployee);

// Temporary route to fix employee roles
router.post("/fix-roles", async (req, res) => {
    try {
        await manuallyFixEmployeeRoles();
        res.json({ success: true, message: "Employee roles fixed successfully" });
    } catch (error) {
        console.error("Error fixing employee roles:", error);
        res.status(500).json({ success: false, error: "Failed to fix employee roles" });
    }
});

// Temporary route to cleanup and reinitialize database
router.post("/cleanup-reinitialize", async (req, res) => {
    try {
        await cleanupAndReinitialize();
        res.json({ success: true, message: "Database cleaned up and reinitialized successfully" });
    } catch (error) {
        console.error("Error during cleanup and reinitialization:", error);
        res.status(500).json({ success: false, error: "Failed to cleanup and reinitialize database" });
    }
});

export default router; 