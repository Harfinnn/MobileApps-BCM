<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LaporBencana;
use App\Models\Notification;
use App\Models\User;
use App\Services\FcmService;
use App\Helpers\NotificationHelper;
use Illuminate\Support\Facades\Log;

class LaporBencanaController extends Controller
{
    public function store(Request $request)
    {
        Log::info('LAPOR BENCANA MASUK');

        $sender = auth()->user();

        if (!$sender) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        /* ================= VALIDASI ================= */
        $request->validate([
            'unit_kerja_id' => 'required|integer',
            'unit_kerja_nama' => 'required|string',
            'mbe_id' => 'required|integer',
            'lokasi' => 'nullable|string',
        
            'terdampak' => 'required|in:0,1,true,false',
            'ada_kerusakan' => 'required|in:0,1,true,false',
        
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
        
            // 🔥 TAMBAHAN
            'source' => 'nullable|in:manual,gempa',
            'gempa_ref' => 'nullable|string|max:100',
        ]);

        /* ================= SIMPAN FOTO ================= */
        $fotoPath = null;

        if ($request->hasFile('foto')) {

            $file = $request->file('foto');

            $filename = time() . '_' . $file->getClientOriginalName();

            $destinationPath = public_path('storage/lapor-bencana');

            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $file->move($destinationPath, $filename);

            $fotoPath = 'lapor-bencana/' . $filename;
        }


        /* ================= SIMPAN LAPORAN ================= */
        $laporan = LaporBencana::create([
            'user_id' => $sender->user_id,
            'unit_kerja_id' => $request->unit_kerja_id,
            'unit_kerja_nama' => $request->unit_kerja_nama,
            'mbe_id' => $request->mbe_id,
            'source' => $request->source ?? 'manual',
            'gempa_ref' => $request->gempa_ref,
            'lokasi' => $request->lokasi,
            'terdampak' => filter_var($request->terdampak, FILTER_VALIDATE_BOOLEAN),
            'ada_kerusakan' => filter_var($request->ada_kerusakan, FILTER_VALIDATE_BOOLEAN),
            'foto' => $fotoPath,
        ]);

        if ($request->source === 'gempa' && $request->gempa_ref) {
            \DB::table('mobile_gempa_user_status')
                ->where('user_id', auth()->id())
                ->where('gempa_ref', $request->gempa_ref)
                ->where('status', 'pending')
                ->update([
                    'status' => 'reported',
                    'reported_at' => now(),
                ]);
                
        }

        /* ================= NOTIFIKASI ================= */
        $receivers = NotificationHelper::getReceivers($sender);

        if (empty($receivers)) {
            Log::warning('NO RECEIVER FOUND', [
                'sender_id' => $sender->user_id,
            ]);
        }

        foreach ($receivers as $receiverId) {

            // 1️⃣ SIMPAN NOTIFIKASI KE DATABASE
            Notification::create([
                'sender_id' => $sender->user_id,
                'receiver_id' => $receiverId,
                'type' => 'bencana',
                'reference_id' => $laporan->id,
                'title' => $request->unit_kerja_nama,
                'message' => $laporan->bencana->mbe_nama ?? 'Laporan Bencana',
            ]);

            // 2️⃣ KIRIM PUSH NOTIFICATION (FCM)
            $receiver = User::where('user_id', $receiverId)
                ->whereNotNull('fcm_token')
                ->first();

            if ($receiver && $receiver->fcm_token) {
                FcmService::send(
                    $receiver->fcm_token,
                    '🚨 Laporan Bencana Baru',
                    $request->unit_kerja_nama,
                    [
                        'type' => 'bencana',
                        'lapor_id' => (string) $laporan->id,
                        'sender_id' => (string) $sender->user_id,
                    ]
                );
            }
        }

        /* ================= RESPONSE ================= */
        return response()->json([
            'success' => true,
            'message' => 'Laporan berhasil dikirim',
            'data' => [
                'id' => $laporan->id,
                'foto' => $fotoPath ? asset('storage/' . $fotoPath) : null,
            ],
        ]);
    }
    
    public function show($id)
    {
        // ================= KODE DEBUGGING MULAI =================
        $laporanRaw = \DB::table('mobile_lapor_bencana')->where('id', $id)->first();
        
        if ($laporanRaw) {
            \Log::info('--- DEBUGGING GEMPA REF ---');
            \Log::info('1. Gempa Ref dari Laporan (Tabel Lapor) : [' . $laporanRaw->gempa_ref . ']');
            
            $cekGempa = \DB::table('mobile_gempa_events')
                           ->where('gempa_ref', $laporanRaw->gempa_ref)
                           ->first();
                           
            if ($cekGempa) {
                \Log::info('2. Status Pencarian : KETEMU!');
            } else {
                \Log::info('2. Status Pencarian : GAGAL (TIDAK ADA YANG COCOK)');
                
                $sample = \DB::table('mobile_gempa_events')->latest('created_at')->first();
                if ($sample) {
                    \Log::info('3. Contoh isi Gempa Ref di Tabel Events : [' . $sample->gempa_ref . ']');
                }
            }
            \Log::info('---------------------------');
        }
        // ================= KODE DEBUGGING SELESAI =================

        // INI KODE ASLI ANDA UNTUK MENAMPILKAN DATA
        $laporan = \DB::table('mobile_lapor_bencana as l')
            ->leftJoin('user as u', 'l.user_id', '=', 'u.user_id')
            ->leftJoin('m_bencana as b', 'l.mbe_id', '=', 'b.mbe_id') 
            ->leftJoin('mobile_gempa_events as g', 'l.gempa_ref', '=', 'g.gempa_ref') 
            ->where('l.id', $id)
            ->select(
                'l.id',
                'u.user_nama as pelapor',
                'u.user_hp as no_hp',
                'l.unit_kerja_nama as unit_kerja',
                'l.lokasi',
                'l.terdampak',
                'l.ada_kerusakan',
                'l.foto',
                'b.mbe_nama as jenis_bencana',
                'l.created_at',
                'g.magnitude',
                'g.kedalaman',
                'g.wilayah as wilayah_gempa'
            )
            ->first();

        if (!$laporan) {
            return response()->json([
                'success' => false, 
                'message' => 'Laporan tidak ditemukan'
            ], 404);
        }

        $laporan->terdampak = (bool) $laporan->terdampak;
        $laporan->ada_kerusakan = (bool) $laporan->ada_kerusakan;
        $laporan->created_at = \Carbon\Carbon::parse($laporan->created_at)
            ->timezone('Asia/Jakarta')
            ->format('d-m-Y H:i');
            
        if ($laporan->foto) {
             $laporan->foto = asset('storage/' . $laporan->foto);
        }

        return response()->json([
            'success' => true,
            'data' => $laporan
        ]);
    }
    
    public function summary($gempaRef)
    {
        return [
            'total' => \DB::table('mobile_gempa_user_status')
                ->where('gempa_ref', $gempaRef)
                ->count(),
    
            'reported' => \DB::table('mobile_gempa_user_status')
                ->where('gempa_ref', $gempaRef)
                ->where('status', 'reported')
                ->count(),
    
            'pending' => \DB::table('mobile_gempa_user_status')
                ->where('gempa_ref', $gempaRef)
                ->where('status', 'pending')
                ->count(),
        ];
    }

    public function belumLapor($gempaRef)
    {
        return \DB::table('mobile_gempa_user_status as gus')
            ->join('user as u', 'gus.user_id', '=', 'u.user_id')
            ->where('gus.gempa_ref', $gempaRef)
            ->where('gus.status', 'pending')
            ->select('u.user_nama', 'gus.notified_at')
            ->get();
    }
    
    public function sudahLapor($gempaRef)
    {
        return \DB::table('mobile_gempa_user_status as gus')
            ->join('user as u', 'gus.user_id', '=', 'u.user_id')
            ->where('gus.gempa_ref', $gempaRef)
            ->where('gus.status', 'reported')
            ->select('u.user_nama', 'gus.reported_at')
            ->get();
    }

    public function unitStatus($gempaRef)
    {
        $data = \DB::table('m_jaringan_selindo as m')
            ->leftJoin('user as u', function($join) {
                $join->on('u.user_selindo', '=', 'm.mjs_id')
                     ->where('u.user_jabatan', '!=', 1); // 🔥 Admin (jabatan 1) diabaikan
            })
            ->leftJoin('mobile_gempa_user_status as gus', function ($join) use ($gempaRef) {
                $join->on('gus.user_id', '=', 'u.user_id')
                     ->where('gus.gempa_ref', '=', $gempaRef);
            })
            ->select(
                'm.mjs_id',
                'm.mjs_nama',
                \DB::raw('COUNT(DISTINCT u.user_id) as total_user'),
                \DB::raw("SUM(CASE WHEN gus.status = 'reported' THEN 1 ELSE 0 END) as reported_count")
            )
            ->groupBy('m.mjs_id', 'm.mjs_nama')
            ->get();
    
        $result = $data->map(function ($item) {
            return [
                'mjs_id' => $item->mjs_id,
                'mjs_nama' => $item->mjs_nama,
                'total_user' => (int) $item->total_user,
                'reported_count' => (int) $item->reported_count,
                'status' => $item->reported_count > 0 ? 'reported' : 'pending',
            ];
        });
    
        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }
}