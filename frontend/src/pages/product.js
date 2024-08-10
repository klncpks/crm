import React, { useState, useEffect } from "react";
import axios from "axios";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import '../styles/product.css';
import HighchartsReact from "highcharts-react-official";
import Highcharts from 'highcharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons';

const Product = ({ productId }) => {
    const [productData, setProductData] = useState([]);
    const [productPurchases, setProductPurchases] = useState([]);
    const [productFeedback, setProductFeedback] = useState([]);
    const [productNameOptions, setProductNameOptions] = useState([]);
    const [selectedProductName, setSelectedProductName] = useState('');
    const [selectedProductId, setSelectedProductId] = useState(productId);
    const [activeFilter,setActiveFilter] = useState('');
    const [averageRating,setAverageRating]= useState('');
    const [salesOptions, setSalesOptions] = useState({
        chart: {
            type: 'column',
            height: '250px',
            width: null,
            backgroundColor: 'rgb(233, 233, 234)',
            borderColor: '#edf2f4',
            plotBackgroundColor: 'rgb(233, 233, 234)',
            plotBorderColor: '#edf2f4',
        },
        title: {
            text: 'Sales by time'
        },
        xAxis: {
            categories: [],
        },
        series: [{
            name: 'Count',
            data: [],
        }]
    });
    useEffect(() => {
        async function fetchData(endpoint, setData) {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/crm/${endpoint}`);
                if (response.data.status === "success") {
                    setData(response.data.data);
                } else {
                    console.error('Invalid data format:', response.data);
                }
            } catch (error) {
                console.error(`Error fetching ${endpoint}:`, error);
            }
        }
        fetchData('product/id/name/', setProductNameOptions);
        if (selectedProductName) {
            const selectedProduct = productNameOptions.find(option => option.product_name === selectedProductName);
            if (selectedProduct) {
                setSelectedProductId(selectedProduct.product_id);
                fetchData(`product/${selectedProduct.product_id}`, setProductData);
                fetchData(`product/purchases/${selectedProduct.product_id}`, setProductPurchases);
                fetchData(`product/feedback/${selectedProduct.product_id}`, setProductFeedback)
                .then(() => {
                    preprocessData(productPurchases, activeFilter);
                    caluclateAverageRating();
                });
            }
            console.log(`${process.env.PUBLIC_URL}/Products/${productData.ProductName}`);
        }
    }, [selectedProductName]);
    useEffect(() => {
        if (productFeedback.length > 0) {
            const totalRating = productFeedback.reduce((acc, feedback) => acc + parseInt(feedback.Rating), 0);
            const average = totalRating / productFeedback.length;
            setAverageRating(average);
        } else {
            setAverageRating(0);
        }
    }, [productFeedback]);
    useEffect(() => {
        if (activeFilter && productPurchases.length > 0) {
            const processedData = preprocessData(productPurchases, activeFilter);
            // Update salesOptions state with the processed data
            setSalesOptions({
                ...salesOptions,
                xAxis: {
                    categories: processedData.categories,
                },
                series: [{
                    name: 'Count',
                    data: processedData.counts,
                }]
            });
        }
    }, [activeFilter, productPurchases]);    
    const handleProductSelection = (event, value) => {
        if (value) {
            setSelectedProductName(value.product_name);
            handleFilter('yearly');
        }
    };
    const caluclateAverageRating = () => {
        if (productFeedback.length > 0) {
            const totalRating = productFeedback.reduce((acc, feedback) => acc + parseInt(feedback.Rating), 0);
            const average = parseFloat((totalRating / productFeedback.length).toFixed(2));
            setAverageRating(average);
        } else {
            setAverageRating(0); // Set average rating to 0 if there are no feedback entries
        }
    };
    
    const getProductSegment = (cost) => {
        if (cost < 50) {
            return 'Budget';
        } else if (cost < 200) {
            return 'Premium';
        } else {
            return 'Luxury';
        }
    };
    const renderProductSegment = (cost) => {
        const segment = getProductSegment(cost);
        let className = "product-segment";
        if (segment === 'Budget') {
            className += " budget";
        } else if (segment === 'Premium') {
            className += " premium";
        } else if (segment === 'Luxury') {
            className += " luxury";
        }
        return (
            <td className={className}>
                <div className="segment">Product Segment:</div>
                <div className="segment-text">{segment} Product</div>
            </td>
        );
    };    
    const preprocessData = (data, filter) => {
        const groupedData = data.reduce((acc, purchase) => {
            let period;
            if (filter === 'monthly') {
                // Group by month
                period = purchase.DateofPurchase.split('-')[1];
            } else if (filter === 'yearly') {
                period = purchase.DateofPurchase.split('-')[2];
            }
            acc[period] = (acc[period] || 0) + 1;
            return acc;
        }, {});
    
        // Sort the data by period
        const sortedData = Object.entries(groupedData)
            .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
            .reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {});
    
        // Prepare categories and counts for the chart
        const categories = Object.keys(sortedData);
        const counts = Object.values(sortedData);
    
        return { categories, counts };
    };
    
    const handleFilter = (filterType) => {
        setActiveFilter(filterType);
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
    
        const stars = [];
    
        // Render full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FontAwesomeIcon key={`star-${i}`} icon={faStar} />);
        }
    
        // Render half star if needed
        if (halfStar) {
            stars.push(<FontAwesomeIcon key="half-star" icon={faStarHalf} />);
        }
    
        return stars;
    };
    const getImageUrl = (productData) => {
        if (productData && productData.ProductName) {
            return `${process.env.PUBLIC_URL}/Products/${productData.ProductName}.jpg`;
        } else {
            return null;
        }
    };
    const imageUrl = getImageUrl(productData);

    console.log("Image URL:", imageUrl);
    return (
        <div className="product">
            <table className="table">
            <td colSpan={3} className="search-bar">
                <div className="search-bar-title-container">
                    <span className="search-bar-title">Enter product to search</span>
                </div>
                <Autocomplete
                    value={productNameOptions.find(option => option.product_name === selectedProductName) || null}
                    onChange={handleProductSelection}
                    options={productNameOptions}
                    getOptionLabel={(option) => option.product_name}
                    renderInput={(params) => (
                        <TextField {...params} label="Product Name" required value={selectedProductName} />
                    )}
                />
            </td>
                <tbody>
                <div className="about-container">
                    <span className="about">About Product</span>
                </div>
                    <tr className="first-row">
                    <div className="product-image-container">
                    {imageUrl ? (
                        <img src={imageUrl} alt="Product" />
                    ) : (
                        <div className="empty-box"></div>
                    )}
                    </div>
                        <td className='product-details'>
                            <table className="table">
                                <th colSpan={2}>Product Details:</th>
                                <tr colSpan={2}><td colSpan={2}>Name: {productData.ProductName}</td></tr>
                                <tr colSpan={2}><td>ID: {productData.ProductID}</td></tr>
                                <tr colSpan={2}><td>Category: {productData.ProductCategory}</td></tr>
                                <tr><td></td><td className="cost">Cost: {productData.ProductCost}</td></tr>
                            </table>
                        </td>
                        <td className="sales-graph">
                            <div>
                            <button 
                                className={`filter-button ${activeFilter === 'monthly' ? 'active' : ''}`} 
                                onClick={() => handleFilter('monthly')}
                            >
                                month
                            </button>
                            <button 
                                className={`filter-button ${activeFilter === 'yearly' ? 'active' : ''}`} 
                                onClick={() => handleFilter('yearly')}
                            >
                                year
                            </button>
                            </div>
                                <HighchartsReact highcharts={Highcharts} options={salesOptions} className="chart"></HighchartsReact>
                        </td>
                    </tr>
                    <tr>
                    {renderProductSegment(productData.ProductCost)}
                        <td className="frequent-customers">
                        <div className="title">Frequent Customers:</div>
                            <table className="table">
                                <thead className="head">
                                <tr>
                                    <th>CustomerID</th>
                                    <th>Quantity</th>
                                </tr>
                                </thead>
                                <tbody className="body">
                                {productPurchases.slice(0,5).map((product, index) => (
                                <tr key={index}>
                                                <td>{product.CustomerID}</td>
                                                <td>{product.Quantity}</td>
                                </tr>
                                ))}
                                </tbody>
                            </table>
                        </td>
                        <td className="feedback">
                            <div className="rating" colSpan={3}>Average Rating: {renderStars(averageRating)}</div>
                        <table className="table">
                                <thead className="head"><tr>
                                    <th>Rating</th>
                                    <th>Comments</th>
                                </tr>
                                </thead>
                                <tbody className="body">
                                {productFeedback.slice(0,5).map((product, index) => (
                                <tr key={index}>
                                                <td>{product.Rating}</td>
                                                <td>{product.Comments}</td>
                                </tr>
                                ))}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
export default Product;
