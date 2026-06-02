<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MJabatan extends Model
{
    protected $table = 'm_jabatan';
    protected $primaryKey = 'jab_id';
    public $timestamps = false;

    protected $fillable = [
        'jab_nama',
        'jab_status',
    ];

    public function users()
    {
        return $this->hasMany(
            \App\Models\User::class,
            'user_jabatan',
            'jab_id'
        );
    }
}
