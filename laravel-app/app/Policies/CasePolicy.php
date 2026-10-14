<?php

namespace App\Policies;

use App\Models\MedicalCase;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CasePolicy
{
    /**
     * Determine whether the user can view any medical cases.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated roles (Admin, Viewer, Engineer) can view cases
        return in_array($user->role, ['admin', 'viewer', 'engineer'], true);
    }

    /**
     * Determine whether the user can view the specific medical case.
     */
    public function view(User $user, MedicalCase $case): bool
    {
        return in_array($user->role, ['admin', 'viewer', 'engineer'], true);
    }

    /**
     * Determine whether the user can create medical cases.
     */
    public function create(User $user): Response
    {
        if ($user->isAdmin() || $user->isEngineer()) {
            return Response::allow();
        }

        return Response::deny('Unauthorized: Viewers are not permitted to create medical cases.');
    }

    /**
     * Determine whether the user can update the medical case.
     */
    public function update(User $user, MedicalCase $case): Response
    {
        if ($user->isAdmin() || $user->isEngineer()) {
            return Response::allow();
        }

        return Response::deny('Unauthorized: Viewers are not permitted to modify medical cases.');
    }

    /**
     * Determine whether the user can update the case status.
     */
    public function changeStatus(User $user, MedicalCase $case): Response
    {
        if ($user->isAdmin() || $user->isEngineer()) {
            return Response::allow();
        }

        return Response::deny('Unauthorized: Viewers cannot change case status.');
    }

    /**
     * Determine whether the user can delete the medical case.
     * STRICT REQUIREMENT: Only Admin can delete. Viewer and Engineer get 403.
     */
    public function delete(User $user, MedicalCase $case): Response
    {
        if ($user->isAdmin()) {
            return Response::allow();
        }

        return Response::deny('Access Denied: Only administrators have permission to delete medical cases.');
    }
}
