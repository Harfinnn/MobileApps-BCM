import { DailyForecast } from '../types/forecast';

export const parseForecast = (bmkgJson: any): DailyForecast[] => {
  const cuaca = bmkgJson?.data?.[0]?.cuaca;
  if (!cuaca || !Array.isArray(cuaca)) return [];

  const result: DailyForecast[] = [];

  for (let i = 0; i < Math.min(4, cuaca.length); i++) {
    const dayArray = cuaca[i];
    if (!dayArray?.length) continue;

    const midIndex = Math.floor(dayArray.length / 2);
    const mid = dayArray[midIndex];

    const hourly = [];

    for (let j = 0; j < dayArray.length; j++) {
      const hour = dayArray[j];

      hourly.push({
        time: hour.local_datetime?.split(' ')[1]?.slice(0, 5) ?? '',
        temp: hour.t,
        condition: hour.weather_desc,
        humidity: hour.hu,
        wind: hour.ws,
        icon: hour.image,
      });
    }

    // 🔥 FORMAT TANGGAL FULL
    const dateObj = new Date(mid.local_datetime);

    const formattedDate = dateObj.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

    result.push({
      day: formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1),
      summary: {
        temp: Math.round(mid.t),
        condition: mid.weather_desc,
        humidity: mid.hu,
        wind: Math.round(mid.ws),
        icon: mid.image,
      },
      hourly,
    });
  }

  return result;
};
