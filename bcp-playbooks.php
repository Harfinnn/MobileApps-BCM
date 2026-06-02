<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

/*
|--------------------------------------------------------------------------
| API URL
|--------------------------------------------------------------------------
*/

$apiUrl = "https://lensasyariah.com/simple_app/api/public/api/mobile-playbooks";

/*
|--------------------------------------------------------------------------
| CURL REQUEST
|--------------------------------------------------------------------------
*/

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => $apiUrl,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_SSL_VERIFYPEER => false,
  CURLOPT_SSL_VERIFYHOST => false,
  CURLOPT_FOLLOWLOCATION => true,
]);

$response = curl_exec($curl);

if (curl_errno($curl)) {
  die("CURL Error: " . curl_error($curl));
}

curl_close($curl);

/*
|--------------------------------------------------------------------------
| JSON DECODE
|--------------------------------------------------------------------------
*/

$data = json_decode($response, true);

if (!$data) {
  die("
        <h2>API Tidak Bisa Dibaca</h2>
        <pre>$response</pre>
    ");
}

$books = $data['data'] ?? [];

/*
|--------------------------------------------------------------------------
| VIEW MODE
|--------------------------------------------------------------------------
*/

$isView = isset($_GET['url']);

$url = $_GET['url'] ?? '';
$title = $_GET['title'] ?? 'Playbook';

?>

<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>
    <?= $isView ? htmlspecialchars($title) : 'BCP Playbooks' ?>
  </title>

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
      background: #F8FAFC;
      color: #0F172A;
    }

    /* =========================
   CONTAINER
========================= */

    .container {
      max-width: 1200px;
      margin: auto;
      padding: 40px 24px;
    }

    /* =========================
   HEADER
========================= */

    .top-header {
      margin-bottom: 35px;
    }

    .live-tag {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1px;
      color: #64748B;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #0EA5E9;
    }

    h1 {
      font-size: 48px;
      line-height: 54px;
      font-weight: 800;
      margin-bottom: 14px;
    }

    .top-header p {
      color: #64748B;
      line-height: 24px;
      max-width: 500px;
    }

    /* =========================
   SEARCH
========================= */

    .search-box {
      margin-bottom: 30px;
    }

    .search-box input {
      width: 100%;
      padding: 16px 18px;
      border-radius: 16px;
      border: 1px solid #E2E8F0;
      background: #fff;
      font-size: 14px;
      outline: none;
    }

    .search-box input:focus {
      border-color: #0EA5E9;
    }

    /* =========================
   GRID
========================= */

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
    }

    /* =========================
   CARD
========================= */

    .card {
      background: #fff;
      border-radius: 24px;
      padding: 14px;
      text-decoration: none;
      color: inherit;
      border: 1px solid #F1F5F9;
      transition: 0.25s;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    }

    .image-wrapper {
      position: relative;
      width: 100%;
      height: 160px;
      border-radius: 18px;
      overflow: hidden;
      background: #F1F5F9;
      margin-bottom: 14px;
    }

    .image-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(15, 23, 42, 0.8);
      color: #fff;
      font-size: 10px;
      font-weight: 800;
      padding: 5px 8px;
      border-radius: 6px;
    }

    .book-title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .open-link {
      color: #0EA5E9;
      font-size: 13px;
      font-weight: 600;
    }

    /* =========================
   EMPTY
========================= */

    .empty {
      text-align: center;
      padding: 50px;
      color: #64748B;
    }

    /* =========================
   VIEW PAGE
========================= */

    .viewer-header {
      height: 64px;
      background: #fff;
      border-bottom: 1px solid #E2E8F0;
      display: flex;
      align-items: center;
      padding: 0 20px;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .back-btn {
      text-decoration: none;
      color: #0EA5E9;
      font-weight: 700;
      margin-right: 20px;
    }

    .viewer-title {
      font-size: 15px;
      font-weight: 700;
    }

    iframe {
      width: 100%;
      height: calc(100vh - 64px);
      border: none;
      background: #fff;
    }

    /* =========================
   MOBILE
========================= */

    @media(max-width:768px) {

      h1 {
        font-size: 36px;
        line-height: 42px;
      }

      .container {
        padding: 24px 18px;
      }

    }
  </style>
</head>

<body>

  <?php if ($isView): ?>

    <!-- =========================
     DETAIL VIEW
========================= -->

    <div class="viewer-header">

      <a href="javascript:history.back()" class="back-btn">
        ← Kembali
      </a>

      <div class="viewer-title">
        <?= htmlspecialchars($title) ?>
      </div>

    </div>

    <iframe src="<?= htmlspecialchars($url) ?>"></iframe>

  <?php else: ?>

    <!-- =========================
     LIST PLAYBOOK
========================= -->

    <div class="container">

      <div class="top-header">

        <div class="live-tag">
          <span class="dot"></span>
          INTERNAL REPOSITORY
        </div>

        <h1>
          BCP<br>
          Playbooks
        </h1>

        <p>
          Pilih modul panduan untuk protokol keberlanjutan bisnis.
        </p>

      </div>

      <div class="search-box">
        <input type="text" id="searchInput" placeholder="Cari Playbook...">
      </div>

      <?php if (count($books) > 0): ?>

        <div class="grid" id="bookGrid">

          <?php foreach ($books as $book): ?>

            <a class="card" href="?url=<?= urlencode($book['url']) ?>&title=<?= urlencode($book['title']) ?>">

              <div class="image-wrapper">

                <img src="<?= !empty($book['thumbnail'])
                  ? $book['thumbnail']
                  : 'https://via.placeholder.com/300x200?text=No+Image'
                  ?>" alt="<?= htmlspecialchars($book['title']) ?>">

                <div class="badge">
                  BCP
                </div>

              </div>

              <div class="book-title">
                <?= htmlspecialchars($book['title']) ?>
              </div>

              <div class="open-link">
                Buka Panduan →
              </div>

            </a>

          <?php endforeach; ?>

        </div>

      <?php else: ?>

        <div class="empty">
          Playbook tidak ditemukan
        </div>

      <?php endif; ?>

    </div>

    <script>

      const searchInput = document.getElementById('searchInput');

      const cards = document.querySelectorAll('.card');

      searchInput.addEventListener('keyup', function () {

        const keyword = this.value.toLowerCase();

        cards.forEach(card => {

          const title = card
            .querySelector('.book-title')
            .innerText
            .toLowerCase();

          if (title.includes(keyword)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }

        });

      });

    </script>

  <?php endif; ?>

</body>

</html>