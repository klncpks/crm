import React from "react";
import Product from '../pages/product';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartLine, faPlus, faBox, faUsers, faUser, faArrowTrendUp, faShoppingBasket, faSignOut } from '@fortawesome/free-solid-svg-icons';
import '../styles/sidebar.css';
import { useNavigate } from "react-router-dom";

const Sidebar = ({ selectedPage, handleNavigationClick }) => {
    const navigate=useNavigate();
    const handleLogout = () => {
        navigate('/login');
    }
    return (
        <div className="sidebar" id="sidebar">
            <div className="logo"><FontAwesomeIcon icon={faArrowTrendUp} /> DMCRM</div>
            <ul>
                <li onClick={() => handleNavigationClick('Home')} className={selectedPage === 'Home' ? 'active' : ''}><FontAwesomeIcon icon={faHome} /> Homepage</li>
                <li onClick={() => handleNavigationClick('Predictions')} className={selectedPage === 'Predictions' ? 'active' : ''}><FontAwesomeIcon icon={faChartLine} /> CRM</li>
                <li onClick={() => handleNavigationClick('Products')} className={selectedPage === 'Products' ? 'active' : ''}><FontAwesomeIcon icon={faBox} /> Products</li>
                <li onClick={() => handleNavigationClick('Customers')} className={selectedPage === 'Customers' ? 'active' : ''}><FontAwesomeIcon icon={faUsers} /> Customers</li>
                <li onClick={() => handleNavigationClick('Product')} className={selectedPage === 'Product' ? 'active' : ''}><FontAwesomeIcon icon={faShoppingBasket}/> Product</li>
                <li onClick={() => handleNavigationClick('Customer')} className={selectedPage === 'Customer' ? 'active' : ''}><FontAwesomeIcon icon={faUser} /> Customer</li>
                <li onClick={() => handleNavigationClick('NewCustomer')} className={selectedPage === 'NewCustomer' ? 'active' : ''}><FontAwesomeIcon icon={faPlus} /><FontAwesomeIcon icon={faUser}/> New Customer</li>
                <li onClick={() => handleNavigationClick('NewPurchase')} className={selectedPage === 'NewPurchase' ? 'active' : ''}><FontAwesomeIcon icon={faPlus} /><FontAwesomeIcon icon={faShoppingBasket}/> New Purchase</li>
                <li onClick={() => handleLogout()}><FontAwesomeIcon icon={faSignOut}/> Log Out</li>
            </ul>
        </div>
    );
};

export default Sidebar;