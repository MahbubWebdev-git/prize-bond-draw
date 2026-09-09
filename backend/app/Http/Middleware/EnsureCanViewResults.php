<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCanViewResults
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || (! $user->isAdmin() && ! $user->can_view_results)) {
            return response()->json([
                'message' => 'You do not have permission to view draw results yet. Please contact an admin.',
            ], 403);
        }

        return $next($request);
    }
}
