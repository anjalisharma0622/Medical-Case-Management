<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Authenticate user credentials and issue a new Sanctum API token.
     * POST /api/login
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Invalid email or password credentials.',
                'errors' => [
                    'email' => ['These credentials do not match our registered records.']
                ]
            ], 401);
        }

        // Generate a new Personal Access Token via Laravel Sanctum
        $token = $user->createToken('sanctum_api_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'token' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
            ],
            'message' => 'Authentication successful. Token issued.',
        ], 200);
    }

    /**
     * Revoke current Sanctum token for authenticated user.
     * POST /api/logout
     */
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user) {
            // Revoke current active token
            $user->currentAccessToken()->delete();
        }

        return response()->json([
            'success' => true,
            'data' => null,
            'message' => 'Logged out successfully. Token revoked.',
        ], 200);
    }
}
