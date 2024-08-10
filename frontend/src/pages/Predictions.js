import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/Predictions.css';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title
} from 'chart.js';

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);


function Predictions()
{
    const [leadsData, setLeadsData] = useState([]);
    const [leadsCountData, setLeadsCountData] = useState([]);
    const [leadsInterestData, setLeadsInterestData] = useState([]);
    const [leadsSourceData, setLeadsSourceData] = useState([]);
    const [filterType,setFilterType]=useState('');
    const[filteredLeads,setFilteredLeads]=useState([]);

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
    
        fetchData('leads/', setLeadsData);
        fetchData('leads/count/', setLeadsCountData);
        fetchData('leads/interest/', setLeadsInterestData);
        fetchData('leads/source/', setLeadsSourceData);
        setFilteredLeads(handleFilter(filterType));
      }, []);
      useEffect(() => {
        setFilteredLeads(filterLeadsByType(leadsData, filterType));
        setCurrentPage(1); // Reset to first page when filter changes
    }, [leadsData, filterType]);

    const filterLeadsByType = (leads, type) => {
        if (type === '') return leads; // Return all leads if no filter applied
        return leads.filter(item => item.Status === type);
    };

    const leadCountdata = {
        labels: leadsCountData.map(item => item.status),
        datasets: [{
            label: '# of Leads',
            data: leadsCountData.map(item => item.no_of_leads),
            backgroundColor: ['#e63946', '#e0e1dd', '#1d3557', '#f4d35e'],
            borderColor: ['#e63946', '#e0e1dd', '#1d3557', '#f4d35e'],
        }]
    }

    const leadSourcedata = {
        labels: leadsSourceData.map(item => item.lead_source),
        datasets: [{
            label: '# of Leads',
            data: leadsSourceData.map(item => item.no_of_leads),
            backgroundColor: ['#f95738', '#ee964b', '#f4d35e', '#faf0ca', '#0d3b66'],
            borderColor: ['#f95738', '#ee964b', '#f4d35e', '#faf0ca', '#0d3b66'],
        }]
    }

    const options = {}
    const handleFilter = (type) => {
        // If the clicked filter is already applied, remove the filter
        if (filterType === type) {
            setFilterType('');
            setFilteredLeads(leadsData); // Reset to all leads
        } else {
            setFilterType(type);
            const filteredLeads = leadsData.filter(item => item.Status === type);
            setFilteredLeads(filteredLeads);
        }
    };    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
    return (
        <div className="crm-layout">
            <h1>Predictions</h1>
                <table className="crm-table">
                    <thead></thead>
                <tbody>
                    <tr>
                        <td className="lead-count-container">
                            <div className="title">Leads Status</div>
                                <Doughnut
                                data = {leadCountdata}
                                options = {options}
                                ></Doughnut>
                        </td>
                        <td className="leads-outcome-bars">
                            <h3>Leads Outcome</h3>
                            {leadsInterestData.map(item => (
                                <div key={item.lead_outcome}>
                                <p>{item.lead_outcome}</p>
                                <progress className="lead-progress" value={item.no_of_leads} max={leadsInterestData.reduce((acc, curr) => acc + curr.no_of_leads, 0)} />
                                </div>
                            ))}
                        </td>
                        <td className="lead-source-container">
                            <div className="title">Leads Count from Various Sources</div>
                                <Doughnut
                                data = {leadSourcedata}
                                options = {options}
                                ></Doughnut>
                        </td>
                    </tr>
                    <tr className="crm-leads_details">
                        <td className="crm_leads-container" colSpan={4}>
                        <div>
                        <button 
                            className={`filter-button ${filterType === 'Interested' ? 'active' : ''}`} 
                            onClick={() => handleFilter('Interested')}
                        >
                            Interested
                        </button>
                        <button 
                            className={`filter-button ${filterType === 'Follow-up' ? 'active' : ''}`} 
                            onClick={() => handleFilter('Follow-up')}
                        >
                            Follow-up 
                        </button>
                        <button 
                            className={`filter-button ${filterType === 'New Lead' ? 'active' : ''}`} 
                            onClick={() => handleFilter('New Lead')}
                        >
                            New Lead
                        </button>
                        <button 
                            className={`filter-button ${filterType === 'Contacted' ? 'active' : ''}`} 
                            onClick={() => handleFilter('Contacted')}
                        >
                            Contacted
                        </button>

                        </div>
                        <h3>Transactions</h3>
                            <div className='crm-leads-container'>
                            {leadsData.length > 0 ? (
                            <table className="leads-table">
                                <thead className='leads-table-head'>
                                <tr>
                                    <th>Customer Name</th>
                                    <th>Phone Number</th>
                                    <th>Email</th>
                                    <th>Lead Source</th>
                                    <th>Status</th>
                                    <th>Outcome</th>
                                </tr>
                                </thead>
                                <tbody className='crm-leads-table-body'>
                                    {currentItems.map((lead, index) => (
                                    <tr key={index}>
                                        <td>{lead.CustomerName}</td>
                                        <td>{lead.PhoneNumber}</td>
                                        <td>
  <a href={`https://mail.google.com/mail/u/0/#inbox?compose=new`} target="_blank" rel="noopener noreferrer">
    {lead.Email}
  </a>
</td>
                                        <td>{lead.LeadSource}</td>
                                        <td>{lead.Status}</td>
                                        <td>{lead.Outcome}</td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                            ) : (
                                <div className="no-leads">No Leads History</div>
                            )}
                            </div>
                            <div className="pagination">
                                <button className="navi-buttons-left" onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                                <span>{currentPage} of {totalPages}</span>
                                <button className="navi-buttons-right" onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
                </table>
        </div>
    );
}
export default Predictions;