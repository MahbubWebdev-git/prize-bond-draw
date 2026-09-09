<?php

namespace Database\Seeders;

use App\Models\Draw;
use App\Models\WinningNumber;
use Illuminate\Database\Seeder;

class DrawSeeder extends Seeder
{
    private array $prizeStructure = [
        '1st' => ['count' => 1,  'amount' => 600000],
        '2nd' => ['count' => 3,  'amount' => 375000],
        '3rd' => ['count' => 5,  'amount' => 100000],
        '4th' => ['count' => 10, 'amount' => 25000],
        '5th' => ['count' => 20, 'amount' => 2000],
    ];

    public function run(): void
    {
        $drawCount = 5;
        $startDrawNumber = 101;
        $date = now()->subMonths($drawCount);

        for ($i = 0; $i < $drawCount; $i++) {
            $draw = Draw::create([
                'draw_number' => (string) ($startDrawNumber + $i),
                'draw_date' => $date->copy()->addMonths($i)->format('Y-m-d'),
                'bond_price' => '100',
            ]);

            $usedNumbers = [];

            foreach ($this->prizeStructure as $category => $config) {
                for ($n = 0; $n < $config['count']; $n++) {
                    do {
                        $number = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
                    } while (in_array($number, $usedNumbers, true));

                    $usedNumbers[] = $number;

                    WinningNumber::create([
                        'draw_id' => $draw->id,
                        'prize_category' => $category,
                        'number' => $number,
                        'prize_amount' => $config['amount'],
                    ]);
                }
            }
        }
    }
}
