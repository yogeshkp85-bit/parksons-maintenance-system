# CLASP Automated Deployment Guide

## Overview

This guide explains how to use CLASP to automate deployments to Google Apps Script.

## Prerequisites

- Node.js v14+ (check: `node --version`)
- npm (check: `npm --version`)
- CLASP installed globally: `npm install -g @google/clasp`
- Google account with access to the Apps Script project
- `.clasp.json` configured with your Script ID

## SSL Certificate Fix

The main issue with CLASP is SSL certificate validation. The solution is to use Node.js system certificates.

### One-Time Setup

```bash
# Disable strict SSL in npm (temporary workaround)
npm config set strict-ssl false

# Clear any custom CA configuration
npm config set cafile ""
npm config set ca ""
```

### For Each Deployment

Use the `NODE_OPTIONS` environment variable to enable system certificates:

**Windows (PowerShell):**
```powershell
$env:NODE_OPTIONS = '--use-system-ca'
clasp push --force
clasp deploy -d "Your deployment description"
```

**Mac/Linux (Bash):**
```bash
export NODE_OPTIONS='--use-system-ca'
clasp push --force
clasp deploy -d "Your deployment description"
```

## Automated Deployment Scripts

### Windows (PowerShell)

Run the automated deployment script:

```powershell
.\deploy.ps1
```

This script will:
1. Push all files to Google Apps Script
2. Create a new deployment
3. Show the deployment URL
4. List recent deployments

### Mac/Linux (Bash)

Make the script executable and run it:

```bash
chmod +x deploy.sh
./deploy.sh
```

## Manual Deployment Steps

If you prefer to deploy manually:

### Step 1: Push Code

```bash
$env:NODE_OPTIONS = '--use-system-ca'  # Windows
# OR
export NODE_OPTIONS='--use-system-ca'  # Mac/Linux

clasp push --force
```

Expected output:
```
Pushed 7 files at 11:32:38 pm.
└─ src\Admin.html
└─ src\appsscript.json
└─ src\Code.gs
└─ src\Dashboard.html
└─ src\Form.html
└─ src\KPI_Comparison.html
└─ src\URLs.html
```

### Step 2: Create Deployment

```bash
clasp deploy -d "Automated deployment - $(date)"
```

Expected output:
```
Created version 89.
- AKfycbwzvCSeLMspnlQsHes9pCpp8IOCbMwwOSo59TmI1NIwgo5txYK_TA2O7kwsNWrGNvWl @89
```

### Step 3: Update DEPLOYMENT_URL

Copy the new deployment ID and update `Code.gs`:

```javascript
var DEPLOYMENT_URL = 'https://script.google.com/macros/s/AKfycbwzvCSeLMspnlQsHes9pCpp8IOCbMwwOSo59TmI1NIwgo5txYK_TA2O7kwsNWrGNvWl/exec';
```

### Step 4: Push Again

```bash
clasp push --force
clasp deploy -d "Updated DEPLOYMENT_URL"
```

### Step 5: Commit to GitHub

```bash
git add -A
git commit -m "Deployment: Update to version X with new deployment URL"
git push origin master
```

## Troubleshooting

### Error: "unable to verify the first certificate"

**Solution:** Use the `NODE_OPTIONS` environment variable:

```bash
$env:NODE_OPTIONS = '--use-system-ca'
clasp push --force
```

### Error: "Scripts may only have up to 20 versioned deployments"

**Solution:** Delete old deployments:

```bash
clasp deployments  # List all deployments
clasp undeploy <DEPLOYMENT_ID>  # Remove old ones
```

### Error: "Not logged in"

**Solution:** Authenticate with Google:

```bash
clasp login
```

### Error: "Project not found"

**Solution:** Verify `.clasp.json` has the correct Script ID:

```bash
cat .clasp.json
```

Should show:
```json
{
  "scriptId": "1r4h6p9Lf_YiGe6_h4s3SdBaxCzPAfKxj07CDCECHWMVPULzMSv-aRmrY",
  "rootDir": "src"
}
```

## Complete Deployment Workflow

```bash
# 1. Make changes to your code
# 2. Test locally

# 3. Set environment variable
$env:NODE_OPTIONS = '--use-system-ca'  # Windows
# OR
export NODE_OPTIONS='--use-system-ca'  # Mac/Linux

# 4. Push to Google Apps Script
clasp push --force

# 5. Create deployment
clasp deploy -d "Feature: Your feature description"

# 6. Copy new deployment URL from output

# 7. Update Code.gs with new DEPLOYMENT_URL

# 8. Push again
clasp push --force

# 9. Commit to GitHub
git add -A
git commit -m "Deployment: Feature description"
git push origin master

# 10. Test the live URLs
# Dashboard: https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?page=dashboard
# Admin: https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?page=admin
```

## Current Deployment Info

- **Script ID**: `1r4h6p9Lf_YiGe6_h4s3SdBaxCzPAfKxj07CDCECHWMVPULzMSv-aRmrY`
- **Current Deployment**: `AKfycbwzvCSeLMspnlQsHes9pCpp8IOCbMwwOSo59TmI1NIwgo5txYK_TA2O7kwsNWrGNvWl`
- **Dashboard URL**: https://script.google.com/macros/s/AKfycbwzvCSeLMspnlQsHes9pCpp8IOCbMwwOSo59TmI1NIwgo5txYK_TA2O7kwsNWrGNvWl/exec?page=dashboard

## References

- [CLASP Documentation](https://github.com/google/clasp)
- [Google Apps Script](https://script.google.com/)
- [Node.js SSL Documentation](https://nodejs.org/en/docs/guides/nodejs-ssl-configuration/)
