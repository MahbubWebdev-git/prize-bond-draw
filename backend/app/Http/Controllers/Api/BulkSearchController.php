<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WinningNumber;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;

class BulkSearchController extends Controller
{
    /**
     * Upload a CSV or Excel file with one bond/lottery number per row
     * (first column) and check every number against draw results.
     * POST /api/dashboard/bulk-search
     */
    public function search(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt,xlsx,xls', 'max:2048'],
        ]);

        try {
            $spreadsheet = IOFactory::load($request->file('file')->getRealPath());
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Could not read this file. Please upload a valid CSV or Excel file.',
            ], 422);
        }

        $rows = $spreadsheet->getActiveSheet()->toArray(null, true, true, false);

        $numbers = [];
        foreach ($rows as $row) {
            $raw = trim((string) ($row[0] ?? ''));
            if ($raw !== '' && preg_match('/^[0-9]+$/', $raw)) {
                $numbers[] = $raw;
            }
        }

        $numbers = array_slice(array_values(array_unique($numbers)), 0, 500);

        if (empty($numbers)) {
            return response()->json([
                'message' => 'No valid numbers found in the first column of the file.',
            ], 422);
        }

        $padded = array_map(fn ($n) => str_pad($n, 6, '0', STR_PAD_LEFT), $numbers);

        $winningByNumber = WinningNumber::with('draw')
            ->whereIn('number', $padded)
            ->get()
            ->groupBy('number');

        $results = [];
        $wonCount = 0;

        foreach ($numbers as $original) {
            $key = str_pad($original, 6, '0', STR_PAD_LEFT);
            $matches = $winningByNumber->get($key, collect());

            if ($matches->isEmpty()) {
                $results[] = [
                    'number' => $original,
                    'won' => false,
                    'results' => [],
                ];
                continue;
            }

            $wonCount++;
            $results[] = [
                'number' => $original,
                'won' => true,
                'results' => $matches->map(function ($m) {
                    return [
                        'draw_number' => $m->draw->draw_number,
                        'draw_date' => optional($m->draw->draw_date)->format('Y-m-d'),
                        'prize_category' => $m->prize_category,
                        'prize_amount' => $m->prize_amount,
                    ];
                })->values(),
            ];
        }

        return response()->json([
            'total_checked' => count($numbers),
            'total_won' => $wonCount,
            'results' => $results,
        ]);
    }
}
