<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserDevice extends Model
{
    // Beri tahu Laravel nama tabel yang benar sesuai yang kita buat di MySQL
    protected $table = 'user_devices';

    // Kolom-kolom yang diizinkan untuk diisi datanya secara massal (mass assignment)
    protected $fillable = [
        'user_id',
        'device_id',
        'device_name',
        'fcm_token',
    ];

    // Relasi: Setiap 1 device ini adalah milik 1 user
    public function user()
    {
        // Parameter: (NamaModelRelasi, foreign_key_di_tabel_ini, primary_key_di_tabel_tujuan)
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}