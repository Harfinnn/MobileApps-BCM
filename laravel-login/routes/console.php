<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// 🌦️ CUACA
Schedule::command('app:fetch-weather-hourly')->hourly();

// 🌍 GEMPA
Schedule::command('gempa:check')
    ->everyMinute()
    ->withoutOverlapping();
    
// Reminder Gempa
Schedule::command('gempa:reminder') 
->everyMinute() 
->withoutOverlapping();

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');