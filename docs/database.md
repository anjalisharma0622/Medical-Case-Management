# Database Schema & Relationship Documentation

This document describes the database design for the **Medical Case Management System** for **@Jajal Medical**.

---

## 1. Entity Relationship Overview

```
+-------------------------------------------------------------+
|                            USERS                            |
+-------------------------------------------------------------+
| id                  : BIGINT UNSIGNED (PK, Auto-Increment)  |
| name                : VARCHAR(255)                          |
| email               : VARCHAR(255) (UNIQUE INDEX)           |
| email_verified_at   : TIMESTAMP (Nullable)                  |
| password            : VARCHAR(255) (Bcrypt Hash)            |
| role                : ENUM('admin', 'viewer', 'engineer')   |
| remember_token      : VARCHAR(100) (Nullable)               |
| created_at          : TIMESTAMP                             |
| updated_at          : TIMESTAMP                             |
+-------------------------------------------------------------+
                              | 1
                              |
                              | hasMany (createdCases)
                              |
                              | belongsTo (creator)
                              v N
+-------------------------------------------------------------+
|                            CASES                            |
+-------------------------------------------------------------+
| id                  : BIGINT UNSIGNED (PK, Auto-Increment)  |
| case_number         : VARCHAR(50) (UNIQUE INDEX)            |
| patient_reference   : VARCHAR(100)                          |
| surgeon_name        : VARCHAR(255)                          |
| implant_type        : VARCHAR(255)                          |
| status              : ENUM('Draft', 'Planning', 'In Review',|
|                            'Approved', 'Completed',         |
|                            'Cancelled') (INDEXED)           |
| priority            : ENUM('Low', 'Medium', 'High')         |
| surgery_date        : DATE (Nullable)                       |
| created_by          : BIGINT UNSIGNED (FK -> users.id)      |
| created_at          : TIMESTAMP                             |
| updated_at          : TIMESTAMP                             |
+-------------------------------------------------------------+
```

---

## 2. Table Specifications

### 2.1 Table: `users`

Represents authorized personnel logging into the system.

| Column | Type | Nullable | Constraints & Index | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | No | `PRIMARY KEY AUTO_INCREMENT` | Unique user identifier |
| `name` | `VARCHAR(255)` | No | - | Full name of the user |
| `email` | `VARCHAR(255)` | No | `UNIQUE INDEX` | User login email address |
| `email_verified_at` | `TIMESTAMP` | Yes | - | Verification timestamp |
| `password` | `VARCHAR(255)` | No | - | Securely hashed password (Bcrypt/Argon2) |
| `role` | `ENUM('admin', 'viewer', 'engineer')` | No | `DEFAULT 'viewer'` | Access tier defining permissions |
| `remember_token` | `VARCHAR(100)` | Yes | - | "Remember Me" session token |
| `created_at` | `TIMESTAMP` | Yes | - | Record creation timestamp |
| `updated_at` | `TIMESTAMP` | Yes | - | Last modification timestamp |

### 2.2 Table: `cases`

Stores individual surgical implant case requests and lifecycle progress.

| Column | Type | Nullable | Constraints & Index | Description |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | No | `PRIMARY KEY AUTO_INCREMENT` | Unique internal case record identifier |
| `case_number` | `VARCHAR(50)` | No | `UNIQUE INDEX` (`cases_case_number_unique`) | Business case identifier (e.g., `CASE-0001`) |
| `patient_reference` | `VARCHAR(100)` | No | - | De-identified patient token (e.g., `PT-91402`) |
| `surgeon_name` | `VARCHAR(255)` | No | `INDEX` (`cases_surgeon_name_index`) | Full name of the operating orthopedic surgeon |
| `implant_type` | `VARCHAR(255)` | No | - | Medical implant specification (e.g., `Titanium Hip Stem`) |
| `status` | `ENUM` | No | `INDEX` (`cases_status_index`) | Allowed values: `Draft`, `Planning`, `In Review`, `Approved`, `Completed`, `Cancelled` |
| `priority` | `ENUM` | No | `INDEX` (`cases_priority_index`) | Allowed values: `Low`, `Medium`, `High` |
| `surgery_date` | `DATE` | Yes | - | Scheduled date of surgery (format: `YYYY-MM-DD`) |
| `created_by` | `BIGINT UNSIGNED` | No | `FOREIGN KEY` -> `users.id` (`ON DELETE RESTRICT`) | Author who created this case |
| `created_at` | `TIMESTAMP` | Yes | - | Record creation timestamp |
| `updated_at` | `TIMESTAMP` | Yes | - | Last modification timestamp |

### 2.3 Additional Sanctum Table: `personal_access_tokens`

Standard Laravel Sanctum token storage table for Bearer token API authentication.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `BIGINT UNSIGNED` | Token ID |
| `tokenable_type` | `VARCHAR(255)` | Polymorphic model class (`App\Models\User`) |
| `tokenable_id` | `BIGINT UNSIGNED` | Foreign key to `users.id` |
| `name` | `VARCHAR(255)` | Token description (e.g., `auth_token`) |
| `token` | `VARCHAR(64)` | Hashed SHA-256 token string |
| `abilities` | `TEXT` | Permissions array |
| `last_used_at` | `TIMESTAMP` | Last request timestamp |
| `expires_at` | `TIMESTAMP` | Token expiration date |

---

## 3. Database Indexes & Query Optimizations

1. **Unique Index on `cases.case_number`**: Guarantees zero duplicate case numbers across the system at the database constraint level.
2. **Index on `cases.status`**: High-performance filtering on the dashboard status breakdown cards and list filtering.
3. **Index on `cases.priority`**: Accelerates multi-parameter queries and sorting.
4. **Foreign Key `cases.created_by`**: Ensures referential integrity with `ON DELETE RESTRICT` to prevent accidental deletion of audit records if a user is deactivated.
