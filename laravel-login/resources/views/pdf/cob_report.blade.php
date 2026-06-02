<!DOCTYPE html>
<html>
<head>
    <title>Laporan COB</title>
    <style>
        /* Set margin 0 agar gambar cover bisa full mentok ke tepi */
        @page { 
            margin: 0px; 
        }
        body { 
            font-family: sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0;
            /* Pastikan background putih */
            background-color: #ffffff; 
        }
        
        /* Class untuk memotong ke halaman baru */
        .page-break { page-break-after: always; }
        
        /* Halaman Konten (Halaman 2) butuh margin agar teks tidak nabrak tepi */
        /* Karena format PPT melebar, kita buat padding yang proporsional */
        .content-page { 
            padding: 40px 60px; 
        }

        .header { 
            text-align: center; 
            border-bottom: 2px solid #00A39D; 
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .title { 
            font-size: 28px; /* Diperbesar sedikit karena layarnya lebar */
            font-weight: bold;
            color: #1E2A38;
        }
        .date { 
            font-size: 14px;
            color: #64748B;
        }
        
        .content { 
            font-size: 16px; /* Diperbesar agar mudah dibaca seperti slide */
            margin-top: 20px; 
        }
        
        /* Gambar full page untuk cover dan closing */
        .full-image {
            width: 100%;
            height: 100%;
            /* DOMPDF kadang mengabaikan object-fit, tapi kita pasang untuk berjaga-jaga */
            object-fit: cover;
        }
        
        /* Gambar chart */
        .chart-image {
            width: 100%;
            max-height: 250px; /* Disesuaikan agar tidak memakan ruang teks di bawahnya */
            object-fit: contain;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>

    <div class="page-break">
        <img src="{{ public_path('images/cover_cob.jpg') }}" class="full-image">
    </div>

    <div class="content-page page-break">
        <div class="header">
            <div class="title">Grafik & Laporan Eksekutif COB W1</div>
            <div class="date">Dicetak pada: {{ date('d M Y H:i') }}</div>
        </div>
        
        @if(isset($chart_image_base64))
            <img src="{{ $chart_image_base64 }}" class="chart-image">
        @else
            <div style="height: 220px; background: #eee; text-align:center; padding-top: 90px; border: 2px dashed #ccc; margin-bottom: 20px;">
                <span style="color: #888; font-size: 18px;">[Area Grafik Akan Tampil Di Sini]</span>
            </div>
        @endif

        <div class="content">
            {!! nl2br(e($laporan_text)) !!}
        </div>
    </div>

    <div>
        <img src="{{ public_path('images/closing_cob.jpg') }}" class="full-image">
    </div>

</body>
</html>