import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress, Alert, Typography, Box } from '@mui/material';
import axios from 'axios';
import AddOpportunityDetails from 'src/views/add-opportunitydetails/AddOpportunityDetails';
import Sidebar from 'src/views/opportunitysidebar/Sidebar';
import ListOpportunity from 'src/views/list-opportunity/ListOpportunity';
import HistoryOpportunity from 'src/views/history-apportunity/HistoryOpportunity';
import PieChartIcon from '@mui/icons-material/PieChart';
import Card from '@mui/material/Card';
import TrendingUp from 'mdi-material-ui/TrendingUp';
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd';
import CellphoneLink from 'mdi-material-ui/CellphoneLink';
import AccountOutline from 'mdi-material-ui/AccountOutline';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { useRouter } from 'next/router';

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { useCookies } from 'react-cookie';

const opportunity = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState(null);
  const [leadData, setLeadData] = useState(null);

  
  const [rowDataToUpdate, setRowDataToUpdate] = useState(null);
  const [showAddDetails, setShowAddDetails] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [firstVisit, setFirstVisit] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false); 
  const [counts, setCounts] = useState(null);
  const [cookies, setCookie] = useCookies(["amr"]);



  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const userid = cookies.amr?.UserID || 'Role';
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://apiforcornershost.cubisysit.com/api/api-graph-oppo.php?UserID=${userid}`);
      setRows(response.data.data || []);
      setCounts(response.data.counts || {});
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  const router = useRouter();

  const renderStats = () => {
    console.log(counts, 'dekh>>>>>>>>>>>>>>>>>>');
    
    if (!counts) {
      return null;
    }

    const dynamicSalesData = [
      {
        stats: counts?.todayFollowup,
        title: 'Today Followups',
        color: 'primary',
        icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
      },
      {
        stats: counts?.backlogFollowup,
        title: 'Backlog Followups',
        color: 'success',
        icon: <AccountOutline sx={{ fontSize: '1.75rem' }} />
      },
      {
        stats: counts.nextFollowup,
        color: 'warning',
        title: 'Open Opportunity',
        icon: <CellphoneLink sx={{ fontSize: '1.75rem' }} />
      },
      {
        stats: counts.totalFollowup,
        color: 'info',
        title: 'Total Followups',
        icon: <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
      }
    ];

    return dynamicSalesData.map((item, index) => (
      <Grid item xs={12} sm={3} key={index}>
        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            variant='rounded'
            sx={{
              mr: 3,
              width: 44,
              height: 44,
              boxShadow: 3,
              color: 'common.white',
              backgroundColor: `${item.color}.main`
            }}
          >
            {item.icon}
          </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='caption'>{item.title}</Typography>
            <Typography variant='h6'>{item.stats}</Typography>
          </Box>
        </Box>
      </Grid>
    ));
  };

  const getPieData = () => {
    if (!counts) {
      return [];
    }

    return [
      { name: 'Today Followups', value: counts.todayFollowup, color: '#8884d8' },
      { name: 'Backlog Followups', value: counts.backlogFollowup, color: '#82ca9d' },
      { name: 'Next Followups', value: counts.nextFollowup, color: '#ffc658' },
      { name: 'Total Followups', value: counts.totalFollowup, color: '#a4de6c' }
    ];
  };


  const pieData = getPieData();

  const StatisticsCard = () => {
    return (
      <>
        <CardHeader
          title='Statistics Card'
          subheader={
            <Typography variant='body2'>
              <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
                Total 48.5% growth
              </Box>{' '}
              😎 this month
            </Typography>
          }
          titleTypographyProps={{
            sx: {
              mb: 2.5,
              lineHeight: '2rem !important',
              letterSpacing: '0.15px !important'
            }
          }}
        />
        <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
          <Grid container spacing={[5, 0]}>
            {renderStats()}
            <Grid item xs={12}>
              <ResponsiveContainer width='100%' height={400}>
                <PieChart>
                  <Pie data={pieData} dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius={120} fill='#8884d8' label>
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

const WelcomeScreen = () => {
  return (
    <Card>
      <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
        <PieChartIcon sx={{ fontSize: 60, color: "#333" }} />
        <Typography variant="h5" sx={{ marginTop: 2, fontWeight: "bold" }}>
          Welcome to Opportunity Dashboard
        </Typography>
        <Grid variant="body1" sx={{ marginTop: 10, marginLeft: 20 }}>
          <StatisticsCard />
        </Grid>
      </Box>
    </Card>
  );
};




useEffect(() => {
  // Fetch data on initial render
  fetchData();

  // Retrieve the notification flag and selected notification from localStorage
  const showAddDetailsFlag = localStorage.getItem('showAddDetails');
  const selectedNotification = localStorage.getItem('selectedNotification');
  
  // Log the retrieved data
  console.log('showAddDetailsFlag:>>>>>>>>>>>>>>>>>>', showAddDetailsFlag);
  console.log('selectedNotification:>>>>>>>>>>>>>>>>>>>>>>>>>>>', selectedNotification ? JSON.parse(selectedNotification) : null);

  if (showAddDetailsFlag === 'true') {
    setShowAddDetails(true);
    setLeadData(selectedNotification ? JSON.parse(selectedNotification) : null);
    localStorage.removeItem('showAddDetails'); // Clear flag
  } else {
    setShowAddDetails(false);
  }

  // If the route query has showAddDetails parameter, set the state
  if (router.query.showAddDetails) {
    setShowAddDetails(true);
    setFirstVisit(false);
  }

  // Log route query parameters
  console.log('Router Query:>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', router.query);

}, [router.query]);


  // const fetchData = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await axios.get(`https://apiforcornershost.cubisysit.com/api/api-fetch-opportunity.php?UserID=${userid}`);
  //     setRows(response.data.data || []);
  //   } catch (error) {
  //     setError(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleDelete = async (id) => {
    try {
      const response = await axios.post('https://proxy-forcorners.vercel.app/api/proxy/api-delete-opportunity.php', {
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
    setShowDashboard(false); // Reset showDashboard when navigating back
    fetchData();
  };

  const handleEdit = (row) => {
    setEditData(row);
    setRowDataToUpdate(null);
    setShowAddDetails(true);
    setShowHistory(false);
    setShowDashboard(false); // Reset showDashboard when editing
    setFirstVisit(false);
  };

  const handleShow = (item) => {
    setRowDataToUpdate(item);
    setShowAddDetails(false);
    setShowHistory(false);
    setShowDashboard(false); // Reset showDashboard when showing details
    setFirstVisit(false);
  };

  const handleAddTelecaller = () => {
    setEditData(null);
    setShowAddDetails(false);
    setRowDataToUpdate(null);
    setShowHistory(false);
    setShowDashboard(false); // Ensure dashboard is hidden when adding a contact
    setFirstVisit(false);
    setTimeout(() => {
      setShowAddDetails(true);
    }, 0);
  };

  const handleShowHistory = () => {
    setShowHistory(true);
    setShowAddDetails(false);
    setShowDashboard(false); // Reset showDashboard when showing history
    setFirstVisit(false);
  };

  const handleNavigation = () => {
    setShowDashboard(true);
    setShowAddDetails(false); // Ensure the AddOpportunityDetails form is hidden when navigating to the dashboard
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={4}>
        <Sidebar 
          rows={rows} 
          onItemClick={handleShow} 
          onEdit={handleEdit} 
          onCreate={handleAddTelecaller} 
          onDashboardClick={handleNavigation} 
        />
      </Grid>
      <Grid item xs={8}>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">Error fetching data: {error.message}</Alert>}

        {showAddDetails && !loading && !error && (
          <AddOpportunityDetails 
            show={handleBack} 
            editData={editData} 
            leadData={leadData}
          />
        )}

        {showDashboard && !loading && !error && (
         <WelcomeScreen/>
        )}

     

        {!loading && !error && rowDataToUpdate && !showHistory && !showAddDetails && !showDashboard && (
          <ListOpportunity
            item={rowDataToUpdate}
            onDelete={handleDelete}
            onHistoryClick={handleShowHistory}
            onEdit={handleEdit}
          />
        )}

        {!loading && !error && showHistory && (
          <Box 
            display="flex"
            flexDirection="row"
            alignItems="flex-start"
            minHeight="100vh"
          >
            <Box flex="1">
              <Typography variant="body2" sx={{ marginTop: 5, fontWeight: "bold", fontSize: 20 }}>
                User History
              </Typography>
              <HistoryOpportunity item={rowDataToUpdate} onBack={handleBack} />
            </Box>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default opportunity;