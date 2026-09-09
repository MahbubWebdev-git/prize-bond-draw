<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('winning_numbers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('draw_id')->constrained()->onDelete('cascade');
            $table->string('prize_category');
            $table->string('number');
            $table->unsignedBigInteger('prize_amount');
            $table->timestamps();

            $table->index('number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('winning_numbers');
    }
};
