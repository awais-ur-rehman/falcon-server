import { Document } from "mongoose";

export interface IPermission {
  name: "read" | "create" | "update" | "delete";
  value: boolean;
}

export interface IModulePermission {
  module: {
    _id: string;
  };
  permissions: IPermission[];
}

export interface IRole extends Document {
  _id: string;
  name: string;
  description: string;
  modulePermissions: IModulePermission[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}