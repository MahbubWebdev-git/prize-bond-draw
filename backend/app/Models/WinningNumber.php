<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WinningNumber extends Model
{
    use HasFactory;

    protected $fillable = [
        'draw_id',
        'prize_category',
        'number',
        'prize_amount',
    ];

    public function draw()
    {
        return $this->belongsTo(Draw::class);
    }
}
