<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('data_bencana', function (Blueprint $table) {
            $table->id('dab_id');
            $table->string('dab_gambar', 100);
            $table->integer('dab_sort')->default(1);
            $table->integer('dab_head_id'); // relasi ke m_bencana.mbe_id
            $table->tinyInteger('dab_status')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_bencana');
    }
};
