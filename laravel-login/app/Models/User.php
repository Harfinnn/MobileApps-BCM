<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Carbon\Carbon;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'user';

    protected $primaryKey = 'user_id';

    public $timestamps = false;

    protected $fillable = [
        'user_nama',
        'user_status',
        'user_uname',
        'user_pswd',
        'user_jabatan',
        'user_salah',
        'user_salah_wkt',
        'user_last_login',
        'user_foto',
        'user_hp',
        'user_selindo',
        'user_rta',
        'user_bia',
        'user_drp',
        'user_kegiatan',
        'user_insiden',
        'fcm_token',
    ];

    protected $hidden = [
        'user_pswd',
    ];

    public function getAuthPassword()
    {
        return $this->user_pswd;
    }

    public function jabatan()
    {
        return $this->belongsTo(
            \App\Models\MJabatan::class,
            'user_jabatan',
            'jab_id'
        );
    }

    public function isLocked()
    {
        if ($this->user_salah < 5) {
            return false;
        }

        if (!$this->user_salah_wkt) {
            return false;
        }

        return Carbon::parse($this->user_salah_wkt)
            ->addMinutes(15)
            ->isFuture();
    }

    public function selindo()
    {
        return $this->belongsTo(
            \App\Models\MJaringanSelindo::class,
            'user_selindo',
            'mjs_id'
        );
    }
}
