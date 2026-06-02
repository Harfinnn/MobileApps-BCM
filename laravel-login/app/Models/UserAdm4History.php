<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAdm4History extends Model
{
    protected $table = 'mobile_user_adm4_histories';

    protected $fillable = [
        'user_id',
        'adm4_id',
        'last_accessed_at'
    ];
}