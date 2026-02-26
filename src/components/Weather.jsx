import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'
import humidity_icon from '../assets/humidity.png'

const Weather = () => {
    const inputRef=useRef()
    const [forecast, setForecast] = useState([]);
    const [weatherData,setWeatherData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const allIcons={
      "01d": clear_icon,
      "01n":clear_icon,
      "02d":cloud_icon,
      "02n":cloud_icon,
      "03d":cloud_icon,
      "03n":cloud_icon,
      "04d":drizzle_icon,
      "04n":drizzle_icon,
      "09d":rain_icon,
      "09n":rain_icon,
      "10d":rain_icon,
      "10n":rain_icon,
      "13d":snow_icon,
      "13n":snow_icon,
    }
    
    const fetchForecast = async (city) => {
  try {
    const res = await fetch(`http://localhost:5000/forecast?city=${city}`);
    const data = await res.json();

    if (res.ok) {
      setForecast(data);
    }
  } catch (err) {
    console.log("Forecast error:", err);
  }
};

    const search = async (city) => {
    if (city === "") {
        setError("Please enter a city name");
        return;
    }

    try {
        setLoading(true);
        setError("");

        const url = `http://localhost:5000/weather?city=${city}`;
        const response = await fetch(url);
        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);
        const data = await response.json();
        console.log("Data received:", data);

        if (!response.ok) {
            setError(data.error || "City not found");
            setWeatherData(false);
            setLoading(false);
            return;
        }

        const icon = allIcons[data.icon] || clear_icon;

       setWeatherData({
       temperature: data.temperature,
       humidity: data.humidity,
       windSpeed: data.windSpeed,
       location: data.location,
       icon: data.icon,
       condition: data.condition
       });    
        
       await fetchForecast(city); 
        setLoading(false);

    } catch (error) {
        setError("Something went wrong");
        setWeatherData(false);
        setLoading(false);
    }
};

    useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetch(`http://localhost:5000/weather-by-coords?lat=${latitude}&lon=${longitude}`)
        .then(res => res.json())
        .then(data => {
          setWeatherData(data);
        });
    },
    () => {
      search("London"); 
    }
  );
}, []);

  return (
    <div 
    key={weatherData?.location}
    className={`weather fade-in ${
    weatherData?.condition?.toLowerCase()
  }`}
   >
    {weatherData?.condition === "Rain" && (
    <div className="rain-overlay"></div>
  )}

    <div className='search-bar'>
    <input 
    ref={inputRef} 
    type="text" 
    placeholder='Search'
    onKeyDown={(e) => {
        if (e.key === "Enter") {
        search(inputRef.current.value);
        }
  }}
/>
        <img 
            src={search_icon} 
            alt="" 
            onClick={() => search(inputRef.current.value)} 
        />
    </div>

    {loading && <p className="loading">Loading...</p>}
    {error && <p className="error">{error}</p>}

    {weatherData ? <>
        <img src={weatherData.icon} alt='' className='weather-icon'/>

        <p className='temperature'>{weatherData.temperature}°c</p>
        <p className='location'>{weatherData.location}</p>

        <div className='weather-data'>
            <div className="col">
                <img src={humidity_icon} alt=''/>
                <div>
                    <p>{weatherData.humidity} %</p>
                    <span>Humidity</span>
                </div>
            </div>

            <div className="col">
                <img src={wind_icon} alt=''/>
                <div>
                <p>{weatherData.windSpeed} km/h</p>
                <span>Wind Speed</span>
                </div>
            </div>
        </div>
        {forecast.length > 0 && (
  <div className="forecast">
    <h3>5-Day Forecast</h3>
    <div className="forecast-row">
      {forecast.map((day, index) => (
        <div key={index} className="forecast-card">
          <p>
            {new Date(day.date).toLocaleDateString("en-IN", {
              weekday: "short"
            })}
          </p>

          <img
            src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
            alt=""
          />

          <p>{Math.round(day.temperature)}°C</p>
        </div>
      ))}
    </div>
  </div>
)}
    </> : null}

</div>
  )
}

export default Weather
