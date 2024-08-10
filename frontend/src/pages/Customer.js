import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/Customer.css'; // Import your CSS file for styling
import { Button,Modal } from '@material-ui/core';
import NewInteraction from './NewInteraction';

const Customer = ({customer_id}) => {
  const [searchCriteria, setSearchCriteria] = useState('Customer ID');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState([]);
  const [customerTransactions, setCustomerTransactions] = useState([]);
  const [customerFeedbacks, setCustomerFeedbacks] = useState([]);
  const [customerInteractions, setCustomerInteractions] = useState([]);
  const [customerVisits, setCustomerVisits] = useState(1);
  const [customerTotalRevenue, setCustomerTotalRevenue] = useState(0);
  console.log('Customer ID: ', customer_id);
  const [customerID, setCustomerID] = useState(0);

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

    fetchData('customers/', setCustomerData);
  }, []);

  useEffect(() => {
    // Fetch customer-related data whenever customer_id changes
    if (customer_id) {
      async function fetchCustomerData() {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/crm/customer/${customer_id}`);
          if (response.data.status === 'success') {
            console.log('Selected customer data:', response.data);
            setSelectedCustomerDetails(response.data.data);
            const tresponse = await axios.get(`http://127.0.0.1:8000/crm/customer/transactions/${customer_id}`);
            if(tresponse.data.status === 'success') {
                console.log('Customer transactions:', tresponse.data);
                setCustomerTransactions(tresponse.data.data);
                const length = tresponse.data.data.length;
                setCustomerVisits(length);
                const totalRevenue = tresponse.data.data.reduce((total, transaction) => {
                  return total + parseFloat(transaction.total_amount);
              }, 0);
              const formattedTotalRevenue = totalRevenue.toFixed(2);
              console.log('Total revenue:', formattedTotalRevenue);
              setCustomerTotalRevenue(formattedTotalRevenue);
            }
            else{
                console.error('Error fetching customer transactions:', tresponse.data);
            }
    
            const fresponse = await axios.get(`http://127.0.0.1:8000/crm/customer/feedback/${customer_id}`);
            if(fresponse.data.status === 'success') {
                console.log('Customer Feedback:', fresponse.data);
                setCustomerFeedbacks(fresponse.data.data);
            }
            else{
                console.error('Error fetching customer Feedback:', fresponse.data);
            }
    
            const iresponse = await axios.get(`http://127.0.0.1:8000/crm/customer/interactions/${customer_id}`);
            if(iresponse.data.status === 'success') {
                console.log('Customer Interactions:', iresponse.data);
                setCustomerInteractions(iresponse.data.data);
            }
            else{
                console.error('Error fetching customer transactions:', iresponse.data);
            }
    
          } else {
            console.error('Invalid data format:', response.data);
          }
        } catch (error) {
          console.error('Error fetching customer data:', error);
        }
      }
      fetchCustomerData();
    }
  }, [customer_id]);

  useEffect(() => {
    filterCustomers();
  }, [searchTerm, searchCriteria, customerData]);

  useEffect(() => {
    // Add event listener to handle keyboard navigation within dropdown
    const handleKeyDown = (event) => {
      if (!showDropdown) return;

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedOptionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedOptionIndex((prevIndex) => Math.min(prevIndex + 1, filteredCustomers.length - 1));
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showDropdown, filteredCustomers]);

  const filterCustomers = () => {
    let filteredData = [...customerData];
    if (searchTerm.trim() !== '') {
      filteredData = customerData.filter((customer) => {
        if (searchCriteria === 'Customer ID') {
          return customer.customer_id.toString().includes(searchTerm);
        } else if (searchCriteria === 'Customer Name') {
          return customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
      });
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
    setFilteredCustomers(filteredData);
    setSelectedOptionIndex(-1); // Reset selected index
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchCriteriaChange = (event) => {
    setSearchCriteria(event.target.value);
  };

  const handleOptionClick = async (customer) => {
    setSearchTerm(searchCriteria === 'Customer ID' ? customer.customer_id.toString() : customer.customer_name);
    setShowDropdown(false);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/crm/customer/${customer.customer_id}`);
      if (response.data.status === 'success') {
        console.log('Selected customer data:', response.data);
        setSelectedCustomerDetails(response.data.data);
        const tresponse = await axios.get(`http://127.0.0.1:8000/crm/customer/transactions/${customer.customer_id}`);
        if(tresponse.data.status === 'success') {
            console.log('Customer transactions:', tresponse.data);
            setCustomerTransactions(tresponse.data.data);
            const length = tresponse.data.data.length;
            setCustomerVisits(length);
            const totalRevenue = tresponse.data.data.reduce((total, transaction) => {
              return total + parseFloat(transaction.total_amount);
          }, 0);
          const formattedTotalRevenue = totalRevenue.toFixed(2);
          console.log('Total revenue:', formattedTotalRevenue);
          setCustomerTotalRevenue(formattedTotalRevenue);
        }
        else{
            console.error('Error fetching customer transactions:', tresponse.data);
        }

        const fresponse = await axios.get(`http://127.0.0.1:8000/crm/customer/feedback/${customer.customer_id}`);
        if(fresponse.data.status === 'success') {
            console.log('Customer Feedback:', fresponse.data);
            setCustomerFeedbacks(fresponse.data.data);
        }
        else{
            console.error('Error fetching customer Feedback:', fresponse.data);
        }

        const iresponse = await axios.get(`http://127.0.0.1:8000/crm/customer/interactions/${customer.customer_id}`);
        if(iresponse.data.status === 'success') {
            console.log('Customer Interactions:', iresponse.data);
            setCustomerInteractions(iresponse.data.data);
        }
        else{
            console.error('Error fetching customer transactions:', iresponse.data);
        }

      } else {
        console.error('Invalid data format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };

  const getCustomerSegment = (visits) => {
    if (visits < 4 ) {
        return 'New Customer';
    } else {
        return 'Loyal Customer';
    }
  };

  const renderCustomerSegment = (visits) => {
      const segment = getCustomerSegment(visits);
      console.log("Visits:",visits);
      let className = "cust-segment";
      if (segment === 'New Customer') {
          className += "new_cust";
          console.log("classname :",className);
      } else if (segment === 'Loyal Customer') {
          className += "loyal_cust";
      }
      return (
          <td className={className} rowSpan={1}>
              <h3>Customer Segment:</h3>
              <div>
                {segment}
              </div>
          </td>
      );
  };
  const [modalOpen, setModalOpen] = useState(false); // State to manage modal visibility

  const handleAddInteraction = () => {
    setModalOpen(true); // Open the modal when "Add Interaction" button is clicked
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Close the modal
  };

  return (
    <div className="cust-data">
      <div className="cust-search-bar">
      <div className="search-radio-buttons-container">
          <input
            name="search-criteria"
            type="radio"
            value="Customer ID"
            checked={searchCriteria === 'Customer ID'}
            onChange={handleSearchCriteriaChange}
            id='cust-radio'
            className="cust-input"
          />
          <label htmlFor="cust-radio" className="cust-label">
            Customer ID
          </label>
          <input
            name="search-criteria"
            type="radio"
            value="Customer Name"
            checked={searchCriteria === 'Customer Name'}
            onChange={handleSearchCriteriaChange}
            id='cust-radio2'
            className="cust-input"
          />
          <label htmlFor="cust-radio2" className="cust-label">
            Customer Name
          </label>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchTermChange}
          placeholder={`Search ${searchCriteria}`}
          className="search-input"
        />
        {/* Dropdown for displaying filtered customers */}
        {showDropdown && (
          <div className="dropdown" ref={dropdownRef}>
            <ul className="dropdown-list">
              {/* Render filtered customer options */}
              {filteredCustomers.map((customer, index) => (
                <li
                  key={customer.customer_id}
                  className={index === selectedOptionIndex ? 'selected' : ''}
                  onClick={() => handleOptionClick(customer)}
                >
                  {searchCriteria === 'Customer ID' ? customer.customer_id : customer.customer_name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <table className='customer-layout'>
        <tbody>
            <tr className='customer-details'>
                <td className='customer-detailstd' rowSpan={2}>
                    <div className='customer-details-container'>
                        <table className='cutomers-details-table'>
                            <tbody>
                                <div className='customer-label-heading'><h2>Customer Details</h2></div>
                                <div className='customer-label'><h4 style={{ display: 'inline' }}>Customer ID:</h4> <span style={{ display: 'inline' }}>{selectedCustomerDetails.CustomerID}</span></div>
                                <div className='customer-label'><h4 style={{ display: 'inline' }}>Customer Name:</h4> <span style={{ display: 'inline' }}> {selectedCustomerDetails.Name}</span></div>
                                <div className='customer-label'><h4 style={{ display: 'inline' }}>Email:</h4> <span style={{ display: 'inline' }}> {selectedCustomerDetails.Email}</span></div>
                                <div className='customer-label'><h4 style={{ display: 'inline' }}>Phone Number:</h4> <span style={{ display: 'inline' }}> {selectedCustomerDetails.PhoneNumber}</span></div>
                                <div className='customer-label'><h4 style={{ display: 'inline' }}>Address:</h4> <span style={{ display: 'inline' }}> {selectedCustomerDetails.Address}</span></div>
                                <div className='customer-label'><h4 style={{ display: 'inline' }}>Gender:</h4> <span style={{ display: 'inline' }}> {selectedCustomerDetails.Gender}</span></div>
                            </tbody>
                        </table>
                    </div>
                </td>
                  {renderCustomerSegment(customerVisits)}
            </tr>
            <tr className='total_rev' rowSpan={1}>
              <td className='total_rev_container'>
                <h3 className='total_rev_label'>Total Revenue</h3>
                <div>
                  <div className='total_rev_value'>${customerTotalRevenue}</div>
                </div>
              </td>
            </tr>
          <tr className='feedback-row'>
            <td className="feedback-tabletd"  >
              <h3>Feedback</h3>
              {customerFeedbacks.length > 0 ? (
                <div className="feedback-table-container">
                  <table className="feedback-table">
                    <thead className='feedback-table-head'>
                      <tr>
                        <th>Rating</th>
                        <th>Comments</th>
                      </tr>
                    </thead>
                    <tbody className='feedback-table-body'>
                      {customerFeedbacks.slice(0, 3).map((feedback, index) => (
                        <tr key={index}>
                          <td>{feedback.rating}</td>
                          <td>{feedback.comments}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="no-feedbacks">No Feedbacks</div>
              )}
            </td>
            <td className="interactions_details"colSpan={2} >
              <h3 className='title'>Interactions</h3>
              <Button onClick={handleAddInteraction} className='interaction-button'>Add Interaction</Button>
              <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="modal-content">
          <NewInteraction />
        </div>
      </Modal>
              {customerInteractions.length > 0 ? (
                <table className="interactions-table">
                  <thead className='interactions-table-head'>
                    <tr>
                      <th>Date</th>
                      <th>Interaction Type</th>
                      <th>Purpose</th>
                      <th>Outcome</th>
                    </tr>
                  </thead>
                  <tbody className='interactions-table-body'>
                      {customerInteractions.slice(0, 3).map((interaction, index) => (
                        <tr key={index}>
                          <td>{interaction.date_of_interaction}</td>
                          <td>{interaction.interaction_type}</td>
                          <td>{interaction.purpose}</td>
                          <td>{interaction.outcome}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-interactions">No Interactions</div>
              )}
            </td>
          </tr>
          <tr className="transaction_details">
            <td className="transaction_details-container" colSpan={3}>
              <h3>Transactions</h3>
              <div className='cust-transactions-container'>
              {customerTransactions.length > 0 ? (
              <table className="transactions-table">
                <thead className='transactions-table-head'>
                  <tr>
                    <th>Product Name</th>
                    <th>Date of Purchase</th>
                    <th>Quantity</th>
                    <th>Region</th>
                    <th>Payment Mode</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody className='transactions-table-body'>
                    {customerTransactions.map((transaction, index) => (
                      <tr key={index}>
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
              </div>
              </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Customer;
