# Implementation Plan: Parksons System Enhancements

## Overview

Implement three enhancements to the Parksons Maintenance System (Google Apps Script):
1. Persistent Machine Data Management via `Machine_Data` sheet + Admin CRUD UI
2. Multi-level Admin Panel Access (Supervisor + Super Admin) via `Admin_Users` sheet
3. Daily CSV Data Export Email triggered at 9 AM IST

All code changes are in `apps-script/Code.gs`, `apps-script/Admin.html`, and `form/Parksons_Maintenance_Form_v4.html`.

---

## Tasks

- [x] 1. Update CONFIG and add sheet helper utilities in Code.gs
  - Add `machineSheetName: 'Machine_Data'` and `adminUsersSheet: 'Admin_Users'` to the `CONFIG` object
  - Add `emailExportTo: ['yogeshkp85@gmail.com', 'engg.cn@parksonspackaging.com']` array to CONFIG
  - Retain existing `emailTo`, `adminPassword`, and all other CONFIG keys unchanged
  - Add helper `getMachineSheet()` and `getAdminUsersSheet()` functions (mirrors existing `getRawSheet()` pattern)
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 2. Implement Machine Data backend (Code.gs)
  - [x] 2.1 Implement `seedMachineDataIfEmpty()`
    - Create `Machine_Data` sheet if missing; write header row (`machine_type`, `machine_name`, `units`)
    - Iterate the existing hardcoded `MACHINES` object and append one row per machine name
    - Skip seeding if sheet already has data rows (row count > 1)
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]* 2.2 Write property test for seed idempotence (Property 3)
    - **Property 3: Seed idempotence**
    - **Validates: Requirements 1.4**
    - Call `seedMachineDataIfEmpty()` twice; assert row count is identical after both calls

  - [x] 2.3 Implement `getMachineData()`
    - Call `seedMachineDataIfEmpty()` first
    - Read all rows from `Machine_Data` sheet; build nested `{ TYPE: { NAME: [units] } }` object
    - Return `{ status: 'success', machines: {...} }`
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ]* 2.4 Write property test for machine data save round-trip (Property 1)
    - **Property 1: Machine data save round-trip**
    - **Validates: Requirements 3.1, 3.2, 3.3, 2.1, 2.2**
    - Call `saveMachineData` with a test entry, then call `getMachineData`; assert returned machines object contains the saved entry with correct type, name, and units

  - [x] 2.5 Implement `saveMachineData(params)`
    - Accept `params.machineType`, `params.machineName`, `params.units`
    - Search `Machine_Data` sheet for existing row with matching `machineName`; update if found, append if not
    - Return `{ status: 'success' }`
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 2.6 Implement `deleteMachineData(params)`
    - Accept `params.machineType` and `params.machineName`
    - Find and delete the matching row from `Machine_Data` sheet
    - Return `{ status: 'success' }`
    - _Requirements: 3.5, 3.6_

  - [ ]* 2.7 Write property test for machine data delete (Property 2)
    - **Property 2: Machine data delete removes entry**
    - **Validates: Requirements 3.5**
    - Save a test entry, call `deleteMachineData`, then call `getMachineData`; assert the entry is absent

  - [x] 2.8 Wire machine actions into `handleGetAction()` and `doPost()` router
    - Add `getMachineData`, `saveMachineData`, `deleteMachineData` cases to the action router
    - _Requirements: 2.1, 3.1, 3.5_

- [ ] 3. Checkpoint — Machine Data backend
  - Manually run `getMachineData()` from Apps Script editor; verify it returns the full nested machines object seeded from the hardcoded `MACHINES` constant. Ask the user if questions arise.

- [x] 4. Implement Admin Users backend (Code.gs)
  - [x] 4.1 Implement `seedAdminUsersIfEmpty()`
    - Create `Admin_Users` sheet if missing; write header row (`name`, `email`, `password`, `level`)
    - Seed with Super Admin row: name `YogeshK`, email `yogeshkp85@gmail.com`, password `PKS@2026`, level `superadmin`
    - Skip seeding if sheet already has data rows
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 4.2 Write property test for Admin_Users seed idempotence (Property 3)
    - **Property 3: Seed idempotence (Admin_Users)**
    - **Validates: Requirements 5.4**
    - Call `seedAdminUsersIfEmpty()` twice; assert row count and content are unchanged after second call

  - [x] 4.3 Implement `loginAdmin(params)`
    - Call `seedAdminUsersIfEmpty()` first
    - For `level=supervisor`: find any row where `level='supervisor'` and `password` matches `params.password`
    - For `level=superadmin` (or no level): find row where `email` matches `params.email` and `password` matches
    - On match: return `{ status: 'success', user: { name, email, level } }`
    - On no match: return `{ status: 'error', message: 'Invalid credentials' }`
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ]* 4.4 Write property test for login correctness (Property 4)
    - **Property 4: Login correctness**
    - **Validates: Requirements 6.1, 6.2, 6.3**
    - Test that valid superadmin credentials return success with correct level; test that wrong password returns error; test that unknown email returns error

  - [x] 4.5 Implement `getAdminUsers()`
    - Read all rows from `Admin_Users` sheet
    - Return `{ status: 'success', users: [{ name, email, level }] }` — passwords must be omitted
    - _Requirements: 9.2_

  - [ ]* 4.6 Write property test for passwords omitted from getAdminUsers (Property 7)
    - **Property 7: Passwords omitted from getAdminUsers response**
    - **Validates: Requirements 9.2**
    - Call `getAdminUsers()`; assert no user object in the response contains a `password` field

  - [x] 4.7 Implement `saveAdminUser(params)`
    - Accept `params.name`, `params.email`, `params.password`, `params.level`
    - Search sheet for existing row with matching `email`; update if found, append if not
    - Return `{ status: 'success' }`
    - _Requirements: 9.3, 9.4_

  - [ ]* 4.8 Write property test for Admin_Users row schema invariant (Property 11)
    - **Property 11: Admin_Users_Sheet row schema invariant**
    - **Validates: Requirements 5.2, 5.3**
    - Call `saveAdminUser` with a test supervisor; read the sheet row directly; assert exactly four columns populated with valid `level` value

  - [x] 4.9 Implement `deleteAdminUser(params)`
    - Accept `params.email`
    - If `params.email` equals the Super Admin email (`yogeshkp85@gmail.com`), return `{ status: 'error', message: 'Cannot delete super admin' }` without modifying the sheet
    - Otherwise find and delete the matching row; return `{ status: 'success' }`
    - _Requirements: 9.5, 9.6_

  - [ ]* 4.10 Write property test for Super Admin deletion protection (Property 8)
    - **Property 8: Super Admin deletion protection**
    - **Validates: Requirements 9.6**
    - Call `deleteAdminUser({ email: 'yogeshkp85@gmail.com' })`; assert error response and sheet row count unchanged

  - [x] 4.11 Wire admin user actions into `handleGetAction()` router
    - Add `loginAdmin`, `getAdminUsers`, `saveAdminUser`, `deleteAdminUser` cases
    - _Requirements: 6.1, 9.2, 9.4, 9.5_

- [ ] 5. Checkpoint — Admin Users backend
  - Manually run `loginAdmin({ email:'yogeshkp85@gmail.com', password:'PKS@2026', level:'superadmin' })` from Apps Script editor; verify it returns `{ status:'success', user:{ level:'superadmin' } }`. Ask the user if questions arise.

- [x] 6. Implement Daily CSV Export Email (Code.gs)
  - [x] 6.1 Implement `sendDailyDataExport()`
    - Read all rows from `Raw_Data` sheet using `getDataRange().getValues()`
    - Build a CSV string: escape fields containing commas or quotes; first line is the header row
    - Create blob: `Utilities.newBlob(csvString, 'text/csv', 'raw_data_YYYYMMDD.csv')` where date is today in IST
    - Send email to `CONFIG.emailExportTo.join(',')` with subject `"Parksons Maintenance - Daily Data Export - DD/MM/YYYY"` and the CSV blob as attachment
    - Wrap entire function in try/catch; log errors via `Logger.log` without rethrowing
    - If `Raw_Data` has only a header or is empty, still send the email with header-only CSV
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8_

  - [ ]* 6.2 Write property test for CSV export row count (Property 9)
    - **Property 9: CSV export contains all Raw_Data rows**
    - **Validates: Requirements 10.2, 10.3**
    - Call the CSV-building logic with a known set of rows; assert the resulting CSV line count equals the input row count (including header)

  - [ ]* 6.3 Write property test for export email subject format (Property 10)
    - **Property 10: Export email subject format**
    - **Validates: Requirements 10.5**
    - Assert the subject string produced by `sendDailyDataExport` matches the pattern `"Parksons Maintenance - Daily Data Export - DD/MM/YYYY"` for today's IST date

  - [x] 6.4 Add `sendDailyDataExport` to the `onOpen` menu and add a comment instructing how to set the 9 AM IST time-driven trigger
    - _Requirements: 10.1_

- [x] 7. Update Admin.html — Login screen and session management
  - [x] 7.1 Replace the existing single-password login UI with a two-mode login screen
    - Add two buttons: "Supervisor Login" and "Admin Login" that toggle the visible input fields
    - Supervisor mode: show only a password field (no email); label it "Supervisor Password"
    - Admin mode: show email + password fields
    - Keep the same CSS variables and visual style as the existing login box
    - _Requirements: 6.4, 6.5, 6.6_

  - [x] 7.2 Implement `doLogin()` to call `loginAdmin` API
    - For supervisor mode: call `BASE_URL + '?action=loginAdmin&password=...&level=supervisor'`
    - For admin mode: call `BASE_URL + '?action=loginAdmin&email=...&password=...&level=superadmin'`
    - On success: store user object in `sessionStorage` under key `pks_admin_user`; call `showApp(user)`
    - On failure: show inline error message
    - Remove the old `ADMIN_PWD` constant and `sessionStorage.getItem('pks_admin')` check
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 7.3 Write property test for role-based tab visibility (Property 5)
    - **Property 5: Role-based tab visibility**
    - **Validates: Requirements 7.1, 7.2, 7.3**
    - After calling `showApp({ level:'supervisor' })`, assert Machine Data and Admin Users tabs are hidden; after calling `showApp({ level:'superadmin' })`, assert all tabs are visible

  - [x] 7.4 Implement role-based tab rendering in `showApp(user)`
    - Accept a `user` object `{ name, email, level }`
    - If `level === 'supervisor'`: hide "Machine Data" and "Admin Users" tabs
    - If `level === 'superadmin'`: show all tabs
    - Display the logged-in user's name in the header (replace or supplement the existing pending badge area)
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 8. Add Machine Data tab to Admin.html
  - [x] 8.1 Add "Machine Data" tab button and panel `<div>` to the tabs bar and main area
    - Tab is hidden by default; shown only for superadmin (handled by task 7.4)
    - Panel contains: a table `#machineTable` and an "Add Machine" form
    - _Requirements: 4.1_

  - [x] 8.2 Implement `loadMachineData()` — fetch and render machine table
    - Call `BASE_URL + '?action=getMachineData'`; iterate the returned machines object
    - Render one table row per machine name showing: machine type, machine name, units, Edit button, Delete button
    - _Requirements: 4.2_

  - [x] 8.3 Implement Add Machine form submission
    - On form submit: call `saveMachineData` via GET with `machineType`, `machineName`, `units` params
    - On success: clear form and call `loadMachineData()` to refresh the table
    - _Requirements: 4.3, 4.4_

  - [x] 8.4 Implement inline edit and delete for machine rows
    - Edit: clicking Edit on a row populates the Add Machine form fields for update
    - Delete: clicking Delete shows a `confirm()` dialog; on confirm calls `deleteMachineData` then refreshes table
    - _Requirements: 4.5, 4.6_

- [x] 9. Add Admin Users tab to Admin.html
  - [x] 9.1 Add "Admin Users" tab button and panel `<div>` to the tabs bar and main area
    - Tab is hidden by default; shown only for superadmin (handled by task 7.4)
    - Panel contains: a table `#usersTable` and an "Add User" form
    - _Requirements: 9.1_

  - [x] 9.2 Implement `loadAdminUsers()` — fetch and render users table
    - Call `BASE_URL + '?action=getAdminUsers'`; render one row per user showing: name, email, level, Delete button
    - Disable or hide the Delete button for the Super Admin row (`yogeshkp85@gmail.com`)
    - _Requirements: 9.2, 9.7_

  - [x] 9.3 Implement Add User form submission
    - Form fields: name, email, password, level (dropdown with only `supervisor` option)
    - On submit: call `saveAdminUser` via GET; on success refresh the users table
    - _Requirements: 9.3, 9.4_

  - [x] 9.4 Implement delete user action
    - On Delete click: show `confirm()` dialog; on confirm call `deleteAdminUser` then refresh table
    - Handle error response `'Cannot delete super admin'` by showing an inline error message
    - _Requirements: 9.5, 9.6, 9.7_

- [ ] 10. Checkpoint — Admin panel UI
  - Verify login screen shows two modes (Supervisor / Admin), role-based tabs render correctly, Machine Data tab loads and allows add/delete, Admin Users tab loads and allows add/delete. Ask the user if questions arise.

- [x] 11. Update Parksons_Maintenance_Form_v4.html — dynamic machine data loading
  - [x] 11.1 Add `fetchMachineData()` function called from `window.onload`
    - Call `SCRIPT_URL + '?action=getMachineData'` via `fetch`
    - On success: assign response `machines` to the local `MACHINES` variable; call `populateMachineTypes()`
    - On failure: log a console warning and call `populateMachineTypes()` using the existing hardcoded `MACHINES` constant (graceful degradation)
    - Show a "Loading machines..." disabled placeholder option on the Machine Type dropdown while the fetch is in progress; replace it on completion
    - _Requirements: 2.4, 2.5, 2.6_

  - [x] 11.2 Modify `window.onload` to call `fetchMachineData()` instead of `populateMachineTypes()` directly
    - `populateMachineTypes()` is now called only after `fetchMachineData()` resolves (success or fallback)
    - _Requirements: 2.4_

- [ ] 12. Final checkpoint — end-to-end verification
  - Ensure all tests pass. Verify: form loads machine types from sheet, supervisor login hides admin-only tabs, superadmin login shows all tabs, daily export function runs without error. Ask the user if questions arise.

- [x] 13. Commit and push all changes to GitHub
  - Stage all modified files: `apps-script/Code.gs`, `apps-script/Admin.html`, `form/Parksons_Maintenance_Form_v4.html`
  - Commit with message: `feat: persistent machine data, multi-level admin login, daily CSV export`
  - Push to `origin main`
  - Run: `git -C parksons-maintenance-system-v32-github add apps-script/Code.gs apps-script/Admin.html form/Parksons_Maintenance_Form_v4.html` (adjust paths as needed)
  - Run: `git -C parksons-maintenance-system-v32-github commit -m "feat: persistent machine data, multi-level admin login, daily CSV export"`
  - Run: `git -C parksons-maintenance-system-v32-github push origin main`

---

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- All backend functions follow the existing GET-only API pattern (no POST needed for new actions) to avoid CORS preflight issues
- Supervisor login uses password-only matching against any `supervisor`-level row in `Admin_Users` sheet — no email required
- The hardcoded `MACHINES` object in the form is retained as a fallback; it is not removed
- The `adminPassword` key in CONFIG is retained for backward compatibility even though login now uses the sheet
- Property tests for GAS are manual test functions runnable from the Apps Script editor (no PBT library available in GAS runtime)
- After all code changes, a new deployment of the Apps Script web app is required for changes to take effect
