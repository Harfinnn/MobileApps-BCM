<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('user', function (Blueprint $table) {
            $table->bigIncrements('user_id');
            $table->string('user_nama', 100);
            $table->tinyInteger('user_status');
            $table->string('user_uname', 100);
            $table->string('user_pswd', 100);
            $table->integer('user_jabatan');
            $table->tinyInteger('user_salah');
            $table->string('user_salah_wkt', 18)->nullable();
            $table->string('user_last_login', 11)->nullable();
            $table->text('user_foto')->nullable();
            $table->string('user_hp', 15);
            $table->integer('user_selindo');
            $table->tinyInteger('user_rta');
            $table->tinyInteger('user_bia');
            $table->tinyInteger('user_drp');
            $table->tinyInteger('user_kegiatan');
            $table->tinyInteger('user_insiden');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user');
    }
};
