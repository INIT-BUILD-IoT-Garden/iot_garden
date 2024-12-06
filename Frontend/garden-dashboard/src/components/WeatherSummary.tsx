import { useEffect, useState } from 'react';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  description: string;
  iconCode: string;
}

export function WeatherSummary() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Sweetwater, FL coordinates
        const lat = 25.7617;
        const lon = -80.3775;
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        
        if (!response.ok) {
          throw new Error('Weather data fetch failed');
        }

        const data = await response.json();
        
        setWeatherData({
          temperature: Math.round(data.main.temp),
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed),
          condition: data.weather[0].main,
          description: data.weather[0].description,
          iconCode: data.weather[0].icon
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Fetch every 5 minutes
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="backdrop-blur-sm bg-white/30 rounded-xl border border-white/20 shadow-lg p-4 h-[200px] w-full">
        <h2 className="text-xl font-semibold mb-4">Weather</h2>
        <p>Loading weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="backdrop-blur-sm bg-white/30 rounded-xl border border-white/20 shadow-lg p-4 h-[200px] w-full">
        <h2 className="text-xl font-semibold mb-4">Weather</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-auto w-full flex flex-col">
      <h2 className="text-lg lg:text-xl font-semibold mb-2">Current Weather in Sweetwater</h2>
      {weatherData && (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4">
              <div className="bg-black/20 rounded-lg p-1 shadow-[0_0_5px_1px_rgba(0,0,0,0.4)]">
                <img 
                  src={`https://openweathermap.org/img/wn/${weatherData.iconCode}@2x.png`}
                  alt={weatherData.description}
                  className="w-12 h-12 lg:w-16 lg:h-16"
                />
              </div>
              <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
            </div>
            <p className="capitalize">{weatherData.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Humidity</p>
              <p className="font-semibold">{weatherData.humidity}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Wind Speed</p>
              <p className="font-semibold">{weatherData.windSpeed} mph</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
