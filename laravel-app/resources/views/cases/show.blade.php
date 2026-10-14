@extends('layouts.app')

@section('title', 'Case ' . $case->case_number)

@section('content')
<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
    <!-- Breadcrumb & Back -->
    <div class="flex items-center justify-between mb-4">
        <nav class="flex items-center text-xs font-medium text-slate-500 space-x-2">
            <a href="{{ route('cases.index') }}" class="hover:text-slate-800">Medical Cases</a>
            <span>&rsaquo;</span>
            <span class="text-slate-900 font-semibold font-mono">{{ $case->case_number }}</span>
        </nav>
        <a href="{{ route('cases.index') }}" class="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center space-x-1">
            <span>&larr; Back to Case List</span>
        </a>
    </div>

    <!-- Case Summary Header -->
    <div class="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div class="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-50 via-white to-white">
            <div>
                <div class="flex items-center space-x-3">
                    <h1 class="text-2xl font-bold font-mono text-slate-900">{{ $case->case_number }}</h1>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                        @if($case->status === 'Approved') bg-emerald-100 text-emerald-800 border border-emerald-200
                        @elseif($case->status === 'In Review') bg-amber-100 text-amber-800 border border-amber-200
                        @elseif($case->status === 'Planning') bg-blue-100 text-blue-800 border border-blue-200
                        @elseif($case->status === 'Completed') bg-teal-100 text-teal-800 border border-teal-200
                        @elseif($case->status === 'Cancelled') bg-rose-100 text-rose-800 border border-rose-200
                        @else bg-slate-100 text-slate-800 border border-slate-200 @endif">
                        {{ $case->status }}
                    </span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                        @if($case->priority === 'High') bg-rose-50 text-rose-700 border border-rose-200
                        @elseif($case->priority === 'Medium') bg-amber-50 text-amber-700 border border-amber-200
                        @else bg-slate-50 text-slate-600 border border-slate-200 @endif">
                        Priority: {{ $case->priority }}
                    </span>
                </div>
                <p class="text-xs text-slate-500 mt-1">
                    Internal Case Record ID: <span class="font-mono font-medium">#{{ $case->id }}</span>
                </p>
            </div>

            <!-- Action Buttons Gated by Policy -->
            <div class="flex items-center space-x-2">
                @can('update', $case)
                <a href="{{ route('cases.edit', $case) }}" 
                   class="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 shadow-xs transition">
                    Edit Case
                </a>
                @endcan

                @can('delete', $case)
                <form action="{{ route('cases.destroy', $case) }}" 
                      method="POST" 
                      class="inline"
                      onsubmit="return confirm('WARNING: Are you sure you wish to permanently delete medical case {{ $case->case_number }}? This operation is irreversible and audited.');">
                    @csrf
                    @method('DELETE')
                    <button type="submit" 
                            class="px-4 py-2 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 shadow-xs transition cursor-pointer">
                        Delete Case
                    </button>
                </form>
                @endcan
            </div>
        </div>

        <!-- Case Clinical & Device Specifications -->
        <div class="p-6">
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Case Specifications</h2>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div class="border-b border-slate-100 pb-3">
                    <dt class="text-xs text-slate-500 font-medium">Patient Reference Code</dt>
                    <dd class="mt-1 font-mono font-semibold text-slate-900 bg-slate-100 inline-block px-2.5 py-0.5 rounded">
                        {{ $case->patient_reference }}
                    </dd>
                </div>

                <div class="border-b border-slate-100 pb-3">
                    <dt class="text-xs text-slate-500 font-medium">Operating Surgeon</dt>
                    <dd class="mt-1 font-semibold text-slate-900">
                        {{ $case->surgeon_name }}
                    </dd>
                </div>

                <div class="border-b border-slate-100 pb-3 sm:col-span-2">
                    <dt class="text-xs text-slate-500 font-medium">Implant System Type</dt>
                    <dd class="mt-1 font-medium text-slate-900 text-base">
                        {{ $case->implant_type }}
                    </dd>
                </div>

                <div class="border-b border-slate-100 pb-3">
                    <dt class="text-xs text-slate-500 font-medium">Scheduled Surgery Date</dt>
                    <dd class="mt-1 font-medium text-slate-900">
                        @if($case->surgery_date)
                            {{ $case->surgery_date->format('F d, Y') }}
                            @if(isset($holidayOnSurgery))
                                <span class="ml-2 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                                    ★ Public Holiday: {{ $holidayOnSurgery['name'] ?? 'Holiday' }}
                                </span>
                            @endif
                        @else
                            <span class="text-slate-400 italic">Not scheduled yet</span>
                        @endif
                    </dd>
                </div>

                <div class="border-b border-slate-100 pb-3">
                    <dt class="text-xs text-slate-500 font-medium">Current Workflow State</dt>
                    <dd class="mt-1 font-semibold text-slate-800">
                        {{ $case->status }} (Priority: {{ $case->priority }})
                    </dd>
                </div>
            </dl>
        </div>

        <!-- Audit Trail & Creator Metadata (Mandatory Requirement) -->
        <div class="bg-slate-50/80 p-6 border-t border-slate-200">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Audit Trail &amp; Authorship</h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                    <span class="text-slate-500 block">Created By:</span>
                    <span class="font-semibold text-slate-900">{{ $case->creator?->name ?? 'System' }}</span>
                    <span class="text-[11px] text-slate-500 block">({{ $case->creator?->email ?? 'N/A' }} &bull; {{ ucfirst($case->creator?->role ?? 'user') }})</span>
                </div>
                <div>
                    <span class="text-slate-500 block">Created At:</span>
                    <span class="font-medium text-slate-800 font-mono">{{ $case->created_at->format('Y-m-d H:i:s T') }}</span>
                    <span class="text-[11px] text-slate-500 block">({{ $case->created_at->diffForHumans() }})</span>
                </div>
                <div>
                    <span class="text-slate-500 block">Last Updated At:</span>
                    <span class="font-medium text-slate-800 font-mono">{{ $case->updated_at->format('Y-m-d H:i:s T') }}</span>
                    <span class="text-[11px] text-slate-500 block">({{ $case->updated_at->diffForHumans() }})</span>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
