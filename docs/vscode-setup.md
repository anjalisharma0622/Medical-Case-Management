# Running Medical Case Management in Visual Studio Code

This guide provides step-by-step instructions for running, debugging, and testing both the **Laravel 11 Backend** and the **Interactive Simulator** in VS Code.

---

## Option 1: Running the Laravel Application in VS Code

### 1. Prerequisites on Your Machine
Ensure the following runtimes are installed:
- **PHP 8.2 or 8.3** (`php -v`)
- **Composer 2.x** (`composer -v`)
- **MySQL 8.0+** (or SQLite for zero-config local testing)
- **Node.js 18+ & NPM** (`node -v`)

---

### 2. Open Project in VS Code
1. Launch VS Code.
2. Open the project root or navigate to the Laravel directory:
   ```bash
   code .
   ```
3. Open a terminal inside VS Code: **Terminal &rarr; New Terminal** (or ``Ctrl + ` `` / ``Cmd + ` ``).

---

### 3. Setup Dependencies & Environment
Run these commands in your VS Code terminal:

```bash
# 1. Navigate to the laravel directory
cd laravel-app

# 2. Install PHP backend dependencies
composer install

# 3. Create environment file
cp .env.example .env

# 4. Generate Laravel Application Key
php artisan key:generate
```

---

### 4. Database Setup & Seeding

#### Choice A: Using Local MySQL (Recommended for Production Parity)
1. In `.env`, configure your MySQL credentials:
   ```ini
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=medical_cases
   DB_USERNAME=root
   DB_PASSWORD=your_mysql_password
   ```
2. Create the database in MySQL:
   ```sql
   CREATE DATABASE medical_cases CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Run migrations and database seeder:
   ```bash
   php artisan migrate --seed
   ```

#### Choice B: Using SQLite (Instant Zero-Config Setup)
If you don't have MySQL installed locally, you can run on SQLite immediately:
```bash
# In .env:
# DB_CONNECTION=sqlite
# DB_DATABASE=/absolute/path/to/database/database.sqlite

touch database/database.sqlite
php artisan migrate --seed
```

---

### 5. Start the Local Server in VS Code

You can run the web server in your terminal:
```bash
php artisan serve
```
Your application will be live at: **`http://127.0.0.1:8000`**

Login credentials:
- **Admin:** `admin@jajalmedical.test` / `password123`
- **Viewer:** `viewer@jajalmedical.test` / `password123`
- **Engineer:** `engineer@jajalmedical.test` / `password123`

---

### 6. Running Tests in VS Code

In the terminal:
```bash
# Run all feature tests
php artisan test

# Or run PHPUnit directly
./vendor/bin/phpunit
```

---

### 7. Testing the REST API in VS Code (Thunder Client)

1. Open the **Extensions** panel in VS Code (`Ctrl+Shift+X` or `Cmd+Shift+X`).
2. Search for and install **Thunder Client** (or **Postman for VS Code**).
3. Click on the Thunder Client icon on the activity bar.
4. Click **Collections &rarr; Import** and select:
   `docs/postman_collection.json`
5. You can now execute:
   - `POST /api/login` (Admin / Viewer)
   - `GET /api/cases`
   - `POST /api/cases`
   - `DELETE /api/cases/1` (Tests 403 on Viewer token)

---

### 8. Recommended VS Code Extensions for Laravel

| Extension | ID | Purpose |
| :--- | :--- | :--- |
| **PHP Intelephense** | `bmewburn.vscode-intelephense-client` | Full PHP autocompletion, type hinting, and code navigation |
| **Laravel Blade Snippets** | `onecentlin.laravel-blade` | Blade syntax highlighting and `@can`, `@error` autocompletion |
| **Laravel Extra Intellisense** | `amiralizadeh9480.laravel-extra-intellisense` | Route, view, config, and translation autocompletion |
| **Thunder Client** | `rangav.vscode-thunder-client` | Built-in lightweight REST API client for testing Sanctum tokens |
| **PHPUnit Test Adapter** | `harsana.vscode-phpunit` | Run and debug individual tests directly from editor gutters |

---

## Option 2: Running the Interactive Web Simulator in VS Code

If you want to run the React + TypeScript interactive demo applet:

```bash
# In project root:
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.
