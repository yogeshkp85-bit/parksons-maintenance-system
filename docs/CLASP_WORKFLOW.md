# CLASP Developer Workflow
## Parksons Maintenance System

---

## One-Time Setup (Do This Once)

### Step 1 — Install CLASP
Open Command Prompt (Windows) and run:
```
npm install -g @google/clasp
```

### Step 2 — Login to Google
```
clasp login
```
A browser window opens → sign in with yogeshkp85@gmail.com → Allow

### Step 3 — Clone This Repo
```
git clone https://github.com/YOUR_USERNAME/parksons-maintenance-system.git
cd parksons-maintenance-system
```

### Step 4 — Pull Current Apps Script Code
```
clasp pull
```
This downloads the current live code from Apps Script into your `apps-script/` folder.

### Step 5 — Open in Cursor
```
cursor .
```
Or open Cursor → File → Open Folder → select `parksons-maintenance-system`

---

## Daily Workflow (After Setup)

### Making a Change
```bash
# 1. Make sure you have latest code
git pull
clasp pull

# 2. Edit files in Cursor
#    - apps-script/Code.gs
#    - apps-script/Dashboard.html
#    - apps-script/Admin.html
#    - form/Parksons_Maintenance_Form_v4.html

# 3. Push to Apps Script
clasp push

# 4. Deploy new version (creates new deployment)
clasp deploy --description "fixed date bug in Final_Data"

# 5. Save to GitHub
git add .
git commit -m "fix: date bug in Final_Data column C and D"
git push
```

---

## CLASP Commands Reference

| Command | What it does |
|---------|-------------|
| `clasp login` | Authenticate with Google |
| `clasp pull` | Download code FROM Apps Script to your PC |
| `clasp push` | Upload code FROM your PC TO Apps Script |
| `clasp deploy` | Create a new deployment (new live version) |
| `clasp deployments` | List all existing deployments |
| `clasp open` | Open Apps Script editor in browser |
| `clasp logs` | View execution logs |

---

## Git Commit Message Format

Use this format for clean history:
```
type: short description

feat:     new feature added
fix:      bug fix
update:   existing feature changed
docs:     documentation only
refactor: code reorganized, no feature change
```

Examples:
```
feat: add approval button to admin panel
fix: column C date blank after form submission
update: add GRAVIER machine to dropdown list
docs: update SETUP_GUIDE with Power Query steps
```

---

## File Responsibilities

| File | Purpose | Edit when |
|------|---------|-----------|
| `Code.gs` | Backend logic, form receiver, data API | Adding features, fixing bugs |
| `Dashboard.html` | Dashboard UI and charts | Changing dashboard layout/charts |
| `Admin.html` | Admin panel UI | Changing admin features |
| `Form_v4.html` | Technician data entry | Adding fields, updating dropdowns |
| `appsscript.json` | Apps Script manifest | Changing permissions/timezone |

---

## Important Notes

1. **Never commit `.clasprc.json`** — it contains your Google auth token
2. **Always `clasp pull` before editing** — avoids overwriting someone else's changes
3. **The `.clasp.json` scriptId** links to your specific Apps Script project — do not change it
4. **After `clasp push`**, always test by opening the deployed URL before committing to Git
5. **Excel file changes** — edit the `.xlsx` file and commit it — no CLASP needed for Excel

---

## Troubleshooting

**Error: `clasp push` says "Script ID not found"**
→ Check `.clasp.json` has the correct scriptId

**Error: "You do not have permission"**
→ Run `clasp login` again and re-authorize

**Dashboard shows old version after `clasp push`**
→ You need to also run `clasp deploy` — push alone doesn't update the live deployment

**Error: "Scope not authorized"**
→ Delete `.clasprc.json` and run `clasp login` again
