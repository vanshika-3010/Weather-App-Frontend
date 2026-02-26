import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());

const API_KEY = process.env.API_KEY;
const PORT = process.env.PORT || 5000;

app.get("/weather", async (req, res) => {
  try {
    const city = req.query.city;

    if (!city) {
      return res.status(400).json({ error: "City is required" });
    }
   
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );

    const data = response.data;

    res.json({
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      location: data.name,
      icon: data.weather[0].icon,
      condition: data.weather[0].main
    });

  } catch (error) {
    res.status(400).json({ error: "City not found" });
  }
});


app.get("/forecast", async (req, res) => {
  try {
    const city = req.query.city;

     if (!city) {
      return res.status(400).json({ error: "City is required" });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );

    const forecastData = response.data.list;

    const dailyForecast = forecastData.filter((item, index) => index % 8 === 0)
      .slice(0, 5)
      .map(item => ({
        date: item.dt_txt,
        temperature: item.main.temp,
        icon: item.weather[0].icon
      }));

    res.json(dailyForecast);

  } catch (error) {
    res.status(400).json({ error: "Forecast not available" });
  }
});

app.get("/weather-by-coords", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        error: "Latitude and Longitude required"
      });
    }
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    const data = response.data;

    res.json({
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      location: data.name,
      icon: data.weather[0].icon,
      condition: data.weather[0].main
    });

  } catch (error) {
    res.status(400).json({ error: "Location weather not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});