# How to Copy Updated Code.gs to Google Apps Script

## Method 1: Copy-Paste (Easiest)

### Step 1: Get the Updated Code
1. Open `Maintenance_System/src/Code.gs` in your editor
2. Select all code: **Ctrl+A**
3. Copy: **Ctrl+C**

### Step 2: Paste into Google Apps Script
1. Open your Google Sheet
2. Click **Extensions > Apps Script**
3. In the Apps Script editor, click on **Code.gs** tab
4. Select all existing code: **Ctrl+A**
5. Delete it: **Delete** or **Backspace**
6. Paste new code: **Ctrl+V**
7. Click **Save** (Ctrl+S)

### Step 3: Deploy
1. Click **Deploy > New deployment**
2. Select type: **Web app**
3. Click **Deploy**
4. Wait for confirmation

---

## Method 2: Using clasp (Command Line)

If you have clasp installed:

```bash
cd Maintenance_System
clasp push
```

This automatically syncs all files to Google Apps Script.

---

## What Changed in Code.gs

### Key Changes:
1. **getDashboardData()** function (lines ~461-560)
   - Added `.filter()` to exclude empty rows
   - Now only includes rows with non-empty Ref_ID

2. **countActualDataRows()** function (new)
   - Diagnostic function to count actual data rows
   - Helps verify data accuracy

3. **Menu** (onOpen function)
   - Added "📊 Diagnostic: Count Actual Data Rows" menu item

4. **Web API** (handleGetAction function)
   - Added `countActualDataRows` action

### What Stays the Same:
- All other functions unchanged
- Dashboard.html unchanged
- Configuration unchanged
- All existing features work the same

---

## Verification After Copy

### Step 1: Check Code Saved
1. In Google Apps Script, look for the **Save** button
2. Should show "Saved" (not "Unsaved changes")

### Step 2: Deploy
1. Click **Deploy > New deployment**
2. Select type: **Web app**
3. Click **Deploy**

### Step 3: Test Dashboard
1. Go to dashboard URL
2. Press **Ctrl+Shift+R** (hard refresh)
3. Check "Total Entries" KPI
4. Should show **401** (not 961)

### Step 4: Test Diagnostic
1. Click **Maintenance System > 📊 Diagnostic: Count Actual Data Rows**
2. Should show results with actual data row count

---

## Troubleshooting

### If Code Won't Paste
- Make sure you selected ALL code in Google Apps Script
- Make sure you deleted the old code first
- Try pasting in smaller chunks

### If Deploy Fails
- Check for syntax errors in the code
- Look for red error indicators in the editor
- Try saving again before deploying

### If Dashboard Still Shows 961
- Hard refresh: **Ctrl+Shift+R**
- Clear cache: **Ctrl+Shift+Delete**
- Redeploy the app
- Wait 30 seconds and try again

---

## Quick Checklist

- [ ] Opened `Maintenance_System/src/Code.gs`
- [ ] Selected all code (Ctrl+A)
- [ ] Copied code (Ctrl+C)
- [ ] Opened Google Apps Script
- [ ] Selected all existing code (Ctrl+A)
- [ ] Deleted old code
- [ ] Pasted new code (Ctrl+V)
- [ ] Saved (Ctrl+S)
- [ ] Deployed (Deploy > New deployment)
- [ ] Tested dashboard (should show 401 entries)
- [ ] Tested diagnostic function

