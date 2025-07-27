# Model Interfaces

This directory contains TypeScript interfaces for all data models in the Falcon application, organized by entity type for better maintainability.

## 📁 File Structure

```
interfaces/
├── employee.interface.ts    # Employee-related interfaces
├── resident.interface.ts    # Resident-related interfaces
├── user.interface.ts        # Legacy user interface (backward compatibility)
└── README.md               # This documentation
```

## 👨‍💼 Employee Interfaces (`employee.interface.ts`)

### Core Interface
- **`IEmployee`**: Main employee document interface with all fields

### Data Transfer Interfaces
- **`CreateEmployeeData`**: Interface for creating new employees
- **`UpdateEmployeeData`**: Interface for updating existing employees
- **`EmployeeFilters`**: Interface for filtering employee queries

### Specialized Interfaces
- **`IEmployeeWithRole`**: Employee with populated role object
- **`PaginatedEmployeeResult`**: Paginated employee results

### Usage Example
```typescript
import { 
  IEmployee, 
  CreateEmployeeData, 
  UpdateEmployeeData,
  EmployeeFilters 
} from './employee.interface.js';

// Creating a new employee
const newEmployee: CreateEmployeeData = {
  username: "john_doe",
  email: "john@falcon.com",
  phoneNumber: "03001234567",
  password: "securepassword",
  role: "manager",
  cnic: "81302-1234567-1"
};

// Updating an employee
const updateData: UpdateEmployeeData = {
  email: "john.updated@falcon.com",
  isActive: false
};

// Filtering employees
const filters: EmployeeFilters = {
  role: "admin",
  isActive: true
};
```

## 🏠 Resident Interfaces (`resident.interface.ts`)

### Core Interface
- **`IResident`**: Main resident document interface with all fields

### Data Transfer Interfaces
- **`CreateResidentData`**: Interface for creating new residents
- **`UpdateResidentData`**: Interface for updating existing residents
- **`ResidentFilters`**: Interface for filtering resident queries

### Specialized Interfaces
- **`IResidentSummary`**: Lightweight resident data for lists
- **`PaginatedResidentResult`**: Paginated resident results
- **`ResidentByBlock`**: Residents grouped by block
- **`ResidentDeviceUpdate`**: Device update tracking

### Usage Example
```typescript
import { 
  IResident, 
  CreateResidentData, 
  UpdateResidentData,
  ResidentFilters 
} from './resident.interface.js';

// Creating a new resident
const newResident: CreateResidentData = {
  username: "ahmed_khan",
  phoneNumber: "03009876543",
  password: "securepassword",
  deviceID: "861234567890123",
  houseNumber: "A-101",
  cnic: "81302-1234567-1"
};

// Updating a resident
const updateData: UpdateResidentData = {
  deviceID: "861234567890124",
  isActive: false
};

// Filtering residents
const filters: ResidentFilters = {
  houseNumber: "A-",
  isActive: true
};
```

## 👤 Legacy User Interface (`user.interface.ts`)

### Backward Compatibility
- **`IUser`**: Legacy interface for backward compatibility
- Maintains compatibility with existing code that references `IUser`
- **Note**: For new development, use specific `IEmployee` or `IResident` interfaces

### Usage
```typescript
import { IUser } from './user.interface.js';

// Legacy usage (not recommended for new code)
const legacyUser: IUser = {
  // ... user properties
};
```

## 🔧 Key Features

### Type Safety
- **Strict typing**: All interfaces enforce proper data types
- **Required vs Optional**: Clear distinction between required and optional fields
- **Validation**: Interfaces help catch errors at compile time

### Separation of Concerns
- **Entity-specific**: Each entity has its own interface file
- **CRUD operations**: Separate interfaces for create, update, and filter operations
- **Specialized use cases**: Interfaces for specific scenarios (e.g., populated data, summaries)

### Extensibility
- **Easy to extend**: Add new interfaces without affecting existing ones
- **Backward compatibility**: Legacy interfaces maintained for existing code
- **Version control**: Clear interface evolution tracking

## 📊 Interface Comparison

| Feature | Employee | Resident | Legacy User |
|---------|----------|----------|-------------|
| Email | ✅ Required | ❌ Not applicable | ❌ Not applicable |
| Role | ✅ Required (ObjectId) | ❌ Not applicable | ❌ Optional |
| Device ID | ❌ Not applicable | ✅ Required | ❌ Not applicable |
| House Number | ❌ Not applicable | ✅ Required | ❌ Not applicable |
| Phone Number | ✅ Required | ✅ Required | ✅ Required |
| CNIC | ❌ Optional | ❌ Optional | ❌ Optional |

## 🚀 Best Practices

### 1. Use Specific Interfaces
```typescript
// ✅ Good - Use specific interface
import { IEmployee } from './employee.interface.js';

// ❌ Avoid - Use legacy interface for new code
import { IUser } from './user.interface.js';
```

### 2. Import Only What You Need
```typescript
// ✅ Good - Import specific interfaces
import { CreateEmployeeData, UpdateEmployeeData } from './employee.interface.js';

// ❌ Avoid - Import everything
import * as EmployeeInterfaces from './employee.interface.js';
```

### 3. Use Appropriate Interfaces for Operations
```typescript
// ✅ Good - Use specific interfaces for operations
function createEmployee(data: CreateEmployeeData) { ... }
function updateEmployee(data: UpdateEmployeeData) { ... }
function filterEmployees(filters: EmployeeFilters) { ... }
```

### 4. Handle Optional Fields Properly
```typescript
// ✅ Good - Check optional fields
if (employee.cnic) {
  // Use employee.cnic
}

// ❌ Avoid - Assume optional fields exist
const cnic = employee.cnic; // Could be undefined
```

## 🔄 Migration Guide

### From Legacy to Specific Interfaces

1. **Identify usage**: Find where `IUser` is used
2. **Determine entity type**: Is it an employee or resident?
3. **Update imports**: Import specific interface
4. **Update type annotations**: Change `IUser` to `IEmployee` or `IResident`
5. **Handle field differences**: Add/remove fields as needed

### Example Migration
```typescript
// Before (Legacy)
import { IUser } from './user.interface.js';
const user: IUser = { ... };

// After (Specific)
import { IEmployee } from './employee.interface.js';
const employee: IEmployee = { 
  ...user,
  email: "required@email.com", // Add required field
  role: "admin" // Add required field
};
```

## 🚨 Common Issues

### 1. Missing Required Fields
```typescript
// ❌ Error - Missing required fields
const employee: CreateEmployeeData = {
  username: "john",
  // Missing email, phoneNumber, password, role
};

// ✅ Correct - All required fields provided
const employee: CreateEmployeeData = {
  username: "john",
  email: "john@falcon.com",
  phoneNumber: "03001234567",
  password: "securepassword",
  role: "admin"
};
```

### 2. Wrong Interface for Operation
```typescript
// ❌ Error - Using document interface for creation
const newEmployee: IEmployee = { ... };

// ✅ Correct - Using creation interface
const newEmployee: CreateEmployeeData = { ... };
```

### 3. Type Mismatch
```typescript
// ❌ Error - String instead of ObjectId
const employee: IEmployee = {
  role: "admin" // Should be ObjectId
};

// ✅ Correct - Proper ObjectId
const employee: IEmployee = {
  role: "507f1f77bcf86cd799439011" // ObjectId string
};
```

This interface structure provides a solid foundation for type-safe development while maintaining flexibility and backward compatibility. 