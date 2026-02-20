<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MJabatanSeeder extends Seeder
{
    public function run()
    {
        DB::table('m_jabatan')->insert([
            [
                'jab_id' => 1,
                'jab_nama' => 'Super Administrator',
                'jab_status' => 1
            ],
            [
                'jab_id' => 3,
                'jab_nama' => 'Viewer',
                'jab_status' => 1
            ],
            [
                'jab_id' => 4,
                'jab_nama' => 'Unit Kerja',
                'jab_status' => 1
            ],
            [
                'jab_id' => 5,
                'jab_nama' => 'Pengelola Gedung',
                'jab_status' => 1
            ],
        ]);
    }
}
