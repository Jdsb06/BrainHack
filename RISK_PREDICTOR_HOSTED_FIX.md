# Risk Predictor Hosted Website Fix

This document explains how to fix the issue with the Risk Predictor page not loading in the hosted website.

## Issue

When clicking on the Risk Predictor link in the hosted website, the page doesn't load. This is because the Next.js application is built as a static site (using `next export`), which doesn't support relative API URLs like '/api/predict'.

## Solution

The solution involves two main changes:

1. Update the Risk Predictor page to use an absolute URL for the Flask API instead of a relative URL
2. Create a .env.production file with the correct Flask API URL for the production build

## Changes Made

### 1. Updated the Risk Predictor Page

The code in `src/app/risk-predictor/page.tsx` has been updated to use an absolute URL for the Flask API:

```javascript
// Before:
const apiUrl = process.env.NEXT_PUBLIC_FLASK_API_URL || '/api/predict';

// After:
const apiUrl = process.env.NEXT_PUBLIC_FLASK_API_URL || 'https://your-flask-api-domain.com/predict';
```

### 2. Created a .env.production File

A new file `.env.production` has been created with the following content:

```
# Production environment variables for the Next.js application

# Flask API URL - Replace with your actual production Flask API URL
NEXT_PUBLIC_FLASK_API_URL=https://your-flask-api-domain.com/predict
```

### 3. Updated the Deployment Guide

The `FLASK_APP_DEPLOYMENT.md` file has been updated with instructions for setting up the Flask API URL in the production environment.

## How to Deploy

1. Replace the placeholder URL in the .env.production file with your actual Flask API URL:

```
NEXT_PUBLIC_FLASK_API_URL=https://your-actual-flask-api-domain.com/predict
```

2. Rebuild the Next.js application:

```bash
npm run build
```

3. Deploy the 'out' directory to your hosting provider.

## Verification

After deploying the changes, verify that:

1. The Risk Predictor page loads correctly in the hosted website
2. The form can be submitted and predictions are received from the Flask API
3. The recommendations and risk meter are displayed correctly

If you encounter any issues, check the browser console for errors and ensure that the Flask API is accessible from the hosted website.