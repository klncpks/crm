import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Sidebar from './component/sidebar';
import HomePage from './pages/HomePage'; 
import Predections from './pages/Predictions';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Login from "./pages/Login";
import Product from "./pages/product";
import NewInteraction from "./pages/NewInteraction";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/predictions" element={<Predections/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="/product/:productId" element={<Product/>} />
        <Route path="/customers" element={<Customers/>} />
        <Route path="/newinteraction" element={<NewInteraction/>} />
        <Route path="*" element={<Login />} />
        {/* Add routes for other pages */}
      </Routes>
    </Router>
  );
}
export default App;
