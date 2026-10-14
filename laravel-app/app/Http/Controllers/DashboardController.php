<?php

namespace App\Http\Controllers;

use App\Models\MedicalCase;
use Illuminate\Http\Request;
use Illuminate\View\View;

class DashboardController extends Controller
{
    /**
     * Display the medical case overview dashboard.
     */
    public function index(Request $request): View
    {
        $totalCases = MedicalCase::count();
        $planningCount = MedicalCase::where('status', MedicalCase::STATUS_PLANNING)->count();
        $inReviewCount = MedicalCase::where('status', MedicalCase::STATUS_IN_REVIEW)->count();
        $approvedCount = MedicalCase::where('status', MedicalCase::STATUS_APPROVED)->count();
        $completedCount = MedicalCase::where('status', MedicalCase::STATUS_COMPLETED)->count();
        $draftCount = MedicalCase::where('status', MedicalCase::STATUS_DRAFT)->count();
        $cancelledCount = MedicalCase::where('status', MedicalCase::STATUS_CANCELLED)->count();

        // High priority pending attention
        $highPriorityCount = MedicalCase::where('priority', MedicalCase::PRIORITY_HIGH)
            ->whereNotIn('status', [MedicalCase::STATUS_COMPLETED, MedicalCase::STATUS_CANCELLED])
            ->count();

        // Recent 5 activity cases
        $recentCases = MedicalCase::with('creator')
            ->latest()
            ->take(5)
            ->get();

        return view('dashboard', compact(
            'totalCases',
            'planningCount',
            'inReviewCount',
            'approvedCount',
            'completedCount',
            'draftCount',
            'cancelledCount',
            'highPriorityCount',
            'recentCases'
        ));
    }
}
