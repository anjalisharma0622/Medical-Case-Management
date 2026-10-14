<!-- Reusable Case Form Partial: resources/views/cases/_form.blade.php -->
<div class="space-y-6">
    <!-- Grid Row 1: Case Number & Patient Reference -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- Case Number -->
        <div>
            <label for="case_number" class="block text-sm font-semibold text-slate-800">
                Case Number <span class="text-rose-500">*</span>
            </label>
            <div class="mt-1.5 relative">
                <input type="text" 
                       id="case_number" 
                       name="case_number" 
                       value="{{ old('case_number', $case->case_number) }}"
                       placeholder="e.g. CASE-0001"
                       required
                       class="block w-full px-3.5 py-2.5 font-mono text-sm border rounded-lg shadow-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 {{ $errors->has('case_number') ? 'border-rose-400 bg-rose-50/40 text-rose-900' : 'border-slate-300' }}">
            </div>
            <p class="mt-1 text-xs text-slate-500">Unique alphanumeric business identifier (indexed).</p>
            @error('case_number')
                <div class="mt-1.5 flex items-center space-x-1.5 text-xs text-rose-600 font-semibold">
                    <svg class="w-4 h-4 text-rose-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    <span>{{ $message }}</span>
                </div>
            @enderror
        </div>

        <!-- Patient Reference -->
        <div>
            <label for="patient_reference" class="block text-sm font-semibold text-slate-800">
                Patient Reference Code <span class="text-rose-500">*</span>
            </label>
            <div class="mt-1.5 relative">
                <input type="text" 
                       id="patient_reference" 
                       name="patient_reference" 
                       value="{{ old('patient_reference', $case->patient_reference) }}"
                       placeholder="e.g. PT-98241 (No real patient names)"
                       required
                       class="block w-full px-3.5 py-2.5 font-mono text-sm border rounded-lg shadow-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 {{ $errors->has('patient_reference') ? 'border-rose-400 bg-rose-50/40 text-rose-900' : 'border-slate-300' }}">
            </div>
            <p class="mt-1 text-xs text-slate-500">Dummy reference code for patient de-identification compliance.</p>
            @error('patient_reference')
                <div class="mt-1.5 flex items-center space-x-1.5 text-xs text-rose-600 font-semibold">
                    <svg class="w-4 h-4 text-rose-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    <span>{{ $message }}</span>
                </div>
            @enderror
        </div>
    </div>

    <!-- Grid Row 2: Surgeon Name & Implant Type -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- Surgeon Name -->
        <div>
            <label for="surgeon_name" class="block text-sm font-semibold text-slate-800">
                Surgeon Name <span class="text-rose-500">*</span>
            </label>
            <div class="mt-1.5">
                <input type="text" 
                       id="surgeon_name" 
                       name="surgeon_name" 
                       value="{{ old('surgeon_name', $case->surgeon_name) }}"
                       placeholder="e.g. Dr. Marcus Vance, MD"
                       required
                       class="block w-full px-3.5 py-2.5 text-sm border rounded-lg shadow-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 {{ $errors->has('surgeon_name') ? 'border-rose-400 bg-rose-50/40 text-rose-900' : 'border-slate-300' }}">
            </div>
            @error('surgeon_name')
                <div class="mt-1.5 flex items-center space-x-1.5 text-xs text-rose-600 font-semibold">
                    <svg class="w-4 h-4 text-rose-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    <span>{{ $message }}</span>
                </div>
            @enderror
        </div>

        <!-- Implant Type -->
        <div>
            <label for="implant_type" class="block text-sm font-semibold text-slate-800">
                Implant Type <span class="text-rose-500">*</span>
            </label>
            <div class="mt-1.5">
                <input type="text" 
                       id="implant_type" 
                       name="implant_type" 
                       value="{{ old('implant_type', $case->implant_type) }}"
                       placeholder="e.g. Titanium Hip Stem (Modular)"
                       required
                       class="block w-full px-3.5 py-2.5 text-sm border rounded-lg shadow-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 {{ $errors->has('implant_type') ? 'border-rose-400 bg-rose-50/40 text-rose-900' : 'border-slate-300' }}">
            </div>
            @error('implant_type')
                <div class="mt-1.5 flex items-center space-x-1.5 text-xs text-rose-600 font-semibold">
                    <svg class="w-4 h-4 text-rose-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    <span>{{ $message }}</span>
                </div>
            @enderror
        </div>
    </div>

    <!-- Grid Row 3: Status, Priority & Surgery Date -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <!-- Status -->
        <div>
            <label for="status" class="block text-sm font-semibold text-slate-800">
                Case Status <span class="text-rose-500">*</span>
            </label>
            <div class="mt-1.5">
                <select id="status" 
                        name="status" 
                        required
                        class="block w-full px-3.5 py-2.5 text-sm border rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white {{ $errors->has('status') ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300' }}">
                    @foreach(['Draft', 'Planning', 'In Review', 'Approved', 'Completed', 'Cancelled'] as $option)
                        <option value="{{ $option }}" {{ old('status', $case->status) === $option ? 'selected' : '' }}>
                            {{ $option }}
                        </option>
                    @endforeach
                </select>
            </div>
            @error('status')
                <p class="mt-1.5 text-xs text-rose-600 font-semibold">{{ $message }}</p>
            @enderror
        </div>

        <!-- Priority -->
        <div>
            <label for="priority" class="block text-sm font-semibold text-slate-800">
                Priority Level <span class="text-rose-500">*</span>
            </label>
            <div class="mt-1.5">
                <select id="priority" 
                        name="priority" 
                        required
                        class="block w-full px-3.5 py-2.5 text-sm border rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white {{ $errors->has('priority') ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300' }}">
                    @foreach(['Low', 'Medium', 'High'] as $p)
                        <option value="{{ $p }}" {{ old('priority', $case->priority) === $p ? 'selected' : '' }}>
                            {{ $p }}
                        </option>
                    @endforeach
                </select>
            </div>
            @error('priority')
                <p class="mt-1.5 text-xs text-rose-600 font-semibold">{{ $message }}</p>
            @enderror
        </div>

        <!-- Surgery Date -->
        <div>
            <label for="surgery_date" class="block text-sm font-semibold text-slate-800">
                Surgery Date (Optional)
            </label>
            <div class="mt-1.5">
                <input type="date" 
                       id="surgery_date" 
                       name="surgery_date" 
                       value="{{ old('surgery_date', $case->surgery_date ? $case->surgery_date->format('Y-m-d') : '') }}"
                       class="block w-full px-3.5 py-2.5 text-sm border rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white {{ $errors->has('surgery_date') ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300' }}">
            </div>
            <p class="mt-1 text-xs text-slate-500">YYYY-MM-DD calendar date.</p>
            @error('surgery_date')
                <p class="mt-1.5 text-xs text-rose-600 font-semibold">{{ $message }}</p>
            @enderror
        </div>
    </div>

    <!-- Public Holiday Integration Notice (Bonus Feature: Nager.Date API) -->
    @if(isset($holidays) && count($holidays) > 0)
    <div class="p-3.5 rounded-lg bg-teal-50/60 border border-teal-200/80 text-xs text-teal-800 flex items-start space-x-2.5">
        <svg class="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <div>
            <span class="font-bold">Public Holiday Advisory (Live via Nager.Date API):</span>
            <span class="text-teal-700 ml-1">Check hospital schedules if planning surgeries near national holidays.</span>
        </div>
    </div>
    @endif
</div>
