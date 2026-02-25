<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WeatherHourly extends Model
{
    protected $fillable = [
        'adm4_id',
        'local_datetime',
        'temperature',
        'humidity',
        'wind_speed',
        'wind_direction',
        'weather_code',
        'weather_desc'
    ];

    protected $casts = [
        'local_datetime' => 'datetime'
    ];

    public function adm4()
    {
        return $this->belongsTo(Adm4::class);
    }
}