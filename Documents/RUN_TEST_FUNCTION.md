# Run Test Function to Diagnose Issue

## Step 1: Copy Updated Code.gs
1. Open `Maintenance_System/src/Code.gs`
2. Select all: **Ctrl+A**
3. Copy: **Ctrl+C**

## Step 2: Paste into Google Apps Script
1. Open your Google Sheet
2. Click **Extensions > Apps Script**
3. Click on **Code.gs** tab
4. Select all: **Ctrl+A**
5. Delete old code
6. Paste new code: **Ctrl+V**
7. Save: **Ctrl+S**

## Step 3: Deploy
1. Click **Deploy > New deployment**
2. Select type: **Web app**
3. Click **Deploy**
4. Wait for confirmation

## Step 4: Run Test Function
1. In Google Apps Script, click **Run > testDataFilter**
2. Wait for execution to complete

## Step 5: Check Logs
1. Click **View > Logs** (or press Ctrl+Enter)
2. Look for output like:
```
=== TEST DATA FILTER ===
Total rows read: 1498
Rows with Ref_ID: 401
Rows without Ref_ID: 1097
First non-empty row: {"row":2,"refId":"PKS-20250426-..."}
First empty row: {"row":403,"refId":""}
=== END TEST ===
```

## Step 6: Report Results
Copy the log output and paste it here. This will tell us:
- If the filter is working correctly
- Where the empty rows start
- How many actual data rows exist

