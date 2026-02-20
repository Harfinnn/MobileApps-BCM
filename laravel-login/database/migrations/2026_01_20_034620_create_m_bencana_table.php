<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('m_bencana', function (Blueprint $table) {
            $table->increments('mbe_id');

            $table->string('mbe_nama', 75);
            $table->string('mbe_warna', 35)->nullable();
            $table->string('mbe_icon', 35)->nullable();

            $table->tinyInteger('mbe_sort')->default(0);
            $table->tinyInteger('mbe_status')->default(1);
            $table->integer('mbe_visitor')->default(0);

            // 0 = info, 1 = bencana, 2 = IT
            $table->tinyInteger('mbe_bencana')->default(1);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('m_bencana');
    }
};
