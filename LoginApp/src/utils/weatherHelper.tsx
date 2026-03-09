import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSun,
  CloudSnow,
  CloudFog,
  CloudDrizzle,
  Wind,
  ThermometerSun,
} from 'lucide-react-native';

export const getWeatherAnimation = (condition: string) => {
  const lower = condition?.toLowerCase?.() ?? '';

  // ⛈️ Petir / badai
  if (lower.includes('petir') || lower.includes('storm'))
    return require('../assets/weather/storm.json');

  // 🌧️ Hujan / gerimis
  if (
    lower.includes('hujan') ||
    lower.includes('gerimis') ||
    lower.includes('rain')
  )
    return require('../assets/weather/rain.json');

  // ⛅ Cerah berawan
  if (lower.includes('cerah berawan') || lower.includes('partly'))
    return require('../assets/weather/partly_cloudy.json');

  // ☁️ Berawan
  if (lower.includes('berawan') || lower.includes('cloudy'))
    return require('../assets/weather/cloudy.json');

  // ☀️ Cerah
  if (lower.includes('cerah') || lower.includes('sunny'))
    return require('../assets/weather/sunny.json');

  // 🔥 Panas
  if (lower.includes('panas') || lower.includes('summer'))
    return require('../assets/weather/Summer-Vibes.json');

  return require('../assets/weather/partly_cloudy.json');
};

export const getWeatherIcon = (condition: string, size = 30) => {
  const lower = condition?.toLowerCase?.() ?? '';

  // ⛅ Cerah berawan
  if (lower.includes('cerah berawan'))
    return <CloudSun size={size} color="#0ea5e9" />;

  // ☀️ Cerah
  if (lower.includes('cerah') || lower.includes('sunny'))
    return <Sun size={size} color="#f59e0b" />;

  // ⛈️ Petir
  if (lower.includes('petir') || lower.includes('storm'))
    return <CloudLightning size={size} color="#7c3aed" />;

  // 🌧️ Hujan
  if (lower.includes('hujan') || lower.includes('rain'))
    return <CloudRain size={size} color="#0ea5e9" />;

  // 🌦️ Gerimis
  if (lower.includes('gerimis') || lower.includes('drizzle'))
    return <CloudDrizzle size={size} color="#38bdf8" />;

  // 🌫️ Kabut
  if (lower.includes('kabut') || lower.includes('fog'))
    return <CloudFog size={size} color="#94a3b8" />;

  // ❄️ Salju
  if (lower.includes('salju') || lower.includes('snow'))
    return <CloudSnow size={size} color="#e2e8f0" />;

  // 💨 Angin
  if (lower.includes('angin') || lower.includes('wind'))
    return <Wind size={size} color="#64748b" />;

  // 🔥 Panas
  if (lower.includes('panas') || lower.includes('heat'))
    return <ThermometerSun size={size} color="#f97316" />;

  // ☁️ Default
  return <Cloud size={size} color="#64748b" />;
};
