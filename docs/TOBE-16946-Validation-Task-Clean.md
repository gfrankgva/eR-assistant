# Service Validation: Show All Errors at Once

Type: Task | Priority: High | Project: eRegistrations

## Problem

When a service designer tries to publish a service, the system validates it but reports only the first error. The designer must fix that error, then try to publish again to see the next error. For services with many issues (common during migrations), this requires dozens of publish attempts.

Example scenario:
- Service has 10 validation errors
- Current flow: Error 1 → Fix → Publish → Error 2 → Fix → Publish → ... (10 attempts)
- Desired flow: Check errors → See all 10 at once → Fix all → Publish (1 attempt)

## Goal

Provide a way for service designers to see all validation errors in a single report, without having to publish repeatedly.

## Context

Services are configured in BPA (Business Process Analyzer). Validation currently happens only during publish in ServicePublishController.publish(). The system stops at the first error and prevents publishing.

Each eRegistrations instance has multiple Mule deployments:
- mule-common — shared services
- mule-{country} (optional) — country-specific services (example: mule-benin)

Services can be validated and published to different destinations. Validation must use services from the selected destination.

## Acceptance Criteria

1. Designers can run a validation check on a service at any time (not just at publish)
2. The validation returns a complete list of all errors, not just the first one
3. Validation does not modify the service or trigger a real publish
4. Same validation rules apply as during publish
5. Validation is performed against the selected destination (example: mule-common, mule-benin)
6. If no destination selected, validate against local (default)
7. New button "Check errors" appears in BPA between "See service" and "Publish service" buttons
8. Clicking "Check errors" displays all validation errors in a modal or panel
9. Errors are clear and actionable (include location and reason)

## Technical Analysis

Validation logic is located in:

org.unctad.ereg.bpa.bpmn.validation.RoleDataValidation
- Approximately 15 throw points
- Validates roles, institutions, registrations, bot configurations

org.unctad.ereg.bpa.bpmn.validation.RegistrationDataValidation
- 3 throw points
- Validates registrations and their institutions

org.unctad.ereg.bpa.bpmn.validation.ServiceDataValidation
- Orchestrates the above two validators

Both validation classes throw an exception on the first error encountered. They must be modified to collect all errors into a list and throw (or return) the complete list at the end.

New endpoint required:

POST /service/{id}/validate?externalServerId={externalServerId}
- Reuses modified validation logic
- Does not throw, returns error list
- Respects externalServerId parameter for destination-specific Mule services

Known issue: getMuleServiceMap(ExternalServer) in MuleController currently ignores the externalServerId parameter. This should be reviewed and fixed during implementation to ensure correct Mule services are loaded per destination.

## Implementation Strategy

Phase 1: Extract and refactor validation logic (3-4 hours backend)
- Modify RoleDataValidation.validate() to collect errors instead of throwing
- Modify RegistrationDataValidation.validate() to collect errors instead of throwing
- Create List<ValidationError> to collect all errors
- At end of validation, throw single exception with all errors
- Maintains backward compatibility with publish()

Phase 2: Create validation-only endpoint (included in Phase 1 time)
- New endpoint: POST /service/{id}/validate?externalServerId={id}
- Calls same validation methods as publish()
- Returns HTTP 200 with error list instead of throwing
- Does not modify service or trigger publish

Phase 3: Ensure destination-specific validation (included in Phase 1 time)
- Review getMuleServiceMap() to ensure externalServerId is respected
- Validate against correct Mule deployment (mule-common vs mule-benin, etc.)

Phase 4: Frontend integration (1-2 hours)
- Add "Check errors" button to BPA UI
- Position: between "See service" and "Publish service" buttons
- On click: call /service/{id}/validate endpoint
- Display results in modal or panel with all errors listed

## Definition of Done

- Validation endpoint can return 5+ errors in single response
- Endpoint respects externalServerId parameter and validates against correct destination
- Existing publish flow behavior unchanged (still throws on first error)
- "Check errors" button appears and is functional in BPA
- Errors display clearly with location and description
- No errors or warnings in logs during validation
- Unit tests added for validation collection logic
- Manual testing completed for multi-error scenarios

## Effort Estimate

Backend (Phases 1-3): 3-4 hours
Frontend (Phase 4): 1-2 hours (depends on BPA framework)
Testing: 2-4 hours
Total: 6-10 hours
