// 使うデータのデータ型だけ定義すればいいっぽいことを言っていた
export type OpenWeatherData = {
  name: string;
  main: {
    feels_like: number;
    humidity: number;
    pressure: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  weather: {
    description: string;
    icon: string;
    id: number;
    main: string;
  }[];
  wind: {
    deg: number;
    speed: number;
  };
};

export type OpenweatherTempScale = 'metric' | 'imperial';

export async function fetchOpenWeatherData(
  city: string,
  tempScale: OpenweatherTempScale
): Promise<OpenWeatherData> {
  // TODO: unitはあとでoptionで指定できるようにする
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${tempScale}&APPID=${process.env.OPEN_WEATHER_API_KEY}`
  );

  // ステータスコードが200-299であればOK
  if (!res.ok) {
    throw new Error('City not found: ' + city);
  }

  const data: OpenWeatherData = await res.json();
  return data;
}
