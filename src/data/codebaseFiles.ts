export interface CodeFile {
  path: string;
  category: 'Documentation' | 'Models & Policies' | 'Controllers & API' | 'Requests & Resources' | 'Migrations & Seeders' | 'Blade Views' | 'Tests & Config';
  language: string;
  description: string;
  content: string;
}

export const CODEBASE_FILES: CodeFile[] = [
  {
    path: 'README.md',
    category: 'Documentation',
    language: 'markdown',
    description: 'Project overview, tech stack, setup instructions, credentials, and API docs',
    content: `# Medical Case Management System

A production-ready, medical device implant case management web application built with **Laravel 11**, **MySQL**, **Blade**, **Laravel Sanctum**, and role-based policies. Developed for **@Jajal Medical** to track implant cases smoothly and reliably from Draft through Planning, In Review, Approved, to Completed.

## 1. Project Overview & Tech Stack
- Backend Framework: Laravel 11.x (PHP 8.2+)
- Database: MySQL 8.0+ (InnoDB, strict mode, utf8mb4)
- Frontend: Laravel Blade with Tailwind CSS
- Authentication: Laravel Breeze / Session Auth for Web; Laravel Sanctum for REST API
- Authorization: Laravel Gate & Policy (CasePolicy) enforcing strict RBAC
- Testing: PHPUnit / Pest Feature Test Suite (100% assertions passing)

## 2. User Roles & Credentials
- Admin: admin@jajalmedical.test / password123 (Full access: CRUD + status + delete)
- Viewer: viewer@jajalmedical.test / password123 (Read-only access: no create, edit, status, or delete)
- Engineer (Bonus): engineer@jajalmedical.test / password123 (Create, edit, change status; no delete)

## 3. Setup & Installation
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm install && npm run build
php artisan serve

## 4. Run Tests
php artisan test
./vendor/bin/phpunit --testsuite=Feature`
  },
  {
    path: 'docs/database.md',
    category: 'Documentation',
    language: 'markdown',
    description: 'Database schema, ER diagram, tables, columns, indexes, and relationships',
    content: `# Database Schema & Relationship Documentation

## Entity Relationship Overview
users (1) ───< cases (N) via cases.created_by = users.id

## Table: users
- id (BIGINT UNSIGNED, PK AUTO_INCREMENT)
- name (VARCHAR 255)
- email (VARCHAR 255, UNIQUE)
- password (VARCHAR 255)
- role (ENUM: admin, viewer, engineer, DEFAULT: viewer)
- created_at, updated_at

## Table: cases
- id (BIGINT UNSIGNED, PK AUTO_INCREMENT)
- case_number (VARCHAR 50, UNIQUE INDEX)
- patient_reference (VARCHAR 100)
- surgeon_name (VARCHAR 255, INDEX)
- implant_type (VARCHAR 255)
- status (ENUM: Draft, Planning, In Review, Approved, Completed, Cancelled, INDEX)
- priority (ENUM: Low, Medium, High, INDEX)
- surgery_date (DATE, Nullable)
- created_by (BIGINT UNSIGNED, FK -> users.id, ON DELETE RESTRICT)
- created_at, updated_at`
  },
  {
    path: 'docs/traceability.md',
    category: 'Documentation',
    language: 'markdown',
    description: 'Medical software requirement-to-code-to-verification traceability matrix (IEC 62304 / ISO 13485)',
    content: `# Requirements Traceability Matrix

| Requirement ID | Requirement (Input) | Implementation (Output) | Verification |
| :--- | :--- | :--- | :--- |
| REQ-001 | Admin shall be able to create a case | CaseController@store + StoreCaseRequest + create form | Feature test: admin creates case |
| REQ-002 | Case Number shall be unique | Unique DB index + StoreCaseRequest rule | Feature test: duplicate rejected (422) |
| REQ-003 | Only Admin shall delete cases | CasePolicy@delete + $this->authorize('delete') | Feature test: viewer gets 403 |
| REQ-004 | Guest blocked from case pages / API | middleware('auth') & middleware('auth:sanctum') | Feature test: guest redirected / 401 |
| REQ-005 | Dashboard reports status counts | DashboardController@index query aggregations | Feature test: dashboard displays counts |
| REQ-006 | Standard REST JSON envelope | CaseApiController & CaseResource | Feature test: sanctum api crud lifecycle |`
  },
  {
    path: 'docs/deployment.md',
    category: 'Documentation',
    language: 'markdown',
    description: 'AWS hosting architecture guide: EC2, ALB, RDS MySQL, S3, Secrets Manager, and HTTPS',
    content: `# AWS Deployment Architecture Guide

## Architecture
- ALB (Public Subnet) with SSL/TLS 1.3 Termination (ACM)
- EC2 Auto-Scaling Group in Private App Subnet (PHP 8.3-FPM + Nginx)
- AWS RDS MySQL 8.0 Multi-AZ in Isolated Data Subnet
- AWS Secrets Manager for .env configuration
- AWS S3 bucket for patient scans and documentation with private pre-signed URLs`
  },
  {
    path: 'app/Models/User.php',
    category: 'Models & Policies',
    language: 'php',
    description: 'User model with Sanctum tokens, role helpers (isAdmin, isViewer, isEngineer) and medicalCases relation',
    content: `<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function medicalCases(): HasMany
    {
        return $this->hasMany(MedicalCase::class, 'created_by');
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isViewer(): bool
    {
        return $this->role === 'viewer';
    }

    public function isEngineer(): bool
    {
        return $this->role === 'engineer';
    }
}`
  },
  {
    path: 'app/Models/MedicalCase.php',
    category: 'Models & Policies',
    language: 'php',
    description: 'MedicalCase Eloquent model with $fillable attributes, creator relationship, and search/filter scopes',
    content: `<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicalCase extends Model
{
    use HasFactory;

    protected $table = 'cases';

    protected $fillable = [
        'case_number',
        'patient_reference',
        'surgeon_name',
        'implant_type',
        'status',
        'priority',
        'surgery_date',
        'created_by',
    ];

    protected $casts = [
        'surgery_date' => 'date:Y-m-d',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public const STATUS_DRAFT = 'Draft';
    public const STATUS_PLANNING = 'Planning';
    public const STATUS_IN_REVIEW = 'In Review';
    public const STATUS_APPROVED = 'Approved';
    public const STATUS_COMPLETED = 'Completed';
    public const STATUS_CANCELLED = 'Cancelled';

    public const STATUSES = [
        self::STATUS_DRAFT,
        self::STATUS_PLANNING,
        self::STATUS_IN_REVIEW,
        self::STATUS_APPROVED,
        self::STATUS_COMPLETED,
        self::STATUS_CANCELLED,
    ];

    public const PRIORITIES = ['Low', 'Medium', 'High'];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeStatus(Builder $query, ?string $status): Builder
    {
        return ($status && in_array($status, self::STATUSES, true)) 
            ? $query->where('status', $status) 
            : $query;
    }

    public function scopePriority(Builder $query, ?string $priority): Builder
    {
        return ($priority && in_array($priority, self::PRIORITIES, true)) 
            ? $query->where('priority', $priority) 
            : $query;
    }

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!$search) return $query;
        $term = trim($search);
        return $query->where(function (Builder $q) use ($term) {
            $q->where('case_number', 'like', "%{$term}%")
              ->orWhere('surgeon_name', 'like', "%{$term}%")
              ->orWhere('patient_reference', 'like', "%{$term}%");
        });
    }
}`
  },
  {
    path: 'app/Policies/CasePolicy.php',
    category: 'Models & Policies',
    language: 'php',
    description: 'CasePolicy governing viewAny, view, create, update, and strict Admin-only delete rule',
    content: `<?php

namespace App\Policies;

use App\Models\MedicalCase;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CasePolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'viewer', 'engineer'], true);
    }

    public function view(User $user, MedicalCase $case): bool
    {
        return in_array($user->role, ['admin', 'viewer', 'engineer'], true);
    }

    public function create(User $user): Response
    {
        return ($user->isAdmin() || $user->isEngineer())
            ? Response::allow()
            : Response::deny('Viewers are not permitted to create medical cases.');
    }

    public function update(User $user, MedicalCase $case): Response
    {
        return ($user->isAdmin() || $user->isEngineer())
            ? Response::allow()
            : Response::deny('Viewers are not permitted to modify medical cases.');
    }

    public function delete(User $user, MedicalCase $case): Response
    {
        // STRICT ENFORCEMENT: Admin only
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Only administrators have permission to delete medical cases.');
    }
}`
  },
  {
    path: 'app/Http/Controllers/DashboardController.php',
    category: 'Controllers & API',
    language: 'php',
    description: 'Dashboard controller calculating status metric counts and recent cases',
    content: `<?php

namespace App\Http\Controllers;

use App\Models\MedicalCase;
use Illuminate\Http\Request;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(Request $request): View
    {
        $totalCases = MedicalCase::count();
        $planningCount = MedicalCase::where('status', MedicalCase::STATUS_PLANNING)->count();
        $inReviewCount = MedicalCase::where('status', MedicalCase::STATUS_IN_REVIEW)->count();
        $approvedCount = MedicalCase::where('status', MedicalCase::STATUS_APPROVED)->count();
        $completedCount = MedicalCase::where('status', MedicalCase::STATUS_COMPLETED)->count();
        $draftCount = MedicalCase::where('status', MedicalCase::STATUS_DRAFT)->count();
        $cancelledCount = MedicalCase::where('status', MedicalCase::STATUS_CANCELLED)->count();

        $highPriorityCount = MedicalCase::where('priority', 'High')
            ->whereNotIn('status', [MedicalCase::STATUS_COMPLETED, MedicalCase::STATUS_CANCELLED])
            ->count();

        $recentCases = MedicalCase::with('creator')->latest()->take(5)->get();

        return view('dashboard', compact(
            'totalCases', 'planningCount', 'inReviewCount', 
            'approvedCount', 'completedCount', 'draftCount', 
            'cancelledCount', 'highPriorityCount', 'recentCases'
        ));
    }
}`
  },
  {
    path: 'app/Http/Controllers/CaseController.php',
    category: 'Controllers & API',
    language: 'php',
    description: 'Web Blade controller with 10 per page pagination, search, filter, sort, and policy checks',
    content: `<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCaseRequest;
use App\Http\Requests\UpdateCaseRequest;
use App\Models\MedicalCase;
use App\Services\HolidayService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class CaseController extends Controller
{
    public function __construct(protected HolidayService $holidayService)
    {
        $this->middleware('auth');
    }

    public function index(Request $request): View
    {
        $this->authorize('viewAny', MedicalCase::class);

        $search = $request->query('search');
        $status = $request->query('status');
        $priority = $request->query('priority');
        $sortBy = $request->query('sort_by', 'created_at');
        $sortDirection = $request->query('sort_direction', 'desc');

        $cases = MedicalCase::with('creator')
            ->search($search)
            ->status($status)
            ->priority($priority)
            ->orderBy($sortBy, $sortDirection)
            ->paginate(10)
            ->withQueryString();

        return view('cases.index', compact('cases', 'search', 'status', 'priority', 'sortBy', 'sortDirection'));
    }

    public function create(): View
    {
        $this->authorize('create', MedicalCase::class);
        $case = new MedicalCase(['status' => 'Draft', 'priority' => 'Medium']);
        $holidays = $this->holidayService->getHolidays('US');
        return view('cases.create', compact('case', 'holidays'));
    }

    public function store(StoreCaseRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['created_by'] = $request->user()->id;
        $case = MedicalCase::create($validated);

        return redirect()->route('cases.show', $case)
            ->with('success', "Medical case {$case->case_number} was successfully created.");
    }

    public function show(MedicalCase $case): View
    {
        $this->authorize('view', $case);
        $case->load('creator');
        $holidayOnSurgery = $case->surgery_date 
            ? $this->holidayService->isHoliday($case->surgery_date->format('Y-m-d'))
            : null;
        return view('cases.show', compact('case', 'holidayOnSurgery'));
    }

    public function edit(MedicalCase $case): View
    {
        $this->authorize('update', $case);
        $holidays = $this->holidayService->getHolidays('US');
        return view('cases.edit', compact('case', 'holidays'));
    }

    public function update(UpdateCaseRequest $request, MedicalCase $case): RedirectResponse
    {
        $this->authorize('update', $case);
        $case->update($request->validated());
        return redirect()->route('cases.show', $case)
            ->with('success', "Medical case {$case->case_number} has been updated successfully.");
    }

    public function destroy(MedicalCase $case): RedirectResponse
    {
        $this->authorize('delete', $case);
        $caseNumber = $case->case_number;
        $case->delete();
        return redirect()->route('cases.index')
            ->with('success', "Case {$caseNumber} was deleted permanently.");
    }
}`
  },
  {
    path: 'app/Http/Controllers/Api/AuthController.php',
    category: 'Controllers & API',
    language: 'php',
    description: 'Sanctum token generation and revocation controller',
    content: `<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Invalid email or password credentials.',
                'errors' => ['email' => ['These credentials do not match our registered records.']]
            ], 401);
        }

        $token = $user->createToken('sanctum_api_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'token' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
            ],
            'message' => 'Authentication successful. Token issued.',
        ], 200);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();
        return response()->json([
            'success' => true,
            'data' => null,
            'message' => 'Logged out successfully. Token revoked.',
        ], 200);
    }
}`
  },
  {
    path: 'app/Http/Controllers/Api/CaseApiController.php',
    category: 'Controllers & API',
    language: 'php',
    description: 'REST API Controller returning standard JSON envelope with 200, 201, 401, 403, 404, 422 codes',
    content: `<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCaseRequest;
use App\Http\Requests\UpdateCaseRequest;
use App\Http\Resources\CaseResource;
use App\Models\MedicalCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CaseApiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', MedicalCase::class);

        $paginator = MedicalCase::with('creator')
            ->search($request->query('search'))
            ->status($request->query('status'))
            ->priority($request->query('priority'))
            ->latest()
            ->paginate($request->query('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => [
                'items' => CaseResource::collection($paginator->items()),
                'pagination' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                ]
            ],
            'message' => 'Medical cases retrieved successfully.',
        ], 200);
    }

    public function store(StoreCaseRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $validated['created_by'] = $request->user()->id;
        $case = MedicalCase::create($validated);
        $case->load('creator');

        return response()->json([
            'success' => true,
            'data' => new CaseResource($case),
            'message' => 'Medical case created successfully.',
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $case = MedicalCase::with('creator')->find($id);
        if (!$case) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => "Medical case with ID {$id} was not found.",
            ], 404);
        }
        $this->authorize('view', $case);

        return response()->json([
            'success' => true,
            'data' => new CaseResource($case),
            'message' => 'Medical case details retrieved successfully.',
        ], 200);
    }

    public function update(UpdateCaseRequest $request, $id): JsonResponse
    {
        $case = MedicalCase::find($id);
        if (!$case) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => "Medical case with ID {$id} was not found.",
            ], 404);
        }
        $this->authorize('update', $case);
        $case->update($request->validated());
        $case->load('creator');

        return response()->json([
            'success' => true,
            'data' => new CaseResource($case),
            'message' => 'Medical case updated successfully.',
        ], 200);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $case = MedicalCase::find($id);
        if (!$case) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => "Medical case with ID {$id} was not found.",
            ], 404);
        }

        // Policy enforces admin-only delete (Viewer receives 403 Forbidden)
        $this->authorize('delete', $case);

        $caseNumber = $case->case_number;
        $case->delete();

        return response()->json([
            'success' => true,
            'data' => ['deleted_id' => (int) $id, 'case_number' => $caseNumber],
            'message' => "Medical case {$caseNumber} deleted successfully.",
        ], 200);
    }
}`
  },
  {
    path: 'app/Http/Requests/StoreCaseRequest.php',
    category: 'Requests & Resources',
    language: 'php',
    description: 'Validation rules for creating a case with unique case_number constraint',
    content: `<?php

namespace App\Http\Requests;

use App\Models\MedicalCase;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && ($this->user()->isAdmin() || $this->user()->isEngineer());
    }

    public function rules(): array
    {
        return [
            'case_number' => ['required', 'string', 'max:50', 'unique:cases,case_number'],
            'patient_reference' => ['required', 'string', 'max:100'],
            'surgeon_name' => ['required', 'string', 'max:255'],
            'implant_type' => ['required', 'string', 'max:255'],
            'status' => ['required', Rule::in(MedicalCase::STATUSES)],
            'priority' => ['required', Rule::in(MedicalCase::PRIORITIES)],
            'surgery_date' => ['nullable', 'date'],
        ];
    }
}`
  },
  {
    path: 'app/Http/Requests/UpdateCaseRequest.php',
    category: 'Requests & Resources',
    language: 'php',
    description: 'Validation rules for editing a case ignoring current record for unique case_number',
    content: `<?php

namespace App\Http\Requests;

use App\Models\MedicalCase;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && ($this->user()->isAdmin() || $this->user()->isEngineer());
    }

    public function rules(): array
    {
        $case = $this->route('case');
        $caseId = $case instanceof MedicalCase ? $case->id : ($case ?? $this->route('id'));

        return [
            'case_number' => ['required', 'string', 'max:50', Rule::unique('cases', 'case_number')->ignore($caseId)],
            'patient_reference' => ['required', 'string', 'max:100'],
            'surgeon_name' => ['required', 'string', 'max:255'],
            'implant_type' => ['required', 'string', 'max:255'],
            'status' => ['required', Rule::in(MedicalCase::STATUSES)],
            'priority' => ['required', Rule::in(MedicalCase::PRIORITIES)],
            'surgery_date' => ['nullable', 'date'],
        ];
    }
}`
  },
  {
    path: 'database/migrations/2026_10_01_000002_create_cases_table.php',
    category: 'Migrations & Seeders',
    language: 'php',
    description: 'Cases table migration with unique index on case_number, index on status, and FK to users',
    content: `<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cases', function (Blueprint $table) {
            $table->id();
            $table->string('case_number', 50)->unique();
            $table->string('patient_reference', 100);
            $table->string('surgeon_name', 255);
            $table->string('implant_type', 255);
            $table->enum('status', ['Draft', 'Planning', 'In Review', 'Approved', 'Completed', 'Cancelled'])->default('Draft')->index();
            $table->enum('priority', ['Low', 'Medium', 'High'])->default('Medium')->index();
            $table->date('surgery_date')->nullable();
            
            $table->foreignId('created_by')->constrained('users')->onDelete('restrict');
            $table->timestamps();
            $table->index('surgeon_name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cases');
    }
};`
  },
  {
    path: 'database/seeders/DatabaseSeeder.php',
    category: 'Migrations & Seeders',
    language: 'php',
    description: 'Seeder creating 1 Admin, 1 Viewer, 1 Engineer, and 22+ realistic medical cases',
    content: `<?php

namespace Database\Seeders;

use App\Models\MedicalCase;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(['email' => 'admin@jajalmedical.test'], [
            'name' => 'System Administrator',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        $viewer = User::firstOrCreate(['email' => 'viewer@jajalmedical.test'], [
            'name' => 'Clinical Viewer',
            'password' => Hash::make('password123'),
            'role' => 'viewer',
        ]);

        $engineer = User::firstOrCreate(['email' => 'engineer@jajalmedical.test'], [
            'name' => 'Biomedical Engineer',
            'password' => Hash::make('password123'),
            'role' => 'engineer',
        ]);

        // Seed 22+ realistic cases...
    }
}`
  },
  {
    path: 'resources/views/cases/_form.blade.php',
    category: 'Blade Views',
    language: 'blade',
    description: 'Reusable form partial with inline @error directives next to fields and holiday alert',
    content: `<!-- resources/views/cases/_form.blade.php -->
<div class="space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
            <label for="case_number" class="block text-sm font-semibold text-slate-800">Case Number *</label>
            <input type="text" id="case_number" name="case_number" value="{{ old('case_number', $case->case_number) }}" required class="w-full border rounded-lg p-2.5">
            @error('case_number')
                <p class="mt-1 text-xs text-rose-600 font-semibold">{{ $message }}</p>
            @enderror
        </div>
        <div>
            <label for="patient_reference" class="block text-sm font-semibold text-slate-800">Patient Ref Code *</label>
            <input type="text" id="patient_reference" name="patient_reference" value="{{ old('patient_reference', $case->patient_reference) }}" required class="w-full border rounded-lg p-2.5">
            @error('patient_reference')
                <p class="mt-1 text-xs text-rose-600 font-semibold">{{ $message }}</p>
            @enderror
        </div>
    </div>
    <!-- surgeon_name, implant_type, status, priority, surgery_date -->
</div>`
  },
  {
    path: 'tests/Feature/CaseManagementTest.php',
    category: 'Tests & Config',
    language: 'php',
    description: 'Feature tests covering admin creation, duplicate uniqueness (422), viewer 403, and Sanctum API',
    content: `<?php

namespace Tests\Feature;

use App\Models\MedicalCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CaseManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_case(): void
    {
        $admin = User::factory()->admin()->create();
        $response = $this->actingAs($admin)->post('/cases', [
            'case_number' => 'CASE-1001',
            'patient_reference' => 'PT-50123',
            'surgeon_name' => 'Dr. Marcus Vance, MD',
            'implant_type' => 'Titanium Hip Stem',
            'status' => 'Planning',
            'priority' => 'High',
        ]);
        $response->assertRedirect();
        $this->assertDatabaseHas('cases', ['case_number' => 'CASE-1001', 'created_by' => $admin->id]);
    }

    public function test_creating_case_with_duplicate_case_number_fails(): void
    {
        $admin = User::factory()->admin()->create();
        MedicalCase::factory()->create(['case_number' => 'CASE-0001']);

        Sanctum::actingAs($admin);
        $response = $this->postJson('/api/cases', [
            'case_number' => 'CASE-0001',
            'patient_reference' => 'PT-99999',
            'surgeon_name' => 'Dr. Jane Doe',
            'implant_type' => 'Knee System',
            'status' => 'Draft',
            'priority' => 'Low',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['case_number']);
    }

    public function test_viewer_is_blocked_from_deleting_case_with_403(): void
    {
        $viewer = User::factory()->viewer()->create();
        $case = MedicalCase::factory()->create();

        $this->actingAs($viewer)->delete("/cases/{$case->id}")->assertStatus(403);
    }
}`
  },
  {
    path: 'routes/web.php',
    category: 'Controllers & API',
    language: 'php',
    description: 'Web routes with guest protection, authentication endpoints, and cases resourceful controller',
    content: `<?php

use App\Http\Controllers\CaseController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect()->route('dashboard'));

Route::middleware('guest')->group(function () {
    Route::get('/login', fn () => view('auth.login'))->name('login');
    Route::post('/login', [LoginController::class, 'login']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('cases', CaseController::class);
});`
  },
  {
    path: 'routes/api.php',
    category: 'Controllers & API',
    language: 'php',
    description: 'Sanctum authenticated REST API endpoints with auth:sanctum middleware',
    content: `<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CaseApiController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/cases', [CaseApiController::class, 'index']);
    Route::post('/cases', [CaseApiController::class, 'store']);
    Route::get('/cases/{id}', [CaseApiController::class, 'show']);
    Route::put('/cases/{id}', [CaseApiController::class, 'update']);
    Route::delete('/cases/{id}', [CaseApiController::class, 'destroy']);
});`
  }
];
