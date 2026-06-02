<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    protected $table = 'mobile_chats';

    protected $fillable = [
        'user_id',
        'message',
        'reply',
    ];
}