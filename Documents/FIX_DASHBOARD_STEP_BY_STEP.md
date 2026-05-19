# 🔧 FIX DASHBOARD - STEP BY STEP DEBUGGING

**Goal**: Get all 4 new features working (FY filter, modal, pending table, alerts)

**Current Status**: Dashboard loads but features broken

---

## Root Cause

The new Dashboard.html file with all 4 features is not being properly loaded by Google Apps Script.

**Why**: When you copy-paste HTML into Google Apps Script, sometimes special characters or formatting get corrupted.

---

## Solution: Use Google Apps Script's File Upload

Instead of copy-pasting, we'll use Google Apps Script's native file handling.

---

## Step 1: Prepare the File (2 minutes)

1. **In your editor**, open: `Maintenance_System/src/Dashboard.html`
2. **Save it** to a known location (e.g., Desktop)
3. **Rename it** to: `Dashboard_NEW.html` (to avoid confusion)

---

## Step 2: Delete Old Dashboard.html (1 minute)

1. **In Google Apps Script**:
   - Find **Dashboard.html** in the left sidebar
   - Right-click it
   - Click **Delete**
   - Confirm deletion

---

## Step 3: Create New Dashboard.html Using Script Editor (3 minutes)

**Instead of copy-pasting, we'll create it fresh:**

1. **In Google Apps Script**, click **+** (plus icon) next to "Files"
2. Select **HTML file**
3. Name it: `Dashboard.html`
4. Click **Create**

---

## Step 4: Paste Content Carefully (5 minutes)

**This is the critical step - we need to paste the content correctly:**

1. **In your editor**, open: `Maintenance_System/src/Dashboard.html`

2. **Copy in sections** (not all at once):
   - **Section 1**: Lines 1-100 (HTML head and styles)
   - **Section 2**: Lines 101-200 (HTML body start)
   - **Section 3**: Lines 201-400 (HTML content)
   - **Section 4**: Lines 401-600 (More HTML)
   - **Section 5**: Lines 601-767 (JavaScript and closing)

3. **For each section**:
   - Copy the section from your editor
   - Paste into Google Apps Script Dashboard.html
   - Wait 2 seconds
   - Move to next section

4. **Save** (Ctrl+S) after each section

---

## Step 5: Verify Dashboard.html Content (2 minutes)

**Check that the file has all the features:**

1. **In Google Apps Script**, click **Dashboard.html**
2. **Search** (Ctrl+F) for these keywords:
   - `fFY` - Should find FY filter dropdown
   - `pendingTable` - Should find pending entries table
   - `drillDownModal` - Should find modal
   - `displayAlerts` - Should find alert function
   - `openModal` - Should find modal open function

**If all 5 keywords found**: ✅ File is complete

**If any keyword missing**: ❌ File is incomplete, try again

---

## Step 6: Verify Code.gs (1 minute)

1. **In Google Apps Script**, click **Code.gs**
2. **Find line 39**: `var DEPLOYMENT_URL = '...'`
3. **Verify it has the NEW URL** (ending in `...BOxu6/exec`)
4. **If not**, update it with the correct URL
5. **Save** (Ctrl+S)

---

## Step 7: Create New Deployment (2 minutes)

1. Click **Deploy** (top right)
2. Click **New Deployment**
3. Select **Web app** (gear icon ⚙️)
4. Execute as: Your email
5. Who has access: Anyone
6. Click **Deploy**
7. **Copy the new URL** from the dialog

---

## Step 8: Update Code.gs with New URL (1 minute)

1. Click **Code.gs**
2. Find line 39: `var DEPLOYMENT_URL = '...'`
3. Replace with the NEW URL from Step 7
4. Save (Ctrl+S)

---

## Step 9: Test Dashboard (2 minutes)

1. **Open the new deployment URL** with `?page=dashboard`:
   ```
   https://script.google.com/macros/s/[YOUR_NEW_ID]/exec?page=dashboard
   ```

2. **Hard refresh** (Ctrl+Shift+R)

3. **Open browser console** (F12)

4. **Look for "Dashboard Data Loaded:" message**
   - Check what data is loaded
   - Look for any red error messages

5. **Verify features**:
   - ✅ FY filter dropdown visible
   - ✅ KPI cards show data
   - ✅ Charts render
   - ✅ Pending table visible
   - ✅ Click row → modal opens
   - ✅ Alert panel visible

---

## Step 10: If Still Not Working

**Check browser console (F12) for errors:**

1. **Look for red error messages**
2. **Copy the error message**
3. **Tell me the exact error**

**Common errors and fixes:**

| Error | Cause | Fix |
|-------|-------|-----|
| `Uncaught SyntaxError` | HTML syntax error | Paste content again carefully |
| `Cannot read property 'value' of null` | Element not found | Dashboard.html incomplete |
| `RAW_DATA_JSON is undefined` | Data not passed | Code.gs issue |
| `Chart is not defined` | Chart.js not loaded | Refresh page |

---

## Verification Checklist

After deployment, verify:

- [ ] Dashboard loads without errors
- [ ] Browser console shows "Dashboard Data Loaded:"
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

## If All Else Fails

**Nuclear option - Start completely fresh:**

1. **Delete all HTML files** from Google Apps Script
2. **Copy fresh from** `Maintenance_System/src/`:
   - Dashboard.html
   - Admin.html
   - Form.html
   - KPI_Comparison.html
   - URLs.html
   - appsscript.json

3. **Paste each one** carefully into Google Apps Script

4. **Create new deployment** and test

---

## Expected Timeline

- Step 1-2: 3 minutes
- Step 3-5: 10 minutes (careful pasting)
- Step 6-8: 5 minutes
- Step 9-10: 5 minutes
- **Total: ~25 minutes**

---

**Start with Step 1 and let me know if you hit any issues!**

**When you get to Step 9, tell me:**
1. What you see in the browser console
2. Which features are working
3. Which features are broken
4. Any error messages

**Then I can help you fix the specific issue!**
