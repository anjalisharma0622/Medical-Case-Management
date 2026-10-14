<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CaseApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Laravel Sanctum Token Authentication
|--------------------------------------------------------------------------
*/

// Public Authentication Endpoints
Route::post('/login', [AuthController::class, 'login']);

// Protected Sanctum Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Case Management REST Endpoints
    Route::get('/cases', [CaseApiController::class, 'index']);
    Route::post('/cases', [CaseApiController::class, 'store']);
    Route::get('/cases/{id}', [CaseApiController::class, 'show']);
    Route::put('/cases/{id}', [CaseApiController::class, 'update']);
    Route::delete('/cases/{id}', [CaseApiController::class, 'destroy']);
});
