export interface IncidentItem {
  iid_id: number;
  iid_insiden: string;
  iid_impact: string | null;
  iid_eksternal?: number;
  iid_tgl_mulai_kejadian?: string;
  iid_jam_mulai?: string;
  iid_tgl_selesai_kejadian?: string;
  iid_jam_selesai?: string;
  iid_kronologi?: string;
  iid_rca?: string;
  iid_keterangan_temporary?: string;
  iid_keterangan_permanent_solution?: string;
  iid_durasi_insiden?: string;
  dbmak_nama?: string;
}

export function formatTanggal(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function decodeHtmlText(html?: string | null): string {
  if (!html) return '';

  let text = html
    // <br>, <br/>, <br /> jadi baris baru
    .replace(/<br\s*\/?>/gi, '\n')
    // tag HTML lain dibuang (kalau ada <p>, <b>, dst)
    .replace(/<\/?[^>]+(>|$)/g, '');

  // decode HTML entities yang umum
  const entities: Record<string, string> = {
    '&#039;': "'",
    '&#39;': "'",
    '&quot;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&nbsp;': ' ',
  };

  Object.keys(entities).forEach(key => {
    text = text.split(key).join(entities[key]);
  });

  // decode numeric entity sisanya, misal &#123;
  text = text.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(Number(code)),
  );

  return text.trim();
}
