# Changelog — Parksons Maintenance System

All notable changes to this project are documented here.
Format: [Version] — Date — Description

---

## [v3.0] — 2026-03-28

### Added
- Live web dashboard served directly from Apps Script (`?page=dashboard`)
- Admin panel URL (`?page=admin`)
- Data API endpoint (`?page=data`) returns JSON for dashboard
- 6 charts: Monthly trend, Category pie, Department bar, MTTR line, Shift doughnut, Machine table
- 5 KPI cards: Total Breakdowns, Downtime Hrs, Avg MTTR, Avg MTBF, Availability %
- Filters: Month, Department, Machine, Shift, Category
- Daily email report via Google Apps Script MailApp
- `fixFinalDataFormulas()` function to repair Column C/D date issue
- GitHub-ready project structure with CLASP configuration

### Fixed
- Dashboard showing "This application was created by Google Script user" — fixed doGet()
- Final_Data Column C and D showing blank/wrong date on last row
- "Thrid Shift" typo auto-corrected to "Third Shift"
- Emoji characters in VBA causing compile errors (Excel file)

### Changed
- Complete rewrite of doGet() to use HtmlService properly
- Data separated into getDashboardData() function for clean API

---

## [v2.0] — 2026-03-26

### Added
- Google Apps Script Web App deployment
- Raw_Data sheet with 19 columns
- Final_Data sheet with ARRAYFORMULA auto-cleaning
- Config sheet for machine/technician lists
- formatTimeStr() to prevent time decimal conversion
- testSubmit() test function
- setupHeaders() utility

### Fixed
- Time columns showing decimals (0.375) instead of time values
- Date column blank due to DATEVALUE() on numeric serial
- Apps Script syntax error from nested functions

---

## [v1.0] — 2026-03-24 (Excel Dashboard)

### Added
- Excel .xlsm dashboard with 5 KPI cards
- 8 charts: Breakdown count, Downtime hrs, MTBF trend, MTTR trend, Availability
- FY 2024-25 vs FY 2025-26 year-over-year comparison
- Machine comparison: KBA1/2/3, CX1/2
- 534 cross-sheet formula links (zero errors)
- VBA Refresh button

---

## [v0.1] — 2026-03-23 (Initial)

### Added
- HTML data entry form with all fields
- Offline queue for failed submissions
- Machine dropdown with all departments
- POST to Google Apps Script
- Initial Google Sheet structure
