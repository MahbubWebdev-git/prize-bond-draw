<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Draw extends Model
{
    use HasFactory;

    protected $fillable = [
        'draw_number',
        'draw_date',
        'bond_price',
    ];

    protected $casts = [
        'draw_date' => 'date',
    ];

    public function winningNumbers()
    {
        return $this->hasMany(WinningNumber::class);
    }
}
