================================================================
FIRST-TIME GITHUB PUSH — EXACT COMMANDS
Parksons Maintenance System
================================================================

Run these commands ONE BY ONE in Command Prompt.
Open Command Prompt: Press Windows+R → type cmd → Enter

================================================================
PART 1 — ONE-TIME SETUP (only do this once ever)
================================================================

--- Check Node.js is working ---
node --version
(should show v18.x or higher)

--- Install CLASP globally ---
npm install -g @google/clasp

--- Install Git if not already installed ---
Check: git --version
If not installed: download from https://git-scm.com/download/win

--- Login to CLASP with your Google account ---
clasp login
(browser opens → sign in as yogeshkp85@gmail.com → Allow)

================================================================
PART 2 — CREATE GITHUB REPO (do in browser)
================================================================

1. Go to: https://github.com
2. Click the green "New" button (top left)
3. Fill in:
   Repository name: parksons-maintenance-system
   Description:     Maintenance tracking system for Parksons Packaging Ltd
   Visibility:      Private  ← keep it private (your company data)
4. DO NOT check "Add README" (we already have one)
5. Click "Create repository"
6. GitHub shows a page with commands — you will use the URL shown

================================================================
PART 3 — PUSH YOUR LOCAL FILES TO GITHUB
================================================================

Step 1: Navigate to the project folder
(Replace E:\System development with your actual path)

cd "E:\System development\Final code and URL"

Step 2: Create the folder structure (copy-paste the folder
we built — or just init git in your existing folder)

git init

Step 3: Connect to your GitHub repo
(Replace YOUR_USERNAME with your actual GitHub username)

git remote add origin https://github.com/YOUR_USERNAME/parksons-maintenance-system.git

Step 4: Add all files
git add .

Step 5: First commit
git commit -m "feat: initial commit - Parksons Maintenance System v3.0"

Step 6: Push to GitHub
git branch -M main
git push -u origin main

Done! Open GitHub in browser → your repo is live.

================================================================
PART 4 — LINK CLASP TO YOUR APPS SCRIPT PROJECT
================================================================

Step 1: Make sure .clasp.json is in your project folder
It should contain:
{
  "scriptId": "1r4h6p9Lf_YiGe6_h4s3SdBaxCzPAfKxj07CDCECHWMVPULzMSv-aRmrY",
  "rootDir": "./apps-script",
  "projectType": "standalone"
}

Step 2: Pull current Apps Script code to your PC
clasp pull

(This downloads Code.gs, Dashboard.html, Admin.html from your
 live Apps Script project into the apps-script/ folder)

Step 3: Verify files downloaded
dir apps-script\

You should see: Code.gs, appsscript.json

Step 4: Push everything to GitHub again (with the pulled files)
git add .
git commit -m "chore: pull current Apps Script code via CLASP"
git push

================================================================
PART 5 — OPEN IN CURSOR AND START EDITING
================================================================

Step 1: Install Cursor from https://cursor.com (free)

Step 2: Open your project
cursor "E:\System development\Final code and URL"
OR
Open Cursor → File → Open Folder → select your folder

Step 3: You will see all files in the left panel:
  apps-script/
    Code.gs
    Dashboard.html
    Admin.html
    appsscript.json
  form/
    Parksons_Maintenance_Form_v4.html
  excel/
    Parksons_Maintenance_Phase2.xlsx
  docs/
    SETUP_GUIDE.md
    CLASP_WORKFLOW.md
    CHANGELOG.md
  README.md
  .clasp.json
  .gitignore

Step 4: Use Cursor AI (Ctrl+K or Ctrl+L) to make changes
Example: "Fix the date bug in Code.gs where Column C shows blank"
AI reads all files → writes the fix → you review → accept

Step 5: After changes, run in terminal inside Cursor:
clasp push
clasp deploy --description "fix: date column bug"
git add .
git commit -m "fix: date column C blank after form submission"
git push

================================================================
YOUR FOLDER STRUCTURE TO CREATE ON YOUR PC
================================================================

Inside: E:\System development\Final code and URL\

parksons-maintenance-system\
├── apps-script\
│   ├── Code.gs                          ← paste Code_v3_complete.gs content here
│   ├── Dashboard.html                   ← your existing Dashboard.html
│   ├── Admin.html                       ← your existing Admin.html
│   └── appsscript.json                  ← from this package
├── form\
│   └── Parksons_Maintenance_Form_v4.html ← your existing form
├── excel\
│   └── Parksons_Maintenance_Phase2.xlsx  ← your Excel file
├── docs\
│   ├── SETUP_GUIDE.md
│   ├── CLASP_WORKFLOW.md
│   └── CHANGELOG.md
├── .clasp.json                           ← from this package
├── .claspignore                          ← from this package
├── .gitignore                            ← from this package
└── README.md                             ← from this package

================================================================
TOTAL TIME: ~40 minutes (one-time setup)
After that: every fix takes 5 minutes end-to-end
================================================================
