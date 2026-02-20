import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSun,
} from 'lucide-react-native';

export const getWeatherAnimation = (condition: string) => {
  const lower = condition.toLowerCase();

  if (lower.includes('petir') || lower.includes('storm'))
    return require('../assets/weather/storm.json');

  if (lower.includes('hujan') || lower.includes('rain'))
    return require('../assets/weather/rain.json');

  if (lower.includes('cerah berawan') || lower.includes('partly'))
    return require('../assets/weather/partly_cloudy.json');

  if (lower.includes('berawan') || lower.includes('cloudy'))
    return require('../assets/weather/cloudy.json');

  if (lower.includes('cerah') || lower.includes('sunny'))
    return require('../assets/weather/sunny.json');

  if (lower.includes('panas') || lower.includes('summer'))
    return require('../assets/weather/Summer-Vibes.json');

  // default fallback
  return require('../assets/weather/partly_cloudy.json');
};

export const getWeatherIcon = (condition: string, size = 30) => {
  const lower = condition.toLowerCase();

  if (lower.includes('cerah berawan'))
    return <CloudSun size={size} color="#0ea5e9" />;
  if (lower.includes('cerah')) return <Sun size={size} color="#f59e0b" />;
  if (lower.includes('petir'))
    return <CloudLightning size={size} color="#7c3aed" />;
  if (lower.includes('hujan')) return <CloudRain size={size} color="#0ea5e9" />;

  return <Cloud size={size} color="#64748b" />;
};
