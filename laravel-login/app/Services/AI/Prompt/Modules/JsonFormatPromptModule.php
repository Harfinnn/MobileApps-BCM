<?php

namespace App\Services\AI\Prompt\Modules;

class JsonFormatPromptModule
{
    public function build(): string
    {
        return '
Format JSON (WAJIB):

{
    "intent": "nama_intent",
    "parameters": {
        "is_compare": false,

        "hari": null,
        "hari_banding": null,

        "hari_mulai": null,
        "hari_akhir": null,

        "bulan": null,
        "bulan_banding": null,

        "tahun": null,

        "magnitudo": null,

        "lokasi": null,
        "nama_user": null,

        "target_cob": null,
        "operasi_cob": null,

        "filter_kondisi": null,
        "filter_nilai": null,

        "kata_kunci_kendala": null,

        "jenis_chart": null,

        "jumlah_hari_prediksi": null,

        "jumlah_bulan_bom": null,
        "jumlah_bulan_eom": null,
        "jumlah_bulan": null,

        "kategori": null
    }
}
';
    }
}