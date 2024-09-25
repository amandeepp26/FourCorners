import React, { useState, useEffect } from 'react';
import { Button, Grid, CircularProgress, Alert, Box } from '@mui/material';
import axios from 'axios';
import AddUser from 'src/views/add-usermaster/AddUser';
import Allnotification from 'src/views/notification/AllNotification';

const Notification = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://apiforcornershost.cubisysit.com/api/api-fetch-notification.php');
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



  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Allnotification rows={rows}/>
        </Grid>
      </Grid>
    </>
  );
};

export default Notification;
