import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PropertiesList from "../pages/PropertiesList";
import PropertyDetails from "../pages/PropertyDetails";
import Home from "../pages/Home";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<PropertiesList />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
      </Routes>
    </Router>
  );
}
