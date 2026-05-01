# TASK 4: DASHBOARD TESTING GUIDE

**Date**: May 1, 2026  
**Version**: v3.21 (@68)  
**Status**: Ready for Testing

---

## 🎯 WHAT WAS CHANGED

The Dashboard.html frontend has been updated to use the new data structure from the backend `getDashboardData()` function. This means:

1. **KPI metrics are now pre-calculated on the backend** instead of being recalculated on the frontend
2. **Dashboard displays both approved and pending entries** in the tables
3. **KPI cards show metrics based on approved data only**
4. **Filters work with the new data structure**

---

## 🧪 TESTING CHECKLIST

### Test 1: Dashboard Loads Without Errors
**Steps**:
1. Open Dashboard: https://script.google.com/macros/s/AKfycbxo4lP2xog4XD-NoCCFUZdYw0V_ADiCNNKvssoAIvMyC7xMO8_NZSt7I81jckhHCkjz/exec?page=dashboard
2. Wait for page to load completely
3. Check browser console for errors (F12 → Console tab)

**Expected Result**: ✅ Page loads without errors, all KPI cards display values

---

### Test 2: KPI Cards Display Correct Values
**Steps**:
1. Open Dashboard
2. Check KPI cards:
   - Avg MTTR (minutes)
   - Avg MTBF (hours)
   - Total Downtime (hours)
   - Breakdown Count (events)
   - Avg Availability (%)
   - Breakdown % (%)
   - Total Entries (records)

**Expected Result**: ✅ All KPI cards show numeric values (not "--" or "NaN")

**Verification**:
- MTTR should be > 0 if there are breakdowns
- MTBF should be > 0 if there are breakdowns
- Availability should be between 0-100%
- Breakdown % should be between 0-100%

---

### Test 3: Charts Display Data
**Steps**:
1. Open Dashboard
2. Scroll down to "Trend Analysis" section
3. Check all charts:
   - Monthly Downtime & Breakdown Count
   - Category Distribution
   - Machine-wise Breakdown Count
   - MTTR Trend (Monthly Avg)
   - Category-wise Downtime
   - Problem Type Downtime
   - Downtime by Shift
   - Downtime by Department
   - Top 10 Machines by Downtime

**Expected Result**: ✅ All charts display data (not empty)

---

### Test 4: Tables Display Data
**Steps**:
1. Open Dashboard
2. Scroll down to tables section
3. Check:
   - Machine Availability Summary table
   - Accumulative Monthly Summary table
   - Recent Entries (Last 50) table
   - Highest Downtime Events (Top 50) table

**Expected Result**: ✅ All tables show data rows (not "No data" message)

---

### Test 5: Filters Work Correctly
**Steps**:
1. Open Dashboard
2. Use filter bar at top:
   - Select a Month
   - Select a Department
   - Select a Machine
   - Select a Shift
   - Select a Category
   - Select a Person

**Expected Result**: ✅ 
- KPI cards update with filtered data
- Charts update with filtered data
- Tables update with filtered data
- Reset button clears all filters

---

### Test 6: Pending Entries Warning
**Steps**:
1. Open Dashboard
2. Check if there's a yellow warning banner at top of main content

**Expected Result**: ✅ If there are pending entries, warning shows:
- "X entries pending approval — not shown in dashboard"
- Link to "Open Admin Panel to approve"

---

### Test 7: Data Accuracy
**Steps**:
1. Open Dashboard
2. Note the KPI values
3. Open Admin Panel
4. Check if pending entries are NOT included in KPI
5. Approve a pending entry
6. Refresh Dashboard
7. Check if KPI values updated

**Expected Result**: ✅ 
- Pending entries don't affect KPI
- After approving, KPI updates correctly
- Approved entries appear in KPI

---

### Test 8: Pending Entries in Tables
**Steps**:
1. Open Dashboard
2. Scroll to "Recent Entries (Last 50)" table
3. Look for entries with status badge

**Expected Result**: ✅ 
- Approved entries show normally
- Pending entries show with yellow/orange highlight
- Rejected entries are hidden

---

### Test 9: Admin Panel Integration
**Steps**:
1. Open Dashboard
2. Click "Admin" button in header
3. Approve a pending entry
4. Go back to Dashboard
5. Refresh page
6. Check if KPI updated

**Expected Result**: ✅ 
- Admin panel opens in new tab
- After approving entry, Dashboard KPI updates
- New entry appears in KPI calculations

---

### Test 10: Mobile Responsiveness
**Steps**:
1. Open Dashboard
2. Resize browser window to mobile size (375px width)
3. Check if layout adapts
4. Try scrolling and using filters

**Expected Result**: ✅ 
- Layout adapts to mobile size
- All elements remain readable
- Filters still work

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue 1: KPI Cards Show "--" or "NaN"
**Cause**: Backend not returning kpiData correctly  
**Solution**: 
1. Check browser console for errors
2. Verify Final_Data sheet has approved entries
3. Refresh page and try again

### Issue 2: Charts Are Empty
**Cause**: No data in filtered results  
**Solution**:
1. Click "Reset" button to clear filters
2. Check if data exists in tables
3. Verify Final_Data sheet has data

### Issue 3: Tables Show "No data"
**Cause**: No entries match filter criteria  
**Solution**:
1. Click "Reset" button to clear filters
2. Check if entries exist in Raw_Data sheet
3. Verify entries have correct status

### Issue 4: Filters Don't Work
**Cause**: monthYear field not calculated correctly  
**Solution**:
1. Refresh page
2. Check browser console for errors
3. Verify date format is DD/MM/YYYY

---

## 📊 DATA VALIDATION

### Check Backend Data Structure
**Steps**:
1. Open browser console (F12)
2. Type: `console.log(RAW_DATA_JSON)`
3. Check if output contains:
   - `approvedData` array
   - `last50` array
   - `kpiData` object
   - `generated` timestamp

**Expected Output**:
```javascript
{
  error: null,
  approvedData: [...],
  rawData: [...],
  last50: [...],
  kpiData: {
    totalEntries: 123,
    totalBreakdowns: 45,
    totalDowntimeMin: 5400,
    avgMTTR: 120,
    avgMTBF: 1800,
    avgAvailability: 98.5,
    pendingCount: 0
  },
  generated: "2026-05-01T..."
}
```

---

## ✅ SIGN-OFF CHECKLIST

- [ ] Dashboard loads without errors
- [ ] All KPI cards display values
- [ ] All charts display data
- [ ] All tables display data
- [ ] Filters work correctly
- [ ] Pending entries warning shows (if applicable)
- [ ] Data accuracy verified
- [ ] Pending entries in tables highlighted
- [ ] Admin panel integration works
- [ ] Mobile responsiveness works
- [ ] No console errors
- [ ] Backend data structure correct

---

## 📞 SUPPORT

If you encounter any issues:

1. **Check browser console** (F12 → Console tab) for error messages
2. **Verify data exists** in Google Sheet (Raw_Data, Final_Data, Historical_KPI sheets)
3. **Refresh page** and try again
4. **Clear browser cache** (Ctrl+Shift+Delete)
5. **Contact developer** with error message and steps to reproduce

---

## 🎉 SUCCESS CRITERIA

Dashboard is working correctly when:
- ✅ All KPI cards show numeric values
- ✅ All charts display data
- ✅ All tables show entries
- ✅ Filters work and update all sections
- ✅ Pending entries are highlighted but not in KPI
- ✅ No console errors
- ✅ Page loads in < 3 seconds

---

_Task 4 Testing Guide - v3.21_  
_Date: May 1, 2026_
