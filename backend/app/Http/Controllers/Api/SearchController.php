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
            'number' => ['required'],
        ]);

        // ১. নরমালইজেশন: হিডেন স্পেস ও ইউনিকোড ক্যারেক্টার রিমুভ করা
        $raw = trim((string) $validated['number']);
        $raw = str_replace(["\u{00A0}", "\u{200B}", "\u{200C}", "\u{200D}", "\u{FEFF}"], '', $raw);
        $raw = trim($raw);
        
        // শুধু ডিজিটগুলো রাখা
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

        // ২. ক্যান্ডিডেট অ্যারে মডিফিকেশন (৭ ডিজিট ও ৬ ডিজিট উভয়ই সাপোর্ট করবে)
        // বাংলাদেশের প্রাইজবন্ড অনুযায়ী ৭ ডিজিট ও ৬ ডিজিট উভয় প্যাডিংই ক্যান্ডিডেটে রাখা হলো
        $padded6 = str_pad($digits, 6, '0', STR_PAD_LEFT);
        $padded7 = str_pad($digits, 7, '0', STR_PAD_LEFT);
        
        $candidates = array_values(array_unique([
            $digits, 
            $padded6, 
            $padded7, 
            ltrim($digits, '0') === '' ? '0' : ltrim($digits, '0')
        ]));

        // ৩. ডাটাবেজ কোয়েরি
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
