import React, { useState, useEffect } from "react";
import config from "../utils/config";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import CircularProgress from "@mui/material/CircularProgress"; 
import Container from "@mui/material/Container";
import AirIcon from "@mui/icons-material/Air";
import OpacityIcon from "@mui/icons-material/Opacity";

const WeatherHourly = ({ lat, lon }) => {
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {API_BASE_URL} = config;

  useEffect(() => {
    if (lat && lon) {
      fetchHourlyForecast(lat, lon);
    }
  }, [lat, lon]);

  const fetchHourlyForecast = async (lat, lon) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/weather/forecast?lat=${lat}&lon=${lon}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const responseData = await response.json();
      const data = JSON.parse(responseData.data);

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to load hourly forecast.");
      }
      const today = new Date().toISOString().split("T")[0];
      const todayForecast = data.list.filter((item) => {
        return new Date(item.dt * 1000).toISOString().split("T")[0] === today;
      });

      setHourlyForecast(todayForecast.slice(0, 12)); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dt_txt) => {
    const date = new Date(dt_txt);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 text-center">
            <h4 className="text-danger">{error}</h4>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row mt-3">
        <div className="col-12 hourly-forecast-container">
          <h1 className="fs-5 text-center">Today's Hourly Forecast</h1>
          {hourlyForecast.length > 0 ? (
            <div className="row d-flex justify-content-center">
              {hourlyForecast.map((forecast, index) => (
                <div
                  key={index}
                  className="col-6 col-md-2 d-flex flex-column align-items-center p-2 bg-white border hour-card"
                >
                  <h6>{formatTime(forecast.dt_txt)}</h6>
                  <img
                    src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                    alt={forecast.weather[0].description}
                  />
                  <p className="text-capitalize">
                    {forecast.weather[0].description}
                  </p>
                  <p><ThermostatIcon/>{forecast.main.temp}°C</p>
                  <p><OpacityIcon/>{forecast.main.humidity}%</p>
                  <p><AirIcon/>{(forecast.wind.speed * 3.6).toFixed(2)} km/hr</p>
                </div>
              ))}
              </div>
          ) : (
            <p className="text-center">No forecast available for today.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default WeatherHourly;
