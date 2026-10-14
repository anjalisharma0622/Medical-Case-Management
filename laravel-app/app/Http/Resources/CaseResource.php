<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CaseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'case_number' => $this->case_number,
            'patient_reference' => $this->patient_reference,
            'surgeon_name' => $this->surgeon_name,
            'implant_type' => $this->implant_type,
            'status' => $this->status,
            'priority' => $this->priority,
            'surgery_date' => $this->surgery_date ? $this->surgery_date->format('Y-m-d') : null,
            'created_by' => [
                'id' => $this->creator?->id,
                'name' => $this->creator?->name,
                'email' => $this->creator?->email,
                'role' => $this->creator?->role,
            ],
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
