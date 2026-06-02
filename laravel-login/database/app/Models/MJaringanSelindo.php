<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MJaringanSelindo extends Model
{
    protected $table = 'm_jaringan_selindo';
    protected $primaryKey = 'mjs_id';
    public $timestamps = false;

    protected $fillable = [
        'mjs_kode',
        'mjs_nama',
        'mjs_status',
        'mjs_alamat',
        'mjs_lat',
        'mjs_long',
        'mjs_jenis',
        'mjs_area',
        'mjs_region',
        'mjs_bia',
        'mjs_rta',
        'mjs_class_insiden',
        'mjs_colour_insiden',
        'mjs_thn_isi_rta',
        'mjs_foto',
    ];

    /* ================= SCOPES ================= */

    // hanya data aktif
    public function scopeActive($query)
    {
        return $query->where('mjs_status', 1);
    }

    // filter jenis (kantor, area, dll)
    public function scopeJenis($query, $jenis)
    {
        if ($jenis) {
            return $query->whereIn('mjs_jenis', (array) $jenis);
        }
        return $query;
    }

    // hanya yang punya koordinat
    public function scopeWithLocation($query)
    {
        return $query
            ->whereNotNull('mjs_lat')
            ->whereNotNull('mjs_long')
            ->where('mjs_lat', '!=', '')
            ->where('mjs_long', '!=', '');
    }

    public function users()
    {
        return $this->hasMany(
            \App\Models\User::class,
            'user_selindo',
            'mjs_id'
        );
    }
}
