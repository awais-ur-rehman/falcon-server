import { Employee, Resident } from "../../models/User.js";
import { Module } from "../../models/Module.js";
import { Role } from "../../models/Role.js";
import { Announcement } from "../../models/Announcement.js";
import { Visitor } from "../../models/Visitor.js";
import { Complaint } from "../../models/Complaint.js";

export const cleanupAndReinitialize = async (): Promise<void> => {
    try {
        console.log("🧹 Starting database cleanup and reinitialization...");

        // 1. Clean up all collections
        console.log("🗑️ Cleaning up existing data...");
        await Employee.deleteMany({});
        await Role.deleteMany({});
        await Module.deleteMany({});
        await Announcement.deleteMany({});
        await Visitor.deleteMany({});
        await Complaint.deleteMany({});

        console.log("✅ Database cleaned up");

        // 2. Reinitialize everything
        console.log("🔄 Reinitializing data...");

        // Import and run initialization functions
        const { initializeDefaultData } = await import("./appInitializer.js");
        await initializeDefaultData();

        console.log("✅ Database reinitialization completed successfully!");

    } catch (error) {
        console.error("❌ Error during cleanup and reinitialization:", error);
        throw error;
    }
}; 