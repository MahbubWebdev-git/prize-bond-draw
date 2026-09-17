<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_approved' => true,
                'can_view_results' => true,
                'can_import_data' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Sample User',
                'password' => Hash::make('password'),
                'role' => 'user',
                'is_approved' => true,
                'can_view_results' => true,
                'can_import_data' => false,
            ]
        );
    }
}
