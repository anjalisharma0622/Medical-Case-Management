<?php

namespace App\Http\Requests;

use App\Models\MedicalCase;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCaseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && ($this->user()->isAdmin() || $this->user()->isEngineer());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Extract case ID whether route model binding or raw ID param is used
        $case = $this->route('case');
        $caseId = $case instanceof MedicalCase ? $case->id : ($case ?? $this->route('id'));

        return [
            'case_number' => [
                'required',
                'string',
                'max:50',
                Rule::unique('cases', 'case_number')->ignore($caseId),
            ],
            'patient_reference' => [
                'required',
                'string',
                'max:100',
            ],
            'surgeon_name' => [
                'required',
                'string',
                'max:255',
            ],
            'implant_type' => [
                'required',
                'string',
                'max:255',
            ],
            'status' => [
                'required',
                Rule::in(MedicalCase::STATUSES),
            ],
            'priority' => [
                'required',
                Rule::in(MedicalCase::PRIORITIES),
            ],
            'surgery_date' => [
                'nullable',
                'date',
            ],
        ];
    }

    /**
     * Custom validation error messages.
     */
    public function messages(): array
    {
        return [
            'case_number.required' => 'The Case Number is mandatory.',
            'case_number.unique' => 'This Case Number has already been registered on another case.',
            'patient_reference.required' => 'Patient Reference dummy code is required.',
            'surgeon_name.required' => 'The operating Surgeon Name is required.',
            'implant_type.required' => 'The Implant Type specification is required.',
            'status.required' => 'Please select a valid case status.',
            'status.in' => 'Status must be one of: Draft, Planning, In Review, Approved, Completed, Cancelled.',
            'priority.required' => 'Please select a priority level.',
            'priority.in' => 'Priority must be Low, Medium, or High.',
            'surgery_date.date' => 'The Surgery Date must be a valid calendar date format.',
        ];
    }
}
