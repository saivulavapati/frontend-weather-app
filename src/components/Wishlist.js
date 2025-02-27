import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../utils/config";
import CircularProgress from "@mui/material/CircularProgress"; 
import Container from "@mui/material/Container";

const Favourites = () => {
  const navigate = useNavigate();
  const [favourites, setFavourites] = useState([]);
  const [loading,setLoading] = useState(true);

  const {API_BASE_URL} = config

  useEffect(()=>{
    getWishlistCities()
  },[])

  const getWishlistCities = async () => {
    setLoading(true)
    try{
      const response = await fetch(`${API_BASE_URL}/wishlist`,{
        method:"GET",
        credentials:"include"
      })
      if(response.ok){
        const data = await response.json();
        setFavourites(data);
      }
      else{
        throw Error("Unable to fetch cities wishlist")
      }
    }catch(error){
      alert(error.message);
    }finally{
      setLoading(false);
    }
  }

  const handleRemove = async (city) => {
    try{
      const response = await fetch(`${API_BASE_URL}/wishlist/remove?city=${city}`,{
        method:"DELETE",
        credentials:"include"
      })
      if(response.ok){
        const updatedFavourites = favourites.filter((fav) => fav.cityName !== city);
        setFavourites(updatedFavourites);
      }else{
        throw Error("Unable to remove from Favourites")
      }
    }catch(error){
      alert(error.message)
    } 
  };

  const handleViewWeather = (city) => {
    navigate(`/weather?city=${city}`);
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40vh" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <div className="container mt-3">
      <h1 className="fs-4">Favourite Cities</h1>
      {favourites.length === 0 ? (
        <div className="alert alert-warning">
          <p>No favourite cities added.</p>
        </div>
      ) : (
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>City Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {favourites.map((city) => (
              <tr key={city.id}>
                <td></td>
                <td>{city.cityName}</td>
                <td>
                  <button className="btn btn-primary me-2" onClick={() => handleViewWeather(city.cityName)}>
                    View
                  </button>
                  <button className="btn btn-danger" onClick={() => handleRemove(city.cityName)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button className="btn btn-secondary mt-3" onClick={() => navigate("/weather")}>
        Search Weather
      </button>
    </div>
  );
};

export default Favourites;
