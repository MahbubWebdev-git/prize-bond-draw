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
        'is_approved',
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
            'is_approved' => 'boolean',
            'can_view_results' => 'boolean',
            'can_import_data' => 'boolean',
        ];
    }

    // role case-insensitive compare kore, jate "Admin" / "admin" dutoi kaj kore
    public function isAdmin(): bool
    {
        return strtolower((string) $this->role) === 'admin';
    }

    public function isApproved(): bool
    {
        // Admins are always treated as approved.
        return $this->isAdmin() || (bool) $this->is_approved;
    }

    public function canViewResults(): bool
    {
        // Approved normal users can ONLY search (view results).
        return $this->isApproved() && ($this->isAdmin() || $this->can_view_results);
    }

    public function canImportData(): bool
    {
        // Only admins may bulk-upload / insert data — never normal users.
        return $this->isAdmin();
    }
}
