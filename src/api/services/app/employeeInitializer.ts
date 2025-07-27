import bcrypt from "bcryptjs";
import { Employee } from "../../models/User.js";
import { Role } from "../../models/Role.js";

export const initializeEmployees = async (): Promise<void> => {
    try {
        const employeeCount = await Employee.countDocuments();
        if (employeeCount === 0) {
            const hashedPassword = bcrypt.hashSync("12345678", 10);

            // Verify roles exist first
            const adminRole = await Role.findOne({ name: "Admin" });
            const managerRole = await Role.findOne({ name: "Manager" });
            const operatorRole = await Role.findOne({ name: "Operator" });

            if (!adminRole || !managerRole || !operatorRole) {
                console.error("❌ Required roles not found. Please ensure roles are created first.");
                const availableRoles = await Role.find({}, '_id name');
                console.log("Available roles:", availableRoles);
                return;
            }

            console.log("✅ Found roles:", {
                admin: { id: adminRole._id, name: adminRole.name },
                manager: { id: managerRole._id, name: managerRole.name },
                operator: { id: operatorRole._id, name: operatorRole.name }
            });

            const defaultEmployees = [
                {
                    username: "admin",
                    email: "admin@falcon.com",
                    phoneNumber: "03001234568",
                    password: hashedPassword,
                    role: adminRole._id,
                    isFirstLogin: false,
                    isActive: true,
                    cnic: "81302-9898783-3",
                },
                {
                    username: "manager",
                    email: "manager@falcon.com",
                    phoneNumber: "03001234569",
                    password: hashedPassword,
                    role: managerRole._id,
                    isFirstLogin: false,
                    isActive: true,
                    cnic: "81302-9898783-4",
                },
                {
                    username: "operator",
                    email: "operator@falcon.com",
                    phoneNumber: "03001234570",
                    password: hashedPassword,
                    role: operatorRole._id,
                    isFirstLogin: false,
                    isActive: true,
                    cnic: "81302-9898783-5",
                },
                {
                    username: "security_officer",
                    email: "security@falcon.com",
                    phoneNumber: "03001234571",
                    password: hashedPassword,
                    role: operatorRole._id,
                    isFirstLogin: false,
                    isActive: true,
                    cnic: "81302-9898783-6",
                },
                {
                    username: "maintenance_supervisor",
                    email: "maintenance@falcon.com",
                    phoneNumber: "03001234572",
                    password: hashedPassword,
                    role: managerRole._id,
                    isFirstLogin: false,
                    isActive: true,
                    cnic: "81302-9898783-7",
                },
                {
                    username: "receptionist",
                    email: "reception@falcon.com",
                    phoneNumber: "03001234573",
                    password: hashedPassword,
                    role: operatorRole._id,
                    isFirstLogin: false,
                    isActive: true,
                    cnic: "81302-9898783-8",
                },
            ];

            await Employee.insertMany(defaultEmployees);
            console.log("👨‍💼 Default employees created");
            console.log("🔑 Login credentials:");
            console.log("   Admin: admin@falcon.com / 12345678");
            console.log("   Manager: manager@falcon.com / 12345678");
            console.log("   Operator: operator@falcon.com / 12345678");
            console.log("   Security Officer: security@falcon.com / 12345678");
            console.log("   Maintenance Supervisor: maintenance@falcon.com / 12345678");
            console.log("   Receptionist: reception@falcon.com / 12345678");
        } else {
            console.log("👨‍💼 Employees already exist, skipping initialization");
        }
    } catch (error) {
        console.error("❌ Error initializing employees:", error);
    }
};

export const createEmployee = async (employeeData: {
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    roleId: string;
    cnic?: string;
}): Promise<void> => {
    try {
        const hashedPassword = bcrypt.hashSync(employeeData.password, 10);
        const role = await Role.findById(employeeData.roleId);

        if (!role) {
            throw new Error(`Role with ID ${employeeData.roleId} not found`);
        }

        const employee = new Employee({
            username: employeeData.username,
            email: employeeData.email,
            phoneNumber: employeeData.phoneNumber,
            password: hashedPassword,
            role: role._id,
            isFirstLogin: false,
            isActive: true,
            cnic: employeeData.cnic,
        });

        await employee.save();
        console.log(`✅ Employee ${employeeData.username} created successfully`);
    } catch (error) {
        console.error(`❌ Error creating employee ${employeeData.username}:`, error);
        throw error;
    }
};

export const updateEmployeeRole = async (employeeId: string, roleId: string): Promise<void> => {
    try {
        const role = await Role.findById(roleId);
        if (!role) {
            throw new Error(`Role with ID ${roleId} not found`);
        }

        await Employee.findByIdAndUpdate(employeeId, { role: role._id });
        console.log(`✅ Employee role updated successfully`);
    } catch (error) {
        console.error("❌ Error updating employee role:", error);
        throw error;
    }
};

export const deactivateEmployee = async (employeeId: string): Promise<void> => {
    try {
        await Employee.findByIdAndUpdate(employeeId, { isActive: false });
        console.log(`✅ Employee deactivated successfully`);
    } catch (error) {
        console.error("❌ Error deactivating employee:", error);
        throw error;
    }
};

// Migration function to fix existing employee role references
export const migrateEmployeeRoles = async (): Promise<void> => {
    try {
        // Get all employees with string role values
        const employeesWithStringRoles = await Employee.find({
            role: { $type: "string" }
        });

        console.log(`Found ${employeesWithStringRoles.length} employees with string role values`);

        for (const employee of employeesWithStringRoles) {
            let roleId;

            // Map string role names to role ObjectIds
            switch (employee.role) {
                case "admin":
                    const adminRole = await Role.findOne({ name: "Admin" });
                    roleId = adminRole?._id;
                    break;
                case "manager":
                    const managerRole = await Role.findOne({ name: "Manager" });
                    roleId = managerRole?._id;
                    break;
                case "operator":
                    const operatorRole = await Role.findOne({ name: "Operator" });
                    roleId = operatorRole?._id;
                    break;
                default:
                    console.log(`Unknown role: ${employee.role} for employee ${employee.username}`);
                    continue;
            }

            if (roleId) {
                await Employee.findByIdAndUpdate(employee._id, { role: roleId });
                console.log(`Updated employee ${employee.username} role from "${employee.role}" to ObjectId`);
            } else {
                console.log(`Role not found for employee ${employee.username} with role "${employee.role}"`);
            }
        }

        console.log("Employee role migration completed");
    } catch (error: any) {
        console.error("Error migrating employee roles:", error);
        throw error;
    }
}; 