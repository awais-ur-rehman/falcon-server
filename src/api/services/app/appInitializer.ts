import bcrypt from "bcryptjs";
import { User } from "../../models/User.js";
import { Module } from "../../models/Module.js";
import { Role } from "../../models/Role.js";

export const initializeDefaultData = async (): Promise<void> => {
  try {
    const moduleCount = await Module.countDocuments();
    if (moduleCount === 0) {
      const defaultModules = [
        {
          _id: "customer_engagement_id",
          name: "Customer Engagement",
          description: "Manage customer interactions and engagement",
        },
        {
          _id: "keyword_mapping_id",
          name: "Keyword Mapping",
          description: "Map and analyze keywords",
        },
        {
          _id: "sentiment_analysis_id",
          name: "Sentiment Analysis",
          description: "Analyze sentiment in communications",
        },
        {
          _id: "channels_id",
          name: "Channels",
          description: "Manage communication channels",
        },
        {
          _id: "access_control_id",
          name: "Access Control",
          description: "Manage user access and permissions",
        },
      ];
      await Module.insertMany(defaultModules);
      console.log("Default modules created");
    }

    const roleCount = await Role.countDocuments();
    if (roleCount === 0) {
      const defaultRoles = [
        {
          _id: "admin",
          name: "Admin",
          description: "Full system access",
          modulePermissions: [
            {
              module: { _id: "customer_engagement_id" },
              permissions: [
                { name: "read", value: true },
                { name: "create", value: true },
                { name: "update", value: true },
                { name: "delete", value: true },
              ],
            },
            {
              module: { _id: "access_control_id" },
              permissions: [
                { name: "read", value: true },
                { name: "create", value: true },
                { name: "update", value: true },
                { name: "delete", value: true },
              ],
            },
          ],
        },
        {
          _id: "user",
          name: "User",
          description: "Limited system access",
          modulePermissions: [
            {
              module: { _id: "customer_engagement_id" },
              permissions: [
                { name: "read", value: true },
                { name: "create", value: false },
                { name: "update", value: false },
                { name: "delete", value: false },
              ],
            },
          ],
        },
      ];
      await Role.insertMany(defaultRoles);
      console.log("Default roles created");
    }

    const adminUser = await User.findOne({ email: "root@issm.ai" });
    if (!adminUser) {
      const hashedPassword = bcrypt.hashSync("Root@123", 10);
      const defaultAdmin = new User({
        fullName: "Admin User",
        username: "root",
        email: "root@issm.ai",
        password: hashedPassword,
        role: "admin",
        isFirstLogin: false,
        onboardingCompleted: true,
      });
      await defaultAdmin.save();
      console.log("Default admin user created - Email: root@issm.ai, Password: Root@123");
    }
  } catch (error) {
    console.error("Error initializing default data:", error);
  }
};