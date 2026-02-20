<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DataBerita extends Model
{
    protected $table = 'data_berita';
    protected $primaryKey = 'dbe_id';
    public $timestamps = false;

    protected $fillable = [
        'dbe_judul',
        'dbe_gambar',
        'dbe_isi',
        'dbe_isi_cuplikan',
        'dbe_tgl',
        'dbe_jam',
        'dbe_user',
        'dbe_viewer',
        'dbe_status'
    ];
}
