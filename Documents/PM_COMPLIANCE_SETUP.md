# PM Schedule vs Compliance - Setup & Deployment Guide

## ✅ What's Been Created

### 1. **PM_Compliance.html** - New Web Page
- Beautiful dashboard showing PM schedule vs actual compliance
- Real-time compliance tracking for all machines
- Section-wise compliance analysis
- Status indicators (On Time, Overdue, Pending, Completed)

### 2. **Backend Functions in Code.gs**
- `servePMCompliance()` - Serves the PM Compliance page
- `getPMComplianceData()` - Fetches and calculates compliance metrics
- `initializePMScheduleSheet()` - Creates PM_Schedule sheet with sample data
- Helper functions for date calculations

### 3. **PM_Schedule Google Sheet** (Auto-created)
- Columns: Machine_ID, Machine_Name, Section, Frequency, Year, Yearly_Compliance, Notes
- Pre-populated with 10 sample machines from your Excel file
- Can be easily updated with all 49 machines

### 4. **Updated URLs.html**
- Added link to PM Schedule vs Compliance page
- Accessible from the main URLs page

---

## 🚀 How to Deploy

### Step 1: Deploy New Version
1. Open your Google Apps Script project
2. Click **Deploy** → **Manage Deployments**
3. Click the **edit icon** (pencil) next to your current deployment
4. Click **Create new version**
5. Click **Deploy**

### Step 2: Access the New Page
- **URL**: `https://script.google.com/macros/s/AKfycbwWgwK3Iu17-otCE-GdkoUHDe-COYzXR9awIETObfxJctigYLTF4M293ktJnGthQPfG/exec?page=pm-compliance`
- Or click the link from URLs.html

---

## 📊 Features

### Compliance Overview Dashboard
- **Overall Compliance %** - Percentage of machines on schedule
- **On Schedule** - Count of machines with completed PM
- **Overdue** - Count of machines past their scheduled PM date
- **Pending** - Count of machines awaiting first PM

### Charts & Analytics
- **Compliance by Section** - Bar chart showing compliance % per section
- **Status Distribution** - Doughnut chart showing status breakdown

### Machine-wise Details Table
Shows for each machine:
- Machine Name
- Section
- Last PM Date (from maintenance records)
- Next Scheduled PM Date
- Days Until/Overdue
- Status Badge (✓ On Time | ⚠ Overdue | ⏳ Pending)
- Yearly Compliance %

### Overdue Alert Panel
- Automatically shows when machines are overdue
- Lists all overdue machines with days overdue
- Quick action buttons to schedule PM

### Filters
- Filter by Section
- Filter by Status
- Filter by Year (2024-25, 2025-26, 2026-27)
- Reset button to clear all filters

---

## 📋 Next Steps

### 1. **Populate PM_Schedule Sheet** (Important!)
The system auto-created a PM_Schedule sheet with 10 sample machines. You need to:

1. Open your Google Sheet
2. Go to the **PM_Schedule** sheet
3. Add all 49 machines from your Excel file with:
   - Machine_ID (e.g., MNT/PR/001)
   - Machine_Name
   - Section
   - Frequency (Monthly, Quarterly, etc.)
   - Year (2024-25, 2025-26, 2026-27)
   - Yearly_Compliance % (from your Excel)

**Quick way to populate:**
- Copy the machine data from your Excel file
- Paste into the PM_Schedule sheet starting from row 2

### 2. **Verify Data Mapping**
The system compares:
- **Planned dates** from PM_Schedule sheet
- **Actual completion dates** from Final_Data sheet (maintenance records)

Make sure machine names match exactly between sheets!

### 3. **Monitor Compliance**
- Check the page daily to see which machines are overdue
- Use filters to focus on specific sections
- Track compliance trends over time

---

## 🔧 How It Works

### Data Flow
```
PM_Schedule Sheet (Planned dates)
         ↓
    getPMComplianceData()
         ↓
    Compare with Final_Data (Actual dates)
         ↓
    Calculate compliance metrics
         ↓
    Display in PM_Compliance.html
```

### Status Calculation
- **On Time**: Last PM date exists AND next PM date is in future
- **Overdue**: Last PM date exists AND next PM date is in past
- **Pending**: No PM record found yet
- **Completed**: PM completed within scheduled window

### Compliance % Calculation
```
Compliance % = (Machines On Time / Total Machines) × 100
```

---

## 📱 Mobile Responsive
- Works on desktop, tablet, and mobile
- Auto-adjusts layout for smaller screens
- Touch-friendly buttons and filters

---

## 🎨 Design Features
- Dark theme matching your existing dashboard
- Color-coded status badges
- Real-time data refresh
- Auto-updating timestamp
- Smooth animations and transitions

---

## ⚙️ Configuration

### To Change Frequency Calculation
Edit the `calculateNextPM()` function in Code.gs:
```javascript
if (frequency === 'Monthly') {
  nextDate.setMonth(nextDate.getMonth() + 1);
} else if (frequency === 'Quarterly') {
  nextDate.setMonth(nextDate.getMonth() + 3);
}
// Add more frequencies as needed
```

### To Add More Machines
Simply add rows to the PM_Schedule sheet with:
- Machine_ID
- Machine_Name (must match Final_Data exactly)
- Section
- Frequency
- Year
- Yearly_Compliance %

---

## 🐛 Troubleshooting

### "No machines found"
- Check that PM_Schedule sheet has data
- Verify machine names match between PM_Schedule and Final_Data

### Compliance % showing 0%
- Ensure maintenance records exist in Final_Data
- Check that Status column = "APPROVED"
- Verify machine names match exactly

### Dates not calculating correctly
- Check date format in Final_Data (should be DD/MM/YYYY)
- Verify PM_Schedule has valid dates

---

## 📞 Support
For issues or questions, check:
1. Browser console (F12) for error messages
2. Google Apps Script logs (Apps Script → Executions)
3. Verify data in PM_Schedule and Final_Data sheets

---

## 📝 Version Info
- **Created**: May 2026
- **Version**: 1.0
- **Status**: Production Ready
- **Last Updated**: 04 May 2026

---

**Ready to use! Deploy and start tracking PM compliance today.** ✅
