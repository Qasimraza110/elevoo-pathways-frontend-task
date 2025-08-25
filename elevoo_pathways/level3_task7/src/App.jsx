import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false); 

  // Fetch weather data
  const getWeather = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const res = await axios.post("https://dazzling-upliftment-production.up.railway.app/api/weather", { city });
      setWeather(res.data);
      fetchHistory();
    } catch (err) {
      alert("City not found");
    }
    setLoading(false);
  };

  // Fetch recent search history
  const fetchHistory = async () => {
    const res = await axios.get("https://dazzling-upliftment-production.up.railway.app/api/history");
    setHistory(res.data);
  };

  // Delete a search from history
  const deleteHistory = async (id) => {
    try {
      await axios.delete(`https://dazzling-upliftment-production.up.railway.app/api/history/${id}`);
      setHistory(history.filter((h) => h._id !== id)); 
      alert("Search deleted successfully");
    } catch (err) {
      alert("Failed to delete search");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images.jpeg')" }}
    >
      <div className="p-4 sm:p-8 w-full max-w-lg bg-white bg-opacity-80 rounded-2xl shadow-2xl space-y-4 sm:space-y-8 backdrop-blur-sm mx-2">
        <h1 className="text-lg sm:text-3xl font-extrabold text-center text-blue-700 mb-2 sm:mb-4 tracking-wide">
          🌦 Weather App
        </h1>

        {/* Input */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            className="border-2 border-blue-300 p-2 sm:p-3 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base"
            type="text"
            value={city}
            placeholder="Enter city..."
            onChange={(e) => setCity(e.target.value)}
            disabled={loading}
          />
          <button
            onClick={getWeather}
            className={`bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Weather Data */}
        {weather && !loading && (
          <div className="bg-blue-50 p-4 sm:p-6 rounded-xl shadow flex flex-col items-center space-y-2 border border-blue-200">
            <h2 className="text-lg sm:text-2xl font-bold text-blue-800">{weather.name}</h2>
            <p className="text-base sm:text-lg">
              🌡 <span className="font-semibold">{weather.main.temp}°C</span>
            </p>
            <p className="capitalize">☁ {weather.weather[0].description}</p>
            <p>
              💧 Humidity: <span className="font-semibold">{weather.main.humidity}%</span>
            </p>
          </div>
        )}

        {/* Search History */}
        <div>
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <h3 className="font-bold text-blue-700 text-base sm:text-lg">Recent Searches</h3>
            <span className="text-xs text-gray-400">Click 🗑️ to delete</span>
          </div>
          <ul className="space-y-1">
            {history.map((h) => (
              <li
                key={h._id}
                className="flex items-center justify-between bg-blue-50 rounded px-2 sm:px-3 py-1 hover:bg-blue-100 transition"
              >
                <div
                  className="cursor-pointer text-blue-600 hover:underline hover:text-blue-800 transition text-sm sm:text-base"
                  onClick={() => setCity(h.city)}
                  title="Search this city"
                >
                  <span className="font-medium">{h.city}</span>
                  <span className="text-gray-500 text-xs sm:text-sm ml-1 sm:ml-2">
                    ({new Date(h.date).toLocaleString()})
                  </span>
                </div>
                <button
                  className="ml-2 text-red-500 hover:text-red-700 transition text-base sm:text-lg"
                  title="Delete"
                  onClick={() => deleteHistory(h._id)}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;