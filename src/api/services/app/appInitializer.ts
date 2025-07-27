import { Employee, Resident } from "../../models/User.js";
import { Module } from "../../models/Module.js";
import { Role } from "../../models/Role.js";
import { Announcement } from "../../models/Announcement.js";
import { Visitor } from "../../models/Visitor.js";
import { Complaint } from "../../models/Complaint.js";
import { initializeEmployees } from "./employeeInitializer.js";
import { initializeResidents } from "./residentInitializer.js";
import bcrypt from "bcryptjs";

export const initializeDefaultData = async (): Promise<void> => {
  try {
    console.log("🚀 Starting application initialization...");

    // 1. Initialize Modules
    await initializeModules();

    // 2. Initialize Roles
    await initializeRoles();

    // 3. Initialize Employees (Admin Portal Users)
    await initializeEmployees();

    // 4. Migrate existing employee roles if needed
    const { migrateEmployeeRoles } = await import("./employeeInitializer.js");
    await migrateEmployeeRoles();

    // 4. Initialize Residents (Mobile App Users)
    await initializeResidents();

    // 5. Initialize Announcements
    await initializeAnnouncements();

    // 6. Initialize Visitors
    await initializeVisitors();

    // 7. Initialize Complaints
    await initializeComplaints();

    console.log("✅ Application initialization completed successfully!");
  } catch (error) {
    console.error("❌ Error initializing default data:", error);
  }
};

const initializeModules = async (): Promise<void> => {
  const moduleCount = await Module.countDocuments();
  if (moduleCount === 0) {
    const defaultModules = [
      {
        _id: "control_center_id",
        name: "Control Center",
        description: "Main dashboard and system overview",
      },
      {
        _id: "access_control_id",
        name: "Access Control",
        description: "Manage employees, roles, and permissions",
      },
      {
        _id: "residents_id",
        name: "Residents",
        description: "Manage resident information and profiles",
      },
      {
        _id: "visitors_id",
        name: "Visitors",
        description: "Manage visitor entries and records",
      },
      {
        _id: "announcements_id",
        name: "Announcements",
        description: "Manage community announcements and notifications",
      },
      {
        _id: "complaints_id",
        name: "Complaints",
        description: "Manage resident complaints and feedback",
      },
    ];
    await Module.insertMany(defaultModules);
    console.log("📋 Default modules created");
  }
};

const initializeRoles = async (): Promise<void> => {
  const roleCount = await Role.countDocuments();
  if (roleCount === 0) {
    const defaultRoles = [
      {
        name: "Admin",
        description: "Full system access with all permissions",
        modulePermissions: [
          {
            module: { _id: "control_center_id" },
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
          {
            module: { _id: "residents_id" },
            permissions: [
              { name: "read", value: true },
              { name: "create", value: true },
              { name: "update", value: true },
              { name: "delete", value: true },
            ],
          },
          {
            module: { _id: "visitors_id" },
            permissions: [
              { name: "read", value: true },
              { name: "create", value: true },
              { name: "update", value: true },
              { name: "delete", value: true },
            ],
          },
          {
            module: { _id: "announcements_id" },
            permissions: [
              { name: "read", value: true },
              { name: "create", value: true },
              { name: "update", value: true },
              { name: "delete", value: true },
            ],
          },
          {
            module: { _id: "complaints_id" },
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
        name: "Manager",
        description: "Department manager with limited admin access",
        modulePermissions: [
          {
            module: { _id: "control_center_id" },
            permissions: [
              { name: "read", value: true },
              { name: "create", value: false },
              { name: "update", value: false },
              { name: "delete", value: false },
            ],
          },
          {
            module: { _id: "access_control_id" },
            permissions: [
              { name: "read", value: true },
              { name: "create", value: true },
              { name: "update", value: true },
              { name: "delete", value: false },
            ],
          },
          {
            module: { _id: "residents_id" },
            permissions: [
              { name: "read", value: true },
              { name: "create", value: true },
              { name: "update", value: true },
              { name: "delete", value: false },
            ],
          },
          {
            module: { _id: "visitors_id" },
            permissions: [
              { name: "read", value: true },
              { name: "create", value: true },
              { name: "update", value: true },
              { name: "delete", value: false },
            ],
          },
          {
            module: { _id: "announcements_id" },
            permissions: [
              { name: "read", value: true },
              { name: "create", value: true },
              { name: "update", value: true },
              { name: "delete", value: false },
            ],
          },
          {
            module: { _id: "complaints_id" },
            permissions: [
              { name: "read", value: true },
              { name: "create", value: true },
              { name: "update", value: true },
              { name: "delete", value: false },
            ],
          },
        ],
      },
      {
        name: "Operator",
        description: "Basic operator with read and create permissions",
        modulePermissions: [
          {
            module: { _id: "control_center_id" },
            permissions: [
              { name: "read", value: true },
              { name: "create", value: false },
              { name: "update", value: false },
              { name: "delete", value: false },
            ],
          },
          {
            module: { _id: "visitors_id" },
            permissions: [
              { name: "read", value: true },
              { name: "create", value: true },
              { name: "update", value: false },
              { name: "delete", value: false },
            ],
          },
          {
            module: { _id: "announcements_id" },
            permissions: [
              { name: "read", value: true },
              { name: "create", value: true },
              { name: "update", value: false },
              { name: "delete", value: false },
            ],
          },
          {
            module: { _id: "complaints_id" },
            permissions: [
              { name: "read", value: true },
              { name: "create", value: true },
              { name: "update", value: false },
              { name: "delete", value: false },
            ],
          },
        ],
      },
    ];
    await Role.insertMany(defaultRoles);
    console.log("👥 Default roles created");
  }
};





const initializeAnnouncements = async (): Promise<void> => {
  const announcementCount = await Announcement.countDocuments();
  if (announcementCount === 0) {
    const adminEmployee = await Employee.findOne({ username: "admin" });
    const adminId = adminEmployee ? adminEmployee._id : undefined;

    const dummyAnnouncements = [
      {
        userId: adminId,
        title: "🛠️ Maintenance Notice - Water Supply",
        content: "Water supply will be temporarily suspended from 2:00 PM to 4:00 PM tomorrow due to scheduled maintenance. Please store water for essential use. We apologize for any inconvenience.",
        images: [],
        isActive: true,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        userId: adminId,
        title: "🏘️ Community Meeting - June 10th",
        content: "Monthly community meeting will be held on June 10th at 5:00 PM in the clubhouse. Agenda includes security updates, maintenance schedules, and resident feedback. All residents are welcome to attend.",
        images: [],
        isActive: true,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        userId: adminId,
        title: "🚨 Security Alert - Vehicle Safety",
        content: "Please ensure your vehicles are properly locked and valuables are not left in plain sight. Security patrols have been increased this week. Report any suspicious activity immediately.",
        images: [],
        isActive: true,
        date: new Date(),
      },
      {
        userId: adminId,
        title: "🎉 Eid Celebration - Community Event",
        content: "Join us for Eid celebration on the community grounds. Food stalls, games, and activities for children. Event starts at 6:00 PM. All residents and their families are invited.",
        images: [],
        isActive: false,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        userId: adminId,
        title: "📢 New Gym Equipment Installation",
        content: "New gym equipment will be installed in the fitness center this weekend. The gym will be closed from Friday 6 PM to Sunday 6 PM. Thank you for your patience.",
        images: [],
        isActive: true,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
    ];

    await Announcement.insertMany(dummyAnnouncements);
    console.log("📢 Dummy announcements created");
  }
};

const initializeVisitors = async (): Promise<void> => {
  const visitorCount = await Visitor.countDocuments();
  if (visitorCount === 0) {
    // Get the first resident to assign visitors to
    const firstResident = await Resident.findOne();
    const residentId = firstResident ? firstResident._id : undefined;

    if (!residentId) {
      console.log("⚠️ No residents found, skipping visitor initialization");
      return;
    }

    const dummyVisitors = [
      {
        residentId: residentId,
        visitorName: "Ahmed Khan",
        visitorType: "Guest",
        vehicleType: "Car",
        vehcileNumber: "ABC-123",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        entryCode: "V001",
      },
      {
        residentId: residentId,
        visitorName: "Fatima Ali",
        visitorType: "Delivery",
        vehicleType: "Bike",
        vehcileNumber: "XYZ-789",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        entryCode: "V002",
      },
      {
        residentId: residentId,
        visitorName: "Muhammad Raza",
        visitorType: "Service Provider",
        vehicleType: "Pickup",
        vehcileNumber: "DEF-456",
        date: new Date(),
        entryCode: "V003",
      },
      {
        residentId: residentId,
        visitorName: "Sara Ahmed",
        visitorType: "Guest",
        vehicleType: "Car",
        vehcileNumber: "GHI-789",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        entryCode: "V004",
      },
      {
        residentId: residentId,
        visitorName: "Ali Hassan",
        visitorType: "Cab Driver",
        vehicleType: "Car",
        vehcileNumber: "JKL-012",
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        entryCode: "V005",
      },
    ];

    await Visitor.insertMany(dummyVisitors);
    console.log("👥 Dummy visitors created");
  }
};

const initializeComplaints = async (): Promise<void> => {
  const complaintCount = await Complaint.countDocuments();
  if (complaintCount === 0) {
    // Find a resident to associate complaints with
    const resident = await Resident.findOne();
    const residentId = resident ? resident._id : undefined;

    if (!residentId) {
      console.log("⚠️ No residents found. Skipping complaint initialization.");
      return;
    }

    const dummyComplaints = [
      {
        userId: residentId,
        title: "Water Pressure Issue",
        description: "Water pressure is very low in house A-101. Unable to take proper shower. This has been affecting our daily routine for the past week.",
        images: [],
        status: "Pending",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        userId: residentId,
        title: "Noise Complaint",
        description: "Excessive noise from construction work in Block C during late hours. The construction starts at 6 AM and continues until 10 PM, making it impossible to sleep or work from home.",
        images: [],
        status: "In Progress",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        userId: residentId,
        title: "Garbage Collection",
        description: "Garbage not collected from house B-202 for the past 3 days. The bins are overflowing and creating a health hazard.",
        images: [],
        status: "Resolved",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        userId: residentId,
        title: "Security Concern",
        description: "Suspicious person loitering around the parking area. This person has been seen multiple times in the last few days without any apparent reason.",
        images: [],
        status: "Pending",
        date: new Date(),
      },
      {
        userId: residentId,
        title: "Electricity Issue",
        description: "Frequent power outages in Block A affecting daily activities. The power goes out 3-4 times a day for 10-15 minutes each time.",
        images: [],
        status: "In Progress",
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        userId: residentId,
        title: "Parking Space Problem",
        description: "Someone is parking in my assigned parking space. This has been happening for the past week and I have to park outside the complex.",
        images: [],
        status: "Pending",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        userId: residentId,
        title: "Elevator Maintenance",
        description: "Elevator in Block B is making strange noises and sometimes gets stuck between floors. This is a safety concern.",
        images: [],
        status: "Resolved",
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        userId: residentId,
        title: "Internet Connectivity",
        description: "Poor internet connectivity in the common areas. The WiFi signal is very weak and keeps disconnecting.",
        images: [],
        status: "Rejected",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ];

    await Complaint.insertMany(dummyComplaints);
    console.log("📝 Dummy complaints created");
  }
};