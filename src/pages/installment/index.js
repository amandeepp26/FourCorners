import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddInstallment from 'src/views/add-installment/AddInstallment';
import ListInstallmentDetails from 'src/views/list-installment/ListInstallment';
import { Button, Grid, CircularProgress, Alert, Box } from '@mui/material';

const Installment = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://apiforcornershost.cubisysit.com/api/api-fetch-installmentdetails.php');
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
    debugger;
    try {
      const response = await axios.post('https://proxy-forcorners.vercel.app/api/proxy/api-delete-installmentdetails.php', {
        InstallmentID: id,
        DeleteUID: 1
     
      });
   
      if (response.data.status === 'Success') {
        setRows(rows.filter(row => row.InstallmentID !== id));
        console.log('Deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      setError(error);
    }
  };
  const handleNavigation = () => {
    setShowTabAccount(true);
  };

  const handleBack = () => {
    setShowTabAccount(false);
    fetchData(); // Refetch data after adding or editing an installment
  };

  const handleEdit = (row) => {
    setEditData(row);
    setShowTabAccount(true);
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
    a.download = "installment.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <Grid container spacing={6}>
  <Grid item xs={12}>
    <AddInstallment show={handleBack} editData={editData} />
  </Grid>
  <Grid item xs={12}>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
      <Button
        variant="contained"
        sx={{ marginRight: 3.5 }}
        onClick={handleDownload}
      >
        Download List
      </Button>
   
    </Box>
  </Grid>
  <Grid item xs={12}>
    <ListInstallmentDetails rows={rows} onEdit={handleEdit} setShowTabAccount={handleBack}  onDelete={handleDelete}/>
  </Grid>
</Grid>
    </>
  );
};

export default Installment;
