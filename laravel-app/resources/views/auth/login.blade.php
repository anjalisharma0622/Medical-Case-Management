@extends('layouts.app')

@section('title', 'Sign In')

@section('content')
<div class="min-h-[75vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="mx-auto w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
        </div>
        <h2 class="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900">
            Medical Case Management
        </h2>
        <p class="mt-1 text-center text-sm text-slate-600">
            Sign in to access implant cases and clinical tracking
        </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div class="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-xl sm:px-10">
            <form class="space-y-5" action="{{ route('login') }}" method="POST">
                @csrf

                <!-- Email Input -->
                <div>
                    <label for="email" class="block text-sm font-medium text-slate-700">Email Address</label>
                    <div class="mt-1">
                        <input id="email" 
                               name="email" 
                               type="email" 
                               autocomplete="email" 
                               required 
                               value="{{ old('email') }}"
                               placeholder="name@jajalmedical.test"
                               class="appearance-none block w-full px-3 py-2 border rounded-md shadow-xs placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm {{ $errors->has('email') ? 'border-rose-300 text-rose-900 bg-rose-50/50' : 'border-slate-300' }}">
                    </div>
                    @error('email')
                        <p class="mt-1.5 text-xs text-rose-600 font-medium">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Password Input -->
                <div>
                    <label for="password" class="block text-sm font-medium text-slate-700">Password</label>
                    <div class="mt-1">
                        <input id="password" 
                               name="password" 
                               type="password" 
                               autocomplete="current-password" 
                               required 
                               placeholder="••••••••"
                               class="appearance-none block w-full px-3 py-2 border rounded-md shadow-xs placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm {{ $errors->has('password') ? 'border-rose-300 text-rose-900 bg-rose-50/50' : 'border-slate-300' }}">
                    </div>
                    @error('password')
                        <p class="mt-1.5 text-xs text-rose-600 font-medium">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Remember Me -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input id="remember" name="remember" type="checkbox" class="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded">
                        <label for="remember" class="ml-2 block text-xs text-slate-700">Remember this device</label>
                    </div>
                </div>

                <!-- Submit Button -->
                <div>
                    <button type="submit" 
                            class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition cursor-pointer">
                        Sign In
                    </button>
                </div>
            </form>

            <!-- Quick Login Helper Credentials -->
            <div class="mt-6 pt-6 border-t border-slate-100">
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5 text-center">Quick Test Credentials (Click to Fill)</p>
                <div class="grid grid-cols-2 gap-2 text-xs">
                    <button type="button" 
                            onclick="document.getElementById('email').value='admin@jajalmedical.test'; document.getElementById('password').value='password123';"
                            class="p-2 border border-purple-200 bg-purple-50 hover:bg-purple-100 rounded-md text-left transition">
                        <div class="font-bold text-purple-900">Admin Role</div>
                        <div class="text-[10px] text-purple-700">Full CRUD + Delete</div>
                    </button>
                    <button type="button" 
                            onclick="document.getElementById('email').value='viewer@jajalmedical.test'; document.getElementById('password').value='password123';"
                            class="p-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-md text-left transition">
                        <div class="font-bold text-slate-800">Viewer Role</div>
                        <div class="text-[10px] text-slate-600">Read-Only Access</div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
