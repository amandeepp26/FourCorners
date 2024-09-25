import React, { useState, useEffect } from 'react';
import { Button, Grid, CircularProgress, Alert, Box } from '@mui/material';
import axios from 'axios';
import AddUser from 'src/views/add-usermaster/AddUser';
import ListUserMaster from 'src/views/list-usermaster/ListUserMaster';

const UserManager = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://apiforcornershost.cubisysit.com/api/api-fetch-usermaster.php');
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
    setEditData(null); // Clear edit data when navigating to the add form
  };

  const handleBack = () => {
    setEditData(null);
    fetchData(); // Refetch data after adding or editing details
  };

  const handleEdit = (row) => {
    setEditData(row);
  };

  const handleDelete = async (id) => {
    console.log(id, 'id aayaaaaaaa');
    try {
      const response = await axios.post('https://proxy-forcorners.vercel.app/api/proxy/api-delete-telecalling.php', {
        telecallingID: id,
        DeleteUID: 1
      });
      if (response.data.status === 'Success') {
        setRows(rows.filter(row => row.telecallingID !== id));
        console.log('Deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      setError(error);
    }
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
    a.download = "UserProfile.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <AddUser show={handleBack} editData={editData} fetchDataUser={fetchData} />
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
          <ListUserMaster rows={rows} onEdit={handleEdit} onDelete={handleDelete}/>
        </Grid>
      </Grid>
    </>
  );
};

export default UserManager;
