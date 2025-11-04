# eR-Assistant

### Purpose
eR-Assistant is a **connected validation assistant** for the UNCTAD BPA platform.  
It reads live data from the backend (API) and the browser DOM to verify services, forms, roles, and determinants in real time.

### Why it exists
Publishing a BPA service often fails because of silent configuration errors (missing determinants, wrong field links, broken roles).  
eR-Assistant detects these issues directly in the modeling environment before publishing.

### How it works
1. Runs as a bookmarklet or browser extension.
2. Detects the current `serviceId` from the page URL.
3. Fetches live entities from the BPA backend using the user’s existing session.
4. Reads the visible DOM and merges both sources.
5. Applies backend-aligned validation rules and displays a structured report in-page.

### Key Features
- Connected mode: no exports, no manual uploads.
- Full backend parity for determinants, forms, and roles.
- Instant feedback inside BPA pages.
- Read-only access: never modifies data.
- Portable: bookmarklet or extension.

### Quick Start
1. Add the bookmarklet:
   ```javascript
   javascript:(function(){
     if(window.erAssistantLoaded)return;
     var s=document.createElement('script');
     s.src='https://gfrankgva.github.io/eR-assistant/eR-assistant.js';
     document.body.appendChild(s);
   })();
   ```
2. Open any BPA Service edit page.
3. Click the bookmark → the widget appears.
4. Run validation.

### Folder Overview
| File | Purpose |
|------|----------|
| `eR-Assistant-Context.md` | Technical vision & architecture |
| `development-plan.md` | Phased roadmap with testing steps |
| `validation-rules-spec.md` | Canonical list of validation checks |
| `/reference/` | Backend documentation (read-only) |
| `test-protocols.md` | Testing procedures |
| `CHANGELOG.md` | Phase progress log |

### License
Internal UNCTAD BPA development use.  
No external distribution without written authorization.
