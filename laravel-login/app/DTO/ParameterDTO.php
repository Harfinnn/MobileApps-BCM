<?php

namespace App\DTO;

class ParameterDTO
{
    public $is_compare;

    public $hari;
    public $hari_banding;

    public $hari_mulai;
    public $hari_akhir;

    public $bulan;
    public $bulan_banding;

    public $tahun;

    public $magnitudo;

    public $lokasi;
    public $nama_user;

    public $target_cob;
    public $operasi_cob;

    public $filter_kondisi;
    public $filter_nilai;

    public $kata_kunci_kendala;

    public $jenis_chart;

    public $jumlah_hari_prediksi;

    public $jumlah_bulan_bom;
    public $jumlah_bulan_eom;
    public $jumlah_bulan;

    public $kategori;
    
    public static function defaults(): array
    {
        return [
            'is_compare' => false,
    
            'hari' => null,
            'hari_banding' => null,
    
            'hari_mulai' => null,
            'hari_akhir' => null,
    
            'bulan' => null,
            'bulan_banding' => null,
    
            'tahun' => null,
    
            'magnitudo' => null,
    
            'lokasi' => null,
            'nama_user' => null,
    
            'target_cob' => null,
            'operasi_cob' => null,
    
            'filter_kondisi' => null,
            'filter_nilai' => null,
    
            'kata_kunci_kendala' => null,
    
            'jenis_chart' => null,
    
            'jumlah_hari_prediksi' => null,
    
            'jumlah_bulan_bom' => null,
            'jumlah_bulan_eom' => null,
            'jumlah_bulan' => null,
    
            'kategori' => null,
        ];
    }

    public function __construct(array $data = [])
    {
        $data = array_merge(self::defaults(), $data);
        
        $this->is_compare = $data['is_compare'] ?? false;

        $this->hari = $data['hari'] ?? null;
        $this->hari_banding = $data['hari_banding'] ?? null;

        $this->hari_mulai = $data['hari_mulai'] ?? null;
        $this->hari_akhir = $data['hari_akhir'] ?? null;

        $this->bulan = $data['bulan'] ?? null;
        $this->bulan_banding = $data['bulan_banding'] ?? null;

        $this->tahun = $data['tahun'] ?? null;

        $this->magnitudo = isset($data['magnitudo'])
            ? (float) $data['magnitudo']
            : null;

        $this->lokasi = $data['lokasi'] ?? null;
        $this->nama_user = $data['nama_user'] ?? null;

        $this->target_cob = $data['target_cob'] ?? null;
        $this->operasi_cob = $data['operasi_cob'] ?? null;

        $this->filter_kondisi = $data['filter_kondisi'] ?? null;
        $this->filter_nilai = $data['filter_nilai'] ?? null;

        $this->kata_kunci_kendala = $data['kata_kunci_kendala'] ?? null;

        $this->jenis_chart = $data['jenis_chart'] ?? null;

        $this->jumlah_hari_prediksi = isset($data['jumlah_hari_prediksi'])
            ? (int) $data['jumlah_hari_prediksi']
            : null;

        $this->jumlah_bulan_bom = isset($data['jumlah_bulan_bom'])
            ? (int) $data['jumlah_bulan_bom']
            : null;

        $this->jumlah_bulan_eom = isset($data['jumlah_bulan_eom'])
            ? (int) $data['jumlah_bulan_eom']
            : null;

        $this->jumlah_bulan = isset($data['jumlah_bulan'])
            ? (int) $data['jumlah_bulan']
            : null;

        $this->kategori = $data['kategori'] ?? null;
    }

    public static function fromArray(array $data)
    {
        return new self($data);
    }

    public function toArray()
    {
        return get_object_vars($this);
    }
}