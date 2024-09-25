import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Listenquirysource from 'src/views/Listenquirysource/Listenquirysource';
import Addenquirysource from 'src/views/Addenquirysource/Addenquirysource';
import { Button, Grid, CircularProgress, Alert, Box } from '@mui/material';
const Enquirysource = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'add', 'update'
  const [rowDataToUpdate, setRowDataToUpdate] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://proxy-forcorners.vercel.app/api/proxy/api-fetch-enquirysource.php');
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
  const handleDelete = async (id) => {
    console.log(id, 'id aayaaaaaaa');
    try {
      const response = await axios.post('https://proxy-forcorners.vercel.app/api/proxy/api-delete-enquirysource.php', {
        EnquirySourceID: id,
        DeleteUID: 1
      });
      if (response.data.status === 'Success') {
        setRows(rows.filter(row => row.EnquirySourceID !== id));
        console.log('Deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      setError(error);
    }
  };
  const handleAddNavigation = () => {
    setActiveTab('add'); // Show AddEnquirysource component
    setRowDataToUpdate(null); // Clear any row data for update
  };

  const handleEdit = (rowData) => {
    setActiveTab('add'); // Show AddEnquirysource component for update
    setRowDataToUpdate(rowData); // Pass the selected row data
  };
  const jsonToCSV = (json) => {
    const header = Object.keys(json[0]).join(",");
    const values = json
      .map((obj) => Object.values(obj).join(","))
      .join("\n");
    return `${header}\n${values}`;
  };

  const handleDownload = () => {
    const csv = jsonToCSV(rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "enquirysource.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleBack = () => {
    setActiveTab('list');
    fetchData(); // Refetch data after adding or updating an enquiry source
  };

  return (
    <>
    <Grid container spacing={6}>
  <Grid item xs={12}>
    <Addenquirysource show={handleBack} editData={rowDataToUpdate} />
  </Grid>
  <Grid item xs={12}>
    {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
      <Button
        variant="contained"
        sx={{ marginRight: 3.5 }}
        onClick={handleDownload}
      >
        Download List
      </Button>
   
    </Box> */}
  </Grid>
  <Grid item xs={12}>
    <Listenquirysource rows={rows} onEdit={handleEdit} setShowTabAccount={handleBack}  onDelete={handleDelete}/>
  </Grid>
</Grid>
    </>
  );

};

export default Enquirysource;
