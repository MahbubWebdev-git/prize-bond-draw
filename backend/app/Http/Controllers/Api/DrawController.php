<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Draw;

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
}
