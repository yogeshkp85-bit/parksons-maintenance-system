# 🏭 Parksons Maintenance System

> **Live maintenance tracking system for Parksons Packaging Ltd**
> Multi-shift technician data entry → Google Sheets → Live Dashboard + Excel Reports

---

## 📋 System Overview

```
[Technician on Phone/PC]
        ↓
[HTML Form - Parksons_Maintenance_Form_v4.html]
        ↓  (Google Apps Script Web App)
[Google Sheet - Raw_Data tab]
        ↓  (ARRAYFORMULA auto-cleans)
[Google Sheet - Final_Data tab]
        ↓                    ↓
[Live Web Dashboard]    [Excel .xlsm via Power Query]
[Admin Panel]           [KPI Reports + Charts]
```

---

## 🗂️ Repository Structure

```
parksons-maintenance-system/
│
├── apps-script/
│   ├── Code.gs              ← Main backend: form receiver, dashboard data API, admin
│   ├── Dashboard.html       ← Live web dashboard (served by Apps Script)
│   └── Admin.html           ← Admin panel (approval, config, machine management)
│
├── form/
│   └── Parksons_Maintenance_Form_v4.html   ← Technician data entry form (offline capable)
│
├── excel/
│   └── Parksons_Maintenance_Phase2.xlsx    ← Excel KPI dashboard (Power Query linked)
│
├── docs/
│   ├── SETUP_GUIDE.md       ← Full deployment instructions
│   ├── CLASP_WORKFLOW.md    ← Developer workflow with CLASP
│   └── CHANGELOG.md         ← Version history
│
├── .clasp.json              ← CLASP config (links to your Apps Script project)
├── .claspignore             ← Files CLASP should not push
├── .gitignore               ← Files Git should not track
└── README.md                ← This file
```

---

## 🚀 Quick Start (For Developers)

### Prerequisites
- Node.js installed
- CLASP installed: `npm install -g @google/clasp`
- Git installed
- Google account with access to the Apps Script project

### Clone and Setup
```bash
git clone https://github.com/YOUR_USERNAME/parksons-maintenance-system.git
cd parksons-maintenance-system
clasp login
clasp pull   # pulls latest code from Apps Script
```

### Making Changes
```bash
# Edit files in Cursor / VS Code
# Then push to Apps Script:
clasp push

# Deploy new version:
clasp deploy --description "your change description"

# Save to GitHub:
git add .
git commit -m "describe what you changed"
git push
```

---

## 🔗 Live URLs

| Page | URL |
|------|-----|
| **Dashboard** | `[SCRIPT_URL]?page=dashboard` |
| **Admin Panel** | `[SCRIPT_URL]?page=admin` |
| **Data API** | `[SCRIPT_URL]?page=data` |
| **Form (local)** | Open `form/Parksons_Maintenance_Form_v4.html` in browser |

> Replace `[SCRIPT_URL]` with your deployed Apps Script Web App URL

---

## 📊 KPIs Tracked

| KPI | Description |
|-----|-------------|
| **MTTR** | Mean Time To Repair (minutes per breakdown) |
| **MTBF** | Mean Time Between Failures (minutes) |
| **Breakdown Count** | Total breakdown events per period |
| **Downtime Hours** | Total machine downtime |
| **Availability %** | Machine availability percentage |

---

## 🏭 Machines Tracked

- **Printing:** PrintKBA1, PrintKBA2, PrintKBA3, HeidelbergCX1, HeidelbergCX2
- **Corrugation:** Champion, BHSCORRU, Lamify1Old, Lamify2New
- **NF Die Cutting:** Blanker1, Blanker2, YOKO, NOVA series
- **NF Pasting:** Alpina, Expertfold, Fuego, Mistral
- **Lamination:** YILI, SLITTER, PERFECTA
- *(+ more — full list in Admin Panel)*

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Data Entry | HTML5 + Vanilla JS (offline capable) |
| Backend | Google Apps Script |
| Database | Google Sheets |
| Dashboard | Chart.js 4.x + CSS Grid |
| Reports | Excel (.xlsm) + Power Query |
| Version Control | Git + GitHub |
| Local Dev | CLASP + Cursor/VS Code |

---

## 📅 Development Status

| Feature | Status |
|---------|--------|
| HTML Form (data entry) | ✅ Complete |
| Google Sheet pipeline (Raw → Final) | ✅ Complete |
| Live Web Dashboard | ✅ v3.0 |
| Admin Panel | 🔄 In Progress |
| Approval workflow | 🔄 In Progress |
| Excel Power Query dashboard | ✅ Complete |
| GitHub + CLASP workflow | ✅ This release |
| Looker Studio dashboard | 📋 Planned |

---

## 👤 Project Owner

**Yogesh Patil** — Parksons Packaging Ltd
Maintenance Department | FY 2025-26
