@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
    <!-- Header with Quick Action -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Case Management Dashboard</h1>
            <p class="text-sm text-slate-500 mt-1">Implant workflow status metrics &amp; clinical backlog</p>
        </div>
        <div class="flex items-center space-x-3">
            @can('create', App\Models\MedicalCase::class)
            <a href="{{ route('cases.create') }}" 
               class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                New Case
            </a>
            @endcan
            <a href="{{ route('cases.index') }}" 
               class="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition">
                View All Cases
            </a>
        </div>
    </div>

    <!-- Required Status Metric Cards Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
        <!-- Total Cases -->
        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Cases</span>
                <span class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                </span>
            </div>
            <div class="mt-3 flex items-baseline">
                <span class="text-3xl font-extrabold text-slate-900">{{ $totalCases }}</span>
                <span class="ml-2 text-xs text-slate-500 font-medium">all time</span>
            </div>
        </div>

        <!-- Planning -->
        <div class="bg-white p-5 rounded-xl border border-blue-200 bg-gradient-to-b from-blue-50/30 to-white shadow-xs">
            <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-blue-700 uppercase tracking-wider">Planning</span>
                <span class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                </span>
            </div>
            <div class="mt-3 flex items-baseline">
                <span class="text-3xl font-extrabold text-blue-900">{{ $planningCount }}</span>
                <span class="ml-2 text-xs text-blue-600 font-medium">in queue</span>
            </div>
        </div>

        <!-- In Review -->
        <div class="bg-white p-5 rounded-xl border border-amber-200 bg-gradient-to-b from-amber-50/30 to-white shadow-xs">
            <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-amber-700 uppercase tracking-wider">In Review</span>
                <span class="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                </span>
            </div>
            <div class="mt-3 flex items-baseline">
                <span class="text-3xl font-extrabold text-amber-900">{{ $inReviewCount }}</span>
                <span class="ml-2 text-xs text-amber-600 font-medium">pending sign-off</span>
            </div>
        </div>

        <!-- Approved -->
        <div class="bg-white p-5 rounded-xl border border-emerald-200 bg-gradient-to-b from-emerald-50/30 to-white shadow-xs">
            <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Approved</span>
                <span class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </span>
            </div>
            <div class="mt-3 flex items-baseline">
                <span class="text-3xl font-extrabold text-emerald-900">{{ $approvedCount }}</span>
                <span class="ml-2 text-xs text-emerald-600 font-medium">ready for surgery</span>
            </div>
        </div>

        <!-- Completed -->
        <div class="bg-white p-5 rounded-xl border border-teal-200 bg-gradient-to-b from-teal-50/30 to-white shadow-xs col-span-2 lg:col-span-1">
            <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-teal-700 uppercase tracking-wider">Completed</span>
                <span class="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </span>
            </div>
            <div class="mt-3 flex items-baseline">
                <span class="text-3xl font-extrabold text-teal-900">{{ $completedCount }}</span>
                <span class="ml-2 text-xs text-teal-600 font-medium">archived</span>
            </div>
        </div>
    </div>

    <!-- Secondary Notice / Breakdown -->
    <div class="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 bg-white p-3 rounded-lg border border-slate-200">
        <span class="font-semibold text-slate-700">Other statuses:</span>
        <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700">Draft: <strong>{{ $draftCount }}</strong></span>
        <span class="px-2 py-0.5 rounded bg-rose-50 text-rose-700">Cancelled: <strong>{{ $cancelledCount }}</strong></span>
        <span class="ml-auto font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            ⚠️ {{ $highPriorityCount }} High Priority Cases Active
        </span>
    </div>

    <!-- Recent Cases Table -->
    <div class="mt-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div class="p-5 border-b border-slate-200 flex items-center justify-between">
            <h2 class="text-base font-bold text-slate-900">Recent Cases</h2>
            <a href="{{ route('cases.index') }}" class="text-xs font-semibold text-teal-600 hover:text-teal-700">View all &rarr;</a>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200 text-sm">
                <thead class="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                    <tr>
                        <th class="px-5 py-3 text-left">Case Number</th>
                        <th class="px-5 py-3 text-left">Patient Ref</th>
                        <th class="px-5 py-3 text-left">Surgeon</th>
                        <th class="px-5 py-3 text-left">Implant Type</th>
                        <th class="px-5 py-3 text-left">Status</th>
                        <th class="px-5 py-3 text-left">Priority</th>
                        <th class="px-5 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 bg-white">
                    @forelse ($recentCases as $case)
                    <tr class="hover:bg-slate-50/80 transition">
                        <td class="px-5 py-3.5 font-mono font-medium text-slate-900">
                            <a href="{{ route('cases.show', $case) }}" class="text-teal-600 hover:underline">
                                {{ $case->case_number }}
                            </a>
                        </td>
                        <td class="px-5 py-3.5 text-slate-600 font-mono text-xs">{{ $case->patient_reference }}</td>
                        <td class="px-5 py-3.5 text-slate-800 font-medium">{{ $case->surgeon_name }}</td>
                        <td class="px-5 py-3.5 text-slate-600">{{ $case->implant_type }}</td>
                        <td class="px-5 py-3.5">
                            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                                @if($case->status === 'Approved') bg-emerald-100 text-emerald-800
                                @elseif($case->status === 'In Review') bg-amber-100 text-amber-800
                                @elseif($case->status === 'Planning') bg-blue-100 text-blue-800
                                @elseif($case->status === 'Completed') bg-teal-100 text-teal-800
                                @elseif($case->status === 'Cancelled') bg-rose-100 text-rose-800
                                @else bg-slate-100 text-slate-800 @endif">
                                {{ $case->status }}
                            </span>
                        </td>
                        <td class="px-5 py-3.5">
                            <span class="text-xs font-semibold
                                @if($case->priority === 'High') text-rose-600
                                @elseif($case->priority === 'Medium') text-amber-600
                                @else text-slate-500 @endif">
                                {{ $case->priority }}
                            </span>
                        </td>
                        <td class="px-5 py-3.5 text-right whitespace-nowrap space-x-2">
                            <a href="{{ route('cases.show', $case) }}" class="text-xs font-medium text-slate-600 hover:text-slate-900">View</a>
                            @can('update', $case)
                            <a href="{{ route('cases.edit', $case) }}" class="text-xs font-medium text-teal-600 hover:text-teal-800">Edit</a>
                            @endcan
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="7" class="px-5 py-8 text-center text-sm text-slate-500">
                            No medical cases recorded yet.
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
