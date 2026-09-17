<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCanImportData
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Only approved admins may use bulk-upload / import endpoints.
        if (! $user || ! $user->canImportData()) {
            return response()->json([
                'message' => 'You do not have permission to import lottery data. Bulk upload is admin-only.',
            ], 403);
        }

        return $next($request);
    }
}
