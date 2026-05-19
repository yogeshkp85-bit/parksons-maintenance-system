# ⚡ QUICK START: Deploy Dashboard Features (5 Minutes)

## The Problem
Dashboard.html file is missing from Google Apps Script project → "file does not exist" error

## The Solution
Add Dashboard.html to Google Apps Script with all 4 features implemented

---

## 🚀 5-Step Deployment

### 1️⃣ Copy Dashboard.html
```
File: Maintenance_System/src/Dashboard.html
Action: Select ALL (Ctrl+A) → Copy (Ctrl+C)
```

### 2️⃣ Add to Google Apps Script
```
1. Go to: https://script.google.com/home
2. Open: Parksons Maintenance System project
3. Click: + (plus icon) → HTML file
4. Name: Dashboard.html
5. Paste: (Ctrl+V) → Save (Ctrl+S)
```

### 3️⃣ Create New Deployment
```
1. Click: Deploy button (top right)
2. Click: New Deployment
3. Select: Web app (gear icon ⚙️)
4. Execute as: Your email
5. Who has access: Anyone
6. Click: Deploy
7. Copy: New deployment URL
```

### 4️⃣ Update Code.gs
```
1. Click: Code.gs
2. Find: var DEPLOYMENT_URL = '...'
3. Replace: With new URL from Step 3
4. Save: (Ctrl+S)
```

### 5️⃣ Test Dashboard
```
URL: https://script.google.com/macros/s/[YOUR_ID]/exec?page=dashboard

Verify:
✅ FY filter dropdown visible
✅ Pending entries table shows
✅ Click row → modal opens
✅ Alert panel visible
✅ Escape key closes modal
```

---

## ✨ What You'll Get

| Feature | What It Does |
|---------|-------------|
| **FY Filter** | Filter dashboard by financial year (2023-24, 2024-25, 2025-26) |
| **Drill-Down Modal** | Click any row to see all 15 entry details |
| **Pending Table** | Separate table for entries awaiting approval |
| **Alert System** | Color-coded alerts (Red=Critical, Orange=Warning, Green=OK) |

---

## 🎯 Success Checklist

After deployment, verify:

- [ ] Dashboard loads without errors
- [ ] FY filter dropdown has options
- [ ] Selecting FY updates all views
- [ ] Pending entries table visible
- [ ] Click row → modal opens with details
- [ ] Escape key closes modal
- [ ] Alert panel shows above KPIs
- [ ] No console errors (F12)

---

## ⏱️ Time Estimate

- Copy file: 1 minute
- Add to Google Apps Script: 1 minute
- Create deployment: 2 minutes
- Update Code.gs: 1 minute
- **Total: 5 minutes**

---

## 📞 If Something Goes Wrong

| Issue | Solution |
|-------|----------|
| Changes not showing | Hard refresh: Ctrl+Shift+R |
| FY filter empty | Check browser console (F12) for errors |
| Modal won't open | Verify row data is valid |
| Pending table empty | Check if pending entries exist in data |
| Alerts not showing | Verify alert calculation in backend |

---

## 📁 Files Involved

- ✅ `Maintenance_System/src/Dashboard.html` - Copy this to Google Apps Script
- ✅ `Maintenance_System/src/Code.gs` - Already correct, just update URL
- ✅ Other HTML files - No changes needed

---

**Ready? Start with Step 1 above!**

For detailed instructions, see: `Maintenance_System/DEPLOYMENT_READY.md`
