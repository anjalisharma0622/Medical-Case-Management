<?php

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
    /**
     * Display a paginated listing of cases.
     * GET /api/cases
     * Accessible by: Admin, Viewer, Engineer
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', MedicalCase::class);

        $search = $request->query('search');
        $status = $request->query('status');
        $priority = $request->query('priority');
        $perPage = (int) $request->query('per_page', 10);
        if ($perPage <= 0 || $perPage > 100) {
            $perPage = 10;
        }

        $paginator = MedicalCase::with('creator')
            ->search($search)
            ->status($status)
            ->priority($priority)
            ->latest()
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => [
                'items' => CaseResource::collection($paginator->items()),
                'pagination' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'from' => $paginator->firstItem(),
                    'to' => $paginator->lastItem(),
                ]
            ],
            'message' => 'Medical cases retrieved successfully.',
        ], 200);
    }

    /**
     * Store a newly created case.
     * POST /api/cases
     * Accessible by: Admin, Engineer
     */
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

    /**
     * Display the specified case.
     * GET /api/cases/{id}
     * Accessible by: Admin, Viewer, Engineer
     */
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

    /**
     * Update the specified case.
     * PUT /api/cases/{id}
     * Accessible by: Admin, Engineer
     */
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

    /**
     * Remove the specified case.
     * DELETE /api/cases/{id}
     * Accessible by: Admin ONLY (Viewer and Engineer receive 403 Forbidden)
     */
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

        // Strict authorization check via Policy
        $this->authorize('delete', $case);

        $caseNumber = $case->case_number;
        $case->delete();

        return response()->json([
            'success' => true,
            'data' => [
                'deleted_id' => (int) $id,
                'case_number' => $caseNumber,
            ],
            'message' => "Medical case {$caseNumber} deleted successfully.",
        ], 200);
    }
}
