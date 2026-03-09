<?php

namespace App\Models;
use Carbon\Carbon;

use Illuminate\Database\Eloquent\Model;

class LaporBencana extends Model
{
    protected $table = 'lapor_bencana';

    protected $fillable = [
        'user_id',
        'unit_kerja_id',
        'unit_kerja_nama',
        'mbe_id',
        'lokasi',
        'terdampak',
        'ada_kerusakan',
        'foto',
    ];

    protected $casts = [
        'terdampak' => 'boolean',
        'ada_kerusakan' => 'boolean',
    ];

    protected $appends = [
        'created_at_id',
        'updated_at_id',
    ];

    public function bencana()
    {
        return $this->belongsTo(MBencana::class, 'mbe_id', 'mbe_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function getCreatedAtIdAttribute()
    {
        if (!$this->created_at)
            return null;

        return Carbon::parse($this->created_at)
            ->timezone('Asia/Jakarta')
            ->format('d-m-Y H:i');
    }

    public function getUpdatedAtIdAttribute()
    {
        if (!$this->updated_at)
            return null;

        return Carbon::parse($this->updated_at)
            ->timezone('Asia/Jakarta')
            ->format('d-m-Y H:i');
    }
}
