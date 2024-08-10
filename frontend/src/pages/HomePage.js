import React, { useState } from "react";
import Sidebar from "../component/sidebar";
import Home from "./Home";
import Predictions from "./Predictions";
import Products from "./Products";
import Product from "./product";
import Customers from "./Customers";
import Customer from "./Customer";
import NewCustomer from "./NewCustomer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight, faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../styles/HomePage.css';
import { useNavigate } from "react-router-dom";
import NewPurchase from "./NewPurchase";

function HomePage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedPage, setSelectedPage] = useState('Home');
    const [productId, setProductId] = useState(null);
    const [customer_id, setCustomer_id] = useState(null);
    const navigate=useNavigate();
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleNavigationClick = (pageName, params) => {
        setSelectedPage(pageName);
        if (params && params.customer_id) {
            setCustomer_id(params.customer_id);
        } else if (params && params.product_id) {
            setProductId(params.product_id);
        } else {
            setCustomer_id(null);
            setProductId(null);
        }
    };
    

    return (
        <div className="home-page">
            <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <Sidebar selectedPage={selectedPage} handleNavigationClick={handleNavigationClick} />
            </div>
            <div className={`toggle-sidebar ${sidebarOpen ? 'open' : 'closed'}`} onClick={toggleSidebar}>
                {sidebarOpen ? <FontAwesomeIcon className="arrow" icon={faCircleArrowLeft} /> : <FontAwesomeIcon className="arrow" icon={faCircleArrowRight} />}
            </div>
            <div className={`main-content ${sidebarOpen ? 'with-sidebar' : 'without-sidebar'}`}>
                {selectedPage === 'Home' && <Home />}
                {selectedPage === 'Predictions' && <Predictions />}
                {selectedPage === 'Products' && <Products selectedPage={selectedPage} handleNavigationClick={handleNavigationClick} navigate={navigate}/>}
                {selectedPage === 'Customers' && <Customers selectedPage={selectedPage} handleNavigationClick={handleNavigationClick} navigate={navigate}/>}
                {selectedPage === 'Product' && <Product productId={productId} />}
                {selectedPage === 'Customer' && <Customer customer_id={customer_id} />}
                {selectedPage === 'NewCustomer' && <NewCustomer/>}
                {selectedPage === 'NewPurchase' && <NewPurchase/>}
            </div>
        </div>
    );
}

export default HomePage;
