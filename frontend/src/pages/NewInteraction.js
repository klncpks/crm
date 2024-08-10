import React, { useState } from 'react';
import { TextField, Button, Grid, makeStyles, FormControlLabel, Radio, RadioGroup, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import '../styles/NewInteraction.css';

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

const NewInteraction = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    CustomerID: '',
    DateofInteraction: '',
    InteractionType: '',
    PurposeofInteraction: '',
    OutcomeofInteraction: '',
    EmployeeID: defaultEmployeeID,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    
    event.preventDefault();
    try {
      console.log('New interaction data:', formData);
      const response = await fetch('http://127.0.0.1:8000/crm/interactions/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        console.log('New interaction added successfully!');
      } else {
        console.error('Failed to add new interaction');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Grid className='new-interaction'>
      <Grid item xs={6} container direction="row" alignItems="center" justify="center">
        <form className={classes.form} onSubmit={handleSubmit}>
          <h5 className='title'>Enter Interaction Details:</h5>
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
            id="DateofInteraction"
            label="Date of Interaction"
            name="DateofInteraction"
            value={formData.DateofInteraction}
            onChange={handleChange}
          />
          <FormControl variant="outlined" fullWidth margin="normal" required>
            <InputLabel id="InteractionType">Interaction Type</InputLabel>
            <Select
                labelId="InteractionType-label"
                id="InteractionType"
                name="InteractionType"
                value={formData.InteractionType}
                onChange={handleChange}
                label="InteractionType"
            >
                <MenuItem value="Email">Email</MenuItem>
                <MenuItem value="Call">Call</MenuItem>
                <MenuItem value="Chat">Chat</MenuItem>
            </Select>
        </FormControl>
        <FormControl variant="outlined" fullWidth margin="normal" required>
            <InputLabel id="PurposeofInteraction">Purpose of Interaction</InputLabel>
            <Select
                labelId="PurposeofInteraction-label"
                id="PurposeofInteraction"
                name="PurposeofInteraction"
                value={formData.PurposeofInteraction}
                onChange={handleChange}
                label="PurposeofInteraction"
            >
                <MenuItem value="Enquiry">Enquiry</MenuItem>
                <MenuItem value="Complaint">Complaint</MenuItem>
                <MenuItem value="Feedback">Feedback</MenuItem>
            </Select>
        </FormControl>
        <FormControl variant="outlined" fullWidth margin="normal" required>
            <InputLabel id="OutcomeofInteraction">Outcome of Interaction</InputLabel>
            <Select
                labelId="OutcomeofInteraction-label"
                id="OutcomeofInteraction"
                name="OutcomeofInteraction"
                value={formData.OutcomeofInteraction}
                onChange={handleChange}
                label="OutcomeofInteraction"
            >
                <MenuItem value="Escalated">Escalated</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
            </Select>
        </FormControl>
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

export default NewInteraction;
