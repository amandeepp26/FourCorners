import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress, Alert, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import Addtemplate from 'src/views/add-template/Addtemplate';
import Sidebar from 'src/views/add-template/Sidebartemplate';
import Listtemplate from 'src/views/list-template/Listtemplate';
import HistoryTelecalling from 'src/views/history-telecalling/HistoryTelecalling';
import PieChartIcon from '@mui/icons-material/PieChart';
import Card from '@mui/material/Card';
import TrendingUp from 'mdi-material-ui/TrendingUp';
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd';
import DotsVertical from 'mdi-material-ui/DotsVertical';
import CellphoneLink from 'mdi-material-ui/CellphoneLink';
import AccountOutline from 'mdi-material-ui/AccountOutline';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { useCookies } from "react-cookie";

import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import  Photo  from 'src/pages/404'

const StatisticsCard = () => {
  const [pieData, setPieData] = useState([]);
  const [totalTemplates, settotalTemplates] = useState(0);  // Store totalTemplates
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch campaign data
  const fetchCampaignData = async () => {
    try {
      const response = await axios.get("https://apiforcornershost.cubisysit.com/api/api-graph-template.php");
      if (response.data.status === "Success") {
        const totalTemplates = parseInt(response.data.counts.totalTemplates, 10);
        settotalTemplates(totalTemplates);  // Set the fetched totalTemplates
        setPieData([
          { name: "Templates", value: totalTemplates, color: "#3f51b5" },
        ]);
      }
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignData();
  }, []);

  const salesData = [
    {
      stats: totalTemplates, 
      title: "Total Templates", 
      color: "success", 
      icon: <TrendingUp sx={{ fontSize: "1.75rem" }} /> 
    },
   
  ];

  const renderStats = () => {
    return salesData.map((item, index) => (
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        key={index}
        sx={{
          display: "flex",
          justifyContent: "center", // Center horizontally
          alignItems: "center",     // Center vertically
          textAlign: "center",      // Center the text
          marginBottom: "16px",     // Add some space between cards (optional)
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",  // Stack the icon and text vertically
          }}
        >
          <Avatar
            variant="rounded"
            sx={{
              mb: 2, // Adds margin below the icon
              width: 44,
              height: 44,
              boxShadow: 3,
              color: "common.white",
              backgroundColor: `${item.color}.main`,
            }}
          >
            {item.icon}
          </Avatar>
          <Typography variant="caption">{item.title}</Typography>
          <Typography variant="h6">{item.stats}</Typography>
        </Box>
      </Grid>
    ));
  };
  
  return (
    <Card>
      <CardHeader
        title="Statistics Card"
        subheader={
          <Typography variant="body2">
            <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
              Total growth
            </Box>{" "}
            😎 this month
          </Typography>
        }
      />
      <CardContent sx={{ pt: (theme) => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={5} sx={{ justifyContent: "center" }}>
          {renderStats()}
          <Grid item xs={12}>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Alert severity="error">Error fetching data: {error.message}</Alert>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
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
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
  
};

const WelcomeScreen = () => {
  return (
    <Card>
      <Box sx={{ textAlign: "center", marginTop: "20px" }}>
        <PieChartIcon sx={{ fontSize: 60, color: "#333" }} />
        <Typography variant="h5" sx={{ marginTop: 2, fontWeight: "bold" }}>
          Welcome to Template Dashboard
        </Typography>
        <Grid variant="body1" sx={{ marginTop: 10 }}>
          <StatisticsCard />
        </Grid>
      </Box>
    </Card>
  );
};


const Tellecalling = () => {
  const router = useRouter();
  const { lead } = router.query;
  const leadData = lead ? JSON.parse(lead) : null;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState(null);
  const [rowDataToUpdate, setRowDataToUpdate] = useState(null);
  const [showAddDetails, setShowAddDetails] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [firstVisit, setFirstVisit] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (leadData) {
      console.log('Converted Lead:', leadData);
    }
  }, [leadData]);

  
  const [cookies, setCookie] = useCookies(["amr"]);
  const userName = cookies.amr?.FullName || 'User';
  const roleName = cookies.amr?.RoleName || 'Admin';
  const userid = cookies.amr?.UserID || 'Role';
  console.log(userName, 'ye dekh username');
  console.log(roleName, 'ye dekh rolname');
  console.log(userid, 'ye dekh roleide');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-telecalling.php?UserID=${userid}`
      );
      console.log("API Response:", response.data);
      setRows(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.post('https://proxy-forcorners.vercel.app/api/proxy/api-delete-telecalling.php', {
        Tid: id,
        DeleteUID: 1
      });
      if (response.data.status === 'Success') {
        setRows(rows.filter(row => row.Tid !== id));
        setRowDataToUpdate(null);
        setShowAddDetails(false);
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleBack = () => {
    setEditData(null);
    setShowAddDetails(false);
    setShowHistory(false);
    setRowDataToUpdate(null);
    fetchData();
  };

  const handleEdit = (row) => {
    setEditData(row);
    setRowDataToUpdate(null);
    setShowAddDetails(true);
    setShowHistory(false);
    setFirstVisit(false);
  };

  const handleShow = (item) => {
    setRowDataToUpdate(item);
    setShowAddDetails(false);
    setShowHistory(false);
    setFirstVisit(false);
  };

  const handleAddTelecaller = () => {
    setEditData(null);
    setShowAddDetails(false);
    setRowDataToUpdate(null);
    setShowHistory(false);
    setFirstVisit(false);
    setTimeout(() => {
      setShowAddDetails(true);
    }, 0);
  };

  const handleShowHistory = () => {
    setShowHistory(true);
    setShowAddDetails(false);
    setFirstVisit(false);
  };

  return (
    <Grid container spacing={6}>
     <Grid item xs={12} md={4} style={{background:"white",zIndex:"99",display:"flex", flexWrap:"wrap"}}>
        <Sidebar rows={rows} onItemClick={handleShow} onEdit={handleEdit} onCreate={handleAddTelecaller} />
      </Grid>
      <Grid item xs={8}>
        {loading && <CircularProgress />}
        {/* {error && <Alert></Alert>} */}

        {firstVisit && !loading && !error && !leadData && (
          <WelcomeScreen />
        )}

        {leadData && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Converted Lead Details
            </Typography>
            {/* Render lead data details */}
            <pre>{JSON.stringify(leadData, null, 2)}</pre>
          </Box>
        )}

        {showAddDetails && (
          <Addtemplate show={handleBack} editData={editData} />
        )}

        {!loading && !error && rowDataToUpdate && !showHistory && !showAddDetails && (
          <Listtemplate
            item={rowDataToUpdate}
            onDelete={handleDelete}
            onHistoryClick={handleShowHistory}
            onEdit={handleEdit}
          />
        )}

        {!loading && !error && showHistory && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
          >
            <Typography variant="body2" sx={{ marginTop: 5, fontWeight: "bold", alignItems: 'center', textAlign: 'center', fontSize: 20 }}>
              User History
            </Typography>
            <HistoryTelecalling item={rowDataToUpdate} onBack={handleBack} />
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default Tellecalling;
