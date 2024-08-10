import React, { useState } from 'react';
import { TextField, Button, Grid, makeStyles, RadioGroup, FormControlLabel, Radio,FormLabel,FormControl,InputLabel,Select,MenuItem  } from '@material-ui/core';
import '../styles/NewCustomer.css';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const NewCustomer = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    CustomerID: '110',
    Name: '',
    Email: '',
    PhoneNumber: '',
    Address: '',
    Age: '',
    Gender: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log('New customer data:', formData);
      const response = await fetch('http://127.0.0.1:8000/crm/customers/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        // Customer added successfully
        console.log('New customer added successfully!');
      } else {
        // Handle error response
        console.error('Failed to add new customer');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <Grid className='new'>
      <Grid item xs={6} container direction="row" alignItems="center" justify="center">
        <form className={classes.form} onSubmit={handleSubmit}>
          <h5 className='title'>Enter Customer Details:</h5>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="Name"
            label="Name"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="Email"
            label="Email Address"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="PhoneNumber"
            label="Phone Number"
            name="PhoneNumber"
            value={formData.PhoneNumber}
            onChange={handleChange}
          />
          <FormControl variant="outlined" fullWidth margin="normal" required>
          <InputLabel id="age-label">Age</InputLabel>
          <Select
            labelId="age-label"
            id="Age"
            name="Age"
            value={formData.Age}
            onChange={handleChange}
            label="Age"
          >
            {[...Array(100)].map((_, index) => (
              <MenuItem key={index + 1} value={index + 1}>{index + 1}</MenuItem>
            ))}
          </Select>
        </FormControl>
          <FormLabel component="legend" style={{marginTop:'10px',}}>Gender</FormLabel>
          <RadioGroup aria-label="gender" name="Gender" value={formData.Gender} onChange={handleChange} style={{marginBottom:'-15px',}}>
          <FormControlLabel value="Male" control={<Radio />} label="Male" />
          <FormControlLabel value="Female" control={<Radio />} label="Female" />
          </RadioGroup>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="Address"
            label="Address"
            name="Address"
            multiline
            minRows={4}
            value={formData.Address}
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

export default NewCustomer;