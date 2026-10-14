<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full bg-slate-50">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Jajal Medical Case Management') }} - @yield('title', 'Dashboard')</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

    <!-- Tailwind CSS (via CDN or Vite build) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                        mono: ['"JetBrains Mono"', 'monospace'],
                    },
                    colors: {
                        medical: {
                            50: '#f0fdfa',
                            100: '#ccfbf1',
                            500: '#14b8a6',
                            600: '#0d9488',
                            700: '#0f766e',
                            800: '#115e59',
                            900: '#134e4a',
                        }
                    }
                }
            }
        }
    </script>
</head>
<body class="h-full flex flex-col font-sans antialiased text-slate-800 bg-slate-50">
    <!-- Top Navigation Header -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <!-- Brand and Navigation Links -->
                <div class="flex items-center space-x-8">
                    <a href="{{ route('dashboard') }}" class="flex items-center space-x-3">
                        <div class="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                            </svg>
                        </div>
                        <div>
                            <span class="font-bold text-slate-900 text-lg tracking-tight">Jajal Medical</span>
                            <span class="hidden sm:inline-block text-xs uppercase tracking-wider font-semibold bg-teal-50 text-teal-700 px-2 py-0.5 rounded ml-2">Cases</span>
                        </div>
                    </a>

                    @auth
                    <nav class="hidden md:flex space-x-2">
                        <a href="{{ route('dashboard') }}" 
                           class="px-3 py-2 rounded-md text-sm font-medium transition {{ request()->routeIs('dashboard') ? 'bg-slate-100 text-teal-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50' }}">
                            Dashboard
                        </a>
                        <a href="{{ route('cases.index') }}" 
                           class="px-3 py-2 rounded-md text-sm font-medium transition {{ request()->routeIs('cases.*') ? 'bg-slate-100 text-teal-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50' }}">
                            Medical Cases
                        </a>
                    </nav>
                    @endauth
                </div>

                <!-- User Profile & Session Controls -->
                @auth
                <div class="flex items-center space-x-4">
                    <div class="hidden sm:flex flex-col items-end">
                        <span class="text-sm font-semibold text-slate-900">{{ Auth::user()->name }}</span>
                        <div class="flex items-center space-x-1.5">
                            <span class="w-2 h-2 rounded-full {{ Auth::user()->isAdmin() ? 'bg-emerald-500' : (Auth::user()->isEngineer() ? 'bg-blue-500' : 'bg-slate-400') }}"></span>
                            <span class="text-xs uppercase font-semibold tracking-wider text-slate-500">{{ Auth::user()->role }}</span>
                        </div>
                    </div>

                    <!-- Role Badge -->
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        {{ Auth::user()->isAdmin() ? 'bg-purple-100 text-purple-800 border border-purple-200' : (Auth::user()->isEngineer() ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-slate-100 text-slate-700 border border-slate-200') }}">
                        {{ ucfirst(Auth::user()->role) }}
                    </span>

                    <!-- Logout Button -->
                    <form method="POST" action="{{ route('logout') }}" class="inline">
                        @csrf
                        <button type="submit" 
                                class="text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-md transition cursor-pointer">
                            Logout
                        </button>
                    </form>
                </div>
                @else
                <div class="flex items-center space-x-3">
                    <a href="{{ route('login') }}" class="text-sm font-semibold text-teal-600 hover:text-teal-700">Log In</a>
                </div>
                @endauth
            </div>
        </div>
    </header>

    <!-- Global Flash Notification Messages -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
        @if (session('success'))
            <div class="p-4 mb-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between shadow-xs">
                <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span class="text-sm font-medium">{{ session('success') }}</span>
                </div>
                <button type="button" onclick="this.parentElement.remove()" class="text-emerald-500 hover:text-emerald-700 text-sm font-bold">&times;</button>
            </div>
        @endif

        @if (session('error'))
            <div class="p-4 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between shadow-xs">
                <div class="flex items-center space-x-2">
                    <svg class="w-5 h-5 text-rose-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span class="text-sm font-medium">{{ session('error') }}</span>
                </div>
                <button type="button" onclick="this.parentElement.remove()" class="text-rose-500 hover:text-rose-700 text-sm font-bold">&times;</button>
            </div>
        @endif
    </div>

    <!-- Main View Content -->
    <main class="flex-1 pb-16">
        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>&copy; {{ date('Y') }} Jajal Medical Inc. All rights reserved.</span>
            <span>Medical Case Tracking &bull; ISO 13485 Compliant Workflow</span>
        </div>
    </footer>
</body>
</html>
