# eR Assistant v1.3 - Simple Workflow

## ✅ Changes Made

1. **Header height** - Reduced by 30%, title now readable and centered
2. **Upload zone** - Reduced by 30%
3. **Spacing** - Added 20px before "Run Full Analysis" button  
4. **Score removed** - Will add back later

---

## 🔧 For Development (Quick Changes)

### Use: `er-assistant-dev.html`

**Workflow:**
1. Open `er-assistant-dev.html` in browser
2. Edit the file (change CSS/JS)
3. Save and refresh (F5)
4. Repeat

**No GitHub needed!**

---

## 🚀 For Production (Real Use)

### Use: Bookmarklet + GitHub

**One-time setup:**
1. Push `er-assistant.js` to GitHub
2. Enable GitHub Pages
3. Create bookmarklet with your URL

**Updates:**
1. Edit `er-assistant.js`
2. Push to GitHub
3. Clear browser cache
4. Bookmarklet auto-updates

---

## ⚠️ Why "Search in BPA →" Doesn't Show

**The button only appears when:**

1. ✅ You're on a BPA page (URL has `/services/[id]/`)
2. ✅ Analysis found errors/warnings
3. ✅ The error has a searchable item (BOT name, determinant name)

**On the test HTML file:**
- ❌ URL is `file:///...` (not a BPA page)
- ❌ No service ID detected
- ❌ Links can't be generated

**To see BPA links:**
- Use the bookmarklet on an actual BPA page
- Or fake it by editing the code to set `baseUrl` and `serviceId`

---

## 🎯 Recommended Workflow

### Phase 1: Development
```
Edit er-assistant-dev.html → Save → Refresh
```
Fast iteration, no deployment needed.

### Phase 2: Testing on BPA
```
Push to GitHub → Use bookmarklet on real BPA page
```
Test the actual BPA links and real service data.

### Phase 3: Updates
```
Edit er-assistant.js → Push → Clear cache
```
Update production version.

---

## 📦 Files

1. **er-assistant.js** - Production (upload to GitHub)
2. **er-assistant-dev.html** - Development (edit locally)  
3. **SETUP-GUIDE.md** - GitHub setup instructions
4. **test-local.html** - Quick test page

---

## 💡 GitHub Alternative

If you don't want to use GitHub, you can:

1. **Host on your own server** (put `er-assistant.js` anywhere)
2. **Use a different CDN** (like jsDelivr)
3. **Keep using the HTML file** (just open it)

Bookmarklet just needs a URL to the JS file.

---

## Next Steps?

1. Test the updated version
2. Confirm all fixes work
3. Decide: Continue with Plan A (export, scoring, visual flags)?
