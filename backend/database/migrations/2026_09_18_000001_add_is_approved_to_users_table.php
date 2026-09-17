<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // role column already exists via 2024_01_02 migration on fresh installs,
            // but may be missing on older DBs — add only if missing.
            if (! Schema::hasColumn('users', 'role')) {
                $table->string('role')->default('user')->after('password'); // 'admin' | 'user'
            }
            if (! Schema::hasColumn('users', 'is_approved')) {
                $table->boolean('is_approved')->default(false)->after('role');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'is_approved')) {
                $table->dropColumn('is_approved');
            }
        });
    }
};
