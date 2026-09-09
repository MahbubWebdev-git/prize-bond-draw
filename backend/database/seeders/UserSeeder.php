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
                'can_view_results' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Sample User',
                'password' => Hash::make('password'),
                'role' => 'user',
                'can_view_results' => false,
            ]
        );
    }
}
