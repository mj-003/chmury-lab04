import React, { useState } from "react";
import {
  WiDaySunny,
  WiRain,
  WiSnow,
  WiCloudy,
  WiThunderstorm,
  WiFog,
  WiSprinkle,
} from "react-icons/wi";
import {
  MapPin,
  Search,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Gauge,
} from "lucide-react";

const weatherConditions = {
  Thunderstorm: {
    bgColor: "bg-slate-800",
    accentColor: "bg-purple-600",
    title: "Burza",
    subtitle: "Uważaj na błyskawice!",
    icon: (
      <WiThunderstorm size={120} className="text-purple-400 drop-shadow-lg" />
    ),
    textColor: "text-white",
  },
  Drizzle: {
    bgColor: "bg-blue-600",
    accentColor: "bg-blue-500",
    title: "Mżawka",
    subtitle: "Lekkie opady",
    icon: <WiSprinkle size={120} className="text-blue-200 drop-shadow-lg" />,
    textColor: "text-white",
  },
  Rain: {
    bgColor: "bg-blue-700",
    accentColor: "bg-blue-600",
    title: "Deszcz",
    subtitle: "Weź parasol",
    icon: <WiRain size={120} className="text-blue-200 drop-shadow-lg" />,
    textColor: "text-white",
  },
  Snow: {
    bgColor: "bg-blue-100",
    accentColor: "bg-blue-200",
    title: "Śnieg",
    subtitle: "Ubierz się ciepło",
    icon: <WiSnow size={120} className="text-blue-600 drop-shadow-lg" />,
    textColor: "text-slate-800",
  },
  Clear: {
    bgColor: "bg-amber-400",
    accentColor: "bg-yellow-400",
    title: "Słonecznie",
    subtitle: "Idealna pogoda!",
    icon: <WiDaySunny size={120} className="text-orange-600 drop-shadow-lg" />,
    textColor: "text-slate-800",
  },
  Clouds: {
    bgColor: "bg-gray-500",
    accentColor: "bg-gray-400",
    title: "Pochmurno",
    subtitle: "Może przejaśni się później",
    icon: <WiCloudy size={120} className="text-gray-200 drop-shadow-lg" />,
    textColor: "text-white",
  },
  Mist: {
    bgColor: "bg-emerald-400",
    accentColor: "bg-teal-400",
    title: "Mgła",
    subtitle: "Uważaj na drodze",
    icon: <WiFog size={120} className="text-emerald-700 drop-shadow-lg" />,
    textColor: "text-slate-800",
  },
  Fog: {
    bgColor: "bg-gray-400",
    accentColor: "bg-gray-300",
    title: "Mgła",
    subtitle: "Ograniczona widoczność",
    icon: <WiFog size={120} className="text-gray-700 drop-shadow-lg" />,
    textColor: "text-slate-800",
  },
  Haze: {
    bgColor: "bg-yellow-200",
    accentColor: "bg-yellow-300",
    title: "Zamglenie",
    subtitle: "Mglista atmosfera",
    icon: <WiFog size={120} className="text-yellow-700 drop-shadow-lg" />,
    textColor: "text-slate-800",
  },
};

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;

  const getWeather = async () => {
    if (!city.trim()) {
      setError("Podaj nazwę miasta.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${apiKey}&units=metric&lang=pl`
      );

      if (!response.ok) {
        throw new Error(`Błąd HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data.weather || data.weather.length === 0) {
        throw new Error("Nie udało się pobrać danych pogodowych");
      }

      setWeatherData(data);
    } catch (error) {
      console.error("Błąd:", error);
      setError(error.message || "Wystąpił błąd podczas pobierania danych");
    } finally {
      setLoading(false);
    }
  };

  const getLocationWeather = () => {
    if (!navigator.geolocation) {
      setError("Twoja przeglądarka nie wspiera geolokalizacji");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=pl`
          );

          if (!response.ok) {
            throw new Error(`Błąd HTTP: ${response.status}`);
          }

          const data = await response.json();
          setWeatherData(data);
        } catch (error) {
          setError("Błąd podczas pobierania danych pogodowych");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setError("Zezwól na dostęp do lokalizacji zeby pobrać pogodę.");
        } else {
          setError(`Błąd geolokalizacji: ${error.message}`);
        }
      }
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      getWeather();
    }
  };

  const condition = weatherData
    ? weatherConditions[weatherData.weather[0].main] || weatherConditions.Clear
    : weatherConditions.Clear;

  return (
    <div
      className={`min-h-screen ${condition.bgColor} transition-all duration-1000 ease-in-out flex items-center justify-center p-4 relative overflow-hidden`}
    >
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/3 rounded-full blur-lg"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className={`text-4xl font-bold ${condition.textColor} mb-2 drop-shadow-lg`}
          >
            Prognoza Pogody
          </h1>
          <p className={`${condition.textColor} opacity-80 text-lg`}>
            Sprawdź aktualną pogodę w dowolnym mieście
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-6 mb-6 shadow-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Wpisz nazwę miasta..."
                className="w-full px-4 py-3 pl-12 rounded-2xl bg-white/80 backdrop-blur border-0 focus:outline-none focus:ring-4 focus:ring-white/40 focus:bg-white/90 text-gray-800 placeholder-gray-500 text-lg transition-all shadow-lg"
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={getWeather}
                disabled={loading}
                className="flex-1 bg-white/90 hover:bg-white text-gray-800 font-semibold py-3 px-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-800 border-t-transparent"></div>
                ) : (
                  <>
                    <Search size={18} />
                    Sprawdź
                  </>
                )}
              </button>

              <button
                onClick={getLocationWeather}
                disabled={loading}
                className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-300 hover:scale-105 border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                title="Użyj mojej lokalizacji"
              >
                <MapPin size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-600 backdrop-blur text-white p-4 rounded-2xl mb-6 shadow-xl border border-red-400/30 relative">
            <p className="text-center font-medium">{error}</p>
          </div>
        )}

        {/* Weather Display */}
        {weatherData && (
          <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 text-center hover:bg-white/20 transition-all duration-300">
            {/* Location */}
            <div className="mb-6">
              <h2 className={`text-2xl font-bold ${condition.textColor} mb-1`}>
                {weatherData.name}, {weatherData.sys.country}
              </h2>
              <p
                className={`${condition.textColor} opacity-80 capitalize text-lg`}
              >
                {weatherData.weather[0].description}
              </p>
            </div>

            {/* Weather Icon */}
            <div className="mb-6 flex justify-center">{condition.icon}</div>

            {/* Temperature */}
            <div className="mb-6">
              <div className={`text-6xl font-bold ${condition.textColor} mb-2`}>
                {Math.round(weatherData.main.temp)}°C
              </div>
              <div className={`${condition.textColor} opacity-80 text-lg`}>
                Odczuwalna: {Math.round(weatherData.main.feels_like)}°C
              </div>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-lg">
                <div className="flex items-center justify-center mb-2">
                  <Droplets
                    className={`${condition.textColor} opacity-80`}
                    size={24}
                  />
                </div>
                <div
                  className={`${condition.textColor} opacity-80 text-sm mb-1`}
                >
                  Wilgotność
                </div>
                <div className={`${condition.textColor} text-xl font-semibold`}>
                  {weatherData.main.humidity}%
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-lg">
                <div className="flex items-center justify-center mb-2">
                  <Wind
                    className={`${condition.textColor} opacity-80`}
                    size={24}
                  />
                </div>
                <div
                  className={`${condition.textColor} opacity-80 text-sm mb-1`}
                >
                  Wiatr
                </div>
                <div className={`${condition.textColor} text-xl font-semibold`}>
                  {Math.round(weatherData.wind.speed)} m/s
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-lg">
                <div className="flex items-center justify-center mb-2">
                  <Gauge
                    className={`${condition.textColor} opacity-80`}
                    size={24}
                  />
                </div>
                <div
                  className={`${condition.textColor} opacity-80 text-sm mb-1`}
                >
                  Ciśnienie
                </div>
                <div className={`${condition.textColor} text-xl font-semibold`}>
                  {weatherData.main.pressure} hPa
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-lg">
                <div className="flex items-center justify-center mb-2">
                  <Eye
                    className={`${condition.textColor} opacity-80`}
                    size={24}
                  />
                </div>
                <div
                  className={`${condition.textColor} opacity-80 text-sm mb-1`}
                >
                  Widoczność
                </div>
                <div className={`${condition.textColor} text-xl font-semibold`}>
                  {weatherData.visibility
                    ? Math.round(weatherData.visibility / 1000)
                    : "N/A"}{" "}
                  km
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-6">
          <p className={`${condition.textColor} opacity-60 text-sm`}>
            Powered by OpenWeatherMap
          </p>
        </div>
      </div>
    </div>
  );
}

export default WeatherApp;
