import React, { useState } from 'react';
import '../styles/NewCustomer.css';
import { TextField, Button, Grid, makeStyles, FormControl, InputLabel, Select, MenuItem,  } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
const employee_id=localStorage.getItem('employeeID');
const defaultEmployeeID = employee_id || ''; 

const NewPurchase = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    TransactionID: '',
    EmployeeID: defaultEmployeeID,
    CustomerID: '',
    DateofPurchase: '',
    ProductID: '',
    Quantity: '',
    Region: '',
    Branch: '',
    PaymentMode: '',
    TotalAmount: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log('New purchase data:', formData);
      const response = await fetch('http://127.0.0.1:8000/crm/purchases/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        console.log('New purchase added successfully!');
      } else {
        console.error('Failed to add new purchase');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <Grid container className='new'>
      <Grid item xs={6}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <h5 className='title'>Enter Purchase Details:</h5>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="TransactionID"
            label="Transaction ID"
            name="TransactionID"
            value={formData.TransactionID}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="EmployeeID"
            label="Employee ID"
            name="EmployeeID"
            value={formData.EmployeeID}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="CustomerID"
            label="Customer ID"
            name="CustomerID"
            value={formData.CustomerID}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="DateofPurchase"
            label="DateofPurchase"
            name="DateofPurchase"
            value={formData.DateofPurchase}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="ProductID"
            label="ProductID"
            name="ProductID"
            value={formData.ProductID}
            onChange={handleChange}
          />
          <FormControl variant="outlined" fullWidth margin="normal" required>
          <InputLabel id="quantity-label">Quantity</InputLabel>
          <Select
            labelId="quantity-label"
            id="Quantity"
            name="Quantity"
            value={formData.Quantity}
            onChange={handleChange}
            label="Quantity"
          >
            {[...Array(10)].map((_, index) => (
              <MenuItem key={index + 1} value={index + 1}>{index + 1}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" fullWidth margin="normal" required>
  <InputLabel id="region-label">Region</InputLabel>
  <Select
    labelId="region-label"
    id="Region"
    name="Region"
    value={formData.Region}
    onChange={handleChange}
    label="Region"
  >
    <MenuItem value="Warangal">Warangal</MenuItem>
    <MenuItem value="Vikarabad">Vikarabad</MenuItem>
    <MenuItem value="Karimnagar">Karimnagar</MenuItem>
    <MenuItem value="Medchal">Medchal</MenuItem>
  </Select>
</FormControl>

<FormControl variant="outlined" fullWidth margin="normal" required>
  <InputLabel id="branch-label">Branch</InputLabel>
  <Select
    labelId="branch-label"
    id="Branch"
    name="Branch"
    value={formData.Branch}
    onChange={handleChange}
    label="Branch"
  >
    {formData.Region === "Warangal" && (
      <MenuItem value="Hanamkonda">Hanamkonda</MenuItem>
    )}
    {formData.Region === "Vikarabad" && (
      <MenuItem value="Kodangal">Kodangal</MenuItem>
    )}
    {formData.Region === "Karimnagar" && (
      <MenuItem value="Kondagattu">Kondagattu</MenuItem>
    )}
    {formData.Region === "Medchal" && (
      <MenuItem value="Hyderabad">Hyderabad</MenuItem>
    )}
  </Select>
</FormControl>
<FormControl variant="outlined" fullWidth margin="normal" required>
  <InputLabel id="PaymentMode">PaymentMode</InputLabel>
  <Select
    labelId="PaymentMode"
    id="PaymentMode"
    name="PaymentMode"
    value={formData.PaymentMode}
    onChange={handleChange}
    label="PaymentMode"
  >
    <MenuItem value="PayPal">PayPal</MenuItem>
    <MenuItem value="Credit Card">Credit Card</MenuItem>
    <MenuItem value="Debit Card">Debit Card</MenuItem>
    <MenuItem value="Cash">Cash</MenuItem>
  </Select>
</FormControl>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="TotalAmount"
            label="TotalAmount"
            name="TotalAmount"
            value={formData.TotalAmount}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </Button>
        </form>
      </Grid>
    </Grid>
  );
};

export default NewPurchase;
