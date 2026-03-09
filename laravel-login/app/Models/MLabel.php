<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MLabel extends Model
{
    protected $table = 'm_label';

    protected $primaryKey = 'mla_id';

    public $timestamps = false;
    protected $fillable = [
        'mla_nama_perusahaan',
        'mla_nama_aplikasi',
        'mla_keterangan',
        'mla_logo',
        'mla_logo_kecil',
        'mla_logo_perusahaan',
        'mla_warna',
        'mla_versi',
        'mla_tahun',
        'mla_status',
        'mla_fitur',
        'mla_sign',
    ];
}