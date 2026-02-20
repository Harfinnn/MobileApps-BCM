<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MBencana extends Model
{
    protected $table = 'm_bencana';
    protected $primaryKey = 'mbe_id';
    public $timestamps = false;

    public function laporan()
    {
        return $this->hasMany(
            \App\Models\LaporBencana::class,
            'mbe_id',
            'mbe_id'
        );
    }

    protected $fillable = [
        'mbe_nama',
        'mbe_warna',
        'mbe_icon',
        'mbe_sort',
        'mbe_status',
        'mbe_visitor',
        'mbe_bencana',
    ];
}
