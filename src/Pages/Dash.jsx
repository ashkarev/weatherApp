import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getWeather,
  toggleUnit,
  addFavorite,
  removeFavorite,
} from "../redux/weatherSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const cityMap = {
  Bangalore: { lat: 12.97, lon: 77.59 },
  Kochi: { lat: 9.93, lon: 76.26 },
  Chennai: { lat: 13.08, lon: 80.27 },
};

const Dash = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { current, loading, unit, favorites } = useSelector(
    (state) => state.weather
  );

  const [city, setCity] = useState("");
  const [currentCity, setCurrentCity] = useState("Bangalore");

  useEffect(() => {
    dispatch(getWeather({ ...cityMap[currentCity], unit }));
  }, [dispatch, unit, currentCity]);

  const handleSearch = () => {
    if (cityMap[city]) {
      setCurrentCity(city);
      setCity("");
      navigate(`/city/${city}`);
    } else {
      toast.error("City not available");
    }
  };

  const handleFavorite = () => {
    if (favorites.includes(currentCity)) {
      dispatch(removeFavorite(currentCity));
      toast.info("Removed from favorites");
    } else {
      dispatch(addFavorite(currentCity));
      toast.success("Added to favorites");
    }
  };

  return (
    <div className="min-h-screen bg-sky-200 flex justify-center p-6">
      <div className="w-full max-w-3xl ">
        <h1 className="text-5xl font-semibold mb-6 text-center  text-blue-500">
          Weather Dashboard
        </h1>

       
        <div className=" p-4 rounded-md mb-6 flex gap-2">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            className="border rounded px-3 py-2 w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 rounded hover:bg-sky-900"
          >
            Search
          </button>
        </div>

       
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => dispatch(toggleUnit())}
            className="border-0 px-4 py-2 rounded bg-violet-500 text-white shadow-2xl hover:bg-violet-950"
          >
            {unit === "metric" ? "Show °F" : "Show °C"}
          </button>

          <div className="flex gap-2">
            {Object.keys(cityMap).map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCurrentCity(c);
                  navigate(`/city/${c}`);
                }}
                className="border-0 text-white px-3 py-1 rounded bg-red-500 hover:bg-red-800"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

    
        {loading && <p className="text-center">Loading...</p>}

        {current && (
          <div className="bg-white shadow-2xl hover:scale-105 duration-700 text-black p-6 rounded-md text-center mb-6">
            <h2 className="text-lg font-medium mb-2">
              {currentCity}
            </h2>

            <p className="text-3xl font-semibold mb-1">
              {current.temperature}°
              {unit === "metric" ? "C" : "F"}
            </p>

            <p className="text-gray-600 mb-3">
              Wind Speed: {current.windspeed} km/h
            </p>

            <button
              onClick={handleFavorite}
              className="border px-3 py-1 rounded"
            >
              {favorites.includes(currentCity)
                ? "Remove from Favorites"
                : "Add to Favorites"}
            </button>
          </div>
        )}

        
        {favorites.length > 0 && (
          <div className="bg-white p-4 rounded-md shadow-2xl hover:scale-105 duration-700">
            <h3 className="font-medium mb-3 text-center">
              Favorite Cities
            </h3>
            <div className="flex gap-2 flex-wrap justify-center">
             {favorites
  .filter((f) => f && f.trim() !== "")
  .map((f) => (
    <button
      key={f}
      onClick={() => navigate(`/city/${f}`)}
      className="border px-3 py-1 rounded"
    >
      {f}
    </button>
  ))}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dash;
