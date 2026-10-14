<?php

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
    /**
     * Create the controller instance and register middleware.
     */
    public function __construct(protected HolidayService $holidayService)
    {
        // Enforce web authentication for all actions
        $this->middleware('auth');
    }

    /**
     * Display a paginated listing of medical cases (10 per page).
     * Supports search by Case Number or Surgeon Name, status & priority filters, and sorting.
     */
    public function index(Request $request): View
    {
        $this->authorize('viewAny', MedicalCase::class);

        $search = $request->query('search');
        $status = $request->query('status');
        $priority = $request->query('priority');
        $sortBy = $request->query('sort_by', 'created_at');
        $sortDirection = $request->query('sort_direction', 'desc');

        // Whitelist allowed sort columns
        $allowedSorts = ['case_number', 'patient_reference', 'surgeon_name', 'status', 'priority', 'surgery_date', 'created_at'];
        if (!in_array($sortBy, $allowedSorts, true)) {
            $sortBy = 'created_at';
        }
        $sortDirection = strtolower($sortDirection) === 'asc' ? 'asc' : 'desc';

        $cases = MedicalCase::with('creator')
            ->search($search)
            ->status($status)
            ->priority($priority)
            ->orderBy($sortBy, $sortDirection)
            ->paginate(10)
            ->withQueryString();

        return view('cases.index', compact(
            'cases',
            'search',
            'status',
            'priority',
            'sortBy',
            'sortDirection'
        ));
    }

    /**
     * Show the form for creating a new medical case.
     */
    public function create(): View
    {
        $this->authorize('create', MedicalCase::class);

        $case = new MedicalCase();
        $case->status = MedicalCase::STATUS_DRAFT;
        $case->priority = MedicalCase::PRIORITY_MEDIUM;

        // Fetch upcoming public holidays (bonus API integration)
        $holidays = $this->holidayService->getHolidays('US');

        return view('cases.create', compact('case', 'holidays'));
    }

    /**
     * Store a newly created medical case in storage.
     */
    public function store(StoreCaseRequest $request): RedirectResponse
    {
        // Mass assignment safe via validated attributes
        $validated = $request->validated();
        
        // Explicitly set created_by to currently logged-in user
        $validated['created_by'] = $request->user()->id;

        $case = MedicalCase::create($validated);

        return redirect()
            ->route('cases.show', $case)
            ->with('success', "Medical case {$case->case_number} was successfully created.");
    }

    /**
     * Display the specified medical case.
     */
    public function show(MedicalCase $case): View
    {
        $this->authorize('view', $case);

        $case->load('creator');
        
        // Check if surgery date coincides with a public holiday
        $holidayOnSurgery = $case->surgery_date 
            ? $this->holidayService->isHoliday($case->surgery_date->format('Y-m-d'))
            : null;

        return view('cases.show', compact('case', 'holidayOnSurgery'));
    }

    /**
     * Show the form for editing the specified medical case.
     */
    public function edit(MedicalCase $case): View
    {
        $this->authorize('update', $case);

        $holidays = $this->holidayService->getHolidays('US');

        return view('cases.edit', compact('case', 'holidays'));
    }

    /**
     * Update the specified medical case in storage.
     */
    public function update(UpdateCaseRequest $request, MedicalCase $case): RedirectResponse
    {
        $this->authorize('update', $case);

        $case->update($request->validated());

        return redirect()
            ->route('cases.show', $case)
            ->with('success', "Medical case {$case->case_number} has been updated successfully.");
    }

    /**
     * Remove the specified medical case from storage.
     * STRICT ENFORCEMENT: Policy prevents Viewers or unauthorized roles (HTTP 403).
     */
    public function destroy(MedicalCase $case): RedirectResponse
    {
        // Throws AuthorizationException (HTTP 403) if viewer tries to delete
        $this->authorize('delete', $case);

        $caseNumber = $case->case_number;
        $case->delete();

        return redirect()
            ->route('cases.index')
            ->with('success', "Case {$caseNumber} was deleted permanently.");
    }
}
