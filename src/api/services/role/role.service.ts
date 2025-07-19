import { Role } from "../../models/Role.js";
import { IRole } from "../../models/interfaces/role.interface.js";
import { APIError } from "../../utils/apiError.js";

export const getRoleById = async (roleId: string): Promise<IRole> => {
  const role = await Role.findOne({ _id: roleId, isActive: true });

  if (!role) {
    throw new APIError("Role not found", 404);
  }

  return role;
};

export const getAllRoles = async (): Promise<IRole[]> => {
  const roles = await Role.find({ isActive: true }).sort({ name: 1 });
  return roles;
};

export const getAllRolesPaginated = async (page: number, limit: number): Promise<{
  roles: IRole[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}> => {
  const skip = (page - 1) * limit;

  const [roles, total] = await Promise.all([
    Role.find({ isActive: true })
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit),
    Role.countDocuments({ isActive: true }),
  ]);

  return {
    roles,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const createRole = async (roleData: Partial<IRole>): Promise<IRole> => {
  const existingRole = await Role.findOne({ _id: roleData._id });

  if (existingRole) {
    throw new APIError("Role with this ID already exists", 409);
  }

  const newRole = new Role(roleData);
  await newRole.save();
  return newRole;
};

export const updateRole = async (
  roleId: string,
  updateData: Partial<IRole>
): Promise<IRole> => {
  const role = await Role.findOneAndUpdate(
    { _id: roleId },
    { ...updateData, updatedAt: new Date() },
    { new: true }
  );

  if (!role) {
    throw new APIError("Role not found", 404);
  }

  return role;
};

export const deleteRole = async (roleId: string): Promise<void> => {
  const role = await Role.findOneAndUpdate(
    { _id: roleId },
    { isActive: false, updatedAt: new Date() },
    { new: true }
  );

  if (!role) {
    throw new APIError("Role not found", 404);
  }
};