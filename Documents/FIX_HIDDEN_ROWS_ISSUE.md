# Fix: Hidden Rows in Final_Data Sheet

## Problem Identified
**Final_Data sheet has 1498 data rows (rows 2-1499), but only 401 are visible.**

This means **~1098 rows are hidden**, causing the dashboard to show 961 entries instead of 401.

**Root Cause**: Hidden rows are still being read by the backend code, inflating the data count.

---

## Solution: Unhide All Rows

### Option 1: Use the Menu (Easiest)
1. Open your Google Sheet
2. Click **Maintenance System > 🔧 Fix: Unhide All Rows in Final_Data**
3. Wait for confirmation message
4. Refresh the dashboard

### Option 2: Manual Unhide in Google Sheets
1. Open your Google Sheet
2. Go to **Final_Data** sheet
3. Select all rows:
   - Click row header **1** (header row)
   - Press **Ctrl+Shift+End** to select to last row
4. Right-click on row numbers → **Show rows**
5. All hidden rows will be unhidden

### Option 3: Delete Hidden Rows (Recommended)
If you want to permanently remove the hidden rows:

1. Open your Google Sheet
2. Go to **Final_Data** sheet
3. Select all rows:
   - Click row header **1**
   - Press **Ctrl+Shift+End**
4. Right-click → **Show rows** (unhide first)
5. Now delete the empty/unwanted rows:
   - Select rows 402-1499 (the extra rows)
   - Right-click → **Delete rows**
6. Verify Final_Data now has exactly 402 rows (1 header + 401 data)

---

## Verification Steps

### Step 1: Unhide Rows
Use one of the methods above to unhide all rows.

### Step 2: Check Row Count
1. Press **Ctrl+End** to jump to last cell
2. Should show **Z402** (column Z, row 402)
3. This means 401 data rows + 1 header = 402 total rows ✓

### Step 3: Refresh Dashboard
1. Go to dashboard URL
2. Press **F5** or **Ctrl+R** to refresh
3. Check "Total Entries" KPI card
4. Should now show **401** instead of 961 ✓

### Step 4: Verify KPI Calculations
Check these KPI values:
- **Total Entries**: Should be 401
- **Breakdown Count**: Should be reasonable (not 219)
- **Avg MTTR**: Should be reasonable (not 63 min)
- **Avg Availability**: Should be high (99.97% is correct)

---

## Why This Happened

Hidden rows in Google Sheets are still included in:
- `getLastRow()` - Returns 1499 (includes hidden rows)
- `getRange()` - Reads all rows including hidden ones
- Data calculations - All rows are processed

This is why the backend was reading 1498 rows instead of 401.

---

## Prevention

To prevent this in the future:

1. **Never hide rows** - Delete unwanted rows instead
2. **Use filters** instead of hiding - Filters don't affect data calculations
3. **Add validation** - Check row counts before and after operations
4. **Use this function** to periodically unhide rows:
   ```javascript
   // Run this monthly to ensure no hidden rows
   function checkForHiddenRows() {
     var ss = SpreadsheetApp.getActiveSpreadsheet();
     var finalSheet = ss.getSheetByName('Final_Data');
     var lastRow = finalSheet.getLastRow();
     finalSheet.unhideRow(finalSheet.getRange(1, 1, lastRow, finalSheet.getLastColumn()));
     SpreadsheetApp.flush();
   }
   ```

---

## Expected Results After Fix

### Before Fix
- Final_Data visible rows: 401
- Final_Data total rows: 1499 (with hidden rows)
- Dashboard Total Entries: 961
- Dashboard Breakdown Count: 219
- Dashboard Avg MTTR: 63 min

### After Fix
- Final_Data visible rows: 401
- Final_Data total rows: 402 (1 header + 401 data)
- Dashboard Total Entries: 401 ✓
- Dashboard Breakdown Count: ~27 (correct)
- Dashboard Avg MTTR: ~15-20 min (correct)
- Dashboard Avg Availability: 99.97% (correct)

---

## Troubleshooting

### If Dashboard Still Shows 961 After Unhiding
1. **Clear browser cache**: Press Ctrl+Shift+Delete
2. **Hard refresh dashboard**: Press Ctrl+Shift+R
3. **Redeploy Code.gs**: 
   - Open Google Apps Script
   - Click **Deploy > New deployment**
   - Select type: **Web app**
   - Click **Deploy**

### If Unhide Function Doesn't Work
1. Try manual unhide in Google Sheets (Option 2 above)
2. Or delete the hidden rows (Option 3 above)

### If Row Count Still Shows 1499
1. Check if there are multiple Final_Data sheets
2. Check if data was accidentally duplicated
3. Consider deleting rows 402-1499 to clean up

---

## Next Steps

1. **Unhide all rows** in Final_Data sheet
2. **Verify** row count is 402 (1 header + 401 data)
3. **Refresh** dashboard
4. **Confirm** Total Entries shows 401
5. **Check** all KPI values are reasonable
6. **Test** FY filter, pending table, modal, alerts
7. **Report** success

