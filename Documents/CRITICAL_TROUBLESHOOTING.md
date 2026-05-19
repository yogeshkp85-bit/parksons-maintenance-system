# Critical Troubleshooting - "File Does Not Exist" Error

**Issue**: Dashboard URL returns "Sorry, the file you have requested does not exist"

**Root Cause**: Dashboard.html file is missing from Google Apps Script project

---

## 🔍 Diagnosis

The error indicates one of these issues:

1. **Dashboard.html file is missing** from Google Apps Script
2. **Dashboard.html file was deleted** accidentally
3. **Deployment is broken** and can't find the file
4. **Project structure is corrupted**

---

## ✅ Solution: Rebuild the Project

### Step 1: Check What Files Exist in Google Apps Script

1. Go to your Google Apps Script project
2. Look at the left sidebar - you should see:
   - ✅ Code.gs
   - ✅ Dashboard.html
   - ✅ Admin.html
   - ✅ Form.html
   - ✅ KPI_Comparison.html
   - ✅ URLs.html
   - ✅ appsscript.json

**If Dashboard.html is MISSING, that's the problem!**

---

### Step 2: Recreate Dashboard.html (if missing)

1. In Google Apps Script, click **+ (plus icon)** next to "Files"
2. Select **HTML file**
3. Name it: **Dashboard.html**
4. Copy ALL content from: `Maintenance_System/src/Dashboard.html`
5. Paste into the new Dashboard.html file
6. Click **Save**

---

### Step 3: Verify All Files Exist

After Step 2, you should have:
- ✅ Code.gs
- ✅ Dashboard.html (newly created)
- ✅ Admin.html
- ✅ Form.html
- ✅ KPI_Comparison.html
- ✅ URLs.html
- ✅ appsscript.json

---

### Step 4: Deploy Again

1. Click **Deploy** button
2. Click **New Deployment**
3. Select type: **Web app**
4. Execute as: Your account
5. Who has access: **Anyone**
6. Click **Deploy**
7. Copy the new deployment URL

---

### Step 5: Update Code.gs

1. Find line 39 in Code.gs:
```javascript
var DEPLOYMENT_URL = '...';
```

2. Replace with your new deployment URL from Step 4

3. Click **Save**

---

### Step 6: Test

Open your new deployment URL:
```
https://script.google.com/macros/s/[YOUR_NEW_ID]/exec?page=dashboard
```

---

## 🎯 Quick Checklist

- [ ] Dashboard.html file exists in Google Apps Script
- [ ] All other HTML files exist
- [ ] Code.gs has correct DEPLOYMENT_URL
- [ ] New deployment created
- [ ] Tested the dashboard URL

---

## 📋 If Dashboard.html Still Missing

If you can't find Dashboard.html in your Google Apps Script project:

1. **Check if it was accidentally deleted**
   - Look in the file list
   - If not there, you need to recreate it

2. **Recreate it**
   - Click **+ (plus icon)**
   - Select **HTML file**
   - Name: **Dashboard.html**
   - Copy content from `Maintenance_System/src/Dashboard.html`
   - Save

3. **Deploy again**
   - New Deployment → Web app
   - Copy new URL
   - Update Code.gs

---

## 🚨 If Still Not Working

If you still get the error after these steps:

1. **Hard refresh** the page (Ctrl+Shift+R)
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Try in incognito/private mode**
4. **Try different browser**
5. **Check browser console** (F12) for errors

---

## 📞 Need Help?

If the issue persists:

1. Take a screenshot of your Google Apps Script file list
2. Verify Dashboard.html is there
3. Check if the file has any content
4. Verify the deployment URL is correct

---

**This should resolve the "file does not exist" error!**
