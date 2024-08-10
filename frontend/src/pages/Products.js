import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/Products.css';
import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome';
import { fa0, fa1, fa2, fa3, fa4, fa5, fa6, fa7, fa8, fa9, faSyncAlt} from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';

const numericIcons = [fa0, fa1, fa2, fa3, fa4, fa5, fa6, fa7, fa8, fa9];
const Products = ({ selectedPage, handleNavigationClick }) =>
{
    useEffect(() => {
        async function fetchData(endpoint, setData) {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/crm/${endpoint}`);
                console.log(`Response for ${endpoint}:`, response.data); // Log the response to see its structure
                if (response.data.status === "success") {
                    setData(response.data.data);
                } else {
                    console.error('Invalid data format:', response.data);
                }
            } catch (error) {
                console.error(`Error fetching ${endpoint}:`, error);
            }
        }        
        fetchData('products', setProductData);
        fetchData('products/top5/', setTop5Products);
        fetchData('products/leastPurchased/', setLeast5Products);
        fetchData('products/topRevenue/', setTopRevenue);
        fetchData('products/leastRevenue/', setLeastRevenue);
        fetchData('products/ProductName', setProductNameOptions);
        fetchData('products/ProductCategory', setProductCategoryOptions);
        fetchData('products/ProductCost', setMinimumCostOptions);
    }, []);
    const [productData, setProductData] = useState([]);
    const [top5Products, setTop5Products] = useState([]);
    const [least5Products, setLeast5Products] = useState([]);
    const [topRevenue,setTopRevenue] = useState([]);
    const [leastRevenue,setLeastRevenue] = useState([]);
    const [productNameOptions, setProductNameOptions] = useState([]);
    const [productCategoryOptions, setProductCategoryOptions] = useState([]);
    const [minimumCostOptions, setMinimumCostOptions] = useState([]);
    const [resetFilters, setResetFilters] = useState(false);
    const [productName, setProductName] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [minimumCost, setMinimumCost] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = productData.filter(product => {
        const productNameFilter = !productName || product.product_name.toLowerCase().includes(productName.toLowerCase());
        const productCategoryFilter = !productCategory || product.product_category.toLowerCase() === productCategory.toLowerCase();
        const minimumCostFilter = !minimumCost || parseFloat(product.product_cost) >= parseFloat(minimumCost);
        return productNameFilter && productCategoryFilter && minimumCostFilter;
    }).slice(indexOfFirstProduct, indexOfLastProduct);
    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };
    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    };
    const handleResetFilters = () => {
        setProductName("");
        setProductCategory("");
        setMinimumCost("");
        setResetFilters(!resetFilters);
    };
    return (
        <div className="products">
            <h1>Products</h1>
                <table className="table">
                    <thead></thead>
                <tbody>
                    <tr>
                        <td className="top5" rowSpan={2}>
                            <div className="top5-title">Top Product By Sales</div>
                                <table className="top5-table">
                                    <thead>
                                    <tr>
                                            <th></th>
                                            <th>PRODUCT NAME</th>
                                            <th>UNITS SOLD</th>
                                            <th>REVENUE  GENERATED</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {top5Products.map((product, index) => (
                                            <tr key={index}>
                                                <td className={`numbers number-${index + 1}`}><FontAwesomeIcon icon={numericIcons[index]} /></td>
                                                <td>{product.product_name}</td>
                                                <td>{product.total_sold_units}</td>
                                                <td>${product.total_revenue}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                        </td>
                        <td className="least5" rowSpan={2}>
                            <div className="least5-title">Least Products By Sales</div>
                                <table className="least5-table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>PRODUCT NAME</th>
                                            <th>UNITS SOLD</th>
                                            <th>REVENUE  GENERATED</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {least5Products.map((product, index) => (
                                            <tr key={index}>
                                                <td className={`numbers number-${index + 1}`}><FontAwesomeIcon icon={numericIcons[index]} /></td>
                                                <td>{product.product_name}</td>
                                                <td>{product.total_sold_units}</td>
                                                <td>${product.total_revenue}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                        </td>
                        <td className="top1">
                            <h3 className="top1-title">HIGHEST REVENUE PRODUCT</h3>
                            {topRevenue && topRevenue.length > 0 && (
                                <div>
                                    <div className="product-name">{topRevenue[0].product_name}</div>
                                    <div className="revenue-generated">${topRevenue[0].total_revenue}</div>
                                </div>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className="least1">
                            <h3 className="least1-title">LEAST REVENUE PRODUCT</h3>
                                {leastRevenue && leastRevenue.length > 0 && (
                                    <div>
                                        <div className="product-name">{leastRevenue[0].product_name}</div>
                                        <div className="revenue-generated">${leastRevenue[0].total_revenue}</div>
                                    </div>
                                )}
                        </td>
                    </tr>
                    <tr>
                    <td colSpan={3}>
                    <div className="filter">
    <div className="title">Filters: <div className="refresh-icon" onClick={handleResetFilters}>
        <FontAwesomeIcon icon={faSyncAlt} />
    </div></div>
    <table>
    <tr>
    <td>
        <label htmlFor="product-name" className="label">Product Name:</label>
        <Select
            id="product-name"
            options={productNameOptions.map(option => ({ value: option, label: option }))}
            value={{ value: productName, label: productName }}
            onChange={selectedOption => setProductName(selectedOption.value)}
            placeholder="Select Product Name"
            styles={{
                control: (provided) => ({
                    ...provided,
                     maxHeight: '30px'
                })
            }}
        />
    </td>
    <td>
        <label htmlFor="product-category" className="label">Product Category:</label>
        <Select
            id="product-category"
            options={productCategoryOptions.map(option => ({ value: option, label: option }))}
            value={{ value: productCategory, label: productCategory }}
            onChange={selectedOption => setProductCategory(selectedOption.value)}
            placeholder="Select Product Category"
            styles={{
                control: (provided) => ({
                    ...provided,
                    maxHeight: '30px'
                })
            }}
        />
    </td>
    <td>
        <label htmlFor="minimum-cost" className="label">Minimum Cost:</label>
        <Select
            id="minimum-cost"
            options={minimumCostOptions.map(option => ({ value: option, label: option }))}
            value={{ value: minimumCost, label: minimumCost }}
            onChange={selectedOption => setMinimumCost(selectedOption.value)}
            placeholder="Select Minimum Cost"
            styles={{
                control: (provided) => ({
                    ...provided,
                    maxHeight: '30px' // Override minimum height
                })
            }}
        />
    </td>
    </tr>
    </table>
</div>
</td>
                    </tr>
                    <tr>
                        <td colSpan={3} rowSpan={3} className="listofproducts">
                        <div className="title">List Of Products:</div>
                <table className="list-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>PRODUCT NAME</th>
                            <th>PRODUCT CATEGORY</th>
                            <th>PRODUCT COST</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((product, index) => (
                            <tr key={index}>
                                <td className={`numbers number-${index + 1}`}>
                                    <FontAwesomeIcon icon={numericIcons[index]} />
                                </td>
                                <td onClick={() => handleNavigationClick('Product', {product_id: product.product_id})} className={selectedPage === 'Product' ? 'active' : ''} style={{color: '#66bad4'}}>{product.product_name}</td>
                                <td>{product.product_category}</td>
                                <td>${product.product_cost}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button onClick={prevPage} disabled={currentPage === 1} className="previous">Previous</button>
                    <button onClick={nextPage} disabled={indexOfLastProduct >= productData.length} className="next">Next</button>
                </div>
                        </td>
                    </tr>
                    <tr></tr>
                    <tr></tr>
                </tbody>
                </table>
        </div>
    );
}
export default Products;