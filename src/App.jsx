import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dash from "./Pages/Dash";
import CityDetails from "./Pages/CityDetails";


const App = () => {
  return (
   
      <Routes>
        <Route path="/" element={<Dash />} />
        <Route path="/city/:name" element={<CityDetails />} />
      </Routes>
  
  );
};

export default App;

