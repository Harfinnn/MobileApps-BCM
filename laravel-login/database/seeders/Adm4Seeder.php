<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;

class Adm4Seeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('data/adm4-jawa.json');

        if (!File::exists($path)) {
            $this->command->error("File tidak ditemukan: " . $path);
            return;
        }

        $json = File::get($path);
        $data = json_decode($json, true);

        if (!$data) {
            $this->command->error("JSON tidak valid");
            return;
        }

        $chunks = array_chunk($data, 1000); // 🔥 1000 per batch

        foreach ($chunks as $chunk) {
            $insertData = [];

            foreach ($chunk as $item) {
                $insertData[] = [
                    'adm4' => $item['adm4'],
                    'kecamatan' => $item['kecamatan'],
                    'kelurahan' => $item['kelurahan'],
                    'kotkab' => $item['kotkab'],
                    'provinsi' => $item['provinsi'],
                    'lat' => $item['lat'],
                    'lon' => $item['lon'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            DB::table('adm4')->upsert(
                $insertData,
                ['adm4'], // unique key
                ['kecamatan', 'kelurahan', 'kotkab', 'provinsi', 'lat', 'lon', 'updated_at']
            );
        }

        $this->command->info('ADM4 seeded successfully 🚀');
    }
}