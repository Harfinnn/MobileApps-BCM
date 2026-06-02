<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MobilePlaybook extends Model
{
    protected $table = 'mobile_playbook';
    protected $primaryKey = 'book_id';

    protected $fillable = [
        'title',
        'url',
        'thumbnail',
        'is_active',
        'order_no',
    ];
}