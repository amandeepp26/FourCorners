import React, { useState, useEffect } from 'react';
import { Button, Grid, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import Addcarparkingdetails from 'src/views/add-carparking/Addcarparkingdetails';
import ListCarparking from 'src/views/List-Carparking/ListCarparking';

const TypographyPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProjectManage, setShowProjectManage] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://apiforcornershost.cubisysit.com/api/api-fetch-projectmaster.php');
      console.log('API Response:', response.data);
      setRows(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">Error fetching data: {error.message}</Alert>;
  }

  const handleNavigation = () => {
    setShowProjectManage(true); // Show ProjectManage component
  };

  return (
    <>
      {!showProjectManage && (
        <>
          <Grid item xs={12}>
            <Button
              variant="contained"
              sx={{ marginRight: 3.5 }}
              onClick={handleNavigation}
            >
              Add
            </Button>
          </Grid>

          <Grid container spacing={6}>
            <Grid item xs={12}>
              {rows.length > 0 ? <ListCarparking /> : <Addcarparkingdetails />}
            </Grid>
          </Grid>
        </>
      )}

      {showProjectManage && <Addcarparkingdetails show={setShowProjectManage} />}
    </>
  );
};

export default TypographyPage;
