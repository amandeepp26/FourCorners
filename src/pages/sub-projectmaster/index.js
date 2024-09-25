import React, { useState, useEffect } from 'react';
import { Button, Grid, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import Addsubprojectdetails from 'src/views/AddSubProjectMaster/AddSubprojectmaster';
import ListSubProjectMaster from 'src/views/ListSubProjectmaster/ListSubProjectMaster';
import { useRouter } from 'next/router';
import Link from 'next/link'


const SubProjectmaster = () => {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://apiforcornershost.cubisysit.com/api/api-fetch-subprojectmaster.php');
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
    setShowProjectDetails(true); // Set to true to show ProjectManage
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
            <ListSubProjectMaster /> 
          </Grid>
        </Grid>
      </>
    )}

    {showProjectDetails && <Addsubprojectdetails show = {setShowProjectDetails} />}
  </>
  );
};

export default SubProjectmaster;
  