<?php

namespace App\Services\AI\Prompt;
use App\Services\AI\Prompt\Modules\CobPromptModule;
use App\Services\AI\Prompt\Modules\IncidentPromptModule;
use App\Services\AI\Prompt\Modules\WeatherPromptModule;
use App\Services\AI\Prompt\Modules\JsonFormatPromptModule;
use App\Services\AI\Prompt\Modules\InheritancePromptModule;
use App\Services\AI\Prompt\Modules\TypoPromptModule;
use App\Services\AI\Prompt\Modules\IntentCategoryPromptModule;
use App\Services\AI\Prompt\Modules\GempaPromptModule;

class IntentPromptBuilder
{
    protected $cobPromptModule;
    protected $incidentPromptModule;
    protected $weatherPromptModule;
    protected $jsonFormatPromptModule;
    protected $inheritancePromptModule;
    protected $typoPromptModule;
    protected $intentCategoryPromptModule;
    protected $gempaPromptModule;
    
   public function __construct(
        CobPromptModule $cobPromptModule,
        IncidentPromptModule $incidentPromptModule,
        WeatherPromptModule $weatherPromptModule,
        JsonFormatPromptModule $jsonFormatPromptModule,
        InheritancePromptModule $inheritancePromptModule,
        TypoPromptModule $typoPromptModule,
        IntentCategoryPromptModule $intentCategoryPromptModule,
        GempaPromptModule $gempaPromptModule
    ) {
        $this->cobPromptModule = $cobPromptModule;
        $this->incidentPromptModule = $incidentPromptModule;
        $this->weatherPromptModule = $weatherPromptModule;
        $this->jsonFormatPromptModule = $jsonFormatPromptModule;
    
        $this->inheritancePromptModule = $inheritancePromptModule;
        $this->typoPromptModule = $typoPromptModule;
        $this->intentCategoryPromptModule = $intentCategoryPromptModule;
        $this->gempaPromptModule = $gempaPromptModule;
    }
    
    public function build(
        string $recentHistory,
        string $tanggalHariIni,
        string $namaHariIni,
        string $bulanIni,
        string $tahunIni,
        ?string $detectedIntent = null
    ): string {
    
        $modules = [];
    
        // =====================================
        // DYNAMIC MODULE LOADING
        // =====================================
    
        if ($detectedIntent === 'data_cob') {
            $modules[] = $this->cobPromptModule->build();
        }
    
        if ($detectedIntent === 'insiden_it') {
            $modules[] = $this->incidentPromptModule->build();
        }
    
        if ($detectedIntent === 'cuaca') {
            $modules[] = $this->weatherPromptModule->build();
        }
        
        if ($detectedIntent === 'gempa') {
            $modules[] = $this->gempaPromptModule->build();
        }
    
        return implode("\n\n", array_merge([
    
            $this->identitySection(),
    
            $this->contextSection($recentHistory),
    
            $this->inheritancePromptModule->build(),
    
            $this->timeSection(
                $tanggalHariIni,
                $namaHariIni,
                $bulanIni,
                $tahunIni
            ),
    
            $this->typoPromptModule->build(),
    
            $this->intentCategoryPromptModule->build(),
    
        ], $modules, [
    
            $this->jsonFormatPromptModule->build(),
    
        ]));
    }

    private function identitySection(): string
    {
        return '
Kamu adalah AI ekstraktor parameter untuk sistem intelijen BCM24.
Analisis pesan user dan kembalikan HANYA format JSON valid tanpa basa-basi.
';
    }

    private function contextSection(string $recentHistory): string
    {
        return "
[KONTEKS PERCAKAPAN SEBELUMNYA]
{$recentHistory}
";
    }

    private function timeSection(
        string $tanggalHariIni,
        string $namaHariIni,
        string $bulanIni,
        string $tahunIni
    ): string {

        return "
[KONTEKS WAKTU SAAT INI]
Hari ini: {$namaHariIni}, Tanggal: {$tanggalHariIni}
Bulan ini: {$bulanIni}
Tahun ini: {$tahunIni}

Gunakan parameter tanggal dan compare yang sudah diproses backend.
Jangan menghitung tanggal relatif sendiri.
";
    }

}