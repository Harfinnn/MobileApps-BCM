<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notifications';

    protected $appends = ['created_at_id'];

    protected $fillable = [
        'sender_id',
        'receiver_id',
        'type',
        'reference_id',
        'title',
        'message',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];

    /* ================= RELATIONS ================= */

    public function laporan()
    {
        return $this->belongsTo(
            \App\Models\LaporBencana::class,
            'reference_id'
        );
    }

    public function sender()
    {
        return $this->belongsTo(
            \App\Models\User::class,
            'sender_id',
            'user_id'
        );
    }

    public function receiver()
    {
        return $this->belongsTo(
            \App\Models\User::class,
            'receiver_id',
            'user_id'
        );
    }

    public function getCreatedAtIdAttribute()
    {
        return Carbon::parse($this->created_at)
            ->timezone('Asia/Jakarta')
            ->format('d-m-Y H:i');
    }
}
