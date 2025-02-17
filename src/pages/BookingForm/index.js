import React, { useState } from 'react';
import { Button, Grid, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import TemplateRosenagar from 'src/views/TemplateRosenagar/TemplateRosenagar';
import FormRosenagar from 'src/views/BookingFormRosenagar/FormRosenagar';

const BookingForm = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(true); // Initially show the form
  const [bookingID, setBookingID] = useState(null); // To store BookingID

  if (error) {
    return <Alert severity="error">Error fetching data: {error.message}</Alert>;
  }

  const handleFormSubmitSuccess = (id) => {
    setBookingID(id);
    setShowForm(false); // Hide the form and show the template
};

  return (
    <>
      {showForm ? (
        <> 
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <FormRosenagar onFormSubmitSuccess={handleFormSubmitSuccess} />
            </Grid>
          </Grid>
        </>
      ) : (
        <TemplateRosenagar bookingID={bookingID} />
      )}
    </>
  );
};

export default BookingForm;
