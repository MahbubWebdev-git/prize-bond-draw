<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Draw;
use App\Models\WinningNumber;
use Illuminate\Http\Request;

class DrawController extends Controller
{
    public function index()
    {
        return Draw::orderByDesc('draw_date')->paginate(10);
    }

    public function show(Draw $draw)
    {
        return $draw->load('winningNumbers');
    }

    /**
     * Admin-only: manually insert a new lottery draw + winning numbers.
     * POST /api/admin/draws
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'draw_number' => ['required', 'string', 'max:50', 'unique:draws,draw_number'],
            'draw_date' => ['required', 'date'],
            'bond_price' => ['nullable', 'string', 'max:50'],
            'numbers' => ['required', 'array', 'min:1'],
            'numbers.*.prize_category' => ['required', 'string', 'max:50'],
            'numbers.*.number' => ['required', 'string', 'max:10', 'regex:/^[0-9]+$/'],
            'numbers.*.prize_amount' => ['required', 'integer', 'min:0'],
        ]);

        $draw = Draw::create([
            'draw_number' => $validated['draw_number'],
            'draw_date' => $validated['draw_date'],
            'bond_price' => $validated['bond_price'] ?? '100',
        ]);

        foreach ($validated['numbers'] as $row) {
            $draw->winningNumbers()->create([
                'prize_category' => $row['prize_category'],
                'number' => str_pad($row['number'], 6, '0', STR_PAD_LEFT),
                'prize_amount' => $row['prize_amount'],
            ]);
        }

        return response()->json($draw->load('winningNumbers'), 201);
    }

    /**
     * Admin-only: bulk CSV/XLS(X) upload of winning numbers for one draw.
     * POST /api/admin/draws/import  (multipart: draw_number, draw_date, bond_price?, file)
     * File first column = number, optional 2nd = prize_category, 3rd = prize_amount.
     */
    public function import(Request $request)
    {
        $request->validate([
            'draw_number' => ['required', 'string', 'max:50', 'unique:draws,draw_number'],
            'draw_date' => ['required', 'date'],
            'bond_price' => ['nullable', 'string', 'max:50'],
            'file' => ['required', 'file', 'mimes:csv,txt,xlsx,xls', 'max:5120'],
            'default_prize_category' => ['nullable', 'string', 'max:50'],
            'default_prize_amount' => ['nullable', 'integer', 'min:0'],
        ]);

        try {
            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($request->file('file')->getRealPath());
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Could not read this file. Please upload a valid CSV or Excel file.',
            ], 422);
        }

        $rows = $spreadsheet->getActiveSheet()->toArray(null, true, true, false);

        $numbers = [];
        foreach ($rows as $row) {
            $raw = trim((string) ($row[0] ?? ''));
            if ($raw === '' || ! preg_match('/^[0-9]+$/', $raw)) {
                continue;
            }
            $numbers[] = [
                'number' => str_pad($raw, 6, '0', STR_PAD_LEFT),
                'prize_category' => trim((string) ($row[1] ?? '')) ?: ($request->input('default_prize_category') ?? '5th'),
                'prize_amount' => is_numeric($row[2] ?? null) ? (int) $row[2] : (int) ($request->input('default_prize_amount') ?? 0),
            ];
        }

        $numbers = array_values(array_unique($numbers, SORT_REGULAR));

        if (empty($numbers)) {
            return response()->json([
                'message' => 'No valid numbers found in the first column of the file.',
            ], 422);
        }

        $draw = Draw::create([
            'draw_number' => $request->input('draw_number'),
            'draw_date' => $request->input('draw_date'),
            'bond_price' => $request->input('bond_price') ?? '100',
        ]);

        $now = now();
        $payload = array_map(fn ($n) => [
            'draw_id' => $draw->id,
            'prize_category' => $n['prize_category'],
            'number' => $n['number'],
            'prize_amount' => $n['prize_amount'],
            'created_at' => $now,
            'updated_at' => $now,
        ], $numbers);

        WinningNumber::insert($payload);

        return response()->json([
            'message' => 'Draw imported successfully.',
            'imported' => count($payload),
            'draw' => $draw->load('winningNumbers'),
        ], 201);
    }
}
