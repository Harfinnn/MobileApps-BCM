<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WeatherLog extends Model
{
    protected $fillable = [
        'location_name',
        'latitude',
        'longitude',
        'temperature',
        'humidity',
        'wind_speed',
        'rain_probability',
        'condition',
        'weather_date',
    ];
}