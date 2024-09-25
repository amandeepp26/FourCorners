import React, { useState, useEffect } from 'react';
import { Button, Grid, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import Listunitallocation from 'src/views/list-unitallocation/Listunitallocation';
import Addsubprojectdetails from 'src/views/add-unitallocation/Addunitallocation';
import { useRouter } from 'next/router';

const Unitallocation = () => {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showunitallocation, setshowunitallocation] = useState(false);
  const [editData, setEditData] = useState(null); // New state for editing

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://apiforcornershost.cubisysit.com/api/api-fetch-unitallocation.php');
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
    setshowunitallocation(true);
  };

  const handleBack = () => {
    setshowunitallocation(false);
    fetchData(); // Refetch data after adding a new subproject
  };

  const handleEdit = (row) => {
    setEditData(row);
    setshowunitallocation(true);
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
    a.download = "data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  return (
    <>
      {!showunitallocation && (
        <>
           <Grid item xs={12}>
            <Button
              variant="contained"
              sx={{ marginRight: 3.5 }}
              onClick={handleNavigation}
              style={{ marginBottom: "8px", float: "right" }}
            >
              Add
            </Button>

            <Button
              variant="contained"
              sx={{ marginRight: 3.5 }}
              onClick={handleDownload}
              style={{ marginBottom: "8px", float: "right" }}
            >
              Download
            </Button>
          </Grid>

          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Listunitallocation rows={rows} setRows={setRows} onEdit={handleEdit} />
            </Grid>
          </Grid>
        </>
      )}

      {showunitallocation && <Addsubprojectdetails show={handleBack} editData={editData} />}
    </>
  );
};

export default Unitallocation;
