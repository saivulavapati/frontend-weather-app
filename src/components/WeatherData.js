import React, { useState, useEffect } from "react";
import AirIcon from "@mui/icons-material/Air";
import OpacityIcon from "@mui/icons-material/Opacity";
import SpeedIcon from "@mui/icons-material/Speed";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudCircleIcon from "@mui/icons-material/CloudCircle";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import SolarPowerIcon from "@mui/icons-material/SolarPower";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CircularProgress from "@mui/material/CircularProgress"; 
import Container from "@mui/material/Container";
import config from "../utils/config";
import WeatherHourly from "./WeatherHourly";
import { formatDate,formatTime } from "../utils/config";


const WeatherData = ({ city }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isFavourite,setIsFavourite] = useState(false)
  const [showHourly,setShowHourly] = useState(false)
  const [loading,setLoading] = useState(true)

  const { API_BASE_URL } = config;

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true)
      try {
        if (!city.trim()) {
          setError("City name cannot be empty.");
          return;
        }
        const response = await fetch(`${API_BASE_URL}/weather?city=${city}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Something went wrong. Please try again."
          );
        }
        const responseData = await response.json();
        if (
          responseData.data ===
          "Weather service unavailable. Please try again later"
        ) {
          throw new Error(
            "Weather service is currently unavailable. Please try again later."
          );
        }

        const weatherData = JSON.parse(responseData.data);
        setWeatherData(weatherData);
        setLastUpdated(
          new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })
        );
        setError(null);
      } catch (error) {
        setError(error.message);
        setWeatherData(null);
      }finally {
        setLoading(false);
      }
    };
    const checkIfFavourite = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/wishlist`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch wishlist");
        }
        let cities = await response.json();
        if (!cities) cities = []; 
        const exists = cities.some(
          (c) => c.cityName?.toLowerCase() === city.toLowerCase()
        );
        setIsFavourite(exists);
      } catch (error) {
        alert(error.message)
      }
    };

    fetchWeather();
    checkIfFavourite();
  }, [city]); 

  const handleAddToFavourite = async (city) => {
    try {
      const action = isFavourite ? "remove" : "add";
      const response = await fetch(
        `${API_BASE_URL}/wishlist/${action}?city=${city}`,
        {
          method: isFavourite ? "DELETE" : "POST",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update wishlist");
      }
      setIsFavourite((prev) => !prev);
      alert(`${city} ${isFavourite ? "removed from" : "added to"} Favourites`);
    } catch (error) {
      setError(error.message);
    }
  };

  if(loading){
    return(
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40vh" }}>
        <CircularProgress />
      </Container>
    )
  }

  if (error) return <p className="text-danger text-center mt-3">{error}</p>;


  return (
    <>
      {weatherData && (
        <>
          <div className="row mt-3">
            <div className="col-sm-12 col-md-8 mx-auto p-3 bg-light border">
              <div className="d-flex justify-content-between border-bottom">
                <p>Today's Weather</p>
                <p>{formatDate(weatherData.dt)}</p>
              </div>
              <div className="row p-2">
                <div className="col-sm-12 col-md-4">
                  <h1>
                    {weatherData.name}{" "}
                    <span className="text-muted fs-6">
                      {weatherData.sys.country}
                    </span>
                  </h1>
                  <button className="btn" onClick={()=>handleAddToFavourite(weatherData.name)}>
                    {isFavourite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </button>
                </div>
                <div className="col-sm-12 col-md-4">
                  <p>
                    <strong>Max Temp:</strong> {weatherData.main.temp_max}°C
                  </p>
                  <p>
                    <strong>Min Temp:</strong> {weatherData.main.temp_min}°C
                  </p>
                </div>
                <div className="col-sm-12 col-md-4">
                  <p>
                    <strong>Sunrise: </strong>
                    {formatTime(weatherData.sys.sunrise)}
                    {<WbTwilightIcon />}
                  </p>
                  <p>
                    <strong>Sunset: </strong>
                    {formatTime(weatherData.sys.sunset)}
                    {<SolarPowerIcon />}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-sm-12 col-md-8 bg-light mx-auto p-3">
              <div className="d-flex justify-content-between border-bottom">
                <p>Current Weather</p>
                <p>{lastUpdated}</p>
              </div>
              <div className="d-flex">
                <div>
                <img
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                  alt="Weather Icon"
                />
                </div>
                <div className="mx-2">
                  <span>Feels Like</span>
                  <h1>{Math.round(weatherData.main.feels_like)}°C</h1>
                  <p className="text-capitalize">
                    {weatherData.weather[0].description}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 col-md-6">
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>
                          <ThermostatIcon />
                        </td>
                        <td>High/Low</td>
                        <td>
                          {weatherData.main.temp_max}/
                          {weatherData.main.temp_min}°C
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <OpacityIcon />
                        </td>
                        <td>Humidity</td>
                        <td>{weatherData.main.humidity}%</td>
                      </tr>
                      <tr>
                        <td>
                          <SpeedIcon />
                        </td>
                        <td>Pressure</td>
                        <td>{weatherData.main.pressure} mb</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-sm-12 col-md-6">
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>
                          <VisibilityIcon />
                        </td>
                        <td>Visibility</td>
                        <td>{(weatherData.visibility / 1000).toFixed(2)} km</td>
                      </tr>
                      <tr>
                        <td>
                          <AirIcon />
                        </td>
                        <td>Wind Speed</td>
                        <td>
                          {(weatherData.wind.speed * 3.6).toFixed(2)} km/h
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <CloudCircleIcon />
                        </td>
                        <td>Cloud Cover</td>
                        <td>{weatherData.clouds.all}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="btn btn-primary" onClick={()=>setShowHourly(!showHourly)}>{showHourly?"Hide Hourly":"Show Hourly"}</div>
            </div>
          </div>
          {showHourly && <WeatherHourly lat={weatherData.coord.lat} lon={weatherData.coord.lon}/>}
        </>
      ) 
      }
    </>
  );
};

export default WeatherData;
