@extends('layouts.app')

@section('title', 'Medical Cases')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
    <!-- Header with Create Action -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
            <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Implant Medical Cases</h1>
            <p class="text-sm text-slate-500 mt-1">Review, filter, and track clinical surgical plans</p>
        </div>
        @can('create', App\Models\MedicalCase::class)
        <div>
            <a href="{{ route('cases.create') }}" 
               class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Create New Case
            </a>
        </div>
        @endcan
    </div>

    <!-- Search, Filter & Sort Controls Form -->
    <div class="mt-6 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <form method="GET" action="{{ route('cases.index') }}" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
            <!-- Search Query -->
            <div class="lg:col-span-4">
                <label for="search" class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Search Cases
                </label>
                <div class="relative">
                    <input type="text" 
                           id="search" 
                           name="search" 
                           value="{{ $search }}" 
                           placeholder="Case # (CASE-0001) or Surgeon..."
                           class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 placeholder-slate-400">
                </div>
            </div>

            <!-- Status Filter -->
            <div class="lg:col-span-3">
                <label for="status" class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Filter Status
                </label>
                <select id="status" 
                        name="status" 
                        class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white">
                    <option value="">All Statuses</option>
                    @foreach(['Draft', 'Planning', 'In Review', 'Approved', 'Completed', 'Cancelled'] as $s)
                        <option value="{{ $s }}" {{ $status === $s ? 'selected' : '' }}>{{ $s }}</option>
                    @endforeach
                </select>
            </div>

            <!-- Priority Filter (Bonus) -->
            <div class="lg:col-span-2">
                <label for="priority" class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Priority
                </label>
                <select id="priority" 
                        name="priority" 
                        class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white">
                    <option value="">All Priorities</option>
                    @foreach(['Low', 'Medium', 'High'] as $p)
                        <option value="{{ $p }}" {{ $priority === $p ? 'selected' : '' }}>{{ $p }}</option>
                    @endforeach
                </select>
            </div>

            <!-- Action Buttons -->
            <div class="lg:col-span-3 flex items-center space-x-2">
                <button type="submit" 
                        class="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-lg shadow-xs transition">
                    Filter
                </button>
                @if($search || $status || $priority)
                <a href="{{ route('cases.index') }}" 
                   class="px-3 py-2 border border-slate-300 text-slate-600 hover:text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-50 transition">
                    Reset
                </a>
                @endif
            </div>
        </form>
    </div>

    <!-- Cases Data Table -->
    <div class="mt-6 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200 text-sm">
                <thead class="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                    <tr>
                        <th class="px-5 py-3.5 text-left">
                            <a href="{{ route('cases.index', array_merge(request()->query(), ['sort_by' => 'case_number', 'sort_direction' => $sortBy === 'case_number' && $sortDirection === 'asc' ? 'desc' : 'asc'])) }}" class="hover:text-slate-800 flex items-center space-x-1">
                                <span>Case Number</span>
                                @if($sortBy === 'case_number')
                                    <span>{{ $sortDirection === 'asc' ? '▲' : '▼' }}</span>
                                @endif
                            </a>
                        </th>
                        <th class="px-5 py-3.5 text-left">Patient Ref</th>
                        <th class="px-5 py-3.5 text-left">
                            <a href="{{ route('cases.index', array_merge(request()->query(), ['sort_by' => 'surgeon_name', 'sort_direction' => $sortBy === 'surgeon_name' && $sortDirection === 'asc' ? 'desc' : 'asc'])) }}" class="hover:text-slate-800 flex items-center space-x-1">
                                <span>Surgeon Name</span>
                                @if($sortBy === 'surgeon_name')
                                    <span>{{ $sortDirection === 'asc' ? '▲' : '▼' }}</span>
                                @endif
                            </a>
                        </th>
                        <th class="px-5 py-3.5 text-left">Implant Type</th>
                        <th class="px-5 py-3.5 text-left">
                            <a href="{{ route('cases.index', array_merge(request()->query(), ['sort_by' => 'status', 'sort_direction' => $sortBy === 'status' && $sortDirection === 'asc' ? 'desc' : 'asc'])) }}" class="hover:text-slate-800 flex items-center space-x-1">
                                <span>Status</span>
                                @if($sortBy === 'status')
                                    <span>{{ $sortDirection === 'asc' ? '▲' : '▼' }}</span>
                                @endif
                            </a>
                        </th>
                        <th class="px-5 py-3.5 text-left">Priority</th>
                        <th class="px-5 py-3.5 text-left">Surgery Date</th>
                        <th class="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 bg-white">
                    @forelse ($cases as $case)
                    <tr class="hover:bg-slate-50/80 transition">
                        <!-- Case Number -->
                        <td class="px-5 py-4 font-mono font-bold text-slate-900">
                            <a href="{{ route('cases.show', $case) }}" class="text-teal-600 hover:text-teal-800 hover:underline">
                                {{ $case->case_number }}
                            </a>
                        </td>

                        <!-- Patient Reference -->
                        <td class="px-5 py-4 font-mono text-xs text-slate-600">
                            <span class="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                                {{ $case->patient_reference }}
                            </span>
                        </td>

                        <!-- Surgeon Name -->
                        <td class="px-5 py-4 text-slate-900 font-medium">
                            {{ $case->surgeon_name }}
                        </td>

                        <!-- Implant Type -->
                        <td class="px-5 py-4 text-slate-600 max-w-xs truncate" title="{{ $case->implant_type }}">
                            {{ $case->implant_type }}
                        </td>

                        <!-- Status Badge -->
                        <td class="px-5 py-4">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                                @if($case->status === 'Approved') bg-emerald-100 text-emerald-800 border border-emerald-200
                                @elseif($case->status === 'In Review') bg-amber-100 text-amber-800 border border-amber-200
                                @elseif($case->status === 'Planning') bg-blue-100 text-blue-800 border border-blue-200
                                @elseif($case->status === 'Completed') bg-teal-100 text-teal-800 border border-teal-200
                                @elseif($case->status === 'Cancelled') bg-rose-100 text-rose-800 border border-rose-200
                                @else bg-slate-100 text-slate-800 border border-slate-200 @endif">
                                {{ $case->status }}
                            </span>
                        </td>

                        <!-- Priority -->
                        <td class="px-5 py-4">
                            <span class="inline-flex items-center text-xs font-semibold
                                @if($case->priority === 'High') text-rose-700 bg-rose-50 px-2 py-0.5 rounded
                                @elseif($case->priority === 'Medium') text-amber-700 bg-amber-50 px-2 py-0.5 rounded
                                @else text-slate-600 bg-slate-50 px-2 py-0.5 rounded @endif">
                                {{ $case->priority }}
                            </span>
                        </td>

                        <!-- Surgery Date -->
                        <td class="px-5 py-4 text-xs text-slate-600">
                            {{ $case->surgery_date ? $case->surgery_date->format('M d, Y') : '—' }}
                        </td>

                        <!-- Role-Gated Action Buttons -->
                        <td class="px-5 py-4 text-right whitespace-nowrap">
                            <div class="flex items-center justify-end space-x-2">
                                <!-- View Button (All authenticated roles) -->
                                <a href="{{ route('cases.show', $case) }}" 
                                   class="text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition">
                                    View
                                </a>

                                <!-- Edit Button (Admin & Engineer only) -->
                                @can('update', $case)
                                <a href="{{ route('cases.edit', $case) }}" 
                                   class="text-xs font-medium text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded transition">
                                    Edit
                                </a>
                                @endcan

                                <!-- Delete Button (Admin ONLY; Hidden from Viewer & Engineer) -->
                                @can('delete', $case)
                                <form action="{{ route('cases.destroy', $case) }}" 
                                      method="POST" 
                                      class="inline"
                                      onsubmit="return confirm('Are you sure you want to permanently delete case {{ $case->case_number }}? This action cannot be undone.');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" 
                                            class="text-xs font-medium text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded transition cursor-pointer">
                                        Delete
                                    </button>
                                </form>
                                @endcan
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="8" class="px-6 py-12 text-center text-slate-500">
                            <svg class="mx-auto h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                            </svg>
                            <p class="mt-2 text-sm font-semibold text-slate-700">No medical cases found</p>
                            <p class="text-xs text-slate-500">Try adjusting your search keywords or clear active filters.</p>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination Bar (10 per page) -->
        <div class="px-5 py-4 border-t border-slate-200 bg-slate-50/50">
            {{ $cases->links() }}
        </div>
    </div>
</div>
@endsection
