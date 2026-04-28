# Deployment Commands - Task 3.10

**Version**: 3.10.0
**Date**: 2026-04-28
**Status**: READY FOR DEPLOYMENT

---

## Quick Start Deployment

### Step 1: Verify Current Status

```bash
# Check clasp status
clasp status

# Check git status
git status
```

---

### Step 2: Push to Google Apps Script

```bash
# Navigate to project directory
cd Maintenance_System

# Push all files to Google Apps Script
clasp push

# Expected output:
# ? Overwrite? (y/n) y
# Pushed 7 files.
```

**Files Pushed**:
- Code.gs (Main backend code)
- Admin.html (Admin panel)
- Dashboard.html (KPI dashboard)
- Form.html (Maintenance form)
- KPI_Comparison.html (KPI comparison)
- URLs.html (URL management)
- appsscript.json (Project configuration)

---

### Step 3: Create New Deployment Version

```bash
# Create new deployment version
clasp deploy -d "Advanced Reporting & Analytics - Task 3.10 Complete"

# Expected output:
# Created version 1.
# Deployed version 1.
# Deployment ID: [new-deployment-id]
```

---

### Step 4: Record Version in Google Sheets

In Google Sheets, run this command in the Apps Script console:

```javascript
recordVersion('3.10.0', 'Advanced Reporting & Analytics - Integrated error logging and version control. Completed comprehensive integration testing. Ready for production deployment.', 'yogeshkp85@gmail.com')
```

---

### Step 5: Push to GitHub

```bash
# Navigate to project directory
cd Maintenance_System

# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Task 3.10: Integrate with error logging and version control - Complete Advanced Reporting & Analytics feature

- Implemented all 26 functions for advanced reporting and analytics
- Created 6 new sheets: Alert_Log, Benchmark_History, Report_Templates, Trend_Data, Alert_Config, Alert_Preferences
- Integrated error logging for all functions
- Integrated version control with semantic versioning
- Completed comprehensive integration testing
- Verified all performance targets met
- Ready for production deployment"

# Push to main branch
git push origin main

# Expected output:
# [main abc1234] Task 3.10: Integrate with error logging and version control...
#  X files changed, Y insertions(+), Z deletions(-)
```

---

## Detailed Deployment Steps

### Full Deployment Workflow

```bash
# 1. Navigate to project directory
cd Maintenance_System

# 2. Check current status
clasp status
git status

# 3. Push to Google Apps Script
clasp push
# Answer 'y' to overwrite prompt

# 4. Create new deployment version
clasp deploy -d "Advanced Reporting & Analytics - Task 3.10 Complete"

# 5. Note the new deployment ID from the output
# Update DEPLOYMENT_URL in Code.gs if needed

# 6. Stage all changes for git
git add .

# 7. Commit changes
git commit -m "Task 3.10: Integrate with error logging and version control - Complete Advanced Reporting & Analytics feature"

# 8. Push to GitHub
git push origin main

# 9. Verify deployment
echo "Deployment complete!"
```

---

## Verification Steps

### After Deployment

```bash
# 1. Check clasp deployment
clasp status

# 2. Check git log
git log --oneline -5

# 3. Verify in Google Sheets
# - Open the Google Sheet
# - Check Versions sheet for version 3.10.0
# - Check Error_Log sheet for any errors
# - Test dashboard functionality
```

---

## Rollback Procedure (If Needed)

### If Issues Occur

```bash
# 1. Identify previous version
# In Google Sheets, run:
getVersionHistory(5)

# 2. Rollback to previous version
# In Google Sheets, run:
rollbackToVersion('3.9.0')

# 3. Verify rollback
# Check Versions sheet for rollback entry

# 4. If needed, revert git commit
git revert HEAD
git push origin main
```

---

## Environment Variables

### Google Apps Script Deployment URL

**Current**: `https://script.google.com/macros/s/AKfycbzHWip5IomqAGlmU78rsoPlX1AFJHKWeZ5u28qWQmKO9VMHAUdKystKv_NigL6XNLKS/exec`

**After New Deployment**: Will be provided by `clasp deploy` command

---

## Git Configuration

### Verify Git Configuration

```bash
# Check git config
git config --list

# Verify remote URL
git remote -v

# Expected output:
# origin  https://github.com/yogeshkp85-bit/parksons-maintenance-system.git (fetch)
# origin  https://github.com/yogeshkp85-bit/parksons-maintenance-system.git (push)
```

---

## Troubleshooting

### Issue: clasp push fails

**Solution**:
```bash
# Verify .clasp.json exists
ls -la .clasp.json

# Verify clasp is installed
clasp --version

# Re-authenticate if needed
clasp login
```

### Issue: git push fails

**Solution**:
```bash
# Verify git is configured
git config --list

# Verify remote URL
git remote -v

# Pull latest changes
git pull origin main

# Try push again
git push origin main
```

### Issue: Deployment ID not found

**Solution**:
```bash
# List all deployments
clasp deployments

# Use existing deployment ID
clasp deploy -i [deployment-id] -d "Description"
```

---

## Post-Deployment Verification

### Dashboard Access

```
Dashboard URL: https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec?page=dashboard
Admin Panel URL: https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec?page=admin
```

### Verification Checklist

- [ ] Dashboard loads correctly
- [ ] KPI cards display values
- [ ] Drill-down works
- [ ] Filters work
- [ ] Charts display
- [ ] Admin panel loads
- [ ] Alert configuration works
- [ ] Report generation works
- [ ] No errors in Error_Log sheet
- [ ] Version 3.10.0 in Versions sheet

---

## Support

For issues or questions:
- **Development Team**: yogeshkp85@gmail.com
- **Engineering Team**: engg.cn@parksonspackaging.com

---

## Summary

**Deployment Status**: ✅ READY

**Commands to Execute**:
1. `clasp push`
2. `clasp deploy -d "Advanced Reporting & Analytics - Task 3.10 Complete"`
3. `git add .`
4. `git commit -m "Task 3.10: Integrate with error logging and version control..."`
5. `git push origin main`

**Expected Time**: ~5-10 minutes

**Rollback Available**: Yes (via `rollbackToVersion()`)

