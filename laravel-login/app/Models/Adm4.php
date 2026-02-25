<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Adm4 extends Model
{
    protected $table = 'adm4';

    protected $fillable = [
        'adm4',
        'kecamatan',
        'kelurahan',
        'kotkab',
        'provinsi',
        'lat',
        'lon'
    ];
}