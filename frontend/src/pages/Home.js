import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import "../styles/Home.css";

function Home()
{
    const [employeeData, setEmployeeData] = useState([]);
    const [totalSalesData, setTotalSalesData] = useState([]);
    const [employeeSalesData, setEmployeeSalesData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [employeeTransactions, setEmployeeTransactions] = useState([]);
    const [employeeInteractions, setEmployeeInteractions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page

    useEffect(() => {
        async function fetchData(endpoint, setData) {
          try {
            const response = await axios.get(`http://127.0.0.1:8000/crm/${endpoint}`);
            console.log(`Response for ${endpoint}:`, response.data); // Log the response to see its structure
            if (response.data.status === 'success') {
              setData(response.data.data);
            } else {
              console.error('Invalid data format:', response.data);
            }
          } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
          }
        }
    
        fetchData(`employees/${localStorage.getItem('employeeID')}`, setEmployeeData);
        fetchData('employees/sales/count/', setTotalSalesData);
        fetchData('employees/sales/count/', setChartData);
        fetchData(`employees/sales/${localStorage.getItem('employeeID')}`, setEmployeeSalesData);
        fetchData(`employees/transactions/${localStorage.getItem('employeeID')}`,setEmployeeTransactions);
        fetchData(`employees/interactions/${localStorage.getItem('employeeID')}`,setEmployeeInteractions);
      }, []);

      const handleTotalSalesClick = () => {
        setChartData(totalSalesData);
    };

    const totalEmpSales = () => {
        let salesCounts = 0;
        if (Array.isArray(employeeSalesData) && employeeSalesData.length > 0) {
            employeeSalesData.forEach(emp=> {
                salesCounts = salesCounts + emp.no_of_sales;
            });
        }
        console.log("Employee Sales:", salesCounts);
        return salesCounts;
    };

    const totalRevenue = () => {
        let revenue = 0;
        if(Array.isArray(employeeTransactions) && employeeTransactions.length > 0) {
            employeeTransactions.forEach(transaction => {
                revenue = revenue + transaction.total_amount;
            });
        }
        revenue = parseFloat(revenue.toFixed(2));
        console.log("Total Revenue:", revenue);
        return revenue;
    }

    const handleEmployeeSalesClick = () => {
        setChartData(employeeSalesData);
    };

    const options = {
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
            text: 'Sales Comparison'
        },
        xAxis: {
            categories: chartData.map(data => data.year)
        },
        yAxis: {
            title: {
                text: 'Number of Sales'
            }
        },
        series: [{
            name: 'Sales',
            data: chartData.map(data => data.no_of_sales)
        }]
    };
    
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = employeeTransactions.slice(indexOfFirstItem, indexOfLastItem);


    return (
        <div className="home">
            <h1>Home Page</h1>
                <table className="table">
                    <thead></thead>
                <tbody>
                    <tr>
                    <td className='emp-detailstd' rowSpan={2} colSpan={1}>
                    <div className='employee-details-container'>
                        <table className='employee-details-table'>
                            <tbody>
                                <div className='emp-label-heading'><h2>Employee Details</h2></div>
                                <div className='emp-label'><h4 style={{ display: 'inline' }}>Employee ID:</h4> <span style={{ display: 'inline' }}>{employeeData.employee_id}</span></div>
                                <div className='emp-label'><h4 style={{ display: 'inline' }}>Employee Name:</h4> <span style={{ display: 'inline' }}> {employeeData.employee_name}</span></div>
                                <div className='emp-label'><h4 style={{ display: 'inline' }}>Email:</h4> <span style={{ display: 'inline' }}> {employeeData.email}</span></div>
                                <div className='emp-label'><h4 style={{ display: 'inline' }}>Phone Number:</h4> <span style={{ display: 'inline' }}> {employeeData.phone_number}</span></div>
                            </tbody>
                        </table>
                    </div>
                </td>
                <td className="emp-total-sales-details" rowSpan={1} colSpan={2}>
                    <h3 className="emp-sales-heading">Employee Sales</h3>
                    <div className="emp-total-sales-container">
                        {totalEmpSales()}
                    </div>
                </td>
                </tr>
                <tr>
                    <td className='emp-total-revenue-details' rowSpan={1} colSpan={2}>
                        <h3 className="emp-total-revenue-heading">Total Revenue</h3>
                        <div className="emp-total-revenue-container">
                            ${totalRevenue()}
                        </div>
                    </td>
                </tr>
                <tr>
                        <td className="emp-chart-container" colSpan={1}>
                        <div className="emp-buttons">
                                <button onClick={handleTotalSalesClick} className = "emp-chart-buttons">Total Sales</button>
                                <button onClick={handleEmployeeSalesClick} className = "emp-chart-buttons">Employee Sales</button>
                            </div>
                            <HighchartsReact highcharts={Highcharts} options={options} />
                        </td>
                        <td className="emp-interactions_details" colSpan={2}>
                            <h3 className="heading">Interactions</h3>
                            <div className="emp-interactions-table-container">
                                {employeeInteractions.length > 0 ? (
                                    <table className="emp-interactions-table">
                                        <thead className='emp-interactions-table-head'>
                                            <tr>
                                                <th>Customer ID</th>
                                                <th>Date</th>
                                                <th>Interaction Type</th>
                                                <th>Purpose</th>
                                                <th>Outcome</th>
                                            </tr>
                                        </thead>
                                        <tbody className='emp-interactions-table-body'>
                                            {employeeInteractions.map((interaction, index) => (
                                                <tr key={index}>
                                                    <td>{interaction.customer_id}</td>
                                                    <td>{interaction.date_of_interaction}</td>
                                                    <td>{interaction.interaction_type}</td>
                                                    <td>{interaction.purpose}</td>
                                                    <td>{interaction.outcome}</td>
                                                </tr>
                                            ))} {/* Slicing here to show only first three rows */}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="no-interactions">No Interactions</div>
                                )}
                            </div>
                        </td>
                        </tr>
                        <tr className="emp-transaction_details">
                            <td className="emp-transaction_details-container" colSpan={3}>
                            <h3 className='heading'>Transactions</h3>
                            {employeeTransactions.length > 0 ? (
                            <table className="emp-transactions-table">
                                <thead className='emp-transactions-table-head'>
                                <tr>
                                    <th>Customer ID</th>
                                    <th>Product Name</th>
                                    <th>Date of Purchase</th>
                                    <th>Quantity</th>
                                    <th>Region</th>
                                    <th>Payment Mode</th>
                                    <th>Total Amount</th>
                                </tr>
                                </thead>
                                <tbody className='emp-transactions-table-body'>
                                    {currentItems.map((transaction, index) => (
                                    <tr key={index}>
                                        <td>{transaction.customer_id}</td>
                                        <td>{transaction.product_name}</td>
                                        <td>{transaction.date_of_purchase}</td>
                                        <td>{transaction.quantity}</td>
                                        <td>{transaction.region}</td>
                                        <td>{transaction.payment_mode}</td>
                                        <td>{transaction.total_amount}</td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                            ) : (
                                <div className="no-transactions">No Transactions</div>
                            )}
                            <div className="pagination">
                                <button className="navi-buttons-left" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                                <button className="navi-buttons-right" onClick={() => paginate(currentPage + 1)} disabled={indexOfLastItem >= employeeTransactions.length}>Next</button>
                            </div>
                            </td>
                        </tr>
                </tbody>
                </table>
        </div>
    );
}
export default Home;