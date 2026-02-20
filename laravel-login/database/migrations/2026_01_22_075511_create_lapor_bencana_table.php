<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lapor_bencana', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedInteger('unit_kerja_id');
            $table->string('unit_kerja_nama');
            $table->unsignedInteger('mbe_id');
            $table->string('lokasi')->nullable();
            $table->boolean('terdampak');
            $table->boolean('ada_kerusakan');
            $table->string('foto')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lapor_bencana');
    }

};
