<?php

namespace Database\Seeders;

use App\Models\MedicalCase;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Required Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@jajalmedical.test'],
            [
                'name' => 'System Administrator',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // 2. Seed Required Viewer User
        $viewer = User::firstOrCreate(
            ['email' => 'viewer@jajalmedical.test'],
            [
                'name' => 'Clinical Viewer',
                'password' => Hash::make('password123'),
                'role' => 'viewer',
                'email_verified_at' => now(),
            ]
        );

        // 3. Seed Bonus Role: Biomedical Engineer
        $engineer = User::firstOrCreate(
            ['email' => 'engineer@jajalmedical.test'],
            [
                'name' => 'Biomedical Engineer',
                'password' => Hash::make('password123'),
                'role' => 'engineer',
                'email_verified_at' => now(),
            ]
        );

        // 4. Seed Curated Realistic Medical Cases (25 cases across all statuses)
        $casesData = [
            [
                'case_number' => 'CASE-0001',
                'patient_reference' => 'PT-71029',
                'surgeon_name' => 'Dr. Marcus Vance, MD',
                'implant_type' => 'Titanium Hip Stem (Modular)',
                'status' => 'Approved',
                'priority' => 'High',
                'surgery_date' => '2026-10-24',
                'created_by' => $admin->id,
            ],
            [
                'case_number' => 'CASE-0002',
                'patient_reference' => 'PT-48201',
                'surgeon_name' => 'Dr. Sophia Patel, FRCS',
                'implant_type' => 'Patient-Specific Cranial Mesh (Titanium)',
                'status' => 'In Review',
                'priority' => 'High',
                'surgery_date' => '2026-11-04',
                'created_by' => $admin->id,
            ],
            [
                'case_number' => 'CASE-0003',
                'patient_reference' => 'PT-99382',
                'surgeon_name' => 'Dr. David Sterling, FACS',
                'implant_type' => 'PCL-Retaining Total Knee System',
                'status' => 'Planning',
                'priority' => 'Medium',
                'surgery_date' => '2026-11-15',
                'created_by' => $engineer->id,
            ],
            [
                'case_number' => 'CASE-0004',
                'patient_reference' => 'PT-21840',
                'surgeon_name' => 'Dr. Elena Rostova, MD',
                'implant_type' => 'Posterior Lumbar Interbody Fusion Cage',
                'status' => 'Completed',
                'priority' => 'Medium',
                'surgery_date' => '2026-09-18',
                'created_by' => $admin->id,
            ],
            [
                'case_number' => 'CASE-0005',
                'patient_reference' => 'PT-33019',
                'surgeon_name' => 'Dr. Tariq Al-Mansoor, MD',
                'implant_type' => 'Ceramic Femoral Head 36mm',
                'status' => 'Approved',
                'priority' => 'Low',
                'surgery_date' => '2026-12-02',
                'created_by' => $admin->id,
            ],
            [
                'case_number' => 'CASE-0006',
                'patient_reference' => 'PT-55102',
                'surgeon_name' => 'Dr. Hannah Schmidt, MD',
                'implant_type' => 'Cervical PEEK Interbody Cage',
                'status' => 'Draft',
                'priority' => 'Low',
                'surgery_date' => null,
                'created_by' => $engineer->id,
            ],
            [
                'case_number' => 'CASE-0007',
                'patient_reference' => 'PT-66294',
                'surgeon_name' => 'Dr. Carlos Mendez, FACS',
                'implant_type' => 'Distal Radius Volar Plating System',
                'status' => 'Cancelled',
                'priority' => 'Low',
                'surgery_date' => '2026-10-01',
                'created_by' => $admin->id,
            ],
            [
                'case_number' => 'CASE-0008',
                'patient_reference' => 'PT-88912',
                'surgeon_name' => 'Dr. Rachel Chen, MD',
                'implant_type' => 'Porocoat Acetabular Cup',
                'status' => 'Planning',
                'priority' => 'High',
                'surgery_date' => '2026-11-10',
                'created_by' => $admin->id,
            ],
            [
                'case_number' => 'CASE-0009',
                'patient_reference' => 'PT-12498',
                'surgeon_name' => 'Dr. Marcus Vance, MD',
                'implant_type' => 'Intramedullary Trochanteric Nail',
                'status' => 'In Review',
                'priority' => 'Medium',
                'surgery_date' => '2026-11-08',
                'created_by' => $engineer->id,
            ],
            [
                'case_number' => 'CASE-0010',
                'patient_reference' => 'PT-45781',
                'surgeon_name' => 'Dr. Sophia Patel, FRCS',
                'implant_type' => 'Bipolar Radial Head Prosthesis',
                'status' => 'Approved',
                'priority' => 'High',
                'surgery_date' => '2026-11-20',
                'created_by' => $admin->id,
            ],
            [
                'case_number' => 'CASE-0011',
                'patient_reference' => 'PT-39104',
                'surgeon_name' => 'Dr. David Sterling, FACS',
                'implant_type' => 'Titanium Hip Stem (Modular)',
                'status' => 'Completed',
                'priority' => 'Low',
                'surgery_date' => '2026-09-25',
                'created_by' => $admin->id,
            ],
            [
                'case_number' => 'CASE-0012',
                'patient_reference' => 'PT-50214',
                'surgeon_name' => 'Dr. Elena Rostova, MD',
                'implant_type' => 'Patient-Specific Cranial Mesh (Titanium)',
                'status' => 'Planning',
                'priority' => 'High',
                'surgery_date' => '2026-11-28',
                'created_by' => $engineer->id,
            ],
            [
                'case_number' => 'CASE-0013',
                'patient_reference' => 'PT-61092',
                'surgeon_name' => 'Dr. Tariq Al-Mansoor, MD',
                'implant_type' => 'PCL-Retaining Total Knee System',
                'status' => 'In Review',
                'priority' => 'Medium',
                'surgery_date' => '2026-12-05',
                'created_by' => $admin->id,
            ],
            [
                'case_number' => 'CASE-0014',
                'patient_reference' => 'PT-72810',
                'surgeon_name' => 'Dr. Hannah Schmidt, MD',
                'implant_type' => 'Posterior Lumbar Interbody Fusion Cage',
                'status' => 'Draft',
                'priority' => 'Medium',
                'surgery_date' => null,
                'created_by' => $engineer->id,
            ],
            [
                'case_number' => 'CASE-0015',
                'patient_reference' => 'PT-83921',
                'surgeon_name' => 'Dr. Carlos Mendez, FACS',
                'implant_type' => 'Ceramic Femoral Head 36mm',
                'status' => 'Approved',
                'priority' => 'High',
                'surgery_date' => '2026-11-18',
                'created_by' => $admin->id,
            ],
            [
                'case_number' => 'CASE-0016',
                'patient_reference' => 'PT-94032',
                'surgeon_name' => 'Dr. Rachel Chen, MD',
                'implant_type' => 'Distal Radius Volar Plating System',
                'status' => 'Completed',
                'priority' => 'Low',
                'surgery_date' => '2026-08-30',
                'created_by' => $admin->id,
            ],
            [
                'case_number' => 'CASE-0017',
                'patient_reference' => 'PT-15143',
                'surgeon_name' => 'Dr. Marcus Vance, MD',
                'implant_type' => 'Porocoat Acetabular Cup',
                'status' => 'Planning',
                'priority' => 'Medium',
                'surgery_date' => '2026-12-10',
                'created_by' => $admin->id,
            ],
            [
                'case_number' => 'CASE-0018',
                'patient_reference' => 'PT-26254',
                'surgeon_name' => 'Dr. Sophia Patel, FRCS',
                'implant_type' => 'Cervical PEEK Interbody Cage',
                'status' => 'In Review',
                'priority' => 'Low',
                'surgery_date' => '2026-11-14',
                'created_by' => $engineer->id,
            ],
            [
                'case_number' => 'CASE-0019',
                'patient_reference' => 'PT-37365',
                'surgeon_name' => 'Dr. David Sterling, FACS',
                'implant_type' => 'Intramedullary Trochanteric Nail',
                'status' => 'Approved',
                'priority' => 'High',
                'surgery_date' => '2026-11-25',
                'created_by' => $admin->id,
            ],
            [
                'case_number' => 'CASE-0020',
                'patient_reference' => 'PT-48476',
                'surgeon_name' => 'Dr. Elena Rostova, MD',
                'implant_type' => 'Bipolar Radial Head Prosthesis',
                'status' => 'Draft',
                'priority' => 'Medium',
                'surgery_date' => null,
                'created_by' => $admin->id,
            ],
            [
                'case_number' => 'CASE-0021',
                'patient_reference' => 'PT-59587',
                'surgeon_name' => 'Dr. Tariq Al-Mansoor, MD',
                'implant_type' => 'Titanium Hip Stem (Modular)',
                'status' => 'Planning',
                'priority' => 'High',
                'surgery_date' => '2026-12-15',
                'created_by' => $engineer->id,
            ],
            [
                'case_number' => 'CASE-0022',
                'patient_reference' => 'PT-60698',
                'surgeon_name' => 'Dr. Hannah Schmidt, MD',
                'implant_type' => 'PCL-Retaining Total Knee System',
                'status' => 'In Review',
                'priority' => 'Medium',
                'surgery_date' => '2026-12-08',
                'created_by' => $admin->id,
            ],
        ];

        foreach ($casesData as $case) {
            MedicalCase::updateOrCreate(
                ['case_number' => $case['case_number']],
                $case
            );
        }
    }
}
