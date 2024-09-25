import React, { useState, useEffect } from 'react';
import { Button, Grid, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import Listsubprojectdetails from 'src/views/Listsubprojectdetails/Listsubprojectdetails';
import Addsubprojectdetails from 'src/views/Addsubprojectdetails/Addsubprojectdetails';
import { useRouter } from 'next/router';

const TypographyPage = () => {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [editData, setEditData] = useState(null); // New state for editing

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
    setShowProjectDetails(true);
  };

  const handleBack = () => {
    setShowProjectDetails(false);
    fetchData(); // Refetch data after adding a new subproject
  };

  const handleEdit = (row) => {
    setEditData(row);
    setShowProjectDetails(true);
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
    a.download = "Sub-Project-master.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
              <Listsubprojectdetails rows={rows} setRows={setRows} onEdit={handleEdit} />
            </Grid>
          </Grid>
        </>
      )}

      {showProjectDetails && <Addsubprojectdetails show={handleBack} editData={editData} />}
    </>
  );
};

export default TypographyPage;
