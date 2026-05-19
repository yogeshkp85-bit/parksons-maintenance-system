# Deployment Guide - PM Schedule vs Compliance Feature

**Date**: May 19, 2026  
**Status**: Ready to Deploy  
**Time Required**: 10 minutes

---

## What's Changed

✅ **PM Compliance Page** - New interactive dashboard for PM schedule tracking  
✅ **Backend Functions** - `getPMComplianceData()` updated to read from PM_Schedule sheet  
✅ **Menu Item** - "Open PM Schedule vs Compliance" added to Maintenance System menu  
✅ **Helper Functions** - Date parsing and PM calculation functions verified  
✅ **PM_Schedule Sheet** - Complete with all 86 machines in Excel-like format  

---

## Prerequisites

Before deploying, ensure:

1. ✅ **PM_Schedule sheet exists** in your Google Sheet
   - Should have 86 machines with columns: Sr. No, Section, Machine Name, Machine ID, Installation Date, Warranty, Apr 2025 - Mar 2026, Yearly %
   - If not, run menu item: **✓ CREATE: Initialize PM_Schedule Sheet**

2. ✅ **Final_Data sheet** has maintenance records
   - Should have columns: Date, Machine_Name, Status, etc.
   - This is where PM compliance data comes from

3. ✅ **Current deployment URL** is working
   - Current URL: `https://script.google.com/macros/s/AKfycbwWgwK3Iu17-otCE-GdkoUHDe-COYzXR9awIETObfxJctigYLTF4M293ktJnGthQPfG/exec`

---

## Deployment Steps (10 Minutes)

### Step 1: Create PM_Schedule Sheet (2 minutes)

If you don't have a PM_Schedule sheet yet:

1. Open your Google Sheet
2. Go to **Maintenance System** menu
3. Click **✓ CREATE: Initialize PM_Schedule Sheet**
4. Wait for confirmation message
5. Verify the sheet was created with 86 machines

**Alternative**: Import your Excel file as `PM_Schedule_Master` sheet
- The system will automatically use `PM_Schedule_Master` if it exists
- Otherwise, it falls back to `PM_Schedule`

---

### Step 2: Deploy Code Changes (3 minutes)

1. Open Google Apps Script:
   ```
   https://script.google.com/home
   ```

2. Open your Parksons Maintenance System project

3. Click **Code.gs** in the left sidebar

4. The file should already have the updates (they were made in the editor)

5. Click **Save** (Ctrl+S)

---

### Step 3: Create New Deployment (3 minutes)

1. Click the **Deploy** button (top right)

2. Click **New Deployment** (or **Manage Deployments** → **Create new version**)

3. Select deployment type:
   - Click the gear icon ⚙️
   - Select **Web app**

4. Configure:
   - **Execute as**: [Your email/account]
   - **Who has access**: Anyone

5. Click **Deploy**

6. A dialog appears with your deployment URL
   - **Copy this URL** - you'll need it for testing

---

### Step 4: Test PM Compliance Page (2 minutes)

1. Open the PM Compliance page:
   ```
   https://script.google.com/macros/s/AKfycbwWgwK3Iu17-otCE-GdkoUHDe-COYzXR9awIETObfxJctigYLTF4M293ktJnGthQPfG/exec?page=pm-compliance
   ```

2. You should see:
   - ✅ Header with "PM SCHEDULE vs COMPLIANCE"
   - ✅ Live data badge
   - ✅ Refresh button
   - ✅ KPI cards showing: Total Machines, On-Time, Overdue, Pending, Overall Compliance %
   - ✅ Machine-wise compliance table with columns: Machine Name, Section, Last PM, Next Scheduled, Days Until, Status

3. If you see data:
   - ✅ **Deployment successful!**
   - The page is reading from your PM_Schedule sheet
   - Compliance status is calculated from Final_Data maintenance records

---

## Accessing PM Compliance Page

### Method 1: From Menu (Recommended)
1. Open your Google Sheet
2. Go to **Maintenance System** menu
3. Click **Open PM Schedule vs Compliance**
4. Page opens in new tab

### Method 2: Direct URL
```
https://script.google.com/macros/s/AKfycbwWgwK3Iu17-otCE-GdkoUHDe-COYzXR9awIETObfxJctigYLTF4M293ktJnGthQPfG/exec?page=pm-compliance
```

### Method 3: From URLs Page
1. Open: `https://script.google.com/macros/s/AKfycbwWgwK3Iu17-otCE-GdkoUHDe-COYzXR9awIETObfxJctigYLTF4M293ktJnGthQPfG/exec`
2. Click **PM Schedule vs Compliance** button

---

## Features of PM Compliance Page

### KPI Cards
- **Total Machines**: Count of all machines in PM_Schedule
- **On-Time**: Machines with PM completed within schedule
- **Overdue**: Machines with PM past due date
- **Pending**: Machines with no PM record yet
- **Overall Compliance %**: Percentage of on-time PMs

### Machine-Wise Table
- **Machine Name**: Equipment name from PM_Schedule
- **Section**: Department/section (Printing, Corrugation, etc.)
- **Last PM Date**: Last approved maintenance from Final_Data
- **Next Scheduled PM**: Calculated based on frequency
- **Days Until**: Days remaining until next PM due
- **Status**: On-Time (green), Overdue (red), or Pending (orange)

### Filters
- **Section Filter**: Filter by department
- **Status Filter**: Filter by compliance status
- **Reset Button**: Clear all filters

### Refresh Button
- Click to manually refresh data
- Auto-refresh can be configured (optional)

---

## Troubleshooting

### Issue: "PM_Schedule sheet is empty"
**Solution**: 
1. Run menu item: **✓ CREATE: Initialize PM_Schedule Sheet**
2. Or import your Excel file as `PM_Schedule_Master`

### Issue: No machines showing in table
**Solution**:
1. Verify PM_Schedule sheet has data (at least 2 rows: header + 1 machine)
2. Check that machine names match between PM_Schedule and Final_Data
3. Open browser console (F12) and check for errors

### Issue: All machines showing "Pending" status
**Solution**:
1. This is normal if no maintenance records exist yet
2. Submit maintenance entries through the Form
3. Approve them in the Admin panel
4. Refresh the PM Compliance page

### Issue: Page not loading
**Solution**:
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Check browser console (F12) for JavaScript errors
3. Verify deployment URL is correct
4. Try accessing from a different browser

### Issue: Auto-refresh dropdown not showing in Dashboard
**Solution**:
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. The dropdown should appear in the header next to the Refresh button
4. If still not showing, check browser console for errors

---

## Files Modified

✅ `Maintenance_System/src/Code.gs`
- Added `openPMCompliance()` function
- Updated `getPMComplianceData()` to handle both Excel and simple formats
- Updated menu to include PM Compliance link
- Fixed `initializePMScheduleSheet()` to prevent errors

✅ `Maintenance_System/src/PM_Compliance.html`
- Already created and ready to use
- No changes needed

✅ `Maintenance_System/src/PM_SCHEDULE_DATA.gs`
- Already has `createPMScheduleSheetComplete()` function
- Creates all 86 machines with proper formatting

✅ `Maintenance_System/src/URLs.html`
- Already includes PM Compliance link
- No changes needed

---

## Next Steps

1. **Deploy** using the steps above
2. **Test** the PM Compliance page
3. **Create PM_Schedule sheet** if it doesn't exist
4. **Submit maintenance entries** through the Form
5. **Approve entries** in the Admin panel
6. **View compliance** in the PM Compliance page

---

## Support

If you encounter issues:
1. Check browser console (F12) for error messages
2. Verify all sheets exist (PM_Schedule, Final_Data, Raw_Data)
3. Ensure machine names match between sheets
4. Try hard refresh (Ctrl+Shift+R)
5. Check the deployment URL is correct

---

**Ready to deploy? Follow the steps above!**

Current Deployment URL:
```
https://script.google.com/macros/s/AKfycbwWgwK3Iu17-otCE-GdkoUHDe-COYzXR9awIETObfxJctigYLTF4M293ktJnGthQPfG/exec
```

