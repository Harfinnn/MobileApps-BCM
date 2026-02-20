<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DataBencanaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('data_bencana')->truncate();

        DB::table('data_bencana')->insert([

            ['dab_gambar' => '2509302250121575.png', 'dab_sort' => 1, 'dab_head_id' => 1, 'dab_status' => 0],
            ['dab_gambar' => '25093022514428279.jpg', 'dab_sort' => 1, 'dab_head_id' => 1, 'dab_status' => 0],
            ['dab_gambar' => '25093022582054367.jpg', 'dab_sort' => 1, 'dab_head_id' => 2, 'dab_status' => 0],
            ['dab_gambar' => 'gempa1.jpg', 'dab_sort' => 1, 'dab_head_id' => 1, 'dab_status' => 1],
            ['dab_gambar' => '25093023012488894.jpg', 'dab_sort' => 1, 'dab_head_id' => 2, 'dab_status' => 1],
            ['dab_gambar' => '25093023133778916.jpg', 'dab_sort' => 1, 'dab_head_id' => 16, 'dab_status' => 1],
            ['dab_gambar' => '25093023134688791.jpg', 'dab_sort' => 1, 'dab_head_id' => 3, 'dab_status' => 0],
            ['dab_gambar' => '25093023331076078.jpg', 'dab_sort' => 1, 'dab_head_id' => 4, 'dab_status' => 1],
            ['dab_gambar' => '25093023331618991.jpg', 'dab_sort' => 1, 'dab_head_id' => 5, 'dab_status' => 1],
            ['dab_gambar' => '25093023454760722.jpg', 'dab_sort' => 1, 'dab_head_id' => 6, 'dab_status' => 1],
            ['dab_gambar' => '25093023455520787.jpg', 'dab_sort' => 1, 'dab_head_id' => 7, 'dab_status' => 1],
            ['dab_gambar' => '25093023494777991.jpg', 'dab_sort' => 1, 'dab_head_id' => 3, 'dab_status' => 1],
            ['dab_gambar' => '25100110540337953.jpg', 'dab_sort' => 1, 'dab_head_id' => 9, 'dab_status' => 0],
            ['dab_gambar' => '25100111024184669.jpg', 'dab_sort' => 2, 'dab_head_id' => 9, 'dab_status' => 1],
            ['dab_gambar' => '25100111374262768.jpg', 'dab_sort' => 1, 'dab_head_id' => 10, 'dab_status' => 1],
            ['dab_gambar' => '25100112013178186.jpg', 'dab_sort' => 2, 'dab_head_id' => 10, 'dab_status' => 1],
            ['dab_gambar' => '25100112021347335.jpg', 'dab_sort' => 3, 'dab_head_id' => 10, 'dab_status' => 1],
            ['dab_gambar' => '25100119352123182.jpg', 'dab_sort' => 2, 'dab_head_id' => 1, 'dab_status' => 1],
            ['dab_gambar' => '25100120035951782.jpg', 'dab_sort' => 3, 'dab_head_id' => 1, 'dab_status' => 1],
            ['dab_gambar' => '25100120200946574.jpg', 'dab_sort' => 4, 'dab_head_id' => 1, 'dab_status' => 1],
            ['dab_gambar' => '25100209510897661.jpg', 'dab_sort' => 1, 'dab_head_id' => 11, 'dab_status' => 1],
            ['dab_gambar' => '25100209523982109.jpg', 'dab_sort' => 2, 'dab_head_id' => 11, 'dab_status' => 1],
            ['dab_gambar' => '25100210013587204.jpg', 'dab_sort' => 3, 'dab_head_id' => 11, 'dab_status' => 1],
            ['dab_gambar' => '25100210040672461.jpg', 'dab_sort' => 4, 'dab_head_id' => 11, 'dab_status' => 1],
            ['dab_gambar' => '25100216171569206.jpg', 'dab_sort' => 1, 'dab_head_id' => 12, 'dab_status' => 1],
            ['dab_gambar' => '25100221544414538.jpg', 'dab_sort' => 2, 'dab_head_id' => 2, 'dab_status' => 1],
            ['dab_gambar' => '25100221545237403.jpg', 'dab_sort' => 3, 'dab_head_id' => 2, 'dab_status' => 1],
            ['dab_gambar' => '25100222041790339.jpg', 'dab_sort' => 1, 'dab_head_id' => 13, 'dab_status' => 0],
            ['dab_gambar' => '25100222062891196.jpg', 'dab_sort' => 1, 'dab_head_id' => 13, 'dab_status' => 1],
            ['dab_gambar' => '25100222271097311.jpg', 'dab_sort' => 4, 'dab_head_id' => 2, 'dab_status' => 1],
            ['dab_gambar' => '25100222524839093.jpg', 'dab_sort' => 5, 'dab_head_id' => 2, 'dab_status' => 1],
            ['dab_gambar' => '25100222525561454.jpg', 'dab_sort' => 6, 'dab_head_id' => 2, 'dab_status' => 1],
            ['dab_gambar' => '251003112253478.jpg', 'dab_sort' => 2, 'dab_head_id' => 16, 'dab_status' => 1],
            ['dab_gambar' => '2510031146108005.jpg', 'dab_sort' => 3, 'dab_head_id' => 16, 'dab_status' => 1],
            ['dab_gambar' => '25100316252859036.jpg', 'dab_sort' => 2, 'dab_head_id' => 3, 'dab_status' => 1],
            ['dab_gambar' => '25100316253597795.jpg', 'dab_sort' => 3, 'dab_head_id' => 3, 'dab_status' => 1],
            ['dab_gambar' => '25100317065938244.jpg', 'dab_sort' => 4, 'dab_head_id' => 3, 'dab_status' => 1],
            ['dab_gambar' => '25100317072319997.jpg', 'dab_sort' => 5, 'dab_head_id' => 3, 'dab_status' => 1],
            ['dab_gambar' => '2510031714157331.jpg', 'dab_sort' => 6, 'dab_head_id' => 3, 'dab_status' => 0],
            ['dab_gambar' => '25100317254332038.jpg', 'dab_sort' => 7, 'dab_head_id' => 3, 'dab_status' => 1],
            ['dab_gambar' => '25100409313770138.jpg', 'dab_sort' => 2, 'dab_head_id' => 4, 'dab_status' => 1],
            ['dab_gambar' => '25100409314281212.jpg', 'dab_sort' => 3, 'dab_head_id' => 4, 'dab_status' => 0],
            ['dab_gambar' => '25100409314828817.jpg', 'dab_sort' => 4, 'dab_head_id' => 4, 'dab_status' => 0],
            ['dab_gambar' => '25100409341840561.jpg', 'dab_sort' => 5, 'dab_head_id' => 4, 'dab_status' => 0],
            ['dab_gambar' => '25100409370857225.jpg', 'dab_sort' => 3, 'dab_head_id' => 4, 'dab_status' => 1],
            ['dab_gambar' => '25100409371494956.jpg', 'dab_sort' => 4, 'dab_head_id' => 4, 'dab_status' => 1],
            ['dab_gambar' => '25100410391094077.jpg', 'dab_sort' => 5, 'dab_head_id' => 4, 'dab_status' => 1],
            ['dab_gambar' => '25100410485660840.jpg', 'dab_sort' => 6, 'dab_head_id' => 4, 'dab_status' => 0],
            ['dab_gambar' => '25100410502572051.jpg', 'dab_sort' => 7, 'dab_head_id' => 4, 'dab_status' => 0],
            ['dab_gambar' => '25100410522949174.jpg', 'dab_sort' => 6, 'dab_head_id' => 4, 'dab_status' => 1],
            ['dab_gambar' => '25100411263644141.jpg', 'dab_sort' => 2, 'dab_head_id' => 5, 'dab_status' => 1],
            ['dab_gambar' => '25100411264760084.jpg', 'dab_sort' => 3, 'dab_head_id' => 5, 'dab_status' => 0],
            ['dab_gambar' => '25100411284063613.jpg', 'dab_sort' => 4, 'dab_head_id' => 5, 'dab_status' => 1],
            ['dab_gambar' => '2510041503059455.jpg', 'dab_sort' => 5, 'dab_head_id' => 5, 'dab_status' => 1],
            ['dab_gambar' => '25100415031330338.jpg', 'dab_sort' => 6, 'dab_head_id' => 5, 'dab_status' => 1],
            ['dab_gambar' => '25100415050866743.jpg', 'dab_sort' => 7, 'dab_head_id' => 5, 'dab_status' => 1],
            ['dab_gambar' => '25100420154114722.jpg', 'dab_sort' => 2, 'dab_head_id' => 6, 'dab_status' => 1],
            ['dab_gambar' => '25100420155268747.jpg', 'dab_sort' => 3, 'dab_head_id' => 6, 'dab_status' => 1],
            ['dab_gambar' => '25100420160049083.jpg', 'dab_sort' => 4, 'dab_head_id' => 6, 'dab_status' => 1],
            ['dab_gambar' => '25100420160795515.jpg', 'dab_sort' => 5, 'dab_head_id' => 6, 'dab_status' => 1],
            ['dab_gambar' => '25100421270342892.jpg', 'dab_sort' => 2, 'dab_head_id' => 7, 'dab_status' => 0],
            ['dab_gambar' => 'utilitas2.jpg', 'dab_sort' => 3, 'dab_head_id' => 7, 'dab_status' => 1],
            ['dab_gambar' => '25100421272045659.jpg', 'dab_sort' => 5, 'dab_head_id' => 7, 'dab_status' => 1],
            ['dab_gambar' => '25100421361354546.jpg', 'dab_sort' => 6, 'dab_head_id' => 7, 'dab_status' => 1],
            ['dab_gambar' => '25100421395719747.jpg', 'dab_sort' => 4, 'dab_head_id' => 7, 'dab_status' => 1],
            ['dab_gambar' => '25100421582571445.jpg', 'dab_sort' => 3, 'dab_head_id' => 9, 'dab_status' => 1],
            ['dab_gambar' => '25100421591151840.jpg', 'dab_sort' => 4, 'dab_head_id' => 9, 'dab_status' => 1],
            ['dab_gambar' => '25100422012736202.jpg', 'dab_sort' => 5, 'dab_head_id' => 9, 'dab_status' => 1],
            ['dab_gambar' => '25100422013582920.jpg', 'dab_sort' => 6, 'dab_head_id' => 9, 'dab_status' => 1],
            ['dab_gambar' => '25100422014130483.jpg', 'dab_sort' => 7, 'dab_head_id' => 9, 'dab_status' => 1],

        ]);
    }
}
