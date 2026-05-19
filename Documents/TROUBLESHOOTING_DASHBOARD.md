# 🔧 Dashboard Troubleshooting Guide

**Problem**: Dashboard loading but features broken (KPI wrong, charts missing, FY filter not showing, modal not working)

---

## Root Cause Analysis

The issue is likely that **Dashboard.html in Google Apps Script is incomplete or outdated**.

When you copied Dashboard.html, it may not have included all the new features we implemented.

---

## ✅ Complete Fix (10 Minutes)

### Step 1: Verify Dashboard.html in Google Apps Script

1. Go to Google Apps Script
2. Click on **Dashboard.html** in the left sidebar
3. Look at the file size:
   - **Should be**: ~30-40 KB (large file with all features)
   - **If it's**: < 20 KB, it's incomplete

### Step 2: If Dashboard.html is Incomplete

**Delete and recreate it:**

1. **In Google Apps Script**:
   - Right-click on Dashboard.html
   - Click "Delete"
   - Confirm deletion

2. **Create new Dashboard.html**:
   - Click **+** (plus icon) next to "Files"
   - Select **HTML file**
   - Name it: `Dashboard.html`

3. **Copy complete Dashboard.html**:
   - Open: `Maintenance_System/src/Dashboard.html` (in your editor)
   - Select ALL (Ctrl+A)
   - Copy (Ctrl+C)

4. **Paste into Google Apps Script**:
   - In Google Apps Script, click the new Dashboard.html
   - Paste (Ctrl+V)
   - Save (Ctrl+S)

### Step 3: Verify Code.gs

1. **In Google Apps Script**, click **Code.gs**
2. **Find line 39**: `var DEPLOYMENT_URL = '...'`
3. **Verify it has the NEW URL** (ending in `...BOxu6/exec`)
4. If not, update it with the correct URL
5. **Save** (Ctrl+S)

### Step 4: Create New Deployment

1. Click **Deploy** (top right)
2. Click **New Deployment**
3. Select **Web app** (gear icon ⚙️)
4. Execute as: Your email
5. Who has access: Anyone
6. Click **Deploy**
7. **Copy the new URL**

### Step 5: Update Code.gs Again

1. Click **Code.gs**
2. Find line 39: `var DEPLOYMENT_URL = '...'`
3. Replace with the NEW URL from Step 4
4. Save (Ctrl+S)

### Step 6: Test Dashboard

1. Open the new deployment URL with `?page=dashboard`:
   ```
   https://script.google.com/macros/s/[YOUR_ID]/exec?page=dashboard
   ```

2. **Hard refresh** (Ctrl+Shift+R)

3. **Verify all features**:
   - ✅ FY filter dropdown visible
   - ✅ KPI cards show correct data
   - ✅ Charts render
   - ✅ Pending entries table visible
   - ✅ Click row → modal opens
   - ✅ Alert panel visible

---

## 🔍 What Each Feature Should Look Like

### FY Filter ✅
- **Location**: First filter in the filter bar (after "Filter:" label)
- **Label**: "All Financial Years"
- **Options**: All, FY 2023-24, FY 2024-25, FY 2025-26
- **Behavior**: Selecting an option updates all KPIs, charts, and tables

### KPI Cards ✅
- **Should show**: 7 cards with metrics
  - Avg MTTR (minutes)
  - Avg MTBF (hours)
  - Total Downtime (hours)
  - Breakdown Count (events)
  - Avg Availability (%)
  - Breakdown % (%)
  - Total Entries (records)
- **Data**: Should match your actual maintenance data

### Charts ✅
- **Should show**: 9 charts
  - Monthly Downtime & Breakdown Count
  - Category Distribution
  - Machine-wise Breakdown Count
  - MTTR Trend
  - Category-wise Downtime
  - Problem Type Downtime
  - Downtime by Shift
  - Downtime by Department
  - Top 10 Machines by Downtime

### Pending Entries Table ✅
- **Location**: Below KPI section, before charts
- **Title**: "Pending Entries (Awaiting Approval)"
- **Content**: Entries with PENDING_REVIEW status
- **Columns**: Date, Machine, Dept, Unit, Shift, Category, Problem Type, Description, Duration, Attended By, Action
- **Styling**: Yellow/orange background

### Drill-Down Modal ✅
- **Trigger**: Click any row in any table
- **Content**: All 15 entry fields
  - Ref ID, Date, Shift, Machine Type, Machine Name, Unit
  - Problem Type, Category, Time Start, Time End, Duration
  - Attended By, Status, Description, Action Taken, Root Cause
- **Close**: Press Escape, click X button, or click outside

### Alert System ✅
- **Location**: Above KPI section
- **Colors**:
  - RED (⚠) = Critical alerts
  - ORANGE (⚡) = Warning alerts
  - GREEN (✓) = Normal status
- **Content**: Alert message, current value, threshold

---

## 🐛 Common Issues & Fixes

### Issue: FY Filter Not Showing
**Cause**: Dashboard.html incomplete or outdated
**Fix**: Delete and recreate Dashboard.html (see Step 2 above)

### Issue: Charts Not Rendering
**Cause**: Data not being passed correctly
**Fix**: 
1. Hard refresh (Ctrl+Shift+R)
2. Check browser console (F12) for errors
3. Verify Code.gs has correct DEPLOYMENT_URL

### Issue: KPI Data Wrong
**Cause**: Using old data structure
**Fix**: Verify getDashboardData() in Code.gs returns correct structure

### Issue: Modal Not Opening
**Cause**: JavaScript not loaded or outdated
**Fix**: Delete and recreate Dashboard.html

### Issue: Pending Table Empty
**Cause**: No pending entries in data
**Fix**: Add a pending entry through the form and check again

---

## ✨ Quick Verification Checklist

After deployment, verify:

- [ ] Dashboard loads without errors
- [ ] FY filter dropdown visible in filter bar
- [ ] KPI cards show 7 metrics
- [ ] Charts render (9 total)
- [ ] Pending entries table visible
- [ ] Click any row → modal opens
- [ ] Modal shows all 15 fields
- [ ] Escape key closes modal
- [ ] Alert panel visible above KPIs
- [ ] No red errors in console (F12)

---

## 📞 If Still Not Working

**Try this nuclear option:**

1. **Delete ALL HTML files** from Google Apps Script:
   - Dashboard.html
   - Admin.html
   - Form.html
   - KPI_Comparison.html
   - URLs.html

2. **Copy all files fresh** from `Maintenance_System/src/`:
   - Dashboard.html
   - Admin.html
   - Form.html
   - KPI_Comparison.html
   - URLs.html
   - appsscript.json

3. **Paste each one** into Google Apps Script

4. **Create new deployment** and test

---

## 📊 Expected Data Flow

```
Google Sheets (Raw_Data + Final_Data)
         ↓
    Code.gs (getDashboardData)
         ↓
    Dashboard.html (receives data)
         ↓
    JavaScript (parses & displays)
         ↓
    User sees: KPIs, Charts, Tables, Modal, Alerts
```

If any step breaks, the whole chain fails.

---

## 🎯 Success Indicators

✅ **All features working when:**
- FY filter visible and functional
- KPI cards show correct data
- Charts render with data
- Pending table shows pending entries
- Click row → modal opens with all fields
- Alert panel shows above KPIs
- No console errors

---

**Follow the 6-step fix above and your dashboard should work!**

If you're still having issues, let me know what specific error messages you see in the browser console (F12).
