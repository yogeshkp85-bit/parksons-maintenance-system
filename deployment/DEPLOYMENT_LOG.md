# DEPLOYMENT LOG — Parksons Maintenance System

---

## Deployment v2.0 — 2026-04-27

**Status**: ✅ LIVE

### Changes Deployed
1. **Persistent Machine Data Management**
   - New sheet: `Machine_Data`
   - Backend functions: `getMachineData()`, `saveMachineData()`, `deleteMachineData()`
   - Admin UI: Machine Data tab (SuperAdmin only)

2. **Multi-Level Admin Login**
   - New sheet: `Admin_Users`
   - Login modes: SuperAdmin (email+password) | Supervisor (password-only)
   - Role-based tab visibility
   - Super Admin protection (cannot delete)

3. **Daily CSV Data Export**
   - Function: `sendDailyDataExport()`
   - Trigger: 3-4 AM UTC (9 AM IST)
   - Recipients: yogeshkp85@gmail.com, engg.cn@parksonspackaging.com
   - Format: CSV attachment

### Deployment Details
- **Deployment ID**: AKfycbzHWip5IomqAGlmU78rsoPlX1AFJHKWeZ5u28qWQmKO9VMHAUdKystKv_NigL6XNLKS
- **Previous ID**: AKfycbyeDqlhh8beleGToHBXQgHcnm785z4xZ6sOAlS_5IHrIzZwoYlxg81wnnpbfpHbmxPA
- **Deployed By**: Yogesh K
- **Git Commit**: feat: persistent machine data, multi-level admin login, daily CSV export
- **Files Modified**:
  - apps-script/Code.gs
  - apps-script/Admin.html
  - form/Parksons_Maintenance_Form_v4.html

### Testing Completed
- [x] Machine Data CRUD operations
- [x] SuperAdmin login with full access
- [x] Supervisor login with limited access
- [x] Role-based tab visibility
- [x] Dynamic machine loading in form
- [x] Daily export function (manual test)
- [x] 9 AM IST trigger configured

### Known Issues Fixed
- [x] getUi() error in time-driven trigger (removed from sendDailyEmailReport)
- [x] Deployment URL updated in all files
- [x] CORS issues resolved (GET-only API)

---

## Previous Deployments

### v1.0 — Initial Release
- Dashboard with KPI tracking
- Form submission workflow
- Admin approval panel
- Financial year analytics

---

## Rollback Instructions

If needed to rollback to previous deployment:

1. Open Apps Script editor
2. Go to Deployments
3. Select previous deployment ID
4. Update DEPLOYMENT_URL in Code.gs
5. Run `clasp push`

---

_Last Updated: 2026-04-27_
