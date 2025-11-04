# BPA Unified Widget - Installation

## Phase 1: Basic Widget ✅

**Features**:
- ✅ Clean, dark mode UI
- ✅ Slider from right side
- ✅ Auto-detects BPA vs DS pages
- ✅ Manual JSON upload
- ✅ Drag & drop support
- ✅ Shows service overview

---

## Installation (2 minutes)

### Method 1: Hosted Version (Recommended)

**Step 1**: Upload `bpa-unified-widget.html` to a web server
- Any simple hosting works (GitHub Pages, Netlify, your server)
- Or I can host it for you

**Step 2**: Create bookmark

1. Create a new bookmark in your browser
2. Name it: `BPA Tools`
3. URL:
```javascript
javascript:(function(){if(document.getElementById('bpa-unified-widget')){alert('Already loaded');return;}const iframe=document.createElement('iframe');iframe.id='bpa-unified-widget-frame';iframe.src='YOUR_URL_HERE/bpa-unified-widget.html';iframe.style.cssText='position:fixed;top:0;right:0;width:100%;height:100%;border:none;z-index:999999;pointer-events:none;';iframe.onload=function(){iframe.contentWindow.document.body.style.pointerEvents='auto';};document.body.appendChild(iframe);})();
```

**Replace `YOUR_URL_HERE` with your hosting URL**

---

### Method 2: Local File (For Testing)

**Step 1**: Save `bpa-unified-widget.html` to your computer

**Step 2**: Get the file path
```bash
# Mac/Linux
cd ~/Downloads
pwd
# Example: /Users/yourname/Downloads
```

**Step 3**: Create bookmark with local path
```javascript
javascript:(function(){if(document.getElementById('bpa-unified-widget-frame')){return;}const iframe=document.createElement('iframe');iframe.id='bpa-unified-widget-frame';iframe.src='file:///Users/yourname/Downloads/bpa-unified-widget.html';iframe.style.cssText='position:fixed;top:0;right:0;width:100%;height:100%;border:none;z-index:999999;';document.body.appendChild(iframe);})();
```

---

## Quick Test

1. Go to: `https://bpa.cuba.eregistrations.org/services/8a2b5457-9656-424e-9e34-f09c27bed997/forms/applicant-form`
2. Click your `BPA Tools` bookmark
3. Widget should slide in from right
4. Should detect "BPA Configuration Page"
5. Upload a service JSON file

---

## Usage

### On BPA Page
1. Click bookmark → widget opens
2. Detects: "BPA Configuration Page"
3. Upload JSON
4. See: Total BOTs, Actions, Types

### On DS Page
1. Click bookmark → widget opens
2. Detects: "DS Service Page"
3. Upload JSON
4. Ready for testing (Phase 4)

---

## What Works Now (Phase 1)

✅ **Page Detection**
- Automatically detects BPA vs DS
- Shows service ID from URL
- Environment badge

✅ **JSON Upload**
- Click to upload
- Drag & drop
- Shows service overview

✅ **Service Overview**
- Total BOTs count
- Total Actions count
- BOTs by type (data, document, etc)
- App version

✅ **UI/UX**
- Clean, dark theme
- Smooth animations
- Toggle button on right edge
- Professional look

---

## What's Coming

⏳ **Phase 2** (Analyzer):
- Configuration error detection
- Missing mappings alerts
- Unused BOTs finder
- Quality score

⏳ **Phase 3** (Claude API):
- Smart pattern detection
- Plain English explanations
- Fix suggestions

⏳ **Phase 4** (Tester):
- Form validation testing
- BOT execution checks
- DOM inspection

⏳ **Phase 5** (Comparison):
- Compare services
- Find best patterns
- Suggest reusable components

---

## Troubleshooting

**Widget doesn't appear**:
- Check browser console (F12) for errors
- Try refreshing the page
- Make sure URL in bookmark is correct

**Can't upload JSON**:
- File must be `.json` extension
- Must be valid JSON format
- Check file is not corrupted

**Page detection wrong**:
- URL must contain `eregistrations.org/services/{id}`
- Service ID must be in UUID format

---

## Next Steps

1. **Test Phase 1**:
   - Install bookmark
   - Test on both URLs
   - Upload JSON
   - Report any issues

2. **Your Feedback**:
   - Is UI clear and easy to use?
   - Any confusing parts?
   - What would you change?

3. **Then**: I'll start Phase 2 (Analyzer)

---

## Need Help?

Just tell me:
- "Can't install" → I'll help step by step
- "Widget not working" → I'll debug
- "Want changes" → I'll modify UI
- "Ready for Phase 2" → I'll start analyzer

**Ready to test?**
