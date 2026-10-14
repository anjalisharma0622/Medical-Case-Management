@extends('layouts.app')

@section('title', 'Edit Case ' . $case->case_number)

@section('content')
<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
    <!-- Breadcrumb -->
    <nav class="flex items-center text-xs font-medium text-slate-500 mb-4 space-x-2">
        <a href="{{ route('cases.index') }}" class="hover:text-slate-800">Medical Cases</a>
        <span>&rsaquo;</span>
        <a href="{{ route('cases.show', $case) }}" class="hover:text-slate-800 font-mono">{{ $case->case_number }}</a>
        <span>&rsaquo;</span>
        <span class="text-slate-900 font-semibold">Edit</span>
    </nav>

    <div class="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div class="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
                <h1 class="text-xl font-bold text-slate-900">
                    Edit Case <span class="font-mono text-teal-600">{{ $case->case_number }}</span>
                </h1>
                <p class="text-xs text-slate-500 mt-1">
                    Update case information, clinical status, or scheduled surgery date.
                </p>
            </div>
            <span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
                Created: {{ $case->created_at->format('M d, Y') }}
            </span>
        </div>

        <form action="{{ route('cases.update', $case) }}" method="POST" class="p-6">
            @csrf
            @method('PUT')

            <!-- Render Shared Form Partial -->
            @include('cases._form')

            <!-- Form Actions -->
            <div class="mt-8 pt-6 border-t border-slate-200 flex items-center justify-end space-x-3">
                <a href="{{ route('cases.show', $case) }}" 
                   class="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition">
                    Cancel
                </a>
                <button type="submit" 
                        class="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition">
                    Update Case
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
