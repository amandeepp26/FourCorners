import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress, Alert, Typography, Box } from '@mui/material';
import axios from 'axios';
import AddOpportunityDetails from 'src/views/add-opportunitydetails/AddOpportunityDetails';
import BacklogSidebar from 'src/views/cancelfollowup/AllBookingCancel/BacklogSidebar';
import ListCancel from 'src/views/cancelfollowup/AllBookingCancel/ListCancel';
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

const backlogcancelfollowup = () => {
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
  const [todayFollowup, setTodayFollowup] = useState(0);
const [backlogFollowup, setBacklogFollowup] = useState(0);
const [nextFollowup, setNextFollowup] = useState(0);
const [transfertooppo, setTransfertooppo] = useState(0);
const [totalFollowup, setTotalFollowup] = useState(0);



  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const userid = cookies.amr?.UserID || 'Role';
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://apiforcornershost.cubisysit.com/api/api-graph-cancelbooking.php?UserID=${userid}`);
      console.log(response.data);
  
      setRows(response.data.data || []);
      
      const counts = response.data.counts || {};
      setTodayFollowup(counts.todayFollowup || 0);
      setBacklogFollowup(counts.backlogFollowup || 0);
      setNextFollowup(counts.nextFollowup || 0);
      setTransfertooppo(counts.transfertooppo || 0);
      setTotalFollowup(counts.totalFollowup || 0);
      
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  const renderStats = () => {
    const dynamicSalesData = [
      { stats: todayFollowup, title: 'Today Follow-ups', color: 'success', icon: <TrendingUp sx={{ fontSize: '1.75rem' }} /> },
      { stats: backlogFollowup, title: 'Backlog Follow-ups', color: 'warning', icon: <TrendingUp sx={{ fontSize: '1.75rem' }} /> },
      { stats: nextFollowup, title: 'Next Follow-ups', color: 'info', icon: <TrendingUp sx={{ fontSize: '1.75rem' }} /> },
      { stats: totalFollowup, title: 'Total Follow-ups', color: 'error', icon: <TrendingUp sx={{ fontSize: '1.75rem' }} /> }
    ];
  
    return (
      <Grid container spacing={2} justifyContent="space-between" alignItems="center">
        {dynamicSalesData.map((item, index) => (
          <Grid item xs={3} key={index}> {/* Adjust xs value based on how many items you want in a row */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                variant='rounded'
                sx={{
                  mr: 2,
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
        ))}
      </Grid>
    );
  };
  
  
  const getPieData = () => {
    return [
      { name: 'Today Follow-ups', value: todayFollowup, color: '#82ca9d' },
      { name: 'Backlog Follow-ups', value: backlogFollowup, color: '#ffc658' },
      { name: 'Next Follow-ups', value: nextFollowup, color: '#ff7300' },
      { name: 'Total Follow-ups', value: totalFollowup, color: '#ff0000' }
    ];
  };
  
  const StatisticsCard = () => {
    return (
      <>
        <CardHeader title='Statistics Card' />
        <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
          <Grid container spacing={[5, 0]}>
            {renderStats()}
            <Grid item xs={12}>
              <ResponsiveContainer width='100%' height={400}>
                <PieChart>
                  <Pie data={getPieData()} dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius={120} fill='#8884d8' label>
                    {getPieData().map((entry, index) => (
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
          Welcome to All Booking Cancel Dashboard
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

    setFirstVisit(true);
    setShowAddDetails(false); // Ensure the AddOpportunityDetails form is hidden when navigating to the dashboard
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={4}>
        <BacklogSidebar 
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
        {firstVisit && !loading && !error && !leadData && (
          <WelcomeScreen />
        )}

        {showAddDetails && !loading && !error && (
          <AddOpportunityDetails 
            show={handleBack} 
            editData={editData}   
            leadData={leadData}
          />
        )}

       

     

        {!loading && !error && rowDataToUpdate && !showHistory && !showAddDetails && !showDashboard && (
          <ListCancel
            item={rowDataToUpdate}
            onDelete={handleDelete}
            onHistoryClick={handleShowHistory}
            onEdit={handleEdit}
          />
        )}

       
      </Grid>
    </Grid>
  );
};
export default backlogcancelfollowup;