# eR Assistant - Technical Context for Development

## Mission

Quality control tool for service designers building government services in eRegistrations BPA (Business Process Analyzer). Prevents configuration errors before services are published to DS (Display System).

---

## Part 1: What Currently Works (v1.4)

**Format:** Browser bookmarklet widget (single JavaScript file)  
**Status:** ~70% complete - basic analysis working

### Implemented Validations

- ✅ Unused BOTs detection
- ✅ Broken determinants (missing field references)
- ✅ System variable filtering (smart camelCase detection)
- ✅ Broken classifications (AAPCE-type errors)
- ✅ Missing BOT data mappings

### UI Features

- ✅ JSON upload interface
- ✅ Service overview stats
- ✅ Health indicators
- ✅ Error/warning categories
- ✅ Collapsible sections with persistence
- ✅ Resize with localStorage
- ✅ Links to BPA for each issue

### Code Quality

- Event delegation (no inline onclick)
- Named constants
- Error handling with validation
- FileReader error handling

---

## Part 2: What Needs to be Built

### Priority 1: Complete BPA Analyzer Validation (Next Sprint)

**Add these 13 validation rules from Service-Validation-Error-Inventory.md:**

#### Registration Errors (3)

```javascript
// REG-001: No active registration
if (registrations.filter(r => r.active).length === 0) {
  error("Service must have at least one active registration");
}

// REG-002: Registration has no institution  
registrations.filter(r => r.active).forEach(reg => {
  if (!reg.institution || reg.institutions.length === 0) {
    error(`Registration '${reg.name}' has no institution assigned`);
  }
});

// REG-003: Registration has multiple institutions
registrations.filter(r => r.active).forEach(reg => {
  if (reg.institutions && reg.institutions.length > 1) {
    error(`Registration '${reg.name}' has ${reg.institutions.length} institutions. Only one allowed`);
  }
});
```

#### Role Errors (10)

```javascript
// ROLE-001: Active role has no institution
roles.filter(r => r.active).forEach(role => {
  if (!role.institution) {
    error(`Role '${role.name}' has no institution assigned`);
  }
});

// ROLE-002: Active role has no registration
roles.filter(r => r.active).forEach(role => {
  if (!role.registrations || role.registrations.length === 0) {
    error(`Role '${role.name}' not linked to any registration`);
  }
});

// ROLE-003: BOT role has no BOT specified
roles.filter(r => r.type === 'BOT' && r.active).forEach(role => {
  if (!role.bots || role.bots.length === 0) {
    error(`BOT role '${role.name}' has no BOT assigned`);
  }
});

// ROLE-004: BOT role action has no BOT service
roles.filter(r => r.type === 'BOT').forEach(role => {
  role.bots?.forEach(bot => {
    if (!bot.serviceId) {
      error(`BOT '${bot.name}' in role '${role.name}' has no service ID`);
    }
  });
});

// ROLE-005: BOT service not found
// (Requires deployment info - may need API or skip)

// ROLE-006: BOT input mapping missing
roles.filter(r => r.type === 'BOT').forEach(role => {
  role.bots?.forEach(bot => {
    bot.requiredInputs?.forEach(input => {
      if (!bot.inputMappings || !bot.inputMappings[input]) {
        error(`BOT '${bot.name}' missing required input mapping: '${input}'`);
      }
    });
  });
});

// ROLE-007: Applicant role in parallel flow
// (Requires process flow graph analysis)

// ROLE-008: File decline missing rejection catalog
roles.forEach(role => {
  if (role.hasDeclineStatus && !role.rejectionCatalog) {
    error(`Role '${role.name}' allows rejection but has no rejection catalog`);
  }
});

// ROLE-009: File decline has no destination
roles.forEach(role => {
  if (role.hasDeclineStatus && !role.declineDestination) {
    error(`Role '${role.name}' allows rejection but has no destination`);
  }
});

// ROLE-010: Problem role missing registrations
roles.filter(r => r.type === 'BOT').forEach(botRole => {
  if (botRole.problemRole) {
    const problemRole = roles.find(r => r.id === botRole.problemRole);
    const missingRegs = botRole.registrations.filter(
      reg => !problemRole.registrations.includes(reg)
    );
    if (missingRegs.length > 0) {
      error(`Problem role '${problemRole.name}' missing registrations: ${missingRegs.join(', ')}`);
    }
  }
});
```

### Priority 2: Add Determinant Type Validation

**From Determinant-System-Refactoring-Guide.md:**

**All Determinant Types to recognize:**
- Field-based: Text, Select, Date, Boolean, Money, Numeric, Radio, File
- Structure-based: Grid, SubCatalog
- Integration-based: Bot
- System-based: Event  
- Process-based: Registration

**Type Mismatch Detection:**

```javascript
determinants.forEach(det => {
  const field = findField(det.targetFormFieldKey);
  
  // Text determinant on non-text field
  if (det.type === 'TEXT' && field.type !== 'textfield') {
    warning(`Text determinant '${det.name}' on ${field.type} field`);
  }
  
  // Date determinant on non-date field
  if (det.type === 'DATE' && field.type !== 'datetime') {
    warning(`Date determinant '${det.name}' on ${field.type} field`);
  }
  
  // Grid determinant on non-grid field
  if (det.type === 'GRID' && field.type !== 'editgrid') {
    error(`Grid determinant '${det.name}' on ${field.type} field`);
  }
  
  // Event determinant validation
  if (det.type === 'EVENT') {
    const component = findComponent(det.componentId);
    const validEvents = getComponentEvents(component.type);
    if (!validEvents.includes(det.eventType)) {
      error(`Event '${det.eventType}' not valid for ${component.type}`);
    }
  }
});
```

**Component Event Types:**
- Button: click, submit
- TextField: change, blur, focus
- FileUpload: upload, remove
- EditGrid: addRow, removeRow
- DataGrid: selectRow, updateRow

### Priority 3: Add Claude API Integration (Smart Analysis)

**Implementation approach:**

```javascript
// Add settings section to widget
const apiKey = localStorage.getItem('anthropic-api-key');

async function analyzeWithClaude(serviceData) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `You are an eRegistrations service analyzer. Analyze this BPA service configuration and:
1. Explain errors in plain language
2. Detect anti-patterns (duplicate BOTs, overly complex determinants)
3. Suggest specific fixes with field names
4. Compare to best practices

Service JSON:
${JSON.stringify(serviceData, null, 2)}

Use the error catalog from Service-Validation-Error-Inventory.md`
      }]
    })
  });
  
  return response.json();
}
```

**What Claude API adds:**
- Plain language error explanations
- Anti-pattern detection ("3 BOTs checking tax ID - consolidate")
- Context-aware suggestions ("Map applicantName to externalAPI.name")
- Best practice comparisons

**Cost:** ~$0.01 per analysis

---

## Part 3: Future Phases (Not Started)

### Phase 4: DS Tester
- Inject into DS pages
- Auto-fill forms, click buttons
- Monitor BOT execution
- Validate role transitions
- Capture error screenshots

### Phase 5: Service Comparator  
- Load multiple services
- Find common patterns
- Suggest reusable components
- Generate component library

---

## Part 4: eRegistrations Domain Model

### Core Entities

**Service:**
- Contains: registrations, roles, BOTs, determinants, actions
- Configured in: BPA
- Runs in: DS

**Registration:**
- What: Authorization result (license, certificate, permit)
- Has: institution (issuer), subjects (who needs it), requirements (data/docs/fees)
- Must have: exactly 1 active institution

**Role:**
- What: Processing step in workflow
- Types: Human (staff) or BOT (automated)
- Has: institution, registrations, status (0-3), form (human only)
- Status: 0=pending, 1=passed, 2=sent back, 3=rejected

**BOT:**
- What: Automated action
- Types: Data (API calls), Document (certificates), Message (notifications), WSDL (SOAP), Listener (event triggers), Internal (transforms)
- Has: serviceId, inputMappings, outputMappings
- Used as: role executor OR component action

**Determinant:**
- What: Condition that triggers action
- Types: See table below
- Based on: field values, events, component states

**Action:**
- What: Operation assigned to component
- Types: System (approve/reject) or BOT (save/upload)
- Has: effects (show/hide, enable/disable, validate)

### Determinant Type Reference

| Type | Description | Example |
|------|-------------|---------|
| TEXT | Text field condition | "If applicantName contains 'LLC'" |
| SELECT | Dropdown selection | "If countryOfOrigin = 'USA'" |
| DATE | Date field condition | "If applicationDate > 2024-01-01" |
| BOOLEAN | Checkbox state | "If agreesToTerms = true" |
| MONEY | Currency amount | "If totalFees > 1000" |
| NUMERIC | Number field | "If employeeCount > 50" |
| RADIO | Radio button | "If businessType = 'Corporation'" |
| FILE | File upload state | "If certificateUploaded = true" |
| GRID | EditGrid row condition | "If items.length > 10" |
| SUBCATALOG | Catalog value | "If activityCode in [123, 456]" |
| BOT | External service response | "If taxVerification.status = 'valid'" |
| EVENT | Component event | "If submitButton clicked" |
| REGISTRATION | Process state | "If hasBusinessRegistration = true" |

### System Variables (Always Skip in Validation)

**Exact matches:**
- isFormValid, isCurrentPartATabValid, theProcedureIsFree
- isPayedDigitally, is_submit_allowed, totalCost
- requirementNotRequired, fileupload, filedate, filestatus
- filerejection, documentrejection, filetitle, certtitle, certid

**Pattern detection:**
- Contains "TabValid"
- Starts with "rejection", "sendbacktocorrections", "file"
- Starts with "is" + 3rd char uppercase (camelCase system var)
  - ✅ `isFormValid` (3rd char 'F' uppercase)
  - ❌ `issueDate` (3rd char 's' lowercase)

---

## Part 5: Bot Architecture Deep Dive

### What are Bot Mappings?

At **publish time**, the system automatically generates DataWeave transformations that map data between form fields and external services.

**INPUT Mapping:** Form data → External service request format  
**OUTPUT Mapping:** External service response → Form fields

**Example:**
```
Form field: applicant.name
INPUT mapping: applicantName -> externalAPI.fullName
OUTPUT mapping: externalAPI.status -> verificationStatus
```

### Bot Types - Complete Reference

| Bot Type | Purpose | INPUT Transform | OUTPUT Transform |
|----------|---------|----------------|------------------|
| **Data** | REST/HTTP APIs | Form → JSON/XML request | JSON/XML response → Form |
| **WSDL** | SOAP services | Form → SOAP envelope | SOAP response → Form |
| **Document** | PDF generation | Form → PDF template data | PDF metadata → Form |
| **Message** | Email/SMS | Form → email/SMS template | Delivery status → Form |
| **Listener** | External events | External event → Form | Form → Event acknowledgment |
| **Internal** | Data transforms | Form → Transformed data | Transformed data → Form |

### Special Path Markers

**EditGrid (repeatable sections) become collections:**
```
Form: items[0].price, items[1].price, items[2].price
Mapping: items_collection_item.price
Result: Array of prices
```

**Nested objects use `_child_` markers:**
```
Form: applicant.address.street
Mapping: applicant_child_address_child_street
Result: Nested object structure
```

### Why Missing Mappings Break BOTs

1. **INPUT mapping missing:** BOT can't send data to external service (empty request)
2. **OUTPUT mapping missing:** BOT can't save response back to form (data lost)
3. **Type mismatch:** String sent to number field (validation error)
4. **Path error:** Wrong collection/child path (data sent to wrong location)

**Analyzer must check:** Every BOT has all required INPUT/OUTPUT mappings defined.

---

## Part 6: Publishing Process

### Eight Publishing Phases

**Phase 1: Pre-Publishing Validation** ⚠️ **THIS IS WHERE ANALYZER HELPS**
- Validates all required fields
- Checks BPMN diagram structure
- Verifies form configuration
- Validates role setup
- Checks classifications
- Tests external integration accessibility
- **If validation fails → Nothing deploys**

**Phase 2: Lock Acquisition**
- Prevents concurrent publishing
- Tracks publishing status
- Enables WebSocket notifications

**Phase 3: Cache Initialization**
- Initializes service-specific caches
- Loads field definitions
- Loads determinant rules
- Loads translation mappings

**Phase 4: Form Generation & Deployment**
- Generates applicant wizard
- Creates inspector review forms
- Creates Part B review forms
- Deploys to Form.io server

**Phase 5: BPMN Process Deployment**
- Generates BPMN XML
- Links forms to BPMN tasks
- Deploys to Camunda engine

**Phase 6: Data Catalog Deployment**
- Publishes process costs
- Publishes certificates
- Publishes service catalogs
- Publishes translations
- Bulk insert to RestHeart/MongoDB

**Phase 7: Service Activation**
- Marks service as active
- Notifies external systems
- Notifies Mule ESB
- Synchronizes Part B backend

**Phase 8: Cleanup**
- Clears temporary caches
- Removes publishing locks
- Prepares for next cycle

### Analyzer's Purpose

**eR Assistant catches Phase 1 errors BEFORE user clicks publish.**

Without analyzer:
1. User configures service in BPA
2. Clicks "Publish"
3. Phase 1 validation runs
4. Error found → Publish fails
5. User fixes error
6. Repeat from step 2

With analyzer:
1. User configures service in BPA
2. Runs eR Assistant analyzer
3. Sees all errors at once
4. Fixes all errors
5. Clicks "Publish"
6. Phase 1 passes → Service deploys

**Result:** Faster feedback loop, fewer failed publishes, less frustration.

### Common Production Errors (Analyzer Can't Detect)

These are runtime/infrastructure errors that static JSON analysis can't catch:

| Error | Cause | Why Analyzer Can't Help |
|-------|-------|-------------------------|
| "Already publishing" | Concurrent attempt | Runtime lock state |
| Form.io timeout | Network issue | Infrastructure problem |
| Camunda deployment failed | Invalid BPMN runtime | Runtime validation |
| RestHeart connection error | MongoDB down | Infrastructure problem |
| BOT service not found | External service down | Deployment/runtime issue |

**Analyzer focuses on:** Configuration errors (missing fields, type mismatches, broken references)  
**Analyzer can't catch:** Runtime issues (network, infrastructure, deployment state)

---

## Part 7: Runtime Limitations

### Global vs Local File State

**The Problem:**
- **Camunda** stores the authoritative global file state
- Each **active role** works on a local copy in DS
- **Merge happens** when role completes (send/validate/reject)
- **Conflicts possible** if global changes while user editing

**Example conflict:**
1. Part A user opens file (copies global → local)
2. Part B user approves file (updates global)
3. Part A user submits (local → global, overwrites Part B's work)

**Why analyzer can't help:**
- Static JSON analysis can't predict runtime merge conflicts
- Would need to simulate full process execution
- Would need to track concurrent user actions

### What Analyzer CAN vs CAN'T Validate

**CAN Validate (Static Configuration):**
- ✅ Missing required fields
- ✅ Broken references (determinant → missing field)
- ✅ Type mismatches (text determinant on date field)
- ✅ Missing BOT mappings
- ✅ Invalid role configurations
- ✅ Registration setup errors

**CAN'T Validate (Runtime Behavior):**
- ❌ Actual BOT execution success/failure
- ❌ External API response handling
- ❌ Form rendering in DS
- ❌ User interaction flow
- ❌ Merge conflicts
- ❌ Network timeouts
- ❌ Database connectivity
- ❌ Permission enforcement

**Strategy:** 
1. Analyzer catches configuration errors (70% of issues)
2. DS Tester (Phase 4) catches runtime errors (remaining 30%)
3. Production monitoring catches infrastructure issues

---

## Part 8: Technical Implementation Notes

### JSON Structure Patterns

**Service Export Structure:**
```javascript
{
  service: {
    name: string,
    registrations: Registration[],
    bots: Bot[],
    roles: Role[],
    serviceDeterminants: Determinant[],
    componentActions: Action[],
    applicantFormPage: { formSchema: string }, // JSON string
    // ... other fields
  }
}
```

**Where to find things:**
- BOTs: `service.bots`
- Roles: Query from `componentActions` → `actionRows` → `bots`
- Determinants: `service.serviceDeterminants`
- Form fields: Parse `service.applicantFormPage.formSchema` (JSON string)
- Actions: `service.componentActions`

### Current Backend Architecture Issues

**From Determinant-System-Refactoring-Guide.md:**

- 20+ determinant repositories (should be 1 generic)
- 30+ line if-else chains for type checking
- 1400-line "God Class" controller
- No factory pattern

**Impact on service designers:**
- Backend complexity leads to configuration errors
- Service designers don't understand determinant type rules
- Analyzer should catch these mistakes BEFORE publish

### Error Message Templates

Use clear, actionable language:

```javascript
// ❌ Bad
"BOT role validation failed"

// ✅ Good  
"BOT role 'Tax Verification' has no BOT assigned. Add a Data BOT in BPA → Roles → Tax Verification → BOT section"
```

**Message structure:**
1. What's wrong (specific role/BOT/field name)
2. Why it matters (will cause failure)
3. Where to fix (exact BPA location)
4. How to fix (specific action)

---

## Part 9: Determinant Backend Architecture

### Current Problems

From Determinant-System-Refactoring-Guide.md:

**1. God Class Anti-Pattern**
- DeterminantController is 1400 lines
- Handles CRUD, deletion, factory creation, validation, events
- Hard to test, extend, maintain

**2. Unmaintainable Polymorphism**
- 30+ line if-else chains throughout code
- Repeats for save, delete, update operations
- Adding new determinant type = changes in 5+ places

```java
if (determinant instanceof TextDeterminant) {
  textDeterminantRepository.save((TextDeterminant) determinant);
} else if (determinant instanceof SelectDeterminant) {
  selectDeterminantRepository.save((SelectDeterminant) determinant);
} else if (determinant instanceof DateDeterminant) {
  dateDeterminantRepository.save((DateDeterminant) determinant);
}
// ... 15 more else-ifs
```

**3. Repository Explosion**
- 20+ repositories autowired (one per determinant type)
- TextDeterminantRepository, SelectDeterminantRepository, DateDeterminantRepository, etc.
- Unnecessary boilerplate

### What Analyzer Should Check

**Type Mismatches (Error):**
- EventDeterminant on wrong component type
- BotDeterminant without corresponding BOT execution
- GridDeterminant referencing non-grid field

**Anti-Patterns (Warning):**
- Multiple determinants doing same thing (consolidate)
- Determinant referencing wrong field type (text det on date field)
- Orphaned determinants (defined but never used)

**Event Determinant Specific (Error):**
- Event type must match component
- Component types supporting events: Button, TextField, FileUpload, EditGrid, DataGrid
- Button click event on TextField = ERROR

---

## Part 10: Files & Usage

**Current version:** `er-assistant_1_4.js`  
**Install:** Drag to bookmark bar  
**Use:** Click bookmark on BPA page → upload JSON

### Development Cycle

1. Add new validation rule
2. Test on real service JSONs
3. Service designer reports false positives
4. Refine detection logic
5. Repeat

### Testing JSONs Available

- Reserve_a_Business_Name (39 determinants, all FORMFIELD)
- Delegate_User_Rights (FORMFIELD only)
- Solicitar_certificado_de_origen (24 determinants, FORMFIELD + EVENT)

---

## Part 11: Next LLM Session Quick Start

### To Continue Development:

1. **Read this entire context document**
2. **Load current code:** `er-assistant_1_4.js` from outputs
3. **Pick a priority:**
   - Add 13 service validation errors (Part 2, Priority 1)
   - Add determinant type validation (Part 2, Priority 2)
   - Add Claude API integration (Part 2, Priority 3)
4. **Implement validation rules** using patterns shown
5. **Test with user-provided service JSONs**
6. **Iterate based on false positive feedback**

### Key Question to Ask User:

**"Which validation errors are you encountering most in production? Let's prioritize those first."**

### Development Principles:

1. **Clear error messages** - Always explain what's wrong, why it matters, where to fix, how to fix
2. **No false positives** - Better to miss an error than flag valid configurations
3. **Performance matters** - Analyzer should run in <2 seconds
4. **Iterative improvement** - Start with high-confidence checks, add edge cases later
5. **Test on real data** - Always validate against actual service exports

---

## Part 12: Architecture Decisions

### Why Bookmarklet vs Extension?

**Bookmarklet (Current):**
- ✅ No installation required
- ✅ Works on any browser
- ✅ Single JavaScript file
- ✅ No permissions needed
- ❌ Can't persist settings easily (uses localStorage)
- ❌ No background processing

**Browser Extension (Future?):**
- ✅ Better settings UI
- ✅ Background processing
- ✅ Better security
- ❌ Requires installation
- ❌ Browser-specific (Chrome, Firefox, etc.)
- ❌ App store approval

**Decision:** Start with bookmarklet, migrate to extension if needed.

### Why Client-Side vs Backend Service?

**Client-Side (Current):**
- ✅ No server costs
- ✅ Works offline
- ✅ Fast (no network latency)
- ✅ User owns their data
- ❌ Limited to JavaScript analysis
- ❌ Can't access BPA/DS databases directly

**Backend Service (Future?):**
- ✅ Can access BPA database
- ✅ Can run complex analysis
- ✅ Can cache results
- ✅ Can compare across all services
- ❌ Requires hosting
- ❌ Network dependency
- ❌ Security/authentication required

**Decision:** Start client-side, add optional backend APIs later.

### Why Manual JSON Upload vs Auto-Fetch?

**Manual Upload (Current):**
- ✅ Works immediately
- ✅ No backend changes needed
- ✅ User controls what's analyzed
- ❌ Extra step (export → upload)
- ❌ Can analyze stale data

**Auto-Fetch (Future):**
- ✅ Always current data
- ✅ One-click analysis
- ✅ Can monitor changes
- ❌ Requires BPA API endpoint
- ❌ Requires authentication
- ❌ Needs backend development

**Decision:** Start manual, add auto-fetch when BPA APIs available.

---

## Part 13: Error Catalog Reference

### Registration Errors (3)

| Code | Error | Fix Location |
|------|-------|--------------|
| REG-001 | No active registration | BPA → Registrations → Mark at least one Active |
| REG-002 | Registration has no institution | BPA → Registration → Assign Institution field |
| REG-003 | Registration has multiple institutions | BPA → Registration → Remove extra institutions (keep 1) |

### Role Errors (10)

| Code | Error | Fix Location |
|------|-------|--------------|
| ROLE-001 | Active role has no institution | BPA → Role → Assign Institution field |
| ROLE-002 | Active role has no registration | BPA → Role → Link to Registration field |
| ROLE-003 | BOT role has no BOT | BPA → BOT Role → Add BOT section |
| ROLE-004 | BOT action has no service | BPA → BOT Role → BOT Action → Specify Service ID |
| ROLE-005 | BOT service not found | Check with admin that service is deployed |
| ROLE-006 | BOT input mapping missing | BPA → BOT Role → Input Mapping → Complete required fields |
| ROLE-007 | Applicant role in parallel flow | Restructure: Applicant must be single entry point |
| ROLE-008 | Decline missing rejection catalog | BPA → Role → Status → Select Rejection Catalog |
| ROLE-009 | Decline has no destination | BPA → Role → Status → Specify Destination |
| ROLE-010 | Problem role missing registrations | BPA → Problem Role → Add all registrations from BOT role |

### Prevention Checklist

Before publishing, verify:

**Registrations:**
- ✓ At least one registration marked Active
- ✓ Each active registration has exactly one institution
- ✓ No registration has zero institutions

**Roles:**
- ✓ Each active role has institution assigned
- ✓ Each active role linked to ≥1 active registration
- ✓ BOT roles have BOT configured
- ✓ Each BOT has service ID specified
- ✓ Each BOT service exists in deployment
- ✓ All required BOT input mappings completed
- ✓ No applicant role in parallel workflow
- ✓ Rejection statuses have rejection catalog
- ✓ Rejection statuses have destination role
- ✓ Problem roles have all required registrations

---

## Part 14: Glossary Quick Reference

### Key Terms

**BPA (Business Process Analyzer):**
- Admin interface for service design
- Where service designers configure everything
- NOT used by applicants or staff

**DS (Display System):**
- User interface for applicants and staff
- Where services run live
- Where actual submissions happen

**Service:**
- Process to obtain registrations
- Sequence of online screens and actions
- Can deliver single or multiple registrations

**Registration:**
- Authorization issued by government (license, permit, certificate)
- Has: data, documents, fees requirements
- Delivered as result of service

**Role:**
- Processing step in workflow
- Human (staff member) or BOT (automated)
- Has: institution, registrations, status, form

**BOT:**
- Automated action without human intervention
- Types: Data, Document, Message, WSDL, Listener, Internal
- Used as role executor OR component action

**Determinant:**
- Condition that triggers action
- Based on field values, events, component states
- When met, action executes

**Action:**
- Operation assigned to component
- System (approve/reject) or BOT (save/upload)
- Produces effects (show/hide, enable/disable, validate)

**Effect:**
- Outcome when action executes
- Show/hide, activate/inactivate, enable/disable, validate

**Validation:**
- Ensures field meets rules
- Static (fixed rules) or dynamic (based on other fields)
- Shows error message if fails

---

## Part 15: Version History

**v1.0 (Phase 1)** - Basic widget
- JSON upload
- Service overview stats
- Basic error detection

**v1.1** - Health indicators
- Unused BOTs detection
- Broken determinants
- Quality scoring

**v1.2** - UI improvements
- Collapsible sections
- State persistence
- Better error messages

**v1.3** - System variables
- Smart camelCase detection
- Pattern matching
- False positive reduction

**v1.4 (Current)** - Polish
- Resize with persistence
- Better error handling
- FileReader validation
- Flex alignment fixes

**v1.5 (Next)** - Validation rules
- 13 service validation errors
- Determinant type checking
- Event validation

**v2.0 (Future)** - Smart analysis
- Claude API integration
- Anti-pattern detection
- Best practice suggestions

**v3.0 (Future)** - DS Tester
- Live form testing
- BOT execution monitoring
- Runtime validation

**v4.0 (Future)** - Service Comparator
- Multi-service analysis
- Pattern extraction
- Reusable components

---

**This document provides complete context for any LLM to continue eR Assistant development with full understanding of the domain, current state, and implementation path.**
