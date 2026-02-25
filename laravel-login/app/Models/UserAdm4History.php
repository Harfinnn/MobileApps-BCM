<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAdm4History extends Model
{
    protected $fillable = [
        'user_id',
        'adm4_id',
        'last_accessed_at'
    ];
}