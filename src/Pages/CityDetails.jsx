import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getForecast } from "../redux/weatherSlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const cityMap = {
  Bangalore: { lat: 12.97, lon: 77.59 },
  Kochi: { lat: 9.93, lon: 76.26 },
  Chennai: { lat: 13.08, lon: 80.27 },
};

const CityDetails = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const { forecast } = useSelector((state) => state.weather);

  useEffect(() => {
    if (cityMap[name]) {
      dispatch(getForecast(cityMap[name]));
    }
  }, [dispatch, name]);

  if (!forecast) return <p className="p-6">Loading...</p>;

  const chartData = forecast.time.slice(0, 8).map((t, i) => ({
    time: t.split("T")[1],
    temp: forecast.temperature_2m[i],
  }));

  return (
    <div className="min-h-screen bg-sky-200 p-6">
      <div className="max-w-3xl mx-auto ">
        <h2 className="text-5xl font-semibold mb-4 text-blue-500">
          {name} - Hourly Forecast
        </h2>

        <div className="bg-blue-500 text-white p-4 rounded-md mb-6 hover:scale-105 duration-700">
          {chartData.map((item, i) => (
            <div
              key={i}
              className="flex justify-between border-b py-2 text-sm"
            >
              <span>{item.time}</span>
              <span>{item.temp} °C</span>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded-md h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line dataKey="temp" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CityDetails;
