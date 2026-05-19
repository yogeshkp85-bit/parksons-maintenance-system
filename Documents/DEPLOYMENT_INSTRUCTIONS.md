# Quick Deployment Guide - Dashboard Interactive Features

**Time Required**: 5 minutes  
**Status**: Ready to Deploy

---

## What's Changed

✅ FY Filter dropdown added  
✅ Drill-down modal enhanced with all entry fields  
✅ Escape key support added  
✅ Pending entries table verified  
✅ Alert system verified  

---

## Deployment Steps (5 Minutes)

### Step 1: Copy Updated Dashboard.html (1 minute)

1. Open this file in your editor:
   ```
   Maintenance_System/src/Dashboard.html
   ```

2. Select ALL content (Ctrl+A or Cmd+A)

3. Copy it (Ctrl+C or Cmd+C)

---

### Step 2: Paste into Google Apps Script (1 minute)

1. Go to your Google Apps Script project:
   ```
   https://script.google.com/home
   ```

2. Open your Parksons Maintenance System project

3. Click on **Dashboard.html** file in the left sidebar

4. Select ALL content in the editor (Ctrl+A)

5. Delete it

6. Paste the new content (Ctrl+V)

7. Click **Save** (Ctrl+S)

---

### Step 3: Create New Deployment (2 minutes)

1. Click the **Deploy** button (top right)

2. Click **New Deployment**

3. Select deployment type:
   - Click the gear icon ⚙️
   - Select **Web app**

4. Configure:
   - **Execute as**: [Your email/account]
   - **Who has access**: Anyone

5. Click **Deploy**

6. A dialog appears with your new deployment URL
   - **Copy this URL** - you'll need it

---

### Step 4: Update Code.gs with New URL (1 minute)

1. In Google Apps Script, click **Code.gs**

2. Find this line (around line 39):
   ```javascript
   var DEPLOYMENT_URL = 'https://script.google.com/macros/s/...';
   ```

3. Replace the entire URL with your new deployment URL from Step 3

4. Click **Save** (Ctrl+S)

---

### Step 5: Test the Dashboard (Optional)

1. Open your new deployment URL with `?page=dashboard`:
   ```
   https://script.google.com/macros/s/YOUR_NEW_ID/exec?page=dashboard
   ```

2. You should see:
   - ✅ FY filter dropdown (first filter in the bar)
   - ✅ Pending entries table
   - ✅ Click any row to see drill-down modal
   - ✅ Press Escape to close modal
   - ✅ Alert panel above KPI section

---

## New Features to Test

### 1. FY Filter
- Look for dropdown labeled "All Financial Years"
- Select "FY 2024-25"
- All KPIs, charts, and tables update

### 2. Drill-Down Modal
- Click any row in "Recent Entries" or "Top Downtime Events"
- Modal shows all entry details
- Press Escape to close

### 3. Pending Entries Table
- Scroll to "Pending Entries (Awaiting Approval)"
- Click any row to see details

### 4. Alert System
- Look above KPI section
- Red alerts (⚠) = Critical
- Orange alerts (⚡) = Warning
- Green alerts (✓) = Normal

---

## Troubleshooting

**Issue**: Changes not showing
- **Solution**: Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

**Issue**: Old URL still showing old version
- **Solution**: Use the new deployment URL from Step 3

**Issue**: FY filter dropdown empty
- **Solution**: Verify data is loading (check browser console for errors)

---

## Files Ready for Deployment

✅ `Maintenance_System/src/Dashboard.html` - Updated with all features  
✅ `Maintenance_System/src/Code.gs` - No changes needed (already correct)

---

## Current Deployment URL (Old)

```
https://script.google.com/macros/s/AKfycbzHWip5IomqAGlmU78rsoPlX1AFJHKWeZ5u28qWQmKO9VMHAUdKystKv_NigL6XNLKS/exec
```

**After deployment, you'll get a NEW URL** - use that instead.

---

## Support

If you encounter any issues:
1. Check browser console (F12) for errors
2. Verify all content was copied correctly
3. Ensure you saved both Dashboard.html and Code.gs
4. Try a hard refresh of the page

---

**Ready to deploy? Follow the 5 steps above!**
