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
            // Accept numeric strings; integers from JSON get cast below.
            'number' => ['required'],
        ]);

        // 1. Normalize: trim hidden spaces/unicode, keep digits only.
        $raw = trim((string) $validated['number']);
        // Remove common invisible chars (NBSP, zero-width) then non-digits.
        $raw = str_replace(["\u{00A0}", "\u{200B}", "\u{200C}", "\u{200D}", "\u{FEFF}"], '', $raw);
        $raw = trim($raw);
        $digits = preg_replace('/\D+/', '', $raw) ?? '';

        if ($digits === '' || strlen($digits) > 10) {
            return response()->json([
                'number' => $raw,
                'won' => false,
                'status' => 'no-prize',
                'message' => 'No prize found for this number.',
                'results' => [],
            ], 422);
        }

        // Search candidates: zero-padded 6-digit form (canonical storage),
        // the raw digits, and the ltrim'd form (covers legacy unpadded rows
        // and numbers with leading zeros typed by the user).
        $padded = str_pad($digits, 6, '0', STR_PAD_LEFT);
        $candidates = array_values(array_unique([$padded, $digits, ltrim($digits, '0') === '' ? '0' : ltrim($digits, '0')]));

        $matches = WinningNumber::with('draw')
            ->whereIn('number', $candidates)
            ->get()
            ->sortByDesc(fn ($m) => $m->draw?->draw_date)
            ->values();

        if ($matches->isEmpty()) {
            return response()->json([
                'number' => $digits,
                'won' => false,
                'status' => 'no-prize',
                'message' => 'No prize found for this number.',
                'results' => [],
            ]);
        }

        $results = $matches->map(function ($m) {
            return [
                'draw_number' => $m->draw?->draw_number,
                'draw_date' => optional($m->draw?->draw_date)->format('Y-m-d'),
                'prize_category' => $m->prize_category,
                'prize_amount' => $m->prize_amount,
            ];
        });

        return response()->json([
            'number' => $digits,
            'won' => true,
            'status' => 'win',
            'message' => 'Congratulations, You Are a Win 🎉',
            'results' => $results,
        ]);
    }
}
