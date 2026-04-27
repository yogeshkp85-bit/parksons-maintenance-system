# PARKSONS MAINTENANCE SYSTEM — MEMORY.MD
_Last Updated: 2026-04-27_

---

## 🎯 PROJECT OBJECTIVE

Enterprise-grade Maintenance Management Dashboard with:
- Real-time Form submission → Approval workflow → Dashboard pipeline
- Financial Year (Apr–Mar) analytics
- KPI tracking: MTTR, MTBF, Availability
- Pending vs Approved data separation
- Auto backup, version control, error logging
- **NEW (v2.0)**: Persistent Machine Data Management, Multi-level Admin Login, Daily CSV Export

---

## 🧩 SYSTEM ARCHITECTURE

```
Form.html → Raw_Data → Admin Approval → Final_Data → Dashboard
                ↓
         Machine_Data (persistent)
         Admin_Users (multi-level access)
         Daily CSV Export (9 AM IST)
```

---

## ⚙️ CORE DATA RULES

| Status         | Raw_Data | Final_Data | Dashboard Visible         | Affects KPI |
|----------------|----------|------------|---------------------------|-------------|
| PENDING_REVIEW | ✅       | ❌         | ✅ (last 50, highlighted)  | ❌          |
| APPROVED       | ✅       | ✅         | ✅                         | ✅          |
| REJECTED       | ✅       | ❌         | ❌                         | ❌          |

---

## 📊 DASHBOARD MODULES

### 1. Last 50 Entries
- Show APPROVED + PENDING entries
- Pending → Yellow/Orange highlight + Status badge
- REJECTED → hidden

### 2. Drill-Down (Click any row)
Modal popup showing: Ref ID, Date, Shift, Machine Type & Name, Unit,
Problem Type & Category, Full Description, Action Taken, Root Cause,
Time Start/End, Duration, Attended By, Remarks, Status

### 3. Financial Year Filter
- FY = Apr 1 → Mar 31
- Logic: Month >= 4 → FY CurrentYear-NextYear; else FY PreviousYear-CurrentYear
- Dropdown: All | FY 2023-24 | FY 2024-25 | FY 2025-26
- Impacts: KPIs, Charts, Machine Performance, Trends

---

## 📈 KPI DEFINITIONS (APPROVED DATA ONLY)

| KPI            | Formula                                                        |
|----------------|----------------------------------------------------------------|
| MTTR           | Total Breakdown Time ÷ Breakdown Count                         |
| MTBF           | Total Running Time ÷ Breakdown Count                           |
| Availability % | (Available Time − Breakdown Time) ÷ Available Time × 100      |

---

## 🚀 ADVANCED ANALYTICS

- Machine-wise: Top 5 machines by downtime
- Category-wise: Electrical / Mechanical / Others
- Shift-wise: First / Second / Third shift
- Monthly Trend: MTTR & MTBF trend lines
- Drill-down: Click any KPI/chart → filter dashboard data

### Chart Interactivity
- Hover → Tooltip with detailed values
- Click → Apply filter (e.g., click KBA-1 → show only KBA-1 rows)

---

## 🏭 ENTERPRISE OPERATIONS

### Auto Backup
- Trigger: Daily automatic
- Storage: Google Drive /backups/ folder
- Format: CSV or Sheet copy, date-wise, never overwrite

### Deployment System
- "Deploy" button in dashboard UI
- Every deployment logged with timestamp

### Version Control (Sheet: Versions)
Columns: Version | Date | Changes | Deployed By
- Major update = new version entry; supports manual rollback

### Error Logging (Sheet: Error_Log)
Columns: Timestamp | Function Name | Error Message
- All major functions in try-catch; no silent failures

---

## 📁 GOOGLE DRIVE STRUCTURE

```
Parksons/Maintenance_System/
 ├── src/        → Code.gs, HTML files
 ├── memory/     → memory.md
 ├── backups/    → Auto backup files
 ├── versions/   → Version snapshots
 ├── deployment/ → Deployment notes/logs
 ├── scripts/    → Automation scripts
 └── docs/       → Setup & documentation
```

---

## 🔗 DEPLOYMENT REFERENCES

| Item                  | Value                                                                        |
|-----------------------|------------------------------------------------------------------------------|
| GitHub Repo           | yogeshkp85-bit/parksons-maintenance-system                                   |
| Active Deployment Key | AKfycbzHWip5IomqAGlmU78rsoPlX1AFJHKWeZ5u28qWQmKO9VMHAUdKystKv_NigL6XNLKS  |
| Google Sheet ID       | 1AT_Sil0sN5xUADNkuOz2ns01gXlawWlqyidkL4BNG7c                                |
| CLASP                 | Working                                                                      |
| Editor                | Cursor / Kiro                                                                |
| Deployment Date       | 2026-04-27                                                                   |

---

## ✨ NEW FEATURES (v2.0 - 2026-04-27)

### 1. Persistent Machine Data Management
- **Sheet**: `Machine_Data` (persistent storage)
- **Backend**: `getMachineData()`, `saveMachineData()`, `deleteMachineData()`
- **UI**: Machine Data tab in Admin panel (SuperAdmin only)
- **Features**: Add, Edit, Delete machines; auto-seed from hardcoded MACHINES constant

### 2. Multi-Level Admin Login
- **Sheet**: `Admin_Users` (name, email, password, level)
- **Levels**: 
  - `superadmin` (email + password login) → Full access to all tabs
  - `supervisor` (password-only login) → Limited access (no Machine Data, no Admin Users tabs)
- **Backend**: `loginAdmin()`, `getAdminUsers()`, `saveAdminUser()`, `deleteAdminUser()`
- **UI**: Two-mode login screen in Admin.html
- **Protection**: Super Admin (`yogeshkp85@gmail.com`) cannot be deleted

### 3. Daily CSV Data Export
- **Function**: `sendDailyDataExport()`
- **Trigger**: Time-driven, 3-4 AM UTC (9 AM IST)
- **Recipients**: `yogeshkp85@gmail.com`, `engg.cn@parksonspackaging.com`
- **Format**: CSV attachment with filename `raw_data_YYYYMMDD.csv`
- **Subject**: `Parksons Maintenance - Daily Data Export - DD/MM/YYYY`
- **Content**: All rows from `Raw_Data` sheet with proper CSV escaping

---

## 🐛 KNOWN ISSUES & FIXES

| Issue | Status | Notes |
|-------|--------|-------|
| Admin panel "Failed to fetch" | ✅ Fixed | POST→GET CORS fix applied |
| Columns C/D dates blank | ✅ Fixed | Date mapping corrected |
| getUi() in time-driven trigger | ✅ Fixed | Removed from sendDailyEmailReport |

---

## ✅ SYSTEM GOVERNANCE CHECKLIST

- [x] KPI = Approved data ONLY
- [x] Pending = visible, never in KPI
- [x] Backup = automatic, date-wise
- [x] Deployment = logged
- [x] Versioning = mandatory on major updates
- [x] Errors = always captured via try-catch
- [x] Machine Data = persistent & manageable
- [x] Admin Login = multi-level with role-based access
- [x] Daily Export = automated at 9 AM IST

---

## 📋 DEPLOYMENT CHECKLIST (v2.0)

- [x] Code.gs updated with Machine Data, Admin Users, Daily Export functions
- [x] Admin.html updated with login screen, role-based tabs, Machine Data tab, Admin Users tab
- [x] Form.html updated with dynamic machine loading from sheet
- [x] New deployment created: `AKfycbzHWip5IomqAGlmU78rsoPlX1AFJHKWeZ5u28qWQmKO9VMHAUdKystKv_NigL6XNLKS`
- [x] All files updated with new deployment URL
- [x] 9 AM IST trigger configured for `sendDailyDataExport`
- [x] Git committed and pushed
- [x] Project reorganized to enterprise structure

---

_END OF MEMORY FILE_
