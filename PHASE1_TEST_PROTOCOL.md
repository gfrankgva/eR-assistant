# Phase 1 Test Protocol

**Goal:** Verify connection layer works on Cuba instance  
**Time:** ~5 minutes  
**Result:** Screenshot of console output + entity counts

---

## Prerequisites

- [ ] Logged into https://bpa.cuba.eregistrations.org/
- [ ] Access to at least one service you can edit
- [ ] Browser with DevTools (F12 works)
- [ ] Bookmarklet installed (see index.html)

---

## Step 1: Navigate to Service

1. On Cuba homepage, pick any service
2. Click **"Edit service"** or similar button
3. **Verify:** URL shows `/services/{serviceId}/forms/...`

**Example URL:**
```
https://bpa.cuba.eregistrations.org/services/8393ad98-a16d-4a2d-80d0-23fbbd69b9e7/forms/applicant-form
```

---

## Step 2: Run Bookmarklet

1. Click **eR-Assistant** bookmark
2. **Within 2 seconds,** console should print output

---

## Step 3: Check Console (F12 → Console Tab)

### ✓ Success Criteria

```
=== eR-Assistant Phase 1 ===
✓ Service ID: [UUID]
Fetching backend data...

📊 Entity Counts:
  Forms:        [N]
  Roles:        [N]
  Determinants: [N]
  BOTs:         [N]

✓ Phase 1 Complete. Ready for Phase 2.

Data stored in: window.erAssistantData
```

### ❌ Failure Criteria

- [ ] **"JWT token not found"** → You're logged out
- [ ] **"Not on a BPA service page"** → Wrong page URL
- [ ] **"HTTP 403"** → Session expired or auth issue
- [ ] **"HTTP 404"** → API endpoint mismatch
- [ ] **Blank console** → Bookmarklet didn't run

---

## Step 4: Verify Counts Match Reality

**In BPA UI, manually count:**
- Number of forms visible
- Number of roles in workflow
- Number of determinants listed
- Number of BOTs in service

**Compare with console output.** They should match.

---

## Step 5: Screenshot & Report

Take screenshot of console output showing:
- Service ID
- All 4 entity counts
- "Phase 1 Complete" message

Send to Frank with:
- Service name/ID you tested
- Any errors in console
- Whether counts matched manual verification

---

## Test Results Template

```
Phase 1 Test Results
====================

Date: [today]
Instance: bpa.cuba.eregistrations.org
Service Tested: [name / UUID]

Entity Counts:
  Forms:        [N] ✓
  Roles:        [N] ✓
  Determinants: [N] ✓
  BOTs:         [N] ✓

Manual Verification:
  Forms:        [N] ✓/❌ (match?)
  Roles:        [N] ✓/❌ (match?)
  Determinants: [N] ✓/❌ (match?)
  BOTs:         [N] ✓/❌ (match?)

Errors: [none / describe]

Status: ✓ PASS / ❌ FAIL
```

---

## What Happens Behind the Scenes

1. **Bookmarklet injects main.js** from GitHub Pages
2. **main.js extracts serviceId** from URL using regex
3. **Retrieves JWT token** from localStorage (`tokenJWT` key)
4. **Makes 4 API calls** in parallel:
   - GET `.../role?includeDetails=true`
   - GET `.../determinant`
   - GET `.../bot`
   - GET `.../forms`
5. **Handles errors gracefully** – if one fails, others continue
6. **Stores data** in `window.erAssistantData` for Phase 2
7. **Logs results** to console

---

## Debugging Tips

**If console is blank:**
- Make sure DevTools is actually open (F12)
- Try clicking bookmark again
- Check if page blocked the script (check for 403 errors in Network tab)

**If "JWT token not found":**
- Log out and log back into Cuba
- Refresh page after logging in
- Try again

**If "HTTP 403" or "HTTP 404":**
- Screenshot the Network tab showing which endpoint failed
- Send to Frank with URL and error response

**If counts seem wrong:**
- Manually count in BPA UI
- Take screenshot showing both manual count + console output
- Send to Frank for verification

---

## Success Criteria for Phase 1

✅ Main checks:
- [ ] Bookmarklet runs without errors
- [ ] Service ID detected correctly
- [ ] All 4 endpoints return data (or graceful error)
- [ ] Entity counts display in console
- [ ] Data stored in `window.erAssistantData`
- [ ] Counts match manual verification on 3+ different services

Once all pass → **Phase 1 complete. Ready for Phase 2.**

---

## What's Next (Phase 2)

Phase 2 will:
1. Read DOM to find visible field keys
2. Parse form schemas for component details
3. Merge API + DOM into one model
4. Test same 3 services to verify DOM reading works

Estimated time: 2-3 days
