<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMJaringanSelindoTable extends Migration
{
    public function up()
    {
        Schema::create('m_jaringan_selindo', function (Blueprint $table) {
            $table->increments('mjs_id');

            $table->string('mjs_kode', 35);
            $table->string('mjs_nama', 150);
            $table->tinyInteger('mjs_status');

            $table->text('mjs_alamat')->nullable();

            $table->string('mjs_lat', 50)->nullable();
            $table->string('mjs_long', 50)->nullable();

            $table->integer('mjs_jenis');
            $table->integer('mjs_area')->default(0);
            $table->integer('mjs_region')->default(0);

            $table->tinyInteger('mjs_bia')->default(0);
            $table->tinyInteger('mjs_rta')->default(0);
            $table->tinyInteger('mjs_class_insiden')->default(0);

            $table->string('mjs_colour_insiden', 35)->nullable();
            $table->string('mjs_thn_isi_rta', 4)->nullable();
            $table->string('mjs_foto', 100)->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('m_jaringan_selindo');
    }
}
