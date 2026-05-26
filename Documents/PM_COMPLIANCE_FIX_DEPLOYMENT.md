# PM Compliance Fix - Deployment Instructions

## Changes Made

### 1. Year Format Fix (extractYearFromSheetName function)
**Problem**: Backend was returning year format "2024-2025" but frontend expected "2024-25"

**Solution**: Modified `extractYearFromSheetName()` function to convert 4-digit years to 2-digit format:
- "2024-2025" → "24-25"
- "2025-2026" → "25-26"  
- "2026-2027" → "26-27"

**File**: `Maintenance_System/src/Code.gs` (line ~1747)

### 2. Machine Name Cleanup (getPMComplianceData function)
**Problem**: Machine names had extra text appended (Make, Model, Sr. No. details) causing matching failures

**Solution**: Added cleanup logic to strip extra text:
- Removes text after newline character (`\n`)
- Removes text after "Make :-" delimiter
- Preserves only the core machine name

**Example**:
```
Before: "Heidelberg printing machine - CX 1\nMake :- Heidelberg ; Model :- CX102-6+L ; Sr. No. :- 551418."
After:  "Heidelberg printing machine - CX 1"
```

**File**: `Maintenance_System/src/Code.gs` (line ~1645)

## Deployment Status

✅ **Code Changes**: Committed to GitHub (commit: d86e2f9)
✅ **Clasp Push**: Pushed to Google Apps Script
⏳ **Deployment**: Needs manual deployment due to 20-deployment limit

## Manual Deployment Steps

1. Go to: https://script.google.com/macros/d/AKfycbxlupdkVZl2K4wFWQnZu1nnWvXl8omyo9iauqi_w94/edit

2. Click **"Deploy"** button (top right)

3. Select **"Manage deployments"**

4. Click the pencil icon next to the current deployment (@HEAD)

5. Click **"Create new version"**

6. Add description: "PM Compliance Fix: Year format (2024-25) and machine name cleanup"

7. Click **"Deploy"**

8. The URL will remain the same: `https://script.google.com/macros/s/AKfycbxlupdkVZl2K4wFWQnZu1nnWvXl8omyo9iauqi_w94/exec`

## Testing After Deployment

1. Open PM Compliance page
2. Verify year dropdown shows: "FY 24-25", "FY 25-26", "FY 26-27"
3. Select a year and verify machines display with data
4. Check that machine names no longer have extra text
5. Verify KPI cards populate with data

## Expected Results

- ✅ Year dropdown values now match backend format
- ✅ Machine names are clean and match Final_Data records
- ✅ PM Compliance page displays data for all three years
- ✅ Filtering by year works correctly
