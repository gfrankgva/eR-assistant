# Development Plan – Connected eR-Assistant

## Phase 1 – Core Connection Layer
**Goal:** Replace file input with live backend queries.
1. Detect `serviceId` from page URL.
2. Implement API wrapper using `fetch('/api/...', {credentials:'include'})`.
3. Collect services, forms, determinants, roles.
4. Display counts in console.
**Test:** Console shows correct entity counts.

## Phase 2 – Data Fusion Layer
**Goal:** Merge backend data with DOM.
1. Extract field keys from DOM (`[data-formio-key]`).
2. Merge with backend schemas.
3. Highlight missing or extra fields.
**Test:** Lists of mismatched fields display correctly.

## Phase 3 – Validation Engine
**Goal:** Run backend-aligned rules.
1. Implement rule registry (see `validation-rules-spec.md`).
2. Return structured results (`area, field, message, severity`).
3. Summarize into a report.
**Test:** Output matches known publish errors on reference services.

## Phase 4 – UI Integration
**Goal:** Build minimal in-page widget.
1. Inject floating panel with “Run Validation”.
2. Display grouped results (Errors/Warnings/Info).
**Test:** Widget loads, displays live report, no console errors.

## Phase 5 – Performance & Reliability
**Goal:** Handle large services gracefully.
1. Progress indicator for fetches.
2. Error handling for 403/404/network.
3. Limit concurrent requests.
**Test:** Runs on 100+ determinants without browser slowdown.

## Phase 6 – QA & Regression
**Goal:** Verify backend parity.
1. Validate three real services (clean, broken, mixed).
2. Compare with `/service/{id}/publish` results.
**Test:** ≥95% match on validation outcomes.

## Phase 7 – Optional Enhancements
- Live re-validation on DOM changes.
- Diff mode (unsaved vs backend state).
- Extension packaging.

**Testing after each phase**  
Each phase must end with a reproducible output, logged in `CHANGELOG.md`.
