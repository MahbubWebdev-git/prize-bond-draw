<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return User::select('id', 'name', 'email', 'role', 'can_view_results', 'created_at')
            ->orderBy('name')
            ->get();
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => ['sometimes', 'in:admin,user'],
            'can_view_results' => ['sometimes', 'boolean'],
        ]);

        if ($request->user()->id === $user->id && isset($validated['role']) && $validated['role'] !== 'admin') {
            return response()->json([
                'message' => 'You cannot remove your own admin role.',
            ], 422);
        }

        $user->update($validated);

        return response()->json($user->fresh());
    }
}
