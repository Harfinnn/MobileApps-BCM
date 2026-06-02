<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

use App\Services\AIProvider\AIProviderInterface;
use App\Services\AIProvider\GroqProvider;
use App\Services\AIProvider\DeepInfraProvider;

use App\Services\Parser\Rules\RulePipeline;
use App\Services\Parser\Rules\BomEomRule;
use App\Services\Parser\Rules\IncidentRule;
use App\Services\Parser\Rules\GempaRule;
use App\Services\Parser\Rules\WeatherRule;
use App\Services\Parser\Rules\CobRule;

class AppServiceProvider extends ServiceProvider
{

    public function register(): void
    {
        // =====================================
        // AI PROVIDER
        // =====================================

        $this->app->bind(
            AIProviderInterface::class,
            GroqProvider::class
        );

        // =====================================
        // RULES
        // =====================================

        $this->app->singleton(
            BomEomRule::class
        );
        
        $this->app->singleton(
            IncidentRule::class
        );
        
        $this->app->singleton(
            GempaRule::class
        );
        
        $this->app->singleton(
            WeatherRule::class
        );
        
        $this->app->singleton(
            CobRule::class
        );

        $this->app->singleton(RulePipeline::class, function ($app) {
            return new RulePipeline(
                $app->make(BomEomRule::class),
                $app->make(IncidentRule::class),
                $app->make(GempaRule::class),
                $app->make(WeatherRule::class),
                $app->make(CobRule::class)
            );
        });
    }

    public function boot(): void
    {

        RateLimiter::for('chat_api', function (Request $request) {
            
            $identifier = $request->header('X-User-Id') ?? $request->user()?->id ?? $request->ip();

            return Limit::perMinute(10)->by($identifier)->response(function () {
                
                return response()->json([
                    'reply' => '⚠️ Sistem mendeteksi terlalu banyak pesan dalam waktu singkat. Mohon tunggu sekitar satu menit sebelum mengirim pesan lagi untuk menjaga stabilitas server.',
                    'limit' => 100,
                    'used' => null,
                    'remaining' => null
                ], 429);
            });
        });
    }
}