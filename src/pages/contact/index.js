import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress, Alert, Button, Typography } from '@mui/material';
import axios from 'axios';
import AddContact from 'src/views/add-contact/AddContact';
import SidebarContactDetails from 'src/views/sidebarContacts/SidebarContactDetails';
import ListContact from 'src/views/list-contact/ListContact';
import HistoryTelecalling from 'src/views/history-telecalling/HistoryTelecalling';
import Box from "@mui/material/Box";

const Contact = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [rowDataToUpdate, setRowDataToUpdate] = useState(null);
  const [showAddDetails, setShowAddDetails] = useState(false); // State to manage showing AddTellecallingDetails
  const [showHistory, setShowHistory] = useState(false); // State to manage showing HistoryTelecalling

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://apiforcorners.cubisysit.com/api/api-fetch-telecalling.php');
      console.log('API Response:', response.data);
      setRows(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.post('https://ideacafe-backend.vercel.app/api/proxy/api-delete-telecalling.php', {
        Tid: id,
        DeleteUID: 1
      });
      if (response.data.status === 'Success') {
        setRows(rows.filter(row => row.Tid !== id));
        console.log('Deleted successfully');
        setRowDataToUpdate(null); // Reset rowDataToUpdate after deletion
        setShowAddDetails(false); // Hide AddTellecallingDetails after deletion
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      setError(error);
    }
  };

  const handleBack = () => {
    setEditData(null);
    setShowAddDetails(false); // Hide AddTellecallingDetails
    setShowHistory(false); // Hide HistoryTelecalling
    fetchData(); // Refetch data after adding or editing details
  };

  const handleEdit = (row) => {
    setEditData(row);
    setRowDataToUpdate(null); // Reset rowDataToUpdate when editing
    setShowAddDetails(true); // Show AddTellecallingDetails
    setShowHistory(false); // Hide HistoryTelecalling
  };

  const handleShow = (item) => {
    setRowDataToUpdate(item); // Set item to display details in ListTellecalling
    setShowAddDetails(false); // Hide AddTellecallingDetails
    setShowHistory(false); // Hide HistoryTelecalling
  };

  const handleAddTelecaller = () => {
    setShowAddDetails(true); // Show AddTellecallingDetails
    setShowHistory(false); // Hide HistoryTelecalling
  };

  const handleShowHistory = () => {
    setShowHistory(true); // Show HistoryTelecalling
    setShowAddDetails(false); // Hide AddTellecallingDetails
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={4}>
        <SidebarContactDetails rows={rows} onItemClick={handleShow} onEdit={handleEdit} onCreate={handleAddTelecaller} />
      </Grid>
      <Grid item xs={8}>
        {loading && <CircularProgress />}
        {error && (
          <Alert severity="error">Error fetching data: {error.message}</Alert>
        )}

        {!loading && !error && !showAddDetails && !rowDataToUpdate && !showHistory && (
          <Button
            variant="contained"
            sx={{
              marginTop: "50px",
              marginBottom: "20px",
              backgroundColor: "#9155FD",
              color: "#FFFFFF",
            }}
            onClick={handleAddTelecaller}
          >
            Add Telecaller
          </Button>
        )}

        {showAddDetails && (
          <AddContact show={handleBack} editData={editData} />
        )}

        {!loading && !error && (
          <>
            {rowDataToUpdate && !showHistory && (
              <ListContact
                item={rowDataToUpdate}
                onDelete={handleDelete}
                onHistoryClick={handleShowHistory} // Pass the handler to show history
              />
            )}

            {/* {showHistory && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                     <Box>
            <Typography
              variant="body2"
              sx={{ marginTop: 5, fontWeight: "bold", fontSize: 20 , marginLeft:60}}
            >
            User History
            </Typography>

            
        
          </Box>
                <HistoryTelecalling
                  item={rowDataToUpdate} // Pass item or relevant data to HistoryTelecalling if needed
                  onBack={handleBack} // Pass any necessary handlers
                />
              </div>
            )} */}
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default Contact;