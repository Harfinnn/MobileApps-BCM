import { DailyForecast } from '../types/forecast';

export const parseForecast = (owmJson: any): DailyForecast[] => {
  // Pastikan data dari OWM tersedia dan berformat list array
  if (!owmJson || !Array.isArray(owmJson.list)) return [];

  const list = owmJson.list;

  // 1. KELOMPOKKAN DATA PER HARI
  // OWM memberikan list data per 3 jam. Kita harus pisahkan per tanggal.
  const groupedByDay = new Map<string, any[]>();

  list.forEach((item: any) => {
    // dt_txt formatnya: "2026-04-06 12:00:00" -> ambil bagian tanggal saja
    const datePart = item.dt_txt.split(' ')[0];

    if (!groupedByDay.has(datePart)) {
      groupedByDay.set(datePart, []);
    }
    groupedByDay.get(datePart)?.push(item);
  });

  const result: DailyForecast[] = [];

  // 2. FORMAT MENJADI STRUKTUR DAILY FORECAST UI KAMU
  Array.from(groupedByDay.entries()).forEach(([dateStr, dayArray]) => {
    if (!dayArray?.length) return;

    // Untuk "summary" hari tersebut, kita ambil cuaca di jam 12 siang.
    // Jika tidak ada (misal hari ini sudah lewat jam 12), ambil data di index tengah.
    let mid = dayArray.find(h => h.dt_txt.includes('12:00:00'));
    if (!mid) {
      const midIndex = Math.floor(dayArray.length / 2);
      mid = dayArray[midIndex];
    }

    const hourly = [];

    // Looping data jam-jaman dalam hari tersebut
    for (let j = 0; j < dayArray.length; j++) {
      const hour = dayArray[j];

      // Ambil deskripsi dan pastikan huruf depannya kapital
      const conditionDesc = hour.weather?.[0]?.description ?? '';
      const capitalizedCondition =
        conditionDesc.charAt(0).toUpperCase() + conditionDesc.slice(1);

      hourly.push({
        // Ambil jam dari dt_txt, hasilnya: "12:00"
        time: hour.dt_txt.split(' ')[1].slice(0, 5),
        temp: Math.round(hour.main.temp),
        condition: capitalizedCondition,
        humidity: hour.main.humidity,
        // OWM pakai m/s, kita konversi ke km/h agar sama dengan format sebelumnya
        wind: Math.round((hour.wind?.speed ?? 0) * 3.6),
        icon: hour.weather?.[0]?.icon ?? '',
      });
    }

    // 🔥 FORMAT TANGGAL FULL (Sama seperti kodemu sebelumnya)
    const dateObj = new Date(dateStr);
    const formattedDate = dateObj.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

    const summaryDesc = mid.weather?.[0]?.description ?? '';
    const summaryCondition =
      summaryDesc.charAt(0).toUpperCase() + summaryDesc.slice(1);

    result.push({
      day: formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1),
      summary: {
        temp: Math.round(mid.main.temp),
        condition: summaryCondition,
        humidity: mid.main.humidity,
        wind: Math.round((mid.wind?.speed ?? 0) * 3.6),
        icon: mid.weather?.[0]?.icon ?? '',
      },
      hourly,
    });
  });

  // Karena UI kamu awalnya membatasi (Math.min(4, cuaca.length)), kita limit datanya jadi 4 hari saja
  return result.slice(0, 4);
};
