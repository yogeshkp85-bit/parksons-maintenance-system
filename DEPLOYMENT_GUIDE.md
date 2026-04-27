# Parksons Maintenance System — Deployment Guide

## Overview

This guide explains how to take updated code from this GitHub repository and deploy it live into Google Apps Script so your team sees the changes immediately.

---

## Folder Structure Reference

```
parksons-maintenance-system/
├── apps-script/
│   ├── Code.gs          ← Backend logic (Google Apps Script)
│   ├── Admin.html       ← Admin panel frontend
│   ├── Dashboard.html   ← Dashboard frontend
│   └── appsscript.json  ← Apps Script manifest
├── form/
│   └── Parksons_Maintenance_Form_v4.html  ← Maintenance log entry form (shared with operators)
├── old-code-and-forms/  ← Archived old versions (do not deploy these)
└── docs/                ← Reference documents
```

**Rule:** Only files inside `apps-script/` go into Google Apps Script. The `form/` file is shared separately as a standalone HTML link or hosted file.

---

## Step 1 — Get the Latest Code from GitHub

If you are using Kiro or have the repo cloned locally, the files are already on your machine at:

```
e:\System development\parksons-maintenance-system-v32-github\parksons-maintenance-system\
```

To pull the latest version from GitHub (if someone else pushed changes):

1. Open a terminal / command prompt
2. Run:
```bash
cd "e:\System development\parksons-maintenance-system-v32-github"
git pull origin main
```

---

## Step 2 — Open Google Apps Script

1. Open your Google Sheet (Parksons Maintenance System spreadsheet)
2. Click **Extensions** → **Apps Script**
3. The Apps Script editor opens in a new tab

---

## Step 3 — Update Code.gs

1. In the Apps Script editor, click on **Code.gs** in the left file list
2. Select all the existing content (Ctrl+A) and delete it
3. Open the file from your local repo:
   ```
   apps-script/Code.gs
   ```
4. Copy the entire content and paste it into the Apps Script editor
5. Click **Save** (Ctrl+S or the floppy disk icon)

---

## Step 4 — Update Admin.html

1. In the Apps Script editor, click on **Admin.html** in the left file list
2. Select all (Ctrl+A) and delete
3. Open from your local repo:
   ```
   apps-script/Admin.html
   ```
4. Copy and paste into the editor
5. Click **Save**

---

## Step 5 — Update Dashboard.html (if changed)

1. Same process as Admin.html — click **Dashboard.html** in the editor
2. Replace with content from `apps-script/Dashboard.html`
3. Save

---

## Step 6 — Deploy a New Version

> You must redeploy every time you change Code.gs. HTML-only changes sometimes work without redeployment, but it is safer to always redeploy.

1. Click **Deploy** (top right) → **Manage Deployments**
2. Click the **pencil (Edit)** icon next to your existing deployment
3. Under **Version**, select **New Version**
4. Click **Deploy**
5. Copy the new **Web App URL** shown

---

## Step 7 — Update the Deployment URL (if it changed)

If the deployment URL changed (it usually stays the same for "Update" deployments):

1. Open `apps-script/Code.gs`
2. Find this line near the top:
   ```javascript
   var DEPLOYMENT_URL = 'https://script.google.com/macros/s/...../exec';
   ```
3. Replace the URL with the new one
4. Save and **redeploy again** (repeat Step 6)

5. Also open `form/Parksons_Maintenance_Form_v4.html`
6. Find this line:
   ```javascript
   var SCRIPT_URL = "https://script.google.com/macros/s/...../exec";
   ```
7. Replace with the new URL
8. Save the form file and re-share it with your team (or re-host it)

---

## Step 8 — Set Up the Daily Export Trigger (First Time Only)

This only needs to be done once after the new Code.gs is deployed.

1. In Apps Script editor, click the **clock icon** (Triggers) in the left sidebar
2. Click **+ Add Trigger** (bottom right)
3. Set:
   - **Function**: `sendDailyDataExport`
   - **Event source**: Time-driven
   - **Type**: Day timer
   - **Time**: 8AM to 9AM
4. Click **Save**

> This sends the full Raw_Data sheet as a CSV attachment every morning at ~9 AM IST to `yogeshkp85@gmail.com` and `engg.cn@parksonspackaging.com`.

To add more email recipients in future, edit `Code.gs`:
```javascript
emailExportTo: ['yogeshkp85@gmail.com', 'engg.cn@parksonspackaging.com', 'newemail@example.com'],
```
Then save and redeploy.

---

## Step 9 — First Login After Deployment

1. Open the Admin Panel URL: `[your deployment URL]?page=admin`
2. Click **Admin Login**
3. Enter:
   - Email: `yogeshkp85@gmail.com`
   - Password: `PKS@2026`
4. On first login, the system will automatically create two new sheets in your Google Sheet:
   - **Machine_Data** — pre-filled with all existing machine/unit data
   - **Admin_Users** — pre-filled with your super admin account
5. You can now add supervisors from the **Admin Users** tab

---

## Step 10 — Share the Form with Operators

The maintenance entry form is a standalone HTML file. No changes needed for operators — they use the same link as before.

If you need to re-share:
- File location: `form/Parksons_Maintenance_Form_v4.html`
- This file can be opened directly in a browser or hosted on any web server / Google Drive
- The `SCRIPT_URL` inside the form must match your current deployment URL (see Step 7)

---

## Quick Reference — What File Goes Where

| File in Repo | Where it goes |
|---|---|
| `apps-script/Code.gs` | Google Apps Script editor → Code.gs |
| `apps-script/Admin.html` | Google Apps Script editor → Admin.html |
| `apps-script/Dashboard.html` | Google Apps Script editor → Dashboard.html |
| `apps-script/appsscript.json` | Google Apps Script editor → appsscript.json (only if changed) |
| `form/Parksons_Maintenance_Form_v4.html` | Share directly with operators as a file or hosted link |
| `old-code-and-forms/*` | Do NOT deploy — archive only |

---

## Checklist for Every Deployment

- [ ] Pulled latest code from GitHub (`git pull origin main`)
- [ ] Updated `Code.gs` in Apps Script editor
- [ ] Updated `Admin.html` in Apps Script editor
- [ ] Updated `Dashboard.html` if changed
- [ ] Saved all files in Apps Script editor
- [ ] Deployed new version (Deploy → Manage Deployments → Edit → New Version → Deploy)
- [ ] Confirmed deployment URL is still the same (or updated it in Code.gs and form)
- [ ] Tested Admin Panel login works
- [ ] Tested form submission works

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Admin panel shows blank / error | Check that Code.gs was saved and redeployed |
| Login says "Invalid credentials" | Make sure Admin_Users sheet exists — log in once to trigger auto-creation |
| Machine dropdowns empty in form | Check SCRIPT_URL in form matches deployment URL; open Admin Panel once to seed Machine_Data sheet |
| Daily export email not arriving | Check trigger is set for `sendDailyDataExport` in Apps Script Triggers |
| Form submissions not appearing in sheet | Check SCRIPT_URL in form is correct and deployment is live |
| "Script function not found" error | You may have saved but not deployed — always redeploy after Code.gs changes |
