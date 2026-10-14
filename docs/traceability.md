# Requirements Traceability Matrix (Medical Software Engineering)

In compliance with medical device software quality management practices (inspired by **IEC 62304 / ISO 13485**), every user and functional requirement must be formally traced from specification (Input) through code architecture (Implementation) to automated verification (Test Output).

---

## 1. Traceability Table

| Requirement ID | Requirement (Input Specification) | Implementation (Code Output) | Verification (Automated Test / Quality Gate) |
| :--- | :--- | :--- | :--- |
| **REQ-001** | Admin shall be able to create a case with valid fields, storing creator ID automatically | `app/Http/Controllers/CaseController.php@store`<br>`app/Http/Requests/StoreCaseRequest.php`<br>`resources/views/cases/create.blade.php` | `tests/Feature/CaseManagementTest.php::test_admin_can_create_case`<br>Asserts HTTP 302 redirect, database record created with `created_by = auth()->id()`. |
| **REQ-002** | Case Number shall be unique across all records; duplicate submission must be rejected | `database/migrations/xxxx_xx_xx_000002_create_cases_table.php` (`unique('case_number')`)<br>`StoreCaseRequest.php` & `UpdateCaseRequest.php` (`unique:cases,case_number`) | `tests/Feature/CaseManagementTest.php::test_duplicate_case_number_fails_with_422`<br>Asserts validation error on `case_number` field with status code 422 or form redirect with session error. |
| **REQ-003** | Only Admin shall delete cases; Viewer and unauthorized attempts must be blocked with 403 Forbidden | `app/Policies/CasePolicy.php@delete`<br>`CaseController.php@destroy`<br>`CaseApiController.php@destroy` | `tests/Feature/CaseManagementTest.php::test_viewer_cannot_delete_case_receives_403`<br>Asserts HTTP 403 status code when Viewer sends DELETE request to both web and API routes. |
| **REQ-004** | All case management screens and API endpoints shall require authenticated credentials; guest access rejected | `routes/web.php` (`middleware('auth')`)<br>`routes/api.php` (`middleware('auth:sanctum')`) | `tests/Feature/AuthTest.php::test_guest_cannot_access_cases_pages_or_apis`<br>Asserts guests are redirected to `/login` for web and receive `401 Unauthorized` on API. |
| **REQ-005** | Dashboard shall accurately report summary counts for Total, Planning, In Review, Approved, and Completed cases | `app/Http/Controllers/DashboardController.php@index`<br>`resources/views/dashboard.blade.php` | `tests/Feature/CaseManagementTest.php::test_dashboard_displays_accurate_status_counts`<br>Asserts dashboard displays expected aggregated query counts. |
| **REQ-006** | REST API shall return a standardized JSON response envelope (`{ success, data, message }`) with accurate HTTP status codes (200, 201, 401, 403, 404, 422) | `app/Http/Controllers/Api/CaseApiController.php`<br>`app/Http/Resources/CaseResource.php` | `tests/Feature/CaseManagementTest.php::test_sanctum_api_crud_lifecycle`<br>Asserts exact JSON key structure, field validation messages on 422, and proper HTTP response codes. |
| **REQ-007** | Reusable Create/Edit form shall present field-level validation errors directly next to invalid input fields | `resources/views/cases/_form.blade.php`<br>`@error('field') ... @enderror` directives | `tests/Feature/CaseManagementTest.php::test_form_validation_errors_rendered`<br>Asserts Blade view contains error messages corresponding to validation error bag. |
| **REQ-008** | Editing a case shall ignore the current case record when verifying case number uniqueness | `app/Http/Requests/UpdateCaseRequest.php`<br>`Rule::unique('cases', 'case_number')->ignore($case->id)` | `tests/Feature/CaseManagementTest.php::test_case_update_ignores_own_case_number_uniqueness`<br>Asserts updating other fields while retaining the current case number passes validation. |

---

## 2. Verification Summary

All listed requirements are covered by automated unit & feature tests within the PHPUnit test suite. CI/CD pipelines must reject any pull request failing any verification check.
