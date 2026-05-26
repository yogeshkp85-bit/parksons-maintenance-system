#!/bin/bash

# CLASP Automated Deployment Script
# This script automates the deployment process with proper SSL handling

# Set Node.js to use system certificates
export NODE_OPTIONS='--use-system-ca'

echo "🚀 Starting CLASP Automated Deployment..."
echo ""

# Step 1: Push code to Google Apps Script
echo "📤 Step 1: Pushing code to Google Apps Script..."
clasp push --force
if [ $? -ne 0 ]; then
    echo "❌ CLASP push failed!"
    exit 1
fi
echo "✅ Code pushed successfully!"
echo ""

# Step 2: Create new deployment
echo "🔧 Step 2: Creating new deployment..."
DEPLOYMENT_OUTPUT=$(clasp deploy -d "Automated CLASP deployment - $(date '+%Y-%m-%d %H:%M:%S')" 2>&1)
echo "$DEPLOYMENT_OUTPUT"
echo "✅ Deployment created!"
echo ""

# Step 3: List current deployments
echo "📋 Step 3: Current deployments (top 5):"
clasp deployments | head -6
echo ""

echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Copy the new deployment URL from above"
echo "2. Update DEPLOYMENT_URL in Code.gs"
echo "3. Run this script again to deploy the updated URL"
echo "4. Commit and push to GitHub"
