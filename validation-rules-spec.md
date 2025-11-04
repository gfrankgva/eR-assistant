# Validation Rules Specification – eR-Assistant

Each rule mirrors backend validations before service publishing.  
Columns: ID | Description | Data Source | Backend Reference | Severity

| ID | Description | Data Source | Backend Reference | Severity |
|----|--------------|-------------|------------------|-----------|
| FORM_TYPES | All mandatory form types exist (GUIDEFORM, FORM, DOCUMENT, PAYMENT, SENDPAGE) | API | formio-lifecycle.md §Form Types | Error |
| ROLE_FORMS | Each user role has an associated form schema | API | formio-lifecycle.md §Role-based forms | Error |
| DETERMINANT_TYPE | Determinant type is valid (BOT, EVENT, FORMFIELD, etc.) | API | determinant-lifecycle.md §DeterminantType | Error |
| DETERMINANT_TARGET | Each FORMFIELD determinant targets an existing field | API + DOM | determinant-lifecycle-documentation.md §Configuration | Error |
| DETERMINANT_DUPLICATE | No duplicate determinant name/business key within service | API | determinant-lifecycle-documentation.md §Creation | Error |
| BOT_LINK | Bot determinants link to valid bot configurations | API | determinant-lifecycle.md §Event Determinants | Error |
| FORM_FIELD_EXISTENCE | All determinant `targetFormFieldKey` appear in form schema | API + DOM | formio-lifecycle.md §Form Generation | Error |
| COST_STRUCTURE | PAYMENT form implies defined cost structure | API | service-publishing-process.md §Phase 3 | Warning |
| CLASSIFICATION_VALID | Catalog references resolve to existing classifications | API | determinant-lifecycle.md §ClassificationDeterminant | Warning |
| PRINT_TEMPLATE_VALID | Print documents have proper template references | API | formio-lifecycle.md §Print/Certificate Forms | Warning |
| UNUSED_DETERMINANT | Determinant defined but unused in any form | API | determinant-lifecycle-documentation.md §Usage | Info |

**Output Format**
```json
{
  "serviceId": "uuid",
  "status": false,
  "message": "3 errors, 2 warnings",
  "errors": [{"area":"Determinants","field":"targetFormFieldKey","message":"Missing"}],
  "warnings": [{"area":"Costs","message":"No cost structure found"}],
  "timestamp": "2025-11-04T12:00:00Z"
}
```

**Severity definitions**
- **Error:** would block publish.
- **Warning:** would publish but requires review.
- **Info:** diagnostic only.

Refer to `/docs/reference/*.md` for backend alignment.
