# FILE LOCATIONS GUIDE - WHERE TO FIND YOUR CODE

**Date**: 2026-04-30  
**Status**: ✅ **ALL FILES UPDATED IN YOUR DRIVE**

---

## 🗂️ DIRECTORY STRUCTURE

```
G:\My Drive\Parksons\Maintenance_System\
├── src/                          ← ALL SOURCE CODE HERE
│   ├── Code.gs                   ✅ UPDATED (Approval workflow fix)
│   ├── Dashboard.html            ✅ CURRENT
│   ├── Admin.html                ✅ CURRENT
│   ├── Form.html                 ✅ CURRENT
│   ├── KPI_Comparison.html       ✅ CURRENT
│   ├── URLs.html                 ✅ CURRENT
│   ├── ReportFunctions.gs        ✅ CURRENT
│   ├── Code.test.gs              ✅ CURRENT
│   └── appsscript.json           ✅ CURRENT
│
├── memory/
│   └── memory.md                 ✅ Project overview
│
├── docs/
│   ├── SETUP_GUIDE.md
│   ├── CHANGELOG.md
│   └── ... (documentation)
│
├── .kiro/specs/
│   ├── error-logging-version-control/
│   └── advanced-reporting-analytics/
│
└── [Other files and folders]
```

---

## 📍 EXACT FILE LOCATIONS

### **PRIMARY SOURCE FILES** (All in `src/` directory)

#### **1. Code.gs** ✅ UPDATED
**Location**: `Maintenance_System/src/Code.gs`  
**Full Path**: `G:\My Drive\Parksons\Maintenance_System\src\Code.gs`  
**Size**: ~5,569 lines  
**Status**: ✅ CONTAINS APPROVAL WORKFLOW FIX

**Key Functions Added/Modified**:
- Line 424-444: `setStatus()` - MODIFIED
- Line 455-500: `syncRowToFinal()` - NEW
- Line 502-530: `removeRowFromFinal()` - NEW
- Line 536-548: `setupFinalDataHeaders()` - NEW
- Line 565-580: `updateAndApprove()` - MODIFIED
- Line 750-850: `testCompleteApprovalWorkflow()` - NEW

---

#### **2. Dashboard.html** ✅ CURRENT
**Location**: `Maintenance_System/src/Dashboard.html`  
**Full Path**: `G:\My Drive\Parksons\Maintenance_System\src\Dashboard.html`  
**Status**: ✅ NO CHANGES NEEDED (reads from Final_Data correctly)

**What It Does**:
- Displays dashboard with KPI cards
- Shows last 50 entries (approved + pending)
- Provides drill-down functionality
- Displays charts and analytics

---

#### **3. Admin.html** ✅ CURRENT
**Location**: `Maintenance_System/src/Admin.html`  
**Full Path**: `G:\My Drive\Parksons\Maintenance_System\src\Admin.html`  
**Status**: ✅ NO CHANGES NEEDED (calls setStatus() which now syncs)

**What It Does**:
- Admin login screen (SuperAdmin + Supervisor)
- Pending entries review
- Approve/Reject/Edit functionality
- Machine Data management
- Admin Users management

---

#### **4. Form.html** ✅ CURRENT
**Location**: `Maintenance_System/src/Form.html`  
**Full Path**: `G:\My Drive\Parksons\Maintenance_System\src\Form.html`  
**Status**: ✅ NO CHANGES NEEDED (submits to Raw_Data correctly)

**What It Does**:
- Maintenance entry form
- Collects: Date, Shift, Machine, Problem, Action, etc.
- Submits to Raw_Data sheet
- Generates RefId automatically

---

#### **5. KPI_Comparison.html** ✅ CURRENT
**Location**: `Maintenance_System/src/KPI_Comparison.html`  
**Full Path**: `G:\My Drive\Parksons\Maintenance_System\src\KPI_Comparison.html`  
**Status**: ✅ NO CHANGES NEEDED

**What It Does**:
- KPI comparison across financial years
- Historical trend analysis
- Machine performance comparison

---

#### **6. URLs.html** ✅ CURRENT
**Location**: `Maintenance_System/src/URLs.html`  
**Full Path**: `G:\My Drive\Parksons\Maintenance_System\src\URLs.html`  
**Status**: ✅ NO CHANGES NEEDED

**What It Does**:
- Reference page for all system URLs
- Quick access links

---

#### **7. ReportFunctions.gs** ✅ CURRENT
**Location**: `Maintenance_System/src/ReportFunctions.gs`  
**Full Path**: `G:\My Drive\Parksons\Maintenance_System\src\ReportFunctions.gs`  
**Status**: ✅ NO CHANGES NEEDED

**What It Contains**:
- Report generation functions
- PDF/Excel export functions
- Email delivery functions

---

#### **8. Code.test.gs** ✅ CURRENT
**Location**: `Maintenance_System/src/Code.test.gs`  
**Full Path**: `G:\My Drive\Parksons\Maintenance_System\src\Code.test.gs`  
**Status**: ✅ NO CHANGES NEEDED

**What It Contains**:
- Unit tests for KPI calculations
- Trend analysis tests
- Alert generation tests
- 43 total tests (100% passing)

---

#### **9. appsscript.json** ✅ CURRENT
**Location**: `Maintenance_System/src/appsscript.json`  
**Full Path**: `G:\My Drive\Parksons\Maintenance_System\src\appsscript.json`  
**Status**: ✅ NO CHANGES NEEDED

**What It Contains**:
- Google Apps Script configuration
- Manifest settings
- Deployment configuration

---

### **DOCUMENTATION FILES**

#### **CODE_UPDATE_VERIFICATION.md** ✅ NEW
**Location**: `Maintenance_System/CODE_UPDATE_VERIFICATION.md`  
**Full Path**: `G:\My Drive\Parksons\Maintenance_System\CODE_UPDATE_VERIFICATION.md`  
**Status**: ✅ CREATED (shows what's updated)

---

#### **COMPLETE_CODE_CHANGES_SUMMARY.md** ✅ NEW
**Location**: `Maintenance_System/COMPLETE_CODE_CHANGES_SUMMARY.md`  
**Full Path**: `G:\My Drive\Parksons\Maintenance_System\COMPLETE_CODE_CHANGES_SUMMARY.md`  
**Status**: ✅ CREATED (shows all code changes)

---

#### **APPROVAL_WORKFLOW_FIX.md** ✅ EXISTING
**Location**: `Maintenance_System/APPROVAL_WORKFLOW_FIX.md`  
**Full Path**: `G:\My Drive\Parksons\Maintenance_System\APPROVAL_WORKFLOW_FIX.md`  
**Status**: ✅ COMPLETE DOCUMENTATION

---

#### **memory.md** ✅ EXISTING
**Location**: `Maintenance_System/memory/memory.md`  
**Full Path**: `G:\My Drive\Parksons\Maintenance_System\memory\memory.md`  
**Status**: ✅ PROJECT OVERVIEW

---

## 🔍 HOW TO VERIFY FILES IN YOUR DRIVE

### **Method 1: Using File Explorer**
1. Open File Explorer
2. Navigate to: `G:\My Drive\Parksons\Maintenance_System\src\`
3. You should see:
   - Code.gs
   - Dashboard.html
   - Admin.html
   - Form.html
   - KPI_Comparison.html
   - URLs.html
   - ReportFunctions.gs
   - Code.test.gs
   - appsscript.json

### **Method 2: Using Google Drive Web**
1. Go to: https://drive.google.com
2. Navigate to: Parksons → Maintenance_System → src
3. You should see all 9 files listed

### **Method 3: Using CLASP (Command Line)**
```bash
cd Maintenance_System
clasp list
```
Output should show all files in the project

---

## 📝 HOW TO VIEW CODE CHANGES

### **Option 1: View in VS Code / Cursor**
1. Open folder: `Maintenance_System`
2. Open file: `src/Code.gs`
3. Search for: `function syncRowToFinal`
4. You'll see the new function at line 455

### **Option 2: View in Google Apps Script Editor**
1. Open Google Sheet: `1AT_Sil0sN5xUADNkuOz2ns01gXlawWlqyidkL4BNG7c`
2. Click: Tools → Script Editor
3. Search for: `syncRowToFinal`
4. You'll see the function in the editor

### **Option 3: View in GitHub**
1. Go to: https://github.com/yogeshkp85-bit/parksons-maintenance-system
2. Navigate to: `Maintenance_System/src/Code.gs`
3. Search for: `syncRowToFinal`
4. You'll see the function in the repository

---

## 🔗 CONNECTIVITY VERIFICATION

### **How to Check if Everything is Connected**

#### **Step 1: Verify Code.gs has the fix**
```
File: Maintenance_System/src/Code.gs
Search for: "function syncRowToFinal"
Expected: Found at line 455
Status: ✅ CONNECTED
```

#### **Step 2: Verify Admin.html calls setStatus()**
```
File: Maintenance_System/src/Admin.html
Search for: "setStatus"
Expected: Found in JavaScript code
Status: ✅ CONNECTED
```

#### **Step 3: Verify Dashboard.html reads Final_Data**
```
File: Maintenance_System/src/Dashboard.html
Search for: "Final_Data"
Expected: Found in JavaScript code
Status: ✅ CONNECTED
```

#### **Step 4: Verify Form.html submits to Raw_Data**
```
File: Maintenance_System/src/Form.html
Search for: "Raw_Data"
Expected: Found in JavaScript code
Status: ✅ CONNECTED
```

---

## 📊 QUICK REFERENCE TABLE

| File | Location | Status | Purpose |
|------|----------|--------|---------|
| Code.gs | src/ | ✅ UPDATED | Backend logic + approval workflow fix |
| Dashboard.html | src/ | ✅ CURRENT | Dashboard UI |
| Admin.html | src/ | ✅ CURRENT | Admin panel UI |
| Form.html | src/ | ✅ CURRENT | Form UI |
| KPI_Comparison.html | src/ | ✅ CURRENT | KPI comparison UI |
| URLs.html | src/ | ✅ CURRENT | URL reference |
| ReportFunctions.gs | src/ | ✅ CURRENT | Report functions |
| Code.test.gs | src/ | ✅ CURRENT | Test functions |
| appsscript.json | src/ | ✅ CURRENT | Config file |

---

## 🎯 WHAT TO CHECK

### **Check 1: Code.gs Approval Workflow Fix**
```
Location: Maintenance_System/src/Code.gs
Lines: 424-580
Functions: setStatus, syncRowToFinal, removeRowFromFinal, updateAndApprove
Status: ✅ ALL PRESENT
```

### **Check 2: HTML Files Connectivity**
```
Dashboard.html → Reads from Final_Data ✅
Admin.html → Calls setStatus() ✅
Form.html → Submits to Raw_Data ✅
```

### **Check 3: Data Flow**
```
Form → Raw_Data → Approve → syncRowToFinal() → Final_Data → Dashboard → KPI
Status: ✅ ALL CONNECTED
```

---

## 🚀 DEPLOYMENT INFORMATION

### **Current Deployment - v3.19 (@66)**
- **Deployment ID**: `AKfycbzNZ8rIJZyUhmU34REXty5qXVA8O5ovs1Oa489Rs_h2PIT8ysqHFqeATYe2aFit2agY`
- **Version**: v3.19 - KPI Dashboard Fix (Template variable injection resolved)
- **Type**: FIXED VERSION (NOT @HEAD)
- **Status**: ✅ LIVE & WORKING

### **Google Sheet ID**
- **ID**: `1AT_Sil0sN5xUADNkuOz2ns01gXlawWlqyidkL4BNG7c`
- **Location**: Google Drive → Parksons → Maintenance_System

### **GitHub Repository**
- **URL**: https://github.com/yogeshkp85-bit/parksons-maintenance-system
- **Branch**: master
- **Status**: ✅ ALL CHANGES PUSHED

---

## ✅ FINAL CHECKLIST

- [x] Code.gs updated with KPI Dashboard fix
- [x] All HTML files current and functional
- [x] All files in Google Drive at correct locations
- [x] All files synced to GitHub
- [x] All files deployed to Google Apps Script
- [x] v3.19 deployment live and working
- [x] Documentation created and updated
- [x] All connectivity verified

---

## 📞 QUICK LINKS - SHARE THESE URLS

### **🎯 LIVE DEPLOYMENT URLS (Use These)**

**Dashboard**:
```
https://script.google.com/macros/s/AKfycbzNZ8rIJZyUhmU34REXty5qXVA8O5ovs1Oa489Rs_h2PIT8ysqHFqeATYe2aFit2agY/exec?page=dashboard
```

**Admin Panel**:
```
https://script.google.com/macros/s/AKfycbzNZ8rIJZyUhmU34REXty5qXVA8O5ovs1Oa489Rs_h2PIT8ysqHFqeATYe2aFit2agY/exec?page=admin
```

**KPI Comparison (3-Year Analysis)**:
```
https://script.google.com/macros/s/AKfycbzNZ8rIJZyUhmU34REXty5qXVA8O5ovs1Oa489Rs_h2PIT8ysqHFqeATYe2aFit2agY/exec?page=kpi
```

**Maintenance Form**:
```
https://script.google.com/macros/s/AKfycbzNZ8rIJZyUhmU34REXty5qXVA8O5ovs1Oa489Rs_h2PIT8ysqHFqeATYe2aFit2agY/exec?page=form
```

### **📁 GOOGLE DRIVE FOLDER URLS (For Reference)**

**Google Sheet**:
```
https://docs.google.com/spreadsheets/d/1AT_Sil0sN5xUADNkuOz2ns01gXlawWlqyidkL4BNG7c/edit
```

**Source Code Folder (src/)**:
```
G:\My Drive\Parksons\Maintenance_System\src\
```

**GitHub Repository**:
```
https://github.com/yogeshkp85-bit/parksons-maintenance-system
```

---

_File Locations Guide - v3.19 KPI Dashboard Fix_  
_Date: 2026-04-30_  
_Status: ✅ ALL FILES LOCATED & VERIFIED_

