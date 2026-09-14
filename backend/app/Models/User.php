<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'can_view_results',
        'can_import_data',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'can_view_results' => 'boolean',
            'can_import_data' => 'boolean',
        ];
    }

    // role case-insensitive compare kore, jate "Admin" / "admin" dutoi kaj kore
    public function isAdmin(): bool
    {
        return strtolower((string) $this->role) === 'admin';
    }

    public function canViewResults(): bool
    {
        return $this->isAdmin() || $this->can_view_results;
    }

    public function canImportData(): bool
    {
        return $this->isAdmin() || $this->can_import_data;
    }
}
