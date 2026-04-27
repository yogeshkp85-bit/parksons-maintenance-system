# Setup Guide — Parksons Maintenance System

---

## System Architecture

```
HTML Form (local file on PC/phone browser)
    │
    ↓ POST (Google Apps Script Web App URL)
    │
Google Apps Script (Code.gs)
    │
    ├── writes to → Google Sheet: Raw_Data tab
    │                    │
    │                    ↓ ARRAYFORMULA (auto-cleans)
    │               Google Sheet: Final_Data tab
    │                    │
    ↓                    ↓
Web Dashboard         Excel Power Query
(?page=dashboard)     (Parksons_Maintenance_Phase2.xlsx)
    │
Admin Panel
(?page=admin)
```

---

## Google Sheet

**Sheet ID:** `1AT_Sil0sN5xUADNkuOz2ns01gXlawWlqyidkL4BNG7c`
**URL:** https://docs.google.com/spreadsheets/d/1AT_Sil0sN5xUADNkuOz2ns01gXlawWlqyidkL4BNG7c

### Tabs Required
| Tab Name | Purpose |
|----------|---------|
| `Raw_Data` | Form submissions land here (never edit manually) |
| `Final_Data` | Auto-cleaned data with ARRAYFORMULA |
| `Config` | Machine list, technician list, dropdown values |
| `Raw_Submissions` | Legacy tab (keep for backup) |

### Final_Data Column Structure
| Col | Header | Formula type |
|-----|--------|-------------|
| A | # | Row number |
| B | Ref_ID | From Raw_Data |
| C | Date | ARRAYFORMULA (DATEVALUE) |
| D | Month_Year | ARRAYFORMULA (TEXT format MMM-YY) |
| E | Shift | From Raw_Data |
| F | Machine_Type | From Raw_Data |
| G | Machine_Name | From Raw_Data |
| H | Unit | From Raw_Data |
| I | Problem_Type | From Raw_Data |
| J | Category | From Raw_Data |
| K | Description | From Raw_Data |
| L | Action_Taken | From Raw_Data |
| M | Root_Cause | From Raw_Data |
| N | Time_Start | ARRAYFORMULA (TIMEVALUE) |
| O | Time_End | ARRAYFORMULA (TIMEVALUE) |
| P | Total_Repair_Time | ARRAYFORMULA (O-N) |
| Q | Minutes | ARRAYFORMULA (P*1440) |
| R | Available_Time_Min | ARRAYFORMULA (days in month × 1440) |
| S | BD_Flag | ARRAYFORMULA (1 if Breakdown, else 0) |
| T | Attended_By | From Raw_Data |
| U | Submitted_By | From Raw_Data |
| V | Remarks | From Raw_Data |
| W | Submitted_At | From Raw_Data |

---

## Apps Script

**Script ID:** `1r4h6p9Lf_YiGe6_h4s3SdBaxCzPAfKxj07CDCECHWMVPULzMSv-aRmrY`
**Script URL:** https://script.google.com/u/0/home/projects/1r4h6p9Lf_YiGe6_h4s3SdBaxCzPAfKxj07CDCECHWMVPULzMSv-aRmrY/edit

**Deployed Web App URL:**
`https://script.google.com/macros/s/AKfycbyyEmAPLYTTgUTSON6CbnuajBZ72nYhQv2FJZrN_58yBXwXIYr_m4Q6GgvWdqMSTk2I/exec`

### URL Endpoints
| Page | URL suffix | Purpose |
|------|-----------|---------|
| Dashboard | `?page=dashboard` | Live KPI dashboard |
| Admin | `?page=admin` | Admin panel |
| Data API | `?page=data` | JSON data for dashboard |
| Form submit | POST to base URL | Receives form submissions |

### Deployment Settings
- Execute as: **Me** (yogeshkp85@gmail.com)
- Who has access: **Anyone**

---

## First-Time Deployment Steps

1. Open Apps Script editor
2. Paste full contents of `apps-script/Code.gs`
3. Click **Deploy → New deployment**
4. Type: Web app
5. Execute as: Me
6. Access: Anyone
7. Click Deploy → Authorize → Allow
8. Copy the `/exec` URL
9. Update `form/Parksons_Maintenance_Form_v4.html`:
   - Find `var SCRIPT_URL =`
   - Replace with your new `/exec` URL

---

## Excel Dashboard Setup

1. Open `excel/Parksons_Maintenance_Phase2.xlsx`
2. Go to **PowerQuery_Setup** sheet — follow steps there
3. Publish Google Sheet Final_Data as CSV
4. Connect via Data → Get Data → From Web (paste CSV URL)
5. Load into Raw_Import sheet
6. Run VBA macro `AddRefreshButton` once
7. Save as `.xlsm`

---

## Available Time Calculation Reference

| Month | Days | Available Minutes |
|-------|------|------------------|
| April, June, Sep, Nov | 30 | 43,200 |
| Jan, Mar, May, Jul, Aug, Oct, Dec | 31 | 44,640 |
| February (normal) | 28 | 40,320 |
| February (leap year) | 29 | 41,760 |

---

## MTTR / MTBF Formulas

```
MTTR = SUM(Minutes WHERE Category='Breakdown') / COUNT(Category='Breakdown')

MTBF = (Available_Time_Min - SUM(BD_Minutes)) / COUNT(Breakdowns)

Availability% = 1 - (SUM(All_Minutes) / Available_Time_Min)
```

Only `Category = "Breakdown"` counts toward MTTR and MTBF.
All categories (including PM) count toward Availability loss.
