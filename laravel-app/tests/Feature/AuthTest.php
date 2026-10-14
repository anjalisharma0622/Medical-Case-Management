<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test 1: Valid login succeeds and redirects to dashboard.
     */
    public function test_valid_login_succeeds(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@jajalmedical.test',
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);

        $response = $this->post('/login', [
            'email' => 'admin@jajalmedical.test',
            'password' => 'password123',
        ]);

        $this->assertAuthenticatedAs($user);
        $response->assertRedirect('/dashboard');
    }

    /**
     * Test 2: Invalid login is rejected with validation session errors.
     */
    public function test_invalid_login_is_rejected(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@jajalmedical.test',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->from('/login')->post('/login', [
            'email' => 'admin@jajalmedical.test',
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
        $response->assertRedirect('/login');
        $response->assertSessionHasErrors('email');
    }

    /**
     * Test 3: Guest cannot access case pages or APIs (302 redirect for web, 401 for API).
     */
    public function test_guest_cannot_access_cases_pages_or_apis(): void
    {
        // 3a. Guest attempting to view dashboard is redirected to login
        $webDashboardResponse = $this->get('/dashboard');
        $webDashboardResponse->assertRedirect('/login');

        // 3b. Guest attempting to view cases index is redirected to login
        $webCasesResponse = $this->get('/cases');
        $webCasesResponse->assertRedirect('/login');

        // 3c. Guest accessing protected API endpoint receives 401 Unauthorized
        $apiResponse = $this->getJson('/api/cases');
        $apiResponse->assertStatus(401);
    }
}
