# Task 3.7: Alert Configuration UI Implementation

## Overview
Implemented the Alert Configuration UI for the Advanced Reporting & Analytics feature. This allows SuperAdmin users to configure global alert thresholds, notification preferences, and manage user-specific alert preferences.

## Changes Made

### 1. Admin.html Updates

#### Added Alert Configuration Tab
- Added new tab `tabAlertConfig` to the tabs bar (SuperAdmin only)
- Updated `ALL_TABS` array to include `'alertConfig'`
- Updated `switchTab()` function to handle the new tab

#### Added Alert Configuration Panel
The new panel includes four main sections:

**Section 1: Global Alert Thresholds**
- MTBF Threshold slider (0-500 hours, default 100)
- MTTR Threshold slider (0-100 hours, default 10)
- Availability Threshold slider (0-100%, default 85%)
- Save button to persist configuration

**Section 2: Notification Preferences**
- Email Notifications checkbox
- SMS Notifications checkbox
- In-App Notifications checkbox

**Section 3: Machine Selection**
- Multi-select dropdown for selecting machines to monitor
- Dynamically populated from Machine_Data sheet

**Section 4: Alert Types**
- MTBF Decline Alerts checkbox
- High MTTR Alerts checkbox
- Low Availability Alerts checkbox

**Section 5: User Alert Preferences**
- Email input to load/save user-specific preferences
- User-specific notification method selection
- User-specific machine selection
- User-specific alert type selection

#### Added JavaScript Functions

**loadAlertConfiguration()**
- Fetches global alert configuration from backend
- Populates form fields with current values
- Loads machine list for selection dropdowns

**saveAlertConfiguration()**
- Validates form inputs
- Sends configuration to backend via API
- Displays success/error message

**loadUserAlertPreferences()**
- Fetches user-specific preferences by email
- Populates user preference form
- Shows user preference container

**saveUserAlertPreferences()**
- Validates user email
- Collects selected preferences (notification methods, machines, alert types)
- Sends to backend via API
- Displays success/error message

### 2. Code.gs Updates

#### Updated handleGetAction() Function
Added routing for four new actions:
- `getAlertConfiguration` - Returns current global alert configuration
- `updateAlertConfiguration` - Updates global alert configuration
- `getAlertPreferences` - Returns user-specific preferences
- `updateAlertPreferences` - Updates user-specific preferences

#### Backend Functions (Already Implemented)
The following functions were already implemented in Code.gs:
- `getAlertConfigSheet()` - Creates/retrieves Alert_Config sheet
- `getAlertPreferencesSheet()` - Creates/retrieves Alert_Preferences sheet
- `getAlertConfiguration()` - Retrieves current configuration
- `updateAlertConfiguration()` - Updates configuration
- `getAlertPreferences()` - Retrieves user preferences
- `updateAlertPreferences()` - Updates user preferences

### 3. Data Sheets

#### Alert_Config Sheet
Columns:
- Config_Key (Text)
- Config_Value (Text)
- Last_Updated (ISO 8601)
- Updated_By (Email)

Stores:
- mtbfThreshold
- mttrThreshold
- availabilityThreshold
- notificationMethods (comma-separated)
- alertTypes (comma-separated)

#### Alert_Preferences Sheet
Columns:
- User_Email (Email)
- Machines_to_Monitor (comma-separated)
- Alert_Types (comma-separated)
- Notification_Method (comma-separated)
- Last_Updated (ISO 8601)

## Features Implemented

### Global Configuration
- ✓ MTBF Threshold configuration (0-500 hours)
- ✓ MTTR Threshold configuration (0-100 hours)
- ✓ Availability Threshold configuration (0-100%)
- ✓ Notification method selection (Email, SMS, In-App)
- ✓ Alert type selection (MTBF_DECLINE, HIGH_MTTR, LOW_AVAILABILITY)
- ✓ Machine selection for monitoring
- ✓ Persistent storage in Alert_Config sheet

### User Preferences
- ✓ Per-user email-based preferences
- ✓ User-specific notification method selection
- ✓ User-specific machine selection
- ✓ User-specific alert type selection
- ✓ Persistent storage in Alert_Preferences sheet

### Access Control
- ✓ SuperAdmin only access (role-based)
- ✓ Tab visibility controlled by user role

### UI/UX
- ✓ Clean, organized form layout
- ✓ Real-time form validation
- ✓ Success/error message display
- ✓ Multi-select dropdown for machines
- ✓ Checkbox controls for preferences
- ✓ Responsive design

## Testing Checklist

### Form Submission
- [ ] Global configuration saves correctly
- [ ] User preferences save correctly
- [ ] Data persists after page reload
- [ ] Error messages display for invalid inputs

### Threshold Validation
- [ ] MTBF threshold accepts 0-500 range
- [ ] MTTR threshold accepts 0-100 range
- [ ] Availability threshold accepts 0-100 range
- [ ] Invalid values are rejected

### User Preference Saving
- [ ] User preferences load correctly by email
- [ ] User preferences save correctly
- [ ] Multiple users can have different preferences
- [ ] Preferences persist after page reload

### Role-Based Access Control
- [ ] SuperAdmin can access Alert Configuration tab
- [ ] Non-SuperAdmin users cannot see tab
- [ ] Tab is hidden for Supervisor users

### Data Persistence
- [ ] Alert_Config sheet is created on first use
- [ ] Alert_Preferences sheet is created on first use
- [ ] Data is stored in correct sheets
- [ ] Timestamps are recorded correctly

## Integration Points

### With Existing System
- Uses existing `getMachineData()` function to populate machine list
- Uses existing error logging via `logError()` function
- Uses existing authentication system for role-based access
- Uses existing API routing in `handleGetAction()`

### With Alert Generation
- Configuration values used by `generateAlerts()` function
- User preferences used for alert notification routing
- Threshold values used for alert severity determination

## Deployment Notes

1. Update Admin.html with new UI tab and panel
2. Update Code.gs with new action routing
3. Sheets are created automatically on first use
4. No manual sheet creation required
5. Backward compatible with existing system

## Files Modified

1. `Maintenance_System/src/Admin.html`
   - Added Alert Configuration tab
   - Added Alert Configuration panel
   - Added JavaScript functions for form handling

2. `Maintenance_System/src/Code.gs`
   - Updated `handleGetAction()` to route alert configuration actions

## Next Steps

1. Deploy changes to production
2. Test form submission and data persistence
3. Verify role-based access control
4. Test integration with alert generation system
5. Monitor error logs for any issues
6. Update user documentation

## Acceptance Criteria Met

- [x] Alert Configuration UI tab added to Admin.html
- [x] Form with MTBF, MTTR, Availability sliders
- [x] Notification method checkboxes (Email, SMS, In-App)
- [x] Machine selection multi-select dropdown
- [x] Alert type checkboxes (MTBF_DECLINE, HIGH_MTTR, LOW_AVAILABILITY)
- [x] Backend functions to get/update configuration
- [x] Backend functions to get/update user preferences
- [x] Alert_Config sheet created with proper columns
- [x] Alert_Preferences sheet created with proper columns
- [x] Role-based access control (SuperAdmin only)
- [x] Integration with existing error logging
- [x] Data persistence in sheets
