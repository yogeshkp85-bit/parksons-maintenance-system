# Deploy Data Accuracy Fix

## Quick Deploy (5 minutes)

### Step 1: Deploy Code Changes
1. Open Google Sheet
2. Click **Extensions > Apps Script**
3. In the editor, click **Deploy > New deployment**
4. Select type: **Web app**
5. Click **Deploy**
6. If prompted, authorize the app
7. Copy the new deployment URL (if different from current)

### Step 2: Update Dashboard URL (if needed)
If deployment URL changed:
1. Update `DEPLOYMENT_URL` in Code.gs line 39
2. Redeploy

### Step 3: Test the Fix
1. Go to dashboard URL
2. Press **Ctrl+Shift+R** (hard refresh)
3. Check "Total Entries" KPI card
4. Should show **401** (not 961)

### Step 4: Verify Data
1. Click **Maintenance System > 📊 Diagnostic: Count Actual Data Rows**
2. Check results:
   - Final_Data actual data rows: 401 ✓
   - Final_Data empty rows: ~1098 ✓

---

## What Changed

### Code Changes
- **getDashboardData()**: Added filter to exclude empty rows
- **countActualDataRows()**: New diagnostic function
- **Menu**: Added diagnostic menu item
- **Web API**: Added countActualDataRows action

### Expected Impact
- Dashboard Total Entries: 961 → 401 ✓
- Breakdown Count: 219 → ~27 ✓
- Avg MTTR: 63 min → ~15-20 min ✓
- All KPI calculations: More accurate ✓

---

## Verification Checklist

After deployment, verify:

- [ ] Dashboard loads without errors
- [ ] Total Entries shows 401
- [ ] Breakdown Count shows ~27
- [ ] Avg MTTR shows ~15-20 min
- [ ] Avg Availability shows 99.97%
- [ ] FY filter works
- [ ] Pending table displays
- [ ] Drill-down modal opens
- [ ] Alert system works
- [ ] Charts display correctly
- [ ] No console errors

---

## Rollback (if needed)

If something goes wrong:

1. Open Google Apps Script
2. Click **Deployments** (left sidebar)
3. Find previous deployment
4. Click the three dots → **Manage deployments**
5. Select previous version
6. Click **Deploy**

---

## Support

If you encounter issues:

1. **Dashboard still shows 961**: 
   - Hard refresh: Ctrl+Shift+R
   - Clear cache: Ctrl+Shift+Delete
   - Redeploy the app

2. **Diagnostic function not found**:
   - Redeploy the app
   - Wait 30 seconds
   - Try again

3. **Data still looks wrong**:
   - Run diagnostic: `countActualDataRows()`
   - Check if Final_Data has actual data rows
   - Contact support with diagnostic results

---

## Timeline

- **Deployment**: 5 minutes
- **Testing**: 5 minutes
- **Verification**: 5 minutes
- **Total**: ~15 minutes

