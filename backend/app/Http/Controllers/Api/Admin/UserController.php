<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return User::select('id', 'name', 'email', 'role', 'is_approved', 'can_view_results', 'can_import_data', 'created_at')
            ->orderBy('name')
            ->get();
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => ['sometimes', 'in:admin,user'],
            'is_approved' => ['sometimes', 'boolean'],
            'can_view_results' => ['sometimes', 'boolean'],
            'can_import_data' => ['sometimes', 'boolean'],
        ]);

        if ($request->user()->id === $user->id && isset($validated['role']) && $validated['role'] !== 'admin') {
            return response()->json([
                'message' => 'You cannot remove your own admin role.',
            ], 422);
        }

        $targetRole = $validated['role'] ?? $user->role;
        $targetRole = strtolower(trim((string) $targetRole));
        if ($targetRole === '') {
            $targetRole = 'user';
        }

        // Approving a normal user: explicitly force role='user', is_approved=1,
        // and grant search access so list filters match exactly.
        // Revoking approval removes search + import access.
        if (array_key_exists('is_approved', $validated)) {
            if ($validated['is_approved'] && $targetRole !== 'admin') {
                $validated['role'] = 'user';
                $validated['is_approved'] = true;
                $validated['can_view_results'] = true;
                $validated['can_import_data'] = false;
            } elseif (! $validated['is_approved'] && ! $user->isAdmin() && $targetRole !== 'admin') {
                $validated['role'] = 'user';
                $validated['is_approved'] = false;
                $validated['can_view_results'] = false;
                $validated['can_import_data'] = false;
            }
        }

        // Normalise empty/odd role values to 'user' (unless promoting to admin).
        if (! isset($validated['role']) && ($user->role === null || trim((string) $user->role) === '')) {
            if ($targetRole !== 'admin') {
                $validated['role'] = 'user';
            }
        }

        // Normal users must never get import rights (admin-only capability).
        if (isset($validated['role']) && $validated['role'] === 'user') {
            $validated['can_import_data'] = false;
        }
        if (isset($validated['can_import_data']) && $validated['can_import_data'] && ! $user->isAdmin() && ($validated['role'] ?? $user->role) !== 'admin') {
            return response()->json([
                'message' => 'Only admins can import lottery data.',
            ], 422);
        }

        // Promoting to admin auto-approves.
        if (isset($validated['role']) && $validated['role'] === 'admin') {
            $validated['is_approved'] = true;
        }

        $user->update($validated);

        return response()->json($user->fresh());
    }

    public function destroy(Request $request, User $user)
    {
        if ($request->user()->id === $user->id) {
            return response()->json(['message' => 'You cannot delete your own account.'], 422);
        }

        $user->delete();

        return response()->json(['message' => 'User rejected and removed.']);
    }
}
