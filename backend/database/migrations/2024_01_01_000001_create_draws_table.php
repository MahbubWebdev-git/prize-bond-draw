<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('draws', function (Blueprint $table) {
            $table->id();
            $table->string('draw_number')->unique();
            $table->date('draw_date');
            $table->string('bond_price')->default('100');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('draws');
    }
};
