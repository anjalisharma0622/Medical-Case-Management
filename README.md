# Medical Case Management System

A production-ready, medical device implant case management web application built with **Laravel 11**, **MySQL**, **Blade**, **Laravel Sanctum**, and role-based policies. Developed for **@Jajal Medical** to track implant cases smoothly and reliably from Draft through Planning, In Review, Approved, to Completed.

---

## 1. Project Overview & Tech Stack

- **Backend Framework:** Laravel 11.x (PHP 8.2+)
- **Database:** MySQL 8.0+ (InnoDB, strict mode, utf8mb4)
- **Frontend:** Laravel Blade with Tailwind CSS (fully responsive for mobile, tablet, and desktop)
- **Authentication:** Laravel Breeze / Session Auth for Web; Laravel Sanctum Personal Access Tokens for REST API
- **Authorization:** Laravel Gate & Policy (`CasePolicy`) enforcing strict RBAC
- **Testing:** PHPUnit / Pest Feature Test Suite (100% assertions passing)
- **Architecture:** Clean MVC pattern with Dedicated Form Requests, API Resource responses, Database Seeders, Model Factories, and Eloquent ORM.

---

## 2. User Roles & Capabilities

| Role | View Cases | Create / Edit Cases | Change Status | Delete Cases |
| :--- | :---: | :---: | :---: | :---: |
| **Admin** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Viewer** | ✅ Yes | ❌ No (Read-only) | ❌ No | ❌ No (HTTP 403) |
| **Engineer** *(Bonus)* | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No (HTTP 403) |

> **Security Enforcement:** Role authorization is enforced at both the UI layer (Blade `@can` / policy checks) and strictly on the server-side controller layer using `$this->authorize('delete', $case)` or `Gate::authorize()`. Any unauthorized attempt triggers an immediate `403 Forbidden` response.

---

## 3. Test Login Credentials (Dummy Data)

These credentials are automatically seeded via `php artisan db:seed`.

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@jajalmedical.test` | `password123` | Full administrative control (CRUD + status + delete) |
| **Viewer** | `viewer@jajalmedical.test` | `password123` | Read-only access to dashboard and case details |
| **Engineer** *(Bonus)* | `engineer@jajalmedical.test` | `password123` | Create, edit, and change status; no delete privileges |

*Note: No real patient data is stored. Dummy alphanumeric patient references (e.g., `PT-70194`) are used throughout the system.*

---

## 4. Setup & Installation Steps

### Prerequisites
- PHP 8.2 or higher with extensions: `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `curl`
- Composer 2.x
- MySQL 8.0+
- Node.js 18+ & NPM (for frontend asset compilation)

### Installation Commands

```bash
# 1. Clone the repository
git clone https://github.com/jajal-medical/case-management.git
cd case-management

# 2. Install PHP backend dependencies
composer install

# 3. Setup environment configuration
cp .env.example .env

# Configure your database credentials in .env:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=medical_cases
# DB_USERNAME=root
# DB_PASSWORD=your_password

# 4. Generate application key
php artisan key:generate

# 5. Run database migrations and seeders (creates 3 users and 25 realistic dummy cases)
php artisan migrate --seed

# 6. Install frontend packages and build assets
npm install
npm run build

# 7. Start the local development server
php artisan serve
```

Visit the application at `http://127.0.0.1:8000`.

---

## 5. Automated Feature Testing

The project includes comprehensive automated tests covering authentication, guest restrictions, admin capabilities, duplicate case numbers, and role-based 403 access control.

```bash
# Run all tests using Artisan
php artisan test

# Or run tests using PHPUnit
./vendor/bin/phpunit --testsuite=Feature

# Run specific test file
php artisan test tests/Feature/CaseManagementTest.php
```

### Included Test Cases:
1. `test_valid_login_succeeds`: Verifies authorized users receive a valid session / 302 redirect to dashboard.
2. `test_invalid_login_is_rejected`: Ensures bad credentials show clear validation errors.
3. `test_guest_cannot_access_cases_web_or_api`: Unauthenticated web visits redirect to login; API requests return `401 Unauthorized`.
4. `test_admin_can_create_case`: Admin can persist a new case with valid attributes and automatic `created_by` attribution.
5. `test_duplicate_case_number_fails_with_422`: Case numbers are unique across the system; duplicates trigger a `422 Unprocessable Entity`.
6. `test_viewer_cannot_delete_case_receives_403`: Viewer delete requests receive an enforced `403 Forbidden` response.
7. `test_case_update_ignores_own_case_number_uniqueness`: Updating a case keeping its existing number succeeds without self-collision.
8. `test_sanctum_api_crud_lifecycle`: Complete token generation, authenticated fetch, update, and revocation.

---

## 6. REST API Endpoints (Laravel Sanctum)

All API endpoints produce consistent JSON envelopes:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation description"
}
```

| Method | Endpoint | Description | Access / Token Required | Success Code |
| :--- | :--- | :--- | :--- | :---: |
| `POST` | `/api/login` | Authenticate with email/password to receive a Bearer token | Public (Anyone) | `200 OK` |
| `POST` | `/api/logout` | Revoke current user's access token | Authenticated (Sanctum) | `200 OK` |
| `GET` | `/api/cases` | Paginated list of cases with search & status filters | Admin, Viewer, Engineer | `200 OK` |
| `POST` | `/api/cases` | Create a new implant medical case | Admin, Engineer | `201 Created` |
| `GET` | `/api/cases/{id}` | Retrieve details of a single case by ID | Admin, Viewer, Engineer | `200 OK` |
| `PUT` | `/api/cases/{id}` | Update an existing medical case | Admin, Engineer | `200 OK` |
| `DELETE` | `/api/cases/{id}` | Delete a case permanently | Admin only (Viewer/Engineer: 403) | `200 OK` |

### Error Response Codes:
- `401 Unauthorized`: Missing or invalid Bearer token.
- `403 Forbidden`: Authenticated user lacks permission for the action (e.g., Viewer deleting).
- `404 Not Found`: Case ID not found in database.
- `422 Unprocessable Content`: Validation failure with field-level details:
```json
{
  "success": false,
  "message": "The case number has already been taken.",
  "errors": {
    "case_number": ["The case number has already been taken."]
  }
}
```

A complete Postman / Thunder Client collection is provided at `docs/postman_collection.json`.

---

## 7. Medical Traceability Matrix

For medical software compliance, requirements are strictly traced from specification through code implementation to automated verification. See `docs/traceability.md` for full details:

| ID | Requirement (Input) | Implementation (Output) | Verification |
| :--- | :--- | :--- | :--- |
| **REQ-001** | Admin shall be able to create a case | `CaseController@store` + `StoreCaseRequest` + create form | `tests/Feature/CaseManagementTest.php::test_admin_can_create_case` |
| **REQ-002** | Case Number shall be unique | Unique DB index on `cases.case_number` + Form Request validation rule | `tests/Feature/CaseManagementTest.php::test_duplicate_case_number_fails_with_422` |
| **REQ-003** | Only Admin shall delete cases | `CasePolicy@delete` enforced via `$this->authorize('delete', $case)` | `tests/Feature/CaseManagementTest.php::test_viewer_cannot_delete_case_receives_403` |

---

## 8. Assumptions & Known Limitations

1. **Patient Data Privacy:** Under medical device regulations (HIPAA / GDPR), real patient identities are never stored. Only synthetic alphanumeric references (e.g. `PT-98241`) are permitted.
2. **Timezone:** Timestamps are recorded in UTC in MySQL and rendered in user-configured local timezone.
3. **Surgeon Records:** Surgeon and implant type fields are stored as direct text values in this version; future iterations could normalize these to relational reference catalogs (`surgeons` and `implants` tables).
4. **Third-Party API Resilience:** The optional public holiday integration (Nager.Date API) utilizes a 3-second timeout and fails gracefully if external connectivity is interrupted.
