<?php

namespace Database\Factories;

use App\Models\MedicalCase;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MedicalCase>
 */
class MedicalCaseFactory extends Factory
{
    protected $model = MedicalCase::class;

    protected static int $sequenceNumber = 1;

    public function definition(): array
    {
        $implantTypes = [
            'Titanium Hip Stem (Modular)',
            'Ceramic Femoral Head 36mm',
            'Porocoat Acetabular Cup',
            'PCL-Retaining Total Knee System',
            'Cervical PEEK Interbody Cage',
            'Posterior Lumbar Interbody Fusion Cage',
            'Patient-Specific Cranial Mesh (Titanium)',
            'Distal Radius Volar Plating System',
            'Intramedullary Trochanteric Nail',
            'Bipolar Radial Head Prosthesis',
        ];

        $surgeons = [
            'Dr. Marcus Vance, MD',
            'Dr. Sophia Patel, FRCS',
            'Dr. David Sterling, FACS',
            'Dr. Elena Rostova, MD',
            'Dr. Tariq Al-Mansoor, MD',
            'Dr. Hannah Schmidt, MD',
            'Dr. Carlos Mendez, FACS',
            'Dr. Rachel Chen, MD',
        ];

        $caseNum = sprintf('CASE-%04d', static::$sequenceNumber++);

        return [
            'case_number' => $caseNum,
            'patient_reference' => 'PT-' . fake()->unique()->numberBetween(10000, 99999),
            'surgeon_name' => fake()->randomElement($surgeons),
            'implant_type' => fake()->randomElement($implantTypes),
            'status' => fake()->randomElement(MedicalCase::STATUSES),
            'priority' => fake()->randomElement(MedicalCase::PRIORITIES),
            'surgery_date' => fake()->optional(0.8)->dateTimeBetween('+3 days', '+60 days')?->format('Y-m-d'),
            'created_by' => User::factory(),
        ];
    }
}
