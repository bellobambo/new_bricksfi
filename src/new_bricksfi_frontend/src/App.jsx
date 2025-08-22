import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PropertyDetails from "../pages/PropertyDetails";
import Home from "../pages/Home";
import PropertiesList from "../pages/PropertiesList";
import Dashboard from "../pages/Dashboard";
import WishList from "../pages/WishList";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<PropertiesList />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wishlist" element={<WishList />} />
      </Routes>
    </Router>
  );
}
