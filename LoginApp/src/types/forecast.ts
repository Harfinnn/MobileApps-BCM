export interface ForecastItem {
  day: string;
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
}

export interface WeatherWarning {
  type: 'safe' | 'alert';
  title: string;
  description: string;
  expires?: Date | null;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
  icon: string;
}

export interface DailyForecast {
  day: string;
  summary: {
    temp: number;
    condition: string;
    humidity: number;
    wind: number;
    icon: string;
  };
  hourly: HourlyForecast[];
}
