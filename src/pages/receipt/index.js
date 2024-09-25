import React, { useState, useEffect } from 'react';
import { Button, Grid, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import Listreceipt from 'src/views/list-receipt/Listreceipt';
import Addreceipt from 'src/views/add-receipt/Addreceipt';
import { useRouter } from 'next/router';

const Receipt = () => {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showreceipt, setshowreceipt] = useState(false);
  const [editData, setEditData] = useState(null); // New state for editing

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://apiforcornershost.cubisysit.com/api/api-fetch-receipt.php');
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
    setshowreceipt(true);
  };

  const handleBack = () => {
    setshowreceipt(false);
    fetchData(); // Refetch data after adding a new subproject
  };

  const handleEdit = (row) => {
    setEditData(row);
    setshowreceipt(true);
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
      {!showreceipt && (
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

          {/* <Grid container spacing={6}>
            <Grid item xs={12}>
              <Listreceipt rows={rows} setRows={setRows} onEdit={handleEdit} />
            </Grid>
          </Grid> */}
        </>
      )}

      {showreceipt && <Addreceipt show={handleBack} editData={editData} />}
    </>
  );
};

export default Receipt;
