# Quick Deployment Reference

## 🚀 One-Command Deployment

### Windows (PowerShell)
```powershell
$env:NODE_OPTIONS = '--use-system-ca'; clasp push --force; clasp deploy -d "Deployment $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
```

### Mac/Linux (Bash)
```bash
export NODE_OPTIONS='--use-system-ca' && clasp push --force && clasp deploy -d "Deployment $(date '+%Y-%m-%d %H:%M:%S')"
```

---

## 📋 Full Deployment Workflow

```bash
# 1. Set SSL fix
$env:NODE_OPTIONS = '--use-system-ca'  # Windows
# OR
export NODE_OPTIONS='--use-system-ca'  # Mac/Linux

# 2. Push code
clasp push --force

# 3. Create deployment
clasp deploy -d "Your description"

# 4. Copy deployment URL from output

# 5. Update Code.gs line 30:
# var DEPLOYMENT_URL = 'https://script.google.com/macros/s/YOUR_NEW_ID/exec';

# 6. Push again
clasp push --force

# 7. Commit to GitHub
git add -A
git commit -m "Deployment: Your description"
git push origin master
```

---

## 🔧 Automated Scripts

**Windows:**
```powershell
.\deploy.ps1
```

**Mac/Linux:**
```bash
./deploy.sh
```

---

## 🐛 Troubleshooting

| Error | Solution |
|-------|----------|
| "unable to verify the first certificate" | Use `$env:NODE_OPTIONS = '--use-system-ca'` |
| "Scripts may only have up to 20 deployments" | Run `clasp undeploy <ID>` to remove old ones |
| "Not logged in" | Run `clasp login` |
| "Project not found" | Check `.clasp.json` has correct Script ID |

---

## 📍 Current Setup

- **Script ID**: `1r4h6p9Lf_YiGe6_h4s3SdBaxCzPAfKxj07CDCECHWMVPULzMSv-aRmrY`
- **Current Deployment**: `AKfycbwzvCSeLMspnlQsHes9pCpp8IOCbMwwOSo59TmI1NIwgo5txYK_TA2O7kwsNWrGNvWl`
- **Dashboard**: https://script.google.com/macros/s/AKfycbwzvCSeLMspnlQsHes9pCpp8IOCbMwwOSo59TmI1NIwgo5txYK_TA2O7kwsNWrGNvWl/exec?page=dashboard

---

## ✅ SSL Fix Explanation

The issue: Node.js couldn't verify Google's SSL certificates.

The fix: Use system certificates instead of Node.js bundled ones.

```bash
$env:NODE_OPTIONS = '--use-system-ca'
```

This tells Node.js to use your operating system's certificate store, which is always up-to-date.
