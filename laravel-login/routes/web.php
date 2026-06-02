<?php

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Route;

Route::get('/test-pdf', function () {
    // 1. Buat data teks dummy (pura-puranya ini adalah teks balasan dari AI)
    $dummyText = "Laporan Operasional COB - 25 hingga 29 April 2026\n\nProses End-of-Day (EOD) dan Start-of-Day (SOD) berjalan dengan rata-rata durasi 3 jam 15 menit per hari.\nTotal transaksi yang diproses selama periode ini mencapai 25.120.300 transaksi.\n\nBerdasarkan pantauan sistem, seluruh stage Application dan System Wide berjalan dalam kondisi stabil tanpa kendala berarti.";

    // 2. Load file template blade yang sudah Anda buat di Langkah 3 sebelumnya
    $pdf = Pdf::loadView('pdf.cob_report', [
        'laporan_text' => $dummyText
    ]);

    // 3. Gunakan method stream() agar PDF langsung terbuka di dalam tab browser, bukan ter-download otomatis
    return $pdf->stream('test-laporan-cob.pdf');
});


Route::get('/', function () {
    return view('welcome');
});
