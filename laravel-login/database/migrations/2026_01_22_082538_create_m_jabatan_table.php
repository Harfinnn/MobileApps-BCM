<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('m_jabatan', function (Blueprint $table) {
            $table->increments('jab_id'); // int(11) AUTO_INCREMENT PRIMARY KEY
            $table->string('jab_nama', 35);
            $table->boolean('jab_status'); // tinyint(1)
        });
    }

    public function down()
    {
        Schema::dropIfExists('m_jabatan');
    }
};
