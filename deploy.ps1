# CLASP Automated Deployment Script
# This script automates the deployment process with proper SSL handling

# Set Node.js to use system certificates
$env:NODE_OPTIONS = '--use-system-ca'

Write-Host "🚀 Starting CLASP Automated Deployment..." -ForegroundColor Green
Write-Host ""

# Step 1: Push code to Google Apps Script
Write-Host "📤 Step 1: Pushing code to Google Apps Script..." -ForegroundColor Cyan
clasp push --force
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ CLASP push failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Code pushed successfully!" -ForegroundColor Green
Write-Host ""

# Step 2: Create new deployment
Write-Host "🔧 Step 2: Creating new deployment..." -ForegroundColor Cyan
$deploymentOutput = clasp deploy -d "Automated CLASP deployment - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" 2>&1
Write-Host $deploymentOutput
Write-Host "✅ Deployment created!" -ForegroundColor Green
Write-Host ""

# Step 3: List current deployments
Write-Host "📋 Step 3: Current deployments:" -ForegroundColor Cyan
clasp deployments | Select-Object -First 5
Write-Host ""

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy the new deployment URL from above"
Write-Host "2. Update DEPLOYMENT_URL in Code.gs"
Write-Host "3. Run this script again to deploy the updated URL"
Write-Host "4. Commit and push to GitHub"
