import React, {useState } from "react";
import { useSearchParams } from "react-router-dom";
import WeatherData from "./WeatherData";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const searchCity = searchParams.get("city") || "Hyderabad"; 

  const handleSearch = (e) => {
    e.preventDefault();
    if (!city.trim()){
       alert("City cannot be Empty..")
    return
    };
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
