<?php

namespace Database\Seeders;

use App\Helpers\PasswordHelper;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserDemoSeeder extends Seeder
{
    public function run()
    {
        DB::table('user')->insert([
            [
                'user_nama' => 'Super Admin Demo',
                'user_status' => 1,              // AKTIF
                'user_uname' => 'superadmin_demo',
                'user_pswd' => PasswordHelper::encrypt('password123'),
                'user_jabatan' => 1,             // Super Administrator
                'user_salah' => 0,
                'user_salah_wkt' => null,
                'user_last_login' => null,
                'user_foto' => null,
                'user_hp' => '081700000001',
                'user_selindo' => 1175,
                'user_rta' => 0,
                'user_bia' => 0,
                'user_drp' => 0,
                'user_kegiatan' => 0,
                'user_insiden' => 0,
            ],
            [
                'user_nama' => 'Viewer Demo',
                'user_status' => 1,              // AKTIF
                'user_uname' => 'viewer_demo',
                'user_pswd' => PasswordHelper::encrypt('password123'),
                'user_jabatan' => 3,             // Viewer
                'user_salah' => 0,
                'user_salah_wkt' => null,
                'user_last_login' => null,
                'user_foto' => null,
                'user_hp' => '081700000002',
                'user_selindo' => 1181,
                'user_rta' => 0,
                'user_bia' => 0,
                'user_drp' => 0,
                'user_kegiatan' => 0,
                'user_insiden' => 0,
            ],
            [
                'user_nama' => 'Unit Kerja Demo',
                'user_status' => 1,              // AKTIF
                'user_uname' => 'unitkerja_demo',
                'user_pswd' => PasswordHelper::encrypt('password123'),
                'user_jabatan' => 4,             // Unit Kerja
                'user_salah' => 0,
                'user_salah_wkt' => null,
                'user_last_login' => null,
                'user_foto' => null,
                'user_hp' => '081700000003',
                'user_selindo' => 1182,
                'user_rta' => 0,
                'user_bia' => 0,
                'user_drp' => 0,
                'user_kegiatan' => 0,
                'user_insiden' => 0,
            ],
            [
                'user_nama' => 'Pengelola Gedung Demo',
                'user_status' => 0,              // AKTIF
                'user_uname' => 'pengelola_gedung',
                'user_pswd' => PasswordHelper::encrypt('password123'),
                'user_jabatan' => 5,             // Pengelola Gedung
                'user_salah' => 0,
                'user_salah_wkt' => null,
                'user_last_login' => null,
                'user_foto' => null,
                'user_hp' => '081700000004',
                'user_selindo' => 1183,
                'user_rta' => 0,
                'user_bia' => 0,
                'user_drp' => 0,
                'user_kegiatan' => 0,
                'user_insiden' => 0,
            ],
        ]);
    }
}
