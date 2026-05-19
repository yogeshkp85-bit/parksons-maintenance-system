# 🔍 DATA VALIDATION DIAGNOSTIC GUIDE

**Issue**: Dashboard shows 961 entries but sheets only have 401 rows

**Goal**: Find where the extra 560 entries are coming from

---

## Step 1: Run Diagnostic Functions (2 minutes)

I've added diagnostic functions to Code.gs. Run them to investigate:

### Function 1: Check All Sheets

1. **In Google Apps Script**, click **Code.gs**
2. **Find the function**: `listAllSheets()`
3. **Run it**:
   - Click the dropdown next to the play button (▶)
   - Select `listAllSheets`
   - Click play (▶)
4. **Check the logs** (View → Logs):
   - You'll see all sheets and their row counts
   - Look for unexpected sheets with data

### Function 2: Check for Duplicates

1. **In Google Apps Script**, click **Code.gs**
2. **Find the function**: `checkForDuplicates()`
3. **Run it**:
   - Click the dropdown next to the play button (▶)
   - Select `checkForDuplicates`
   - Click play (▶)
4. **Check the logs** (View → Logs):
   - Look for "DUPLICATE" messages
   - Check unique Ref_ID counts vs total rows

---

## Step 2: Analyze the Results

**Report what you see in the logs:**

### From `listAllSheets()`:
```
Sheet: Raw_Data | Rows: ? | Columns: ?
Sheet: Final_Data | Rows: ? | Columns: ?
Sheet: [Other sheets?] | Rows: ? | Columns: ?
```

### From `checkForDuplicates()`:
```
Final_Data total rows: ?
Final_Data unique Ref_IDs: ?
Final_Data duplicates found: ?

Raw_Data total rows: ?
Raw_Data unique Ref_IDs: ?
Raw_Data duplicates found: ?
```

---

## Step 3: Possible Causes

Based on the diagnostic results, here are the likely causes:

### Cause 1: Duplicate Rows in Final_Data
**If**: `Final_Data unique Ref_IDs < Final_Data total rows`
**Then**: There are duplicate entries in Final_Data
**Fix**: Remove duplicate rows from Final_Data

### Cause 2: Multiple Data Sheets
**If**: You see sheets like "Final_Data_v2", "Final_Data_backup", etc.
**Then**: Data might be coming from multiple sheets
**Fix**: Verify which sheet should be used

### Cause 3: Hidden Rows
**If**: Sheet shows 401 rows but logs show more
**Then**: There might be hidden rows
**Fix**: Unhide all rows (Format → Rows → Show)

### Cause 4: Data Concatenation
**If**: Final_Data has 401 rows but approvedData shows 961
**Then**: Data might be read multiple times
**Fix**: Check getDashboardData() logic

---

## Step 4: Manual Verification

**In your Google Sheet:**

1. **Open Final_Data sheet**
2. **Click on column A** (Ref_ID column)
3. **Press Ctrl+Shift+End** to go to last row
4. **Check the row number** - should be 402 (401 data rows + 1 header)

5. **Check for duplicates manually**:
   - Select all data (Ctrl+A)
   - Data → Data validation
   - Look for duplicate Ref_IDs

---

## Step 5: Report Your Findings

**Please tell me:**

1. **From `listAllSheets()` logs**:
   - All sheets and their row counts
   - Any unexpected sheets?

2. **From `checkForDuplicates()` logs**:
   - Final_Data: total rows vs unique Ref_IDs
   - Raw_Data: total rows vs unique Ref_IDs
   - Any duplicates found?

3. **Manual verification**:
   - Last row number in Final_Data?
   - Any duplicate Ref_IDs?

---

## Step 6: Fix Based on Findings

Once we know the cause, we can fix it:

- **If duplicates**: Remove them from Final_Data
- **If multiple sheets**: Update getDashboardData() to use correct sheet
- **If hidden rows**: Unhide them
- **If data concatenation**: Fix the backend logic

---

## Quick Reference: Expected Values

| Metric | Expected | Current | Status |
|--------|----------|---------|--------|
| Raw_Data rows | 401 | 401 | ✅ |
| Final_Data rows | 401 | 401 | ✅ |
| approvedData entries | 401 | 961 | ❌ |
| Unique Ref_IDs | 401 | ? | ? |
| Duplicates | 0 | ? | ? |

---

**Ready to run the diagnostics? Start with Step 1!**

**Then come back and tell me what the logs show.**
