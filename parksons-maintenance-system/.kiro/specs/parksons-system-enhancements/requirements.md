# Requirements Document

## Introduction

This document defines requirements for three targeted enhancements to the Parksons Maintenance System (Google Apps Script + HTML web app):

1. **Persistent Machine Data Management** — Move hardcoded machine data into a dedicated `Machine_Data` Google Sheet tab, with full CRUD from the Admin panel and dynamic loading in the maintenance form.
2. **Multi-level Admin Panel Access** — Add a Supervisor role below the existing Super Admin, stored in an `Admin_Users` sheet, with role-based UI in the Admin panel.
3. **Daily Data Export Email** — A scheduled function triggered at 9 AM IST that sends the full `Raw_Data` sheet as a CSV attachment to a configurable list of recipients.

---

## Glossary

- **System**: The Parksons Maintenance System (Google Apps Script web app)
- **Machine_Data_Sheet**: The Google Sheet tab named `Machine_Data` that stores machine type, name, and unit data
- **Admin_Users_Sheet**: The Google Sheet tab named `Admin_Users` that stores admin credentials and roles
- **Raw_Data_Sheet**: The existing Google Sheet tab named `Raw_Data` containing all maintenance form submissions
- **Form**: The `Parksons_Maintenance_Form_v4.html` frontend used by operators to submit maintenance entries
- **Admin_Panel**: The `Admin.html` frontend used by administrators to manage entries and system data
- **Super_Admin**: An administrator with full system access, including machine data and user management
- **Supervisor**: An administrator with limited access — can view, approve, edit, and reject entries only
- **Export_Trigger**: The time-driven Google Apps Script trigger that fires daily at 9 AM IST
- **CSV_Exporter**: The `sendDailyDataExport()` function responsible for building and emailing the CSV export
- **Machine_CRUD**: The backend functions (`getMachineData`, `saveMachineData`, `deleteMachineData`) that manage machine data
- **User_CRUD**: The backend functions (`getAdminUsers`, `saveAdminUser`, `deleteAdminUser`) that manage admin users
- **Auth_Handler**: The `loginAdmin()` backend function that validates admin credentials
- **CONFIG**: The configuration object in `Code.gs` containing system-wide settings including email recipients and sheet names

---

## Requirements

### Requirement 1: Machine Data Sheet Initialization

**User Story:** As a Super Admin, I want machine data to be stored in a Google Sheet, so that it persists across deployments and can be managed without editing code.

#### Acceptance Criteria

1. WHEN the `getMachineData` action is called and the `Machine_Data_Sheet` does not exist, THE System SHALL create the `Machine_Data_Sheet` and seed it with the existing hardcoded machine data.
2. THE `Machine_Data_Sheet` SHALL store each machine entry as a row with columns: `machine_type`, `machine_name`, and `units` (comma-separated string).
3. THE System SHALL support multiple machine names under the same machine type by storing each as a separate row.
4. WHEN the `Machine_Data_Sheet` already contains data, THE System SHALL skip the seeding step and leave existing data unchanged.

---

### Requirement 2: Machine Data Read API

**User Story:** As a form user, I want the maintenance form to load machine options from the sheet, so that the dropdown always reflects the current machine list.

#### Acceptance Criteria

1. WHEN a GET request with `action=getMachineData` is received, THE Machine_CRUD SHALL read all rows from the `Machine_Data_Sheet` and return a nested object grouped by machine type.
2. THE Machine_CRUD SHALL return the response in the format `{ status: 'success', machines: { "TYPE": { "NAME": ["unit1", ...] } } }`.
3. IF the `Machine_Data_Sheet` is empty or missing, THEN THE Machine_CRUD SHALL trigger sheet initialization before returning data.
4. WHEN the Form loads, THE Form SHALL call `getMachineData` and use the returned data to populate the Machine Type dropdown.
5. IF the `getMachineData` call fails, THEN THE Form SHALL fall back to the hardcoded `MACHINES` constant and log a console warning.
6. WHILE the Form is waiting for `getMachineData` to respond, THE Form SHALL display a loading state on the Machine Type dropdown.

---

### Requirement 3: Machine Data Write API

**User Story:** As a Super Admin, I want to add and update machine entries from the Admin panel, so that I can keep the machine list accurate without editing code.

#### Acceptance Criteria

1. WHEN a GET request with `action=saveMachineData` and parameters `machineType`, `machineName`, and `units` is received, THE Machine_CRUD SHALL write or update the corresponding row in the `Machine_Data_Sheet`.
2. IF a row with the same `machineName` already exists, THEN THE Machine_CRUD SHALL update that row's `machineType` and `units` values.
3. IF no row with the given `machineName` exists, THEN THE Machine_CRUD SHALL append a new row.
4. WHEN a save operation succeeds, THE Machine_CRUD SHALL return `{ status: 'success' }`.
5. WHEN a GET request with `action=deleteMachineData` and parameters `machineType` and `machineName` is received, THE Machine_CRUD SHALL remove the matching row from the `Machine_Data_Sheet`.
6. WHEN a delete operation succeeds, THE Machine_CRUD SHALL return `{ status: 'success' }`.

---

### Requirement 4: Machine Data Admin UI

**User Story:** As a Super Admin, I want a Machine Data tab in the Admin panel, so that I can add, edit, and delete machines through a UI.

#### Acceptance Criteria

1. THE Admin_Panel SHALL display a "Machine Data" tab that is visible only to Super Admin users.
2. WHEN the "Machine Data" tab is opened, THE Admin_Panel SHALL fetch and display all machine entries in a table showing machine type, machine name, and units.
3. THE Admin_Panel SHALL provide an "Add Machine" form with fields for machine type, machine name, and units.
4. WHEN a Super Admin submits the "Add Machine" form, THE Admin_Panel SHALL call `saveMachineData` and refresh the machine table on success.
5. WHEN a Super Admin clicks a machine row to edit, THE Admin_Panel SHALL allow inline editing of the units field and call `saveMachineData` on save.
6. THE Admin_Panel SHALL display a Delete button per machine row with a confirmation prompt before calling `deleteMachineData`.

---

### Requirement 5: Admin Users Sheet Initialization

**User Story:** As a Super Admin, I want admin user credentials to be stored in a Google Sheet, so that new supervisors can be added without code changes.

#### Acceptance Criteria

1. WHEN the `loginAdmin` action is called and the `Admin_Users_Sheet` does not exist, THE System SHALL create the `Admin_Users_Sheet` and seed it with the Super Admin account (`yogeshkp85@gmail.com`, level `superadmin`).
2. THE `Admin_Users_Sheet` SHALL store each user as a row with columns: `name`, `email`, `password`, and `level`.
3. THE System SHALL support two level values: `superadmin` and `supervisor`.
4. WHEN the `Admin_Users_Sheet` already contains data, THE System SHALL skip the seeding step and leave existing data unchanged.

---

### Requirement 6: Admin Login

**User Story:** As an admin user, I want to log in with my email and password, so that the system can identify my role and show the appropriate interface.

#### Acceptance Criteria

1. WHEN a GET request with `action=loginAdmin`, `email`, and `password` parameters is received, THE Auth_Handler SHALL look up the email in the `Admin_Users_Sheet`.
2. IF the email is found and the password matches, THEN THE Auth_Handler SHALL return `{ status: 'success', user: { name, email, level } }`.
3. IF the email is not found or the password does not match, THEN THE Auth_Handler SHALL return `{ status: 'error', message: 'Invalid credentials' }`.
4. WHEN login succeeds, THE Admin_Panel SHALL store the returned user object in `sessionStorage` under the key `pks_admin_user`.
5. WHEN login fails, THE Admin_Panel SHALL display an inline error message without redirecting.
6. THE Admin_Panel SHALL replace the existing single-password login field with an email and password login form.

---

### Requirement 7: Role-Based Tab Visibility

**User Story:** As a Supervisor, I want to see only the tabs relevant to my role, so that I am not presented with controls I am not authorized to use.

#### Acceptance Criteria

1. WHEN a Supervisor logs in, THE Admin_Panel SHALL display only the "Pending Review", "All Entries", "Approved", and "Rejected" tabs.
2. WHEN a Super Admin logs in, THE Admin_Panel SHALL display all tabs including "Machine Data" and "Admin Users".
3. WHILE a Supervisor session is active, THE Admin_Panel SHALL hide the "Machine Data" and "Admin Users" tabs.
4. IF a request for a Super Admin-only action (`getAdminUsers`, `saveAdminUser`, `deleteAdminUser`, `saveMachineData`, `deleteMachineData`) is received without Super Admin credentials, THEN THE System SHALL return `{ status: 'error', message: 'Insufficient permissions' }`.

---

### Requirement 8: Supervisor Entry Management

**User Story:** As a Supervisor, I want to view, approve, edit, and reject maintenance entries, so that I can perform my review duties without needing full admin access.

#### Acceptance Criteria

1. WHILE logged in as a Supervisor, THE Admin_Panel SHALL allow viewing all entries in the "Pending Review", "All Entries", "Approved", and "Rejected" tabs.
2. WHILE logged in as a Supervisor, THE Admin_Panel SHALL allow approving pending entries.
3. WHILE logged in as a Supervisor, THE Admin_Panel SHALL allow editing entry fields.
4. WHILE logged in as a Supervisor, THE Admin_Panel SHALL allow rejecting pending entries.

---

### Requirement 9: Admin User Management

**User Story:** As a Super Admin, I want to add and remove admin users from the Admin panel, so that I can grant or revoke supervisor access without editing code.

#### Acceptance Criteria

1. THE Admin_Panel SHALL display an "Admin Users" tab that is visible only to Super Admin users.
2. WHEN the "Admin Users" tab is opened, THE Admin_Panel SHALL fetch and display all admin users (name, email, level) without showing passwords.
3. THE Admin_Panel SHALL provide an "Add User" form with fields for name, email, password, and level (dropdown limited to `supervisor`).
4. WHEN a Super Admin submits the "Add User" form, THE Admin_Panel SHALL call `saveAdminUser` and refresh the user table on success.
5. WHEN a GET request with `action=deleteAdminUser` and an `email` parameter is received, THE User_CRUD SHALL remove the matching user from the `Admin_Users_Sheet`.
6. IF the email to be deleted belongs to the Super Admin account (`yogeshkp85@gmail.com`), THEN THE User_CRUD SHALL return `{ status: 'error', message: 'Cannot delete super admin' }` and leave the sheet unchanged.
7. THE Admin_Panel SHALL display a Delete button per user row and SHALL disable or hide the Delete button for the Super Admin row.

---

### Requirement 10: Daily CSV Export Email

**User Story:** As a manager, I want to receive a daily email with the full Raw_Data sheet as a CSV attachment, so that I can review all maintenance records without logging into the system.

#### Acceptance Criteria

1. THE Export_Trigger SHALL fire the `sendDailyDataExport` function once daily at 9 AM IST.
2. WHEN `sendDailyDataExport` is triggered, THE CSV_Exporter SHALL read all rows from the `Raw_Data_Sheet` including the header row.
3. THE CSV_Exporter SHALL build a valid CSV string from all `Raw_Data_Sheet` rows and attach it as a file named `raw_data_YYYYMMDD.csv`.
4. THE CSV_Exporter SHALL send the email to all addresses listed in `CONFIG.emailExportTo` (currently `yogeshkp85@gmail.com` and `engg.cn@parksonspackaging.com`).
5. THE CSV_Exporter SHALL use the email subject format: `"Parksons Maintenance - Daily Data Export - DD/MM/YYYY"`.
6. IF the `Raw_Data_Sheet` contains only a header row or is empty, THEN THE CSV_Exporter SHALL still send the email with a header-only CSV attachment.
7. IF `MailApp.sendEmail` throws an error, THEN THE CSV_Exporter SHALL catch the exception and log it via `Logger.log` without crashing the trigger.
8. THE CONFIG SHALL store export recipients as an array (`emailExportTo`) so that additional recipients can be added without code restructuring.

---

### Requirement 11: CONFIG and Sheet Name Management

**User Story:** As a developer, I want all sheet names and configuration values to be defined in a single CONFIG object, so that the system is easy to maintain and update.

#### Acceptance Criteria

1. THE CONFIG SHALL define `machineSheetName` with value `'Machine_Data'` as the canonical sheet name for machine data.
2. THE CONFIG SHALL define `adminUsersSheet` with value `'Admin_Users'` as the canonical sheet name for admin users.
3. THE CONFIG SHALL retain the existing `emailTo` key for the daily summary report (unchanged).
4. THE CONFIG SHALL define `emailExportTo` as an array of recipient email addresses for the daily CSV export.
5. THE CONFIG SHALL retain `adminPassword` with value `'PKS@2026'` for backward compatibility.
