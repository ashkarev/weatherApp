import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Open-Meteo (NO API KEY)
export const getWeather = createAsyncThunk(
  "weather/getWeather",
  async ({ lat, lon, unit }) => {
    const unitParam = unit === "imperial" ? "fahrenheit" : "celsius";
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=${unitParam}`
    );
    const data = await res.json();
    return data.current_weather;
  }
);

export const getForecast = createAsyncThunk(
  "weather/getForecast",
  async ({ lat, lon, unit }) => {
    const unitParam = unit === "imperial" ? "fahrenheit" : "celsius";
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&temperature_unit=${unitParam}`
    );
    const data = await res.json();
    return data.hourly;
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    current: null,
    forecast: null,
    unit: "metric", // metric = Celsius
    favorites: JSON.parse(localStorage.getItem("favorites")) || [],
    loading: false,
  },
  reducers: {
    toggleUnit: (state) => {
      state.unit = state.unit === "metric" ? "imperial" : "metric";
    },
    addFavorite: (state, action) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
        localStorage.setItem("favorites", JSON.stringify(state.favorites));
      }
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(
        (c) => c !== action.payload
      );
      localStorage.setItem("favorites", JSON.stringify(state.favorites));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWeather.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(getForecast.fulfilled, (state, action) => {
        state.forecast = action.payload;
      });
  },
});

export const { toggleUnit, addFavorite, removeFavorite } =
  weatherSlice.actions;
export default weatherSlice.reducer;
