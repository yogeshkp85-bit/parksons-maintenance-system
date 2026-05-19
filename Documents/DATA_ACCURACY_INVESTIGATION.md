# Data Accuracy Investigation: 961 vs 401 Entries

## Problem Statement
Dashboard shows **961 Total Entries** when sheets contain only **401 data rows**.

**Expected**: 401 entries (matching Final_Data sheet)
**Actual**: 961 entries (2.4x too many)

---

## Investigation Steps

### Step 1: Run Diagnostic Function
The backend now includes a diagnostic function to identify where the 961 entries are coming from.

**In Google Apps Script Console:**
1. Open Google Apps Script editor
2. Go to **View > Logs** (or press Ctrl+Enter to open Execution Log)
3. Run the function: `diagnoseDashboardData()`
4. Check the logs for output

**Expected Output:**
```
=== DASHBOARD DATA DIAGNOSIS ===
Final_Data: 401 data rows
Final_Data unique Ref_IDs: 401
Final_Data duplicate Ref_IDs: 0
Raw_Data: 401 data rows
Raw_Data status breakdown:
  APPROVED: 401
  PENDING_REVIEW: 0
Raw_Data unique Ref_IDs: 401
getDashboardData results:
  approvedData: 401
  last50: 50
  pendingData: 0
  kpiData.totalEntries: 401
=== END DIAGNOSIS ===
```

### Step 2: Check via Web API
You can also call the diagnostic function via the web API:

**URL:**
```
https://script.google.com/macros/s/AKfycbwNZxQ_Yyt_oLw83EY_UOgtSg1Wiv2-d8Y5NlImIu2KbB4Mb-fmPxwl5uBCrO2BOxu6/exec?action=diagnoseDashboardData
```

**Expected Response:**
```json
{
  "status": "success",
  "finalDataRows": 401,
  "rawDataRows": 401,
  "approvedDataLength": 401,
  "last50Length": 50,
  "pendingDataLength": 0,
  "kpiTotalEntries": 401
}
```

---

## Possible Root Causes

### Cause 1: Duplicate Rows in Final_Data
**Symptom**: `Final_Data unique Ref_IDs < Final_Data data rows`

**Solution**: 
- Check for duplicate Ref_IDs in Final_Data sheet
- Remove duplicate rows
- Verify unique count matches row count

### Cause 2: Multiple Data Sheets
**Symptom**: `Raw_Data rows + other sheets = 961`

**Solution**:
- Check if there are multiple data sheets being read
- Verify only Final_Data is used for KPI calculations
- Check for hidden sheets

### Cause 3: Data Concatenation in Backend
**Symptom**: `approvedDataLength = 961` (from diagnostic)

**Solution**:
- Check if getDashboardData() is concatenating multiple data sources
- Verify Final_Data sheet is being read correctly
- Check for data duplication in the mapping logic

### Cause 4: Frontend Calculation Error
**Symptom**: `kpiTotalEntries = 401` but dashboard shows 961

**Solution**:
- Check if frontend is recalculating from filtered rows
- Verify FY filter logic is not duplicating entries
- Check if multiple tables are being summed

---

## Data Flow Verification

### Backend Data Flow
```
Final_Data (401 rows)
    ↓
getDashboardData()
    ↓
approvedData (should be 401)
    ↓
calculateDashboardKPI(approvedData)
    ↓
kpiData.totalEntries (should be 401)
```

### Frontend Data Flow
```
kpiData from backend (totalEntries = 401)
    ↓
JavaScript receives data
    ↓
updateKPIs() function
    ↓
Display kpiData.totalEntries (should show 401)
```

---

## Debugging Checklist

- [ ] Run `diagnoseDashboardData()` and check logs
- [ ] Verify Final_Data has exactly 401 rows (no duplicates)
- [ ] Verify Raw_Data has exactly 401 rows
- [ ] Check if approvedData length = 401 in diagnostic output
- [ ] Check if kpiData.totalEntries = 401 in diagnostic output
- [ ] If backend is correct (401), check frontend JavaScript
- [ ] If frontend is correct, check if dashboard is using old cached data
- [ ] Verify deployment URL is correct and latest version is deployed

---

## Next Steps

1. **Run diagnostic function** and report the output
2. **Identify which component** is showing 961 (backend or frontend)
3. **Fix the root cause** based on diagnostic results
4. **Verify fix** by running diagnostic again
5. **Test dashboard** to confirm 401 entries display correctly

---

## Related Files

- Backend: `Maintenance_System/src/Code.gs` (getDashboardData, calculateDashboardKPI)
- Frontend: `Maintenance_System/src/Dashboard.html` (updateKPIs, JavaScript logic)
- Data: Final_Data sheet (401 rows), Raw_Data sheet (401 rows)

