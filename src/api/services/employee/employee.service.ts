import { Employee } from "../../models/User.js";
import { IEmployee, CreateEmployeeData, UpdateEmployeeData, PaginatedEmployeeResult } from "../../models/interfaces/employee.interface.js";
import { APIError } from "../../utils/apiError.js";

// Temporary function to manually fix employee roles
export const manuallyFixEmployeeRoles = async (): Promise<void> => {
    try {
        console.log("🔧 Starting manual employee role fix...");

        // Get all employees
        const allEmployees = await Employee.find().lean();
        console.log(`Found ${allEmployees.length} employees`);

        // Log current employee data
        allEmployees.forEach(emp => {
            console.log(`Employee: ${emp.username}, Role: ${emp.role}, Type: ${typeof emp.role}`);
        });

        // Get all roles
        const { Role } = await import("../../models/Role.js");
        const allRoles = await Role.find().lean();
        console.log(`Found ${allRoles.length} roles`);

        // Log current role data
        allRoles.forEach(role => {
            console.log(`Role: ${role.name}, ID: ${role._id}, Type: ${typeof role._id}`);
        });

        // Fix employees with string role values
        for (const employee of allEmployees) {
            if (typeof employee.role === 'string') {
                let targetRole;

                switch (employee.role) {
                    case "admin":
                        targetRole = allRoles.find(r => r.name === "Admin");
                        break;
                    case "manager":
                        targetRole = allRoles.find(r => r.name === "Manager");
                        break;
                    case "operator":
                        targetRole = allRoles.find(r => r.name === "Operator");
                        break;
                    default:
                        console.log(`Unknown role: ${employee.role} for employee ${employee.username}`);
                        continue;
                }

                if (targetRole) {
                    await Employee.findByIdAndUpdate(employee._id, { role: targetRole._id });
                    console.log(`✅ Fixed employee ${employee.username}: "${employee.role}" -> ${targetRole._id}`);
                } else {
                    console.log(`❌ Role not found for employee ${employee.username} with role "${employee.role}"`);
                }
            }
        }

        console.log("🔧 Manual employee role fix completed");
    } catch (error) {
        console.error("❌ Error in manual fix:", error);
    }
};


export const createEmployee = async (employeeData: CreateEmployeeData): Promise<IEmployee> => {
    try {
        // Check if employee with same username or email already exists
        const existingEmployee = await Employee.findOne({
            $or: [
                { username: employeeData.username },
                { email: employeeData.email },
                { phoneNumber: employeeData.phoneNumber }
            ]
        });

        if (existingEmployee) {
            throw new APIError("Employee with this username, email, or phone number already exists", 400);
        }

        const employee = new Employee(employeeData);
        await employee.save();

        return employee;
    } catch (error: any) {
        if (error instanceof APIError) throw error;
        throw new APIError("Failed to create employee", 500);
    }
};

export const getEmployeeById = async (id: string): Promise<IEmployee> => {
    try {
        const employee = await Employee.findById(id).populate('role', 'name description');

        if (!employee) {
            throw new APIError("Employee not found", 404);
        }

        return employee;
    } catch (error: any) {
        if (error instanceof APIError) throw error;
        throw new APIError("Failed to get employee", 500);
    }
};

export const getAllEmployeesPaginated = async (page: number = 1, limit: number = 20): Promise<PaginatedEmployeeResult> => {
    try {
        const skip = (page - 1) * limit;

        const [employees, total] = await Promise.all([
            Employee.find()
                .populate('role', 'name description _id')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Employee.countDocuments()
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            employees: employees as any, // Type assertion for populated data
            page,
            limit,
            total,
            totalPages
        };
    } catch (error: any) {
        console.error("Error in getAllEmployeesPaginated:", error);
        throw new APIError("Failed to get employees", 500);
    }
};

export const updateEmployee = async (id: string, updateData: UpdateEmployeeData): Promise<IEmployee> => {
    try {
        const employee = await Employee.findById(id);

        if (!employee) {
            throw new APIError("Employee not found", 404);
        }

        // Check if username, email, or phone number is being updated and if it conflicts
        if (updateData.username || updateData.email || updateData.phoneNumber) {
            const query: any = { _id: { $ne: id } };

            if (updateData.username) query.username = updateData.username;
            if (updateData.email) query.email = updateData.email;
            if (updateData.phoneNumber) query.phoneNumber = updateData.phoneNumber;

            const existingEmployee = await Employee.findOne(query);

            if (existingEmployee) {
                throw new APIError("Employee with this username, email, or phone number already exists", 400);
            }
        }

        // Hash password if it's being updated
        if (updateData.password) {
            const bcrypt = await import('bcryptjs');
            updateData.password = bcrypt.hashSync(updateData.password, 10);
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('role', 'name description');

        if (!updatedEmployee) {
            throw new APIError("Employee not found", 404);
        }

        return updatedEmployee;
    } catch (error: any) {
        if (error instanceof APIError) throw error;
        throw new APIError("Failed to update employee", 500);
    }
};

export const updateEmployeeRole = async (id: string, roleId: string): Promise<IEmployee> => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            id,
            { role: roleId },
            { new: true, runValidators: true }
        ).populate('role', 'name description');

        if (!employee) {
            throw new APIError("Employee not found", 404);
        }

        return employee;
    } catch (error: any) {
        if (error instanceof APIError) throw error;
        throw new APIError("Failed to update employee role", 500);
    }
};

export const deleteEmployee = async (id: string): Promise<void> => {
    try {
        const employee = await Employee.findByIdAndDelete(id);

        if (!employee) {
            throw new APIError("Employee not found", 404);
        }
    } catch (error: any) {
        if (error instanceof APIError) throw error;
        throw new APIError("Failed to delete employee", 500);
    }
};

