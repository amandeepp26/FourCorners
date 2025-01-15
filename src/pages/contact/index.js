import React, { useState, useEffect } from "react";
import {
  Grid,
  CircularProgress,
  Alert,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Avatar,
} from "@mui/material";
import axios from "axios";
import AddContact from "src/views/add-contact/AddContact";
import SidebarContactDetails from "src/views/sidebarContacts/SidebarContactDetails";
import ListContact from "src/views/list-contact/ListContact";
import PieChartIcon from "@mui/icons-material/PieChart";
import TrendingUp from "@mui/icons-material/TrendingUp";
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd';
import CellphoneLink from 'mdi-material-ui/CellphoneLink';
import AccountOutline from 'mdi-material-ui/AccountOutline';

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useCookies } from "react-cookie";

const Contact = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState(null);
  const [rowDataToUpdate, setRowDataToUpdate] = useState(null);
  const [showAddDetails, setShowAddDetails] = useState(false);
  const [counts, setCounts] = useState(null);

  const [showHistory, setShowHistory] = useState(false);
  const [firstVisit, setFirstVisit] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false); // New state for showing dashboard
  const [cookies, setCookie] = useCookies(["amr"]); // Define cookies and setCookie function

  const userName = cookies.amr?.FullName || "User";
  const roleName = cookies.amr?.RoleName || "Admin";
  const userid = cookies.amr?.UserID || "Role";



  useEffect(() => {
    fetchDataContact();
  }, []);

  

  const fetchDataContact = async () => {
    const userid = cookies.amr?.UserID || 25;
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-graph-contact.php?UserID=${userid}`
      );
      console.log("API Response:", response.data.count);
      setRows(response.data.data || []);
      console.log(response.data.counts , 'counttt of contacttt<<<<<>>>>>>>>');
      setCounts(response.data.counts || {});
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };

  const renderStats = () => {
    if (!counts) {
      return null;
    }
  
    const dynamicSalesData = [
      {
        stats: counts.count_null,
        title: 'Not transferred to lead',
        color: 'primary',
        icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
      },
      {
        stats: counts.count_one,
        title: 'Transferred to lead',
        color: 'success',
        icon: <AccountOutline sx={{ fontSize: '1.75rem' }} />
      },
      {
        stats: counts.total_count,
        title: 'Total contact',
        color: 'info',
        icon: <CellphoneLink sx={{ fontSize: '1.75rem' }} />
      }
    ];
  
    return dynamicSalesData.map((item, index) => (
      <Grid item xs={12} sm={4} key={index}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant="rounded"
          sx={{
            mr: 2,
            width: 60,
            height: 56,
            boxShadow: 3,
            color: 'common.white',
            backgroundColor: (theme) => theme.palette[item.color].main
          }}
        >
          {item.icon}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            {item.title}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {item.stats}
          </Typography>
        </Box>
      </Box>
    </Grid>
    
    ));
  };
  
  const StatisticsCard = () => {
    return (
      <>
        <CardHeader
          title="Statistics Card"
         
          titleTypographyProps={{
            sx: {
              mb: 2.5,
              lineHeight: '2rem !important',
              letterSpacing: '0.15px !important'
            }
          }}
        />
        <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
          <Grid container spacing={5} justifyContent="center">
            {renderStats()}
            <Grid item xs={12}>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </CardContent>
      </>
    );
  };
  
  
  const getPieData = () => {
    if (!counts) {
      return [];
    }
  
    return [
      { name: 'Not Transferred to lead', value: parseInt(counts.count_null), color: '#8884d8' },
      { name: 'Transferred to lead', value: parseInt(counts.count_one), color: '#82ca9d' },
      { name: 'Total Contacts', value: parseInt(counts.total_count), color: '#ffc658' },
      
    ];
  };
  
  const pieData = getPieData();

  const WelcomeScreen = () => {
    return (
      <Card>
        <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
          <PieChartIcon sx={{ fontSize: 60, color: "#333" }} />
          <Typography variant="h5" sx={{ marginTop: 2, fontWeight: "bold" }}>
            Welcome to Contact Dashboard
          </Typography>




          <Grid variant="body1" sx={{ marginTop: 10, marginLeft: 40 }}>
            <StatisticsCard />
          </Grid>
        </Box>
      </Card>
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-contacts.php?UserID=${userid}`
      );
      console.log(response.data.data, "aagaya data userid wise");
      setRows(response.data.data || []);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }

  };



  const handleBack = () => {
    setEditData(null);
    setShowAddDetails(false);
    setShowHistory(false);
    setRowDataToUpdate(null);
    setShowDashboard(false); 
    fetchData();
  };

  const handleEdit = (row) => {
    setEditData(row);
    setRowDataToUpdate(null);
    setShowAddDetails(true);
    setShowHistory(false);
    setFirstVisit(false);
    setShowDashboard(false); 
  };

  const handleShow = (item) => {
    setRowDataToUpdate(item);
    setShowAddDetails(false);
    setShowHistory(false);
    setFirstVisit(false);
    setShowDashboard(false); // Reset showDashboard when showing details
  };

  const handleAddTelecaller = () => {
    setEditData(null);
    setShowAddDetails(false);
    setRowDataToUpdate(null);
    setShowHistory(false);
    setFirstVisit(false);
    setShowDashboard(false); // Ensure dashboard is hidden when adding a contact
    setTimeout(() => {
      setShowAddDetails(true);
    }, 0);
  };

  const handleShowHistory = () => {
    setShowHistory(true);
    setShowAddDetails(false);
    setFirstVisit(false);
    setShowDashboard(false); // Reset showDashboard when showing history
  };

  const handleNavigation = () => {
    setShowDashboard(true);
    setShowAddDetails(false); // Ensure the AddContact form is hidden when navigating to the dashboard
  };


  return (
    <Grid container spacing={6}>
      <Grid item xs={4}>
        <SidebarContactDetails
          rows={rows}
          onItemClick={handleShow}
          onEdit={handleEdit}
          onDashboardClick={handleNavigation}
          onCreate={handleAddTelecaller}
        />
      </Grid>
      <Grid item xs={8}>
        {loading && <CircularProgress />}
        {error && (
          <Alert severity="error">Error fetching data: {error.message}</Alert>
        )}

        {showDashboard && !loading && !error && <WelcomeScreen />}

        {firstVisit && !loading && !error && !showDashboard && (
          <WelcomeScreen />
        )}

        {showAddDetails &&
          !showDashboard && ( // Add !showDashboard condition here
            <AddContact
              show={handleBack}
              editData={editData}
              onDashboardClick={handleNavigation}
            />
          )}

        {!loading &&
          !error &&
          rowDataToUpdate &&
          !showHistory &&
          !showAddDetails &&
          !showDashboard && (
            <ListContact
              item={rowDataToUpdate}
              // onDelete={handleDelete}
              onHistoryClick={handleShowHistory}
              onEdit={handleEdit}
            />
          )}
      </Grid>
    </Grid>
  );
};

export default Contact;
