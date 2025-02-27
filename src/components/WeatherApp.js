import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import WeatherData from "./WeatherData";
import config from "../utils/config";
import { useAuth } from "../context/AuthContext";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const {API_BASE_URL} = config
  const {setUser} = useAuth();

  useEffect(()=>{
    getUserName()
  },[])

  const getUserName = async () => {
    try{
      const response = await fetch(`${API_BASE_URL}/auth/username`,{
        method:"GET",
        credentials:"include"
      });
      if(response.ok){
        const data = await response.json();
        setUser(data.username)
      }
    }catch(error){
      alert(error.message)
      return
    }

  }

  const searchCity = searchParams.get("city") || "Hyderabad"; // Default city

  const handleSearch = (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    setSearchParams({ city });
    setCity(""); 
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-5 mx-auto bg-white p-2 mt-3">
          <form onSubmit={handleSearch} className="d-flex">
            <input
              className="form-control"
              name="city"
              type="search"
              placeholder="Search City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button className="btn btn-primary mx-1" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
      <WeatherData city={searchCity} />
    </div>
  );
};

export default WeatherApp;
