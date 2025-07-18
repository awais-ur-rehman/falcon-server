import bcrypt from "bcryptjs";
import { User } from "../../models/User.js";
import { Resident } from "../../models/index.js";
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

    const adminUser = await User.findOne({ phoneNumber: "03001234568" });
    if (!adminUser) {
      const defaultAdmin = new User({
        username: "bilal",
        phoneNumber: "03001234568",
        password: null,
        role: "admin",
        isFirstLogin: true,
        cnic: null,
        houseNumber: "IH-702",
      });
      await defaultAdmin.save();

      const adminResident = new Resident({
        user: defaultAdmin._id,
        deviceID: "861234567890123",
      });
      await adminResident.save();

      console.log("Default admin user created - Phone: 03001234568, IMEI: 861234567890123");
    }

    const testUser = await User.findOne({ phoneNumber: "03009876543" });
    if (!testUser) {
      const newTestUser = new User({
        username: "testuser",
        phoneNumber: "03009876543",
        role: "user",
        isFirstLogin: true,
        password: "12345678",
        cnic: "81302-9898783-3",
        houseNumber: "A-101",
      });
      await newTestUser.save();

      const testResident = new Resident({
        user: newTestUser._id,
        deviceID: "869876543210987",
      });
      await testResident.save();

      console.log("Test user created - Phone: 03009876543, IMEI: 869876543210987 (requires first-time setup)");
    }

    const testUser2 = await User.findOne({ phoneNumber: "03001111111" });
    if (!testUser2) {
      const newTestUser2 = new User({
        username: "resident2",
        phoneNumber: "03001111111",
        role: "user",
        isFirstLogin: true,
        password: null,
        cnic: null,
        houseNumber: "B-205",
      });
      await newTestUser2.save();

      const testResident2 = new Resident({
        user: newTestUser2._id,
        deviceID: "861111111111111",
      });
      await testResident2.save();

      console.log("Second test user created - Phone: 03001111111, IMEI: 861111111111111 (requires first-time setup)");
    }

  } catch (error) {
    console.error("Error initializing default data:", error);
  }
};