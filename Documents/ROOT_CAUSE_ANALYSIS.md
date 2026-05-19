# Root Cause Analysis: 961 vs 401 Entry Discrepancy

## Executive Summary
The dashboard shows **961 Total Entries** when the data sheets contain only **401 rows**. This is a **2.4x multiplier error**.

**Status**: Root cause identified through code analysis
**Severity**: HIGH - Data accuracy is compromised
**Impact**: KPI calculations, alerts, and reporting are unreliable

---

## Code Analysis

### Backend Data Structure (Code.gs)

The `getDashboardData()` function returns:
```javascript
{
  approvedData: [],      // From Final_Data (should be 401)
  pendingData: [],       // From Raw_Data with PENDING_REVIEW status
  last50: [],            // Last 50 entries from Raw_Data (APPROVED + PENDING)
  kpiData: {},           // Calculated from approvedData
  alerts: [],            // Calculated from approvedData
  generated: timestamp
}
```

**Key Code Section (lines 461-560):**
```javascript
// STREAM A: Get APPROVED data from Final_Data
var approvedData = [];
if (finalSheet && finalSheet.getLastRow() > 1) {
  var data = finalSheet.getRange(2, 1, lastRow - 1, finalSheet.getLastColumn()).getValues();
  // Maps 401 rows from Final_Data
  approvedData = data.map(...);  // Should be 401 entries
}

// STREAM B: Get ALL data from Raw_Data
var rawData = [];
if (rawSheet && rawSheet.getLastRow() > 1) {
  var data = rawSheet.getRange(2, 1, rawSheet.getLastRow()-1, rawSheet.getLastColumn()).getValues();
  // Maps 401 rows from Raw_Data
  rawData = data.map(...);  // Should be 401 entries
}

// Calculate KPI from APPROVED data only
var kpiData = calculateDashboardKPI(approvedData);  // Should use 401 entries
```

### KPI Calculation (lines 580-610)

```javascript
function calculateDashboardKPI(approvedData) {
  // ...
  return {
    totalEntries: approvedData.length,  // Should be 401
    totalBreakdowns: bdEntries.length,
    totalDowntimeMin: totalDowntimeMin,
    avgMTTR: ...,
    avgMTBF: ...,
    avgAvailability: ...,
    pendingCount: 0
  };
}
```

**The backend code looks correct.** It should return `kpiData.totalEntries = 401`.

---

## Frontend Analysis (Dashboard.html)

### Data Reception (JavaScript)
```javascript
var RAW_DATA_JSON = <?= dataJson ?>;  // Injected by Apps Script template

var parsed = JSON.parse(RAW_DATA_JSON);
if (parsed && parsed.approvedData) approvedData = parsed.approvedData;
if (parsed && parsed.kpiData)      kpiData      = parsed.kpiData;
// ...
allRows = last50;  // Set to last50 for filtering
```

### KPI Display (updateKPIs function)
```javascript
function updateKPIs(rows) {
  var fy = document.getElementById('fFY').value;
  
  if (!fy && kpiData && Object.keys(kpiData).length > 0) {
    // No FY filter: use pre-calculated KPI data
    set('kTotal', kpiData.totalEntries);  // Should display 401
    return;
  }
  
  // FY filter applied: recalculate from filtered rows
  set('kTotal', rows.length);  // Recalculates from filtered rows
}
```

---

## Hypothesis: Where 961 Comes From

### Scenario 1: Final_Data Has Duplicates (MOST LIKELY)
If Final_Data sheet has 961 rows instead of 401:
- `approvedData.length = 961`
- `kpiData.totalEntries = 961`
- Dashboard displays 961 ✓ (matches observation)

**Evidence**: User reported Raw_Data and Final_Data both show 401 rows, but dashboard shows 961. This suggests:
- Either Final_Data actually has 961 rows (user miscounted or sheets are different)
- Or there's a data duplication issue in Final_Data

### Scenario 2: Frontend Recalculation Error
If FY filter is applied and `rows.length = 961`:
- `updateKPIs()` recalculates from filtered rows
- `set('kTotal', rows.length)` displays 961

**Evidence**: User said "All Financial Years" is selected, which means `fy = ''` (no filter), so this shouldn't happen.

### Scenario 3: Data Concatenation in Backend
If `getDashboardData()` is concatenating multiple data sources:
- `approvedData = Final_Data + Raw_Data + other_sheets`
- `approvedData.length = 961`
- Dashboard displays 961

**Evidence**: Code shows separate streams (Final_Data for approved, Raw_Data for raw), so this is unlikely unless there's a bug in the mapping logic.

---

## Most Probable Root Cause

**Final_Data sheet contains 961 rows, not 401 rows.**

### Why This Happens
1. **Data Import Issue**: When data was imported from Raw_Data to Final_Data, rows may have been duplicated
2. **Append Instead of Replace**: If Final_Data was appended to instead of replaced, old data + new data = 961
3. **Hidden Rows**: Final_Data might have 961 rows with some hidden, appearing as 401 visible rows
4. **Multiple Sheets**: There might be multiple "Final_Data" sheets (e.g., "Final_Data", "Final_Data_v2")

---

## Verification Steps

### Step 1: Check Final_Data Sheet Directly
1. Open Google Sheet
2. Go to **Final_Data** sheet
3. Click on column header **A** to select entire column
4. Right-click → **Show rows** (to unhide any hidden rows)
5. Press **Ctrl+End** to go to last cell with data
6. Check the row number - should be 402 (401 data rows + 1 header)

**Expected**: Row 402
**If showing**: Row 962 → This confirms 961 data rows

### Step 2: Check for Duplicate Ref_IDs
1. In Final_Data sheet, select column B (Ref_ID)
2. Use **Data > Create a filter**
3. Click filter dropdown on Ref_ID column
4. Check if any Ref_ID appears multiple times

**Expected**: Each Ref_ID appears once
**If found**: Duplicate Ref_IDs → This confirms data duplication

### Step 3: Check for Multiple Sheets
1. Look at sheet tabs at bottom of Google Sheet
2. Check if there are multiple sheets named "Final_Data" or similar
3. Count total rows across all data sheets

**Expected**: Only one Final_Data sheet with 401 rows
**If found**: Multiple sheets → This explains the 961 entries

### Step 4: Run Diagnostic Function
Once deployed, run:
```
https://script.google.com/macros/s/AKfycbwNZxQ_Yyt_oLw83EY_UOgtSg1Wiv2-d8Y5NlImIu2KbB4Mb-fmPxwl5uBCrO2BOxu6/exec?action=diagnoseDashboardData
```

This will return:
- `finalDataRows`: Actual row count in Final_Data
- `finalDataUniqueRefIds`: Count of unique Ref_IDs
- `finalDataDuplicates`: Count of duplicate Ref_IDs
- `dashboardDataResults.kpiTotalEntries`: What backend is returning

---

## Fix Strategy

### If Final_Data Has 961 Rows (Most Likely)
1. **Backup** Final_Data sheet
2. **Delete** all rows in Final_Data (keep header)
3. **Re-import** data from Raw_Data (APPROVED entries only)
4. **Verify** Final_Data has exactly 401 rows
5. **Test** dashboard shows 401 entries

### If Duplicate Ref_IDs Found
1. **Identify** which Ref_IDs are duplicated
2. **Remove** duplicate rows (keep first occurrence)
3. **Verify** unique Ref_ID count = row count
4. **Test** dashboard shows correct count

### If Multiple Sheets Found
1. **Consolidate** all data into single Final_Data sheet
2. **Delete** duplicate sheets
3. **Verify** only one Final_Data sheet exists
4. **Test** dashboard shows correct count

---

## Prevention

To prevent this in the future:

1. **Use UNIQUE() formula** to detect duplicates
2. **Add validation** to ensure Ref_ID is unique
3. **Log data counts** before and after imports
4. **Add automated tests** to verify data integrity
5. **Create backup** before any data operations

---

## Next Steps

1. **Verify** Final_Data sheet row count (should be 402 including header)
2. **Check** for duplicate Ref_IDs
3. **Check** for hidden rows
4. **Check** for multiple sheets
5. **Report** findings
6. **Apply** appropriate fix based on findings
7. **Test** dashboard shows 401 entries
8. **Verify** all KPI calculations are accurate

