<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WinningNumber;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $validated = $request->validate([
            'number' => ['required', 'string', 'max:10', 'regex:/^[0-9]+$/'],
        ]);

        // Winning numbers are stored zero-padded to 6 digits.
        $number = str_pad($validated['number'], 6, '0', STR_PAD_LEFT);

        $matches = WinningNumber::with('draw')
            ->where('number', $number)
            ->get()
            ->sortByDesc(fn ($m) => $m->draw?->draw_date)
            ->values();

        if ($matches->isEmpty()) {
            return response()->json([
                'number' => $validated['number'],
                'won' => false,
                'message' => 'No prize found for this number.',
                'results' => [],
            ]);
        }

        $results = $matches->map(function ($m) {
            return [
                'draw_number' => $m->draw->draw_number,
                'draw_date' => optional($m->draw->draw_date)->format('Y-m-d'),
                'prize_category' => $m->prize_category,
                'prize_amount' => $m->prize_amount,
            ];
        });

        return response()->json([
            'number' => $validated['number'],
            'won' => true,
            'message' => 'Congratulations! This number has won a prize.',
            'results' => $results,
        ]);
    }
}
