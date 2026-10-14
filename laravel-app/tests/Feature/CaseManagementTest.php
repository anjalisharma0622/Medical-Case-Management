<?php

namespace Tests\Feature;

use App\Models\MedicalCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CaseManagementTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test 4: Admin can successfully create a case.
     */
    public function test_admin_can_create_case(): void
    {
        $admin = User::factory()->admin()->create();

        $casePayload = [
            'case_number' => 'CASE-1001',
            'patient_reference' => 'PT-50123',
            'surgeon_name' => 'Dr. Marcus Vance, MD',
            'implant_type' => 'Titanium Hip Stem (Modular)',
            'status' => 'Planning',
            'priority' => 'High',
            'surgery_date' => '2026-11-20',
        ];

        $response = $this->actingAs($admin)->post('/cases', $casePayload);

        // Assert redirect to the created case show route
        $case = MedicalCase::where('case_number', 'CASE-1001')->first();
        $this->assertNotNull($case);
        $response->assertRedirect(route('cases.show', $case));

        // Assert record persisted in MySQL database with creator set automatically
        $this->assertDatabaseHas('cases', [
            'case_number' => 'CASE-1001',
            'patient_reference' => 'PT-50123',
            'surgeon_name' => 'Dr. Marcus Vance, MD',
            'created_by' => $admin->id,
            'status' => 'Planning',
        ]);
    }

    /**
     * Test 5: Creating a case with a duplicate Case Number fails (422 / session validation error).
     */
    public function test_creating_case_with_duplicate_case_number_fails(): void
    {
        $admin = User::factory()->admin()->create();

        // Pre-existing case with number CASE-0001
        MedicalCase::factory()->create([
            'case_number' => 'CASE-0001',
            'created_by' => $admin->id,
        ]);

        // Attempting to create duplicate CASE-0001 via Web form
        $webResponse = $this->actingAs($admin)
            ->from('/cases/create')
            ->post('/cases', [
                'case_number' => 'CASE-0001',
                'patient_reference' => 'PT-99999',
                'surgeon_name' => 'Dr. Jane Doe',
                'implant_type' => 'Knee System',
                'status' => 'Draft',
                'priority' => 'Low',
            ]);

        $webResponse->assertRedirect('/cases/create');
        $webResponse->assertSessionHasErrors('case_number');

        // Attempting to create duplicate CASE-0001 via Sanctum REST API -> 422 Unprocessable Content
        Sanctum::actingAs($admin);
        $apiResponse = $this->postJson('/api/cases', [
            'case_number' => 'CASE-0001',
            'patient_reference' => 'PT-99999',
            'surgeon_name' => 'Dr. Jane Doe',
            'implant_type' => 'Knee System',
            'status' => 'Draft',
            'priority' => 'Low',
        ]);

        $apiResponse->assertStatus(422)
            ->assertJsonValidationErrors(['case_number']);
    }

    /**
     * Test 6: Viewer cannot delete a case (enforced 403 Forbidden).
     */
    public function test_viewer_is_blocked_from_deleting_case_with_403(): void
    {
        $admin = User::factory()->admin()->create();
        $viewer = User::factory()->viewer()->create();

        $case = MedicalCase::factory()->create([
            'case_number' => 'CASE-0500',
            'created_by' => $admin->id,
        ]);

        // 6a. Web route DELETE attempt by Viewer returns 403 Forbidden
        $webResponse = $this->actingAs($viewer)->delete("/cases/{$case->id}");
        $webResponse->assertStatus(403);

        // 6b. API route DELETE attempt by Viewer returns 403 Forbidden
        Sanctum::actingAs($viewer);
        $apiResponse = $this->deleteJson("/api/cases/{$case->id}");
        $apiResponse->assertStatus(403);

        // Case must still exist in the database untouched
        $this->assertDatabaseHas('cases', [
            'id' => $case->id,
            'case_number' => 'CASE-0500',
        ]);
    }

    /**
     * Test 7: Updating a case ignores its own Case Number for uniqueness checks.
     */
    public function test_case_update_ignores_own_case_number_uniqueness(): void
    {
        $admin = User::factory()->admin()->create();

        $case = MedicalCase::factory()->create([
            'case_number' => 'CASE-0777',
            'patient_reference' => 'PT-11111',
            'status' => 'Draft',
            'created_by' => $admin->id,
        ]);

        // Update status and surgeon while keeping identical case_number
        $response = $this->actingAs($admin)->put("/cases/{$case->id}", [
            'case_number' => 'CASE-0777',
            'patient_reference' => 'PT-11111',
            'surgeon_name' => 'Dr. Sophia Patel, FRCS',
            'implant_type' => 'Titanium Hip Stem',
            'status' => 'Approved',
            'priority' => 'High',
            'surgery_date' => '2026-11-30',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('cases.show', $case));

        $this->assertDatabaseHas('cases', [
            'id' => $case->id,
            'status' => 'Approved',
            'surgeon_name' => 'Dr. Sophia Patel, FRCS',
        ]);
    }

    /**
     * Test 8: Sanctum REST API provides consistent JSON response envelopes.
     */
    public function test_sanctum_api_crud_lifecycle_and_consistent_envelope(): void
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);

        // GET /api/cases
        $listResponse = $this->getJson('/api/cases');
        $listResponse->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'items',
                    'pagination',
                ],
                'message',
            ]);

        // POST /api/cases
        $createResponse = $this->postJson('/api/cases', [
            'case_number' => 'CASE-8888',
            'patient_reference' => 'PT-88888',
            'surgeon_name' => 'Dr. Elena Rostova',
            'implant_type' => 'Custom Mesh',
            'status' => 'In Review',
            'priority' => 'Medium',
        ]);

        $createResponse->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Medical case created successfully.',
            ]);

        $newCaseId = $createResponse->json('data.id');

        // Admin can delete case via API -> 200 OK
        $deleteResponse = $this->deleteJson("/api/cases/{$newCaseId}");
        $deleteResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseMissing('cases', ['id' => $newCaseId]);
    }
}
