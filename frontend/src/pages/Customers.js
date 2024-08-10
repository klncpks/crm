import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, useNavigate } from "react-router-dom";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import '../styles/Customers.css';
import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome';
import { fa0, fa1, fa2, fa3, fa4, fa5, fa6, fa7, fa8, fa9, faSyncAlt} from '@fortawesome/free-solid-svg-icons';

const numericIcons = [fa0, fa1, fa2, fa3, fa4, fa5, fa6, fa7, fa8, fa9];

const Customers = ({ selectedPage, handleNavigationClick }) =>
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
        
    
        fetchData('customers/', setCustomerData);
        fetchData('customers/top5/', setTop5Customers);
        fetchData('customers/count/', setCustomerCount);
        fetchData('customers/table/',setFilteredData);

    }, []);

    const navigate=useNavigate();
    const [customerData, setCustomerData] = useState([]);
    const [top5Customers, setTop5Customers] = useState([]);
    const [customerCount, setCustomerCount] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [activeFilter, setActiveFilter] = useState('');

    const handleFilter = (filterType) => {
        let sortedData = [...filteredData];
        let newActiveFilter = filterType;
    
        if (activeFilter === filterType) {
            sortedData = sortedData.sort((a, b) => a.customer_id - b.customer_id);
            newActiveFilter = 'Show All'; 
        } else {
            switch(filterType) {
                case 'Top10':
                    sortedData = sortedData.sort((a, b) => b.total_revenue - a.total_revenue);
                    break;
                case 'MostVisited':
                    sortedData = sortedData.sort((a, b) => b.no_of_visits - a.no_of_visits);
                    break;
                case 'Show All':
                    sortedData = sortedData.sort((a, b) => a.customer_id - b.customer_id); 
                    break;
            }
        }
    
        setFilteredData(sortedData);
        setActiveFilter(newActiveFilter);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    
    const countGender = () => {
        const genderCounts = {};
        if (Array.isArray(customerData) && customerData.length > 0) {
            customerData.forEach(customer => {
                const gender = customer.gender;
                genderCounts[gender] = (genderCounts[gender] || 0) + 1;
            });
        }
        console.log("genderCounts:", genderCounts);
        return genderCounts;
    };

    const genderData = countGender();

    const genderOptions = {
        chart: {
            type: 'pie',
            backgroundColor: 'rgb(233, 233, 234)',
            borderColor: '#edf2f4',
            plotBackgroundColor: 'rgb(233, 233, 234)',
            plotBorderColor: '#edf2f4',
        },
        title: {
            text: 'Gender Count'
        },
        series: [{
            name: 'Count',
            data: Object.entries(genderData).map(([gender, count], index) => ({
                name: gender,
                y: count,
                color: index === 0 ? '#66b3ff' : 'pink'
            }))
        }]
    };

    const customerCountYearly = () => {
        const yearlyCounts = {};
        if(Array.isArray(customerCount) && customerCount.length > 0) {
            customerCount.forEach(customer => {
                const year = customer.year;
                yearlyCounts[year] = customer.no_of_customers;
            });
        }
        console.log("customerYearlyCounts:", yearlyCounts);
        return yearlyCounts;
    }
    const yearlyData = customerCountYearly();

    const yearlyCountOptions = {
        chart: {
            type: 'column',
            backgroundColor: 'rgb(233, 233, 234)',
            borderColor: '#edf2f4',
            plotBackgroundColor: 'rgb(233, 233, 234)',
            plotBorderColor: '#edf2f4',
        },
        title: {
            text: 'Number of Customers Over Years',
        },
        xAxis: {
            type: 'category',
      title: {
        text: 'Year'
        }
        },
        yAxis: {
            title: {
                text: 'Number of Customers'
            }
        },
        series: [{
            name: 'Customers',
            data: Object.entries(yearlyData).map(([year, count]) => ({ name: year, y: count }))
        }]
    };

    return (
        <div className="customers">
            <h1>Customers</h1>
                <table className="table">
                    <thead></thead>
                <tbody>
                        <tr>
                        <td className="total-count" colSpan={3}>
                            <div>
                            <h3 className="totalCount-title">TOTAL CUSTOMERS</h3>
                                {customerData.length > 0 && (
                                    <div>
                                        <div className = "total-count-val">{customerData.length}</div>
                                    </div>
                                )}
                                </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="loyal" rowSpan={1}>
                            <div className="loyal-title">Loyal Customers</div>
                                <table className="loyal-table">
                                    <thead>
                                    <tr>
                                            <th></th>
                                            <th>CUSTOMER NAME</th>
                                            <th>NO OF PURCHASES</th>
                                            <th>REVENUE  GENERATED</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {top5Customers.map((customer, index) => (
                                            <tr key={index}>
                                                <td className={`numbers number-${index + 1}`}><FontAwesomeIcon icon={numericIcons[index]} /></td>
                                                <td>{customer.customer_name}</td>
                                                <td>{customer.no_of_purchases}</td>
                                                <td>${customer.total_revenue}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                        </td>
                        <td className="customers_yearly_count">
                            <div className="cust_yearly_count-chart"><HighchartsReact highcharts={Highcharts} options={yearlyCountOptions} className="chart2"/></div>
                        </td>
                        <td className="gender-count">
                            <div className = "gender-box">
                        <HighchartsReact highcharts={Highcharts} options={genderOptions} className="chart1"/>  </div>
                        </td>
                        </tr>
                        </tbody>
                        </table>
                    <table className="filters-Table">
                    <tr>
                        <td className="customer-filters" rowSpan={1}>
                        <div>
                            <div>
                            <button 
                                className={`filter-button ${activeFilter === 'Top10' ? 'active' : ''}`} 
                                onClick={() => handleFilter('Top10')}
                            >
                                Top 10
                            </button>
                            <button 
                                className={`filter-button ${activeFilter === 'MostVisited' ? 'active' : ''}`} 
                                onClick={() => handleFilter('MostVisited')}
                            >
                                Most Visited
                            </button>
                            <button 
                                className={`filter-button ${activeFilter === 'Show All' ? 'active' : ''}`} 
                                onClick={() => handleFilter('Show All')}
                            >
                                Show All
                            </button>
                            </div>
                            <div>
                                <h2>Customers Data</h2>
                                <table className = "filterTable">
                                <thead className="filter-head">
                                    <tr>
                                    <th>Sl. No</th>
                                    <th >Customer ID</th>
                                    <th>Customer Name</th>
                                    <th>No. of Visits</th>
                                    <th>Total Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className = "filter-body" >
                                    {currentItems.map((item, index) => (
                                    <tr className = "filter-bodytr" key={item.customer_id} >
                                        <td>{index + 1}</td>
                                        <td onClick={() => handleNavigationClick('Customer', {customer_id: item.customer_id})} className={selectedPage === 'Customer' ? 'active' : ''} style={{color: '#66bad4'}}>{item.customer_id}</td>
                                        <td>{item.customer_name}</td>
                                        <td>{item.no_of_visits}</td>
                                        <td>{item.total_revenue}</td>
                                    </tr>
                                    ))}
                                </tbody>
                                </table>
                            </div>
                            <div>
                                <button className="navi-buttons-left" onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                                <button className="navi-buttons-right" onClick={nextPage} disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}>Next</button>
                            </div>
                            </div>
                            </td>
                            </tr>
                            </table>
        </div>
    );
}
export default Customers;