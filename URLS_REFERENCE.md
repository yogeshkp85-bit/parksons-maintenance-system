# PARKSONS MAINTENANCE SYSTEM - URLS REFERENCE
**Date**: 2026-04-30  
**Version**: v3.19 (@66)  
**Status**: ✅ LIVE & WORKING

---

## 📍 GOOGLE DRIVE LOCATIONS

### Main Folder
**Google Drive Folder**: https://drive.google.com/drive/folders/1AT_Sil0sN5xUADNkuOz2ns01gXlawWlqyidkL4BNG7c

### Source Code Folder
**Location**: `G:\My Drive\Parksons\Maintenance_System\src\`  
**Google Drive URL**: https://drive.google.com/drive/folders/[FOLDER_ID]/src

**Files in src/ folder**:
- Code.gs
- Code.test.gs
- ReportFunctions.gs
- Dashboard.html
- Admin.html
- Form.html
- KPI_Comparison.html
- URLs.html
- appsscript.json

### Google Sheet (Data Source)
**Sheet ID**: `1AT_Sil0sN5xUADNkuOz2ns01gXlawWlqyidkL4BNG7c`  
**Sheet URL**: https://docs.google.com/spreadsheets/d/1AT_Sil0sN5xUADNkuOz2ns01gXlawWlqyidkL4BNG7c/edit

**Sheets in the workbook**:
- Raw_Data (Form submissions)
- Final_Data (Approved entries)
- Historical_KPI (KPI data for dashboard)
- Machine_Data (Machine configuration)
- Admin_Users (Admin login credentials)
- Error_Log (Error tracking)
- Versions (Version history)
- Alert_Log (Alert history)
- Benchmark_History (Benchmark data)
- Report_Templates (Report configurations)
- Trend_Data (Historical trends)
- Alert_Config (Alert configuration)
- Alert_Preferences (User preferences)

---

## 🚀 DEPLOYMENT URLS (LIVE & WORKING)

### Current Deployment
**Deployment ID**: `AKfycbzNZ8rIJZyUhmU34REXty5qXVA8O5ovs1Oa489Rs_h2PIT8ysqHFqeATYe2aFit2agY`  
**Version**: v3.19 (@66)  
**Status**: ✅ LIVE

### Application URLs

#### 1. Dashboard (Main Page)
**URL**: https://script.google.com/macros/s/AKfycbzNZ8rIJZyUhmU34REXty5qXVA8O5ovs1Oa489Rs_h2PIT8ysqHFqeATYe2aFit2agY/exec?page=dashboard

**Features**:
- Last 50 entries (approved + pending)
- KPI cards and metrics
- Charts and analytics
- Drill-down functionality
- Machine performance comparison

#### 2. KPI Comparison (3-Year Analysis)
**URL**: https://script.google.com/macros/s/AKfycbzNZ8rIJZyUhmU34REXty5qXVA8O5ovs1Oa489Rs_h2PIT8ysqHFqeATYe2aFit2agY/exec?page=kpi

**Features**:
- ✅ Financial Year KPI Summary (FY 2023-24, 2024-25, 2025-26)
- ✅ Monthly Trend Comparison (MTTR, MTBF, Availability, Breakdown Count)
- ✅ Machine-wise Comparison (MTBF, MTTR, Availability, Breakdowns)
- ✅ Drilldown Table (176 rows of historical data)
- ✅ Filters (Machine & Financial Year)
- ✅ All charts populated with data

#### 3. Admin Panel
**URL**: https://script.google.com/macros/s/AKfycbzNZ8rIJZyUhmU34REXty5qXVA8O5ovs1Oa489Rs_h2PIT8ysqHFqeATYe2aFit2agY/exec?page=admin

**Features**:
- Multi-level admin login (SuperAdmin + Supervisor)
- Pending entries review
- Approve/Reject/Edit functionality
- Machine Data management
- Admin Users management

#### 4. Maintenance Entry Form
**URL**: https://script.google.com/macros/s/AKfycbzNZ8rIJZyUhmU34REXty5qXVA8O5ovs1Oa489Rs_h2PIT8ysqHFqeATYe2aFit2agY/exec?page=form

**Features**:
- Maintenance entry form
- Collects: Date, Shift, Machine, Problem, Action, etc.
- Submits to Raw_Data sheet
- Generates RefId automatically

#### 5. URLs Reference Page
**URL**: https://script.google.com/macros/s/AKfycbzNZ8rIJZyUhmU34REXty5qXVA8O5ovs1Oa489Rs_h2PIT8ysqHFqeATYe2aFit2agY/exec?page=urls

**Features**:
- Quick access to all system URLs
- Reference page for all pages

---

## 📋 QUICK ACCESS LINKS

### For Sharing with Team
**Send this link to access the KPI Dashboard**:
```
https://script.google.com/macros/s/AKfycbzNZ8rIJZyUhmU34REXty5qXVA8O5ovs1Oa489Rs_h2PIT8ysqHFqeATYe2aFit2agY/exec?page=kpi
```

**Send this link to access the Main Dashboard**:
```
https://script.google.com/macros/s/AKfycbzNZ8rIJZyUhmU34REXty5qXVA8O5ovs1Oa489Rs_h2PIT8ysqHFqeATYe2aFit2agY/exec?page=dashboard
```

**Send this link to access the Admin Panel**:
```
https://script.google.com/macros/s/AKfycbzNZ8rIJZyUhmU34REXty5qXVA8O5ovs1Oa489Rs_h2PIT8ysqHFqeATYe2aFit2agY/exec?page=admin
```

**Send this link to access the Google Sheet**:
```
https://docs.google.com/spreadsheets/d/1AT_Sil0sN5xUADNkuOz2ns01gXlawWlqyidkL4BNG7c/edit
```

---

## 🔐 Admin Credentials

**SuperAdmin Login**:
- Email: yogeshkp85@gmail.com
- Password: PKS@2026

**Access Level**: Full access to all features

---

## 📊 Data Summary

**Historical KPI Data**:
- Total Rows: 176
- Financial Years: 3 (2023-24, 2024-25, 2025-26)
- Machines: 5 (KBA-1, KBA-2, KBA-3, CX-1, CX-2)
- Months: 12 (Apr-Mar)
- Metrics: MTBF, MTTR, Availability, Breakdown Count

**Raw Data**:
- Total Entries: 379
- Status: Mix of PENDING_REVIEW, APPROVED, REJECTED

**Final Data**:
- Approved Entries: 379
- Used for: Dashboard, KPI calculations

---

## 🔄 How to Update URLs

When a new deployment is created:

1. **Update DEPLOYMENT_URL in Code.gs**:
   ```javascript
   var DEPLOYMENT_URL = 'https://script.google.com/macros/s/[NEW_DEPLOYMENT_ID]/exec';
   ```

2. **Push to Google Apps Script**:
   ```bash
   clasp push
   ```

3. **Update the deployment** (don't create new):
   ```bash
   clasp deploy -i [DEPLOYMENT_ID] -d "Description"
   ```

4. **Update this file** with new URLs

---

## ✅ Verification Checklist

- [x] KPI Dashboard displaying all data
- [x] All charts populated
- [x] Drilldown table showing 176 rows
- [x] Filters working (Machine & FY)
- [x] Admin panel accessible
- [x] Form submission working
- [x] Data synced to Google Sheet
- [x] All URLs functional

---

**Last Updated**: 2026-04-30  
**Status**: ✅ ALL URLS LIVE & WORKING  
**Deployment Version**: v3.19 (@66)

