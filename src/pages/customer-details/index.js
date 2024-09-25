import React, { useState, useEffect } from 'react';
import { Button, Grid, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import ListCustomerDetails from 'src/views/ListCustomerDetails/ListCustomerDetails';
import AddCustomerDetails from 'src/views/customer-detailsAdd/AddCustomerDetails';

const TypographyPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);

  useEffect(() => {
    if (showProjectDetails) {
      fetchData();
    }
  }, [showProjectDetails]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://apiforcornershost.cubisysit.com/api/api-fetch-customermaster.php');
      console.log('API Response:', response.data);
      setRows(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
      setLoading(false);
    }
  };

  const handleNavigation = () => {
    setShowProjectDetails(true); // Show AddCustomerDetails
  };

  const handleSubmissionSuccess = () => {
    setShowProjectDetails(false); // Hide AddCustomerDetails
    fetchData(); // Fetch updated data to display in ListCustomerDetails
  };

  return (
    <>
      {!showProjectDetails && (
        <>
          <Grid item xs={12} sx={{ mb: 2 }}>
            <Button
              variant="contained"
              sx={{ marginRight: 3.5, mt: -1 }}
              onClick={handleNavigation}
            >
              Add
            </Button>
          </Grid>

          <Grid container spacing={6}>
            <Grid item xs={12}>
              <ListCustomerDetails />
            </Grid>
          </Grid>
        </>
      )}

      {showProjectDetails && (
        <AddCustomerDetails onSubmitSuccess={handleSubmissionSuccess} />
      )}
    </>
  );
};

export default TypographyPage;