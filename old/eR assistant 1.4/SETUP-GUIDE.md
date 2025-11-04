# eR Assistant v1.3 - Setup Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `er-assistant`
3. Description: `eR Assistant - BPA Service Analyzer`
4. Public (not private)
5. Click "Create repository"

## Step 2: Upload File

1. Click "uploading an existing file"
2. Drag `er-assistant.js` into the upload area
3. Commit message: "Initial commit - v1.3"
4. Click "Commit changes"

## Step 3: Enable GitHub Pages

1. Go to Settings (top menu)
2. Scroll down to "Pages" (left sidebar)
3. Source: Deploy from a branch
4. Branch: `main` (or `master`)
5. Folder: `/ (root)`
6. Click "Save"

Wait 1-2 minutes for deployment.

## Step 4: Get Your URL

Your file will be at:
```
https://YOUR-USERNAME.github.io/er-assistant/er-assistant.js
```

Replace `YOUR-USERNAME` with your actual GitHub username.

Example: If your username is `john`, the URL is:
```
https://john.github.io/er-assistant/er-assistant.js
```

## Step 5: Create Bookmarklet

### Chrome / Brave:
1. Right-click bookmark bar → "Add page"
2. Name: `eR Assistant`
3. URL: Paste the code below (replace YOUR-USERNAME)

### Firefox:
1. Bookmarks → Show All Bookmarks (Ctrl+Shift+B)
2. Right-click → "New Bookmark"
3. Name: `eR Assistant`
4. Location: Paste the code below (replace YOUR-USERNAME)

### Safari:
1. Bookmarks → Add Bookmark
2. Edit bookmark
3. Paste code below (replace YOUR-USERNAME)

### Bookmarklet Code:
```javascript
javascript:(function(){if(document.getElementById('er-widget')){var w=document.getElementById('er-widget');var t=document.getElementById('toggle-btn');w.classList.toggle('open');t.classList.toggle('widget-open');}else{var s=document.createElement('script');s.src='https://YOUR-USERNAME.github.io/er-assistant/er-assistant.js';document.head.appendChild(s);}})();
```

**IMPORTANT:** Replace `YOUR-USERNAME` with your GitHub username!

## Step 6: Test It

1. Go to a BPA service page
2. Click your bookmarklet
3. Widget should slide in from the right
4. Upload a service JSON file
5. Run analysis

## How to Use

1. Open BPA service page
2. Click bookmarklet to open widget
3. Click or drag JSON file
4. View overview and health indicators
5. Click "Run Full Analysis"
6. Click "Search in BPA →" to jump to issues

## Updating

To update the tool:
1. Go to your GitHub repo
2. Click on `er-assistant.js`
3. Click pencil icon (edit)
4. Replace content
5. Commit changes
6. Bookmarklet auto-updates (uses latest version)

## Files

- `er-assistant.js` - Main file (upload to GitHub)
- This README - Setup instructions

## Support

If the bookmarklet doesn't work:
1. Check browser console (F12) for errors
2. Verify URL is correct
3. Make sure GitHub Pages is enabled
4. Wait 2-3 minutes after enabling Pages

## What's Next?

After testing v1.3:
- Iteration 2: Export, Scoring, Visual Flags
- Iteration 3: 30 validation types
- Iteration 4: Distribution & docs
