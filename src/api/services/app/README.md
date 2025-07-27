# App Initialization Services

This directory contains the initialization services for the Falcon application, organized into separate modules for better maintainability.

## 📁 File Structure

```
app/
├── appInitializer.ts      # Main initialization orchestrator
├── employeeInitializer.ts # Employee-specific initialization
├── residentInitializer.ts # Resident-specific initialization
└── README.md             # This documentation
```

## 🚀 Main Initializer (`appInitializer.ts`)

The main orchestrator that initializes all modules in the correct order:

1. **Modules** - System modules (Control Center, Access Control, etc.)
2. **Roles** - User roles with permissions (Admin, Manager, Operator)
3. **Employees** - Admin portal users
4. **Residents** - Mobile app users
5. **Announcements** - Community announcements
6. **Visitors** - Visitor management
7. **Complaints** - Resident complaints

## 👨‍💼 Employee Initializer (`employeeInitializer.ts`)

Handles all employee-related initialization and operations.

### Features:
- **Default Employees**: Creates admin, manager, operator, security officer, maintenance supervisor, receptionist
- **Role Management**: Links employees to appropriate roles
- **CRUD Operations**: Create, update, deactivate employees
- **Role Updates**: Change employee roles dynamically

### Default Employees:
```
Admin: admin@falcon.com / 12345678
Manager: manager@falcon.com / 12345678
Operator: operator@falcon.com / 12345678
Security Officer: security@falcon.com / 12345678
Maintenance Supervisor: maintenance@falcon.com / 12345678
Receptionist: reception@falcon.com / 12345678
```

### Functions:
- `initializeEmployees()` - Creates default employees
- `createEmployee(data)` - Creates a new employee
- `updateEmployeeRole(employeeId, roleId)` - Updates employee role
- `deactivateEmployee(employeeId)` - Deactivates an employee

## 🏠 Resident Initializer (`residentInitializer.ts`)

Handles all resident-related initialization and operations.

### Features:
- **Default Residents**: Creates 10 residents across different blocks
- **Device Management**: Links residents to device IDs
- **House Management**: Associates residents with house numbers
- **Block Operations**: Get residents by block or house number

### Default Residents:
```
Ahmed Khan: 03009876543 / 12345678 (A-101)
Fatima Ali: 03009876544 / 12345678 (A-102)
Muhammad Raza: 03009876545 / 12345678 (B-201)
Sara Ahmed: 03009876546 / 12345678 (B-202)
Ali Hassan: 03009876547 / 12345678 (C-301)
Ayesha Khan: 03009876548 / 12345678 (C-302)
Usman Ali: 03009876549 / 12345678 (D-401)
Nadia Ahmed: 03009876550 / 12345678 (D-402)
Hamza Khan: 03009876551 / 12345678 (E-501)
Zara Ali: 03009876552 / 12345678 (E-502)
```

### Functions:
- `initializeResidents()` - Creates default residents
- `createResident(data)` - Creates a new resident
- `updateResidentDevice(residentId, deviceID)` - Updates resident device
- `deactivateResident(residentId)` - Deactivates a resident
- `getResidentsByBlock(block)` - Gets all residents in a block
- `getResidentByHouseNumber(houseNumber)` - Gets resident by house number

## 🔧 Usage

### Automatic Initialization
The main initializer runs automatically when the application starts:

```typescript
// In your main application file
import { initializeDefaultData } from './services/app/appInitializer.js';

// This will initialize everything
await initializeDefaultData();
```

### Manual Initialization
You can also run individual initializers:

```typescript
import { initializeEmployees } from './services/app/employeeInitializer.js';
import { initializeResidents } from './services/app/residentInitializer.js';

// Initialize only employees
await initializeEmployees();

// Initialize only residents
await initializeResidents();
```

### Creating New Users
```typescript
import { createEmployee } from './services/app/employeeInitializer.js';
import { createResident } from './services/app/residentInitializer.js';

// Create a new employee
await createEmployee({
  username: "new_employee",
  email: "new@falcon.com",
  phoneNumber: "03001234567",
  password: "password123",
  roleId: "manager",
  cnic: "81302-1234567-1"
});

// Create a new resident
await createResident({
  username: "new_resident",
  phoneNumber: "03009876540",
  password: "password123",
  deviceID: "861234567890999",
  houseNumber: "F-601",
  cnic: "81302-1234567-2"
});
```

## 🔐 Security Notes

- All passwords are hashed using bcrypt with salt rounds of 10
- Role references are validated before assignment
- Device IDs and house numbers are unique per resident
- Email addresses are unique per employee

## 📊 Database Structure

### Employees Collection:
- `username` (unique)
- `email` (unique)
- `phoneNumber` (unique)
- `password` (hashed)
- `role` (ObjectId reference to Role)
- `cnic`
- `isActive`
- `isFirstLogin`

### Residents Collection:
- `username` (unique)
- `phoneNumber` (unique)
- `password` (hashed)
- `deviceID` (unique)
- `houseNumber` (unique)
- `cnic`
- `isActive`
- `isFirstLogin`

## 🚨 Error Handling

All functions include proper error handling and logging:
- Validation errors are caught and logged
- Database errors are handled gracefully
- Missing dependencies (like roles) are detected
- Duplicate entries are prevented

## 🔄 Maintenance

To update the initialization data:
1. Modify the respective initializer file
2. Clear the database collections you want to reinitialize
3. Restart the application

The initializers check if data already exists and skip creation if found, so they're safe to run multiple times. 