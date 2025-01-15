import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress, Alert, Typography, Box } from '@mui/material';
import axios from 'axios';
import PieChartIcon from '@mui/icons-material/PieChart';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Avatar from '@mui/material/Avatar'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import { useCookies } from "react-cookie";
import TransferOpportunitySIdebar from 'src/views/TellecallingSidebar/TransferOpportunity/TransferOpportunitySIdebar';
import ListTransferOpportunity from 'src/views/list-tellecalling/ListTransferOpportunity/ListTransferOpportunity';
import TrendingUp from 'mdi-material-ui/TrendingUp';
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd';
import CellphoneLink from 'mdi-material-ui/CellphoneLink';
import AccountOutline from 'mdi-material-ui/AccountOutline';
import HistoryOpportunityTransfer from 'src/views/history-telecalling/HistoryOpportunityTransfer/HistoryOpportunityTransfer';


const TransferOpportunityData  = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState(null);
  const [rowDataToUpdate, setRowDataToUpdate] = useState(null);
  const [showAddDetails, setShowAddDetails] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [firstVisit, setFirstVisit] = useState(true);
  const [cookies, setCookie] = useCookies(["amr"]);
  const [counts, setCounts] = useState(null);

  const [showDashboard, setShowDashboard] = useState(false); 

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    const userid = cookies.amr?.UserID || 25;
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-graph-lead.php?UserID=${userid}`
      );
      console.log("API Response:", response.data);
      setRows(response.data.data || []);
      setCounts(response.data.counts || {});
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };

  const renderStats = () => {
    console.log(counts, 'dekh>>>>>>>>>>>>>>>>>>');
    
    if (!counts) {
      return null;
    }

    const dynamicSalesData = [
      // {
      //   stats: counts?.todayFollowup,
      //   title: 'Today Followups',
      //   color: 'primary',
      //   icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
      // },
      // {
      //   stats: counts?.backlogFollowup,
      //   title: 'Backlog Followups',
      //   color: 'success',
      //   icon: <AccountOutline sx={{ fontSize: '1.75rem' }} />
      // },
      {
        stats: counts.transfertooppo,
        color: 'warning',
        title: 'Transfer to Opportunity',
        icon: <CellphoneLink sx={{ fontSize: '1.75rem' }} />
      },
      // {
      //   stats: counts.totalFollowup,
      //   color: 'info',
      //   title: 'Total Followups',
      //   icon: <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
      // }
    ];

    return dynamicSalesData.map((item, index) => (
      <Grid item xs={12} ml={80} key={index}>
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
      { name: 'Tranfer to Opportunity', value: counts.transfertooppo, color: '#8884d8' },
      // { name: 'Backlog Followups', value: counts.backlogFollowup, color: '#82ca9d' },
      // { name: 'Next Followups', value: counts.nextFollowup, color: '#ffc658' },
      // { name: 'Total Followups', value: counts.totalFollowup, color: '#a4de6c' }
    ];
  };

  const pieData = getPieData();

  const StatisticsCard = () => {
    return (
      <>
        <CardHeader
          title='Statistics Card'
         
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
            Welcome to Telecalling Dashboard
          </Typography>


          <Grid variant="body1" sx={{ marginTop: 10, marginLeft: 20 }}>
            <StatisticsCard />
          </Grid>
        </Box>
      </Card>
    );
  };

  // useEffect(() => {
  //   fetchDataDashboard();
  // }, []);

  // const fetchDataDashboard = async () => {
  //   const userid = cookies.amr?.UserID || 'Role';
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await axios.get(`https://apiforcornershost.cubisysit.com/api/api-sidebar-transfertooppo.php?UserID=${userid}`);
  //     setRows(response.data.data || []);
  //   } catch (error) {
  //     setError(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  



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
  const handleNavigation = () => {
    setShowDashboard(true);
    setShowAddDetails(false); // Ensure the AddOpportunityDetails form is hidden when navigating to the dashboard
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={4}>
        <TransferOpportunitySIdebar
          onDashboardClick={handleNavigation} 
        
        
        rows={rows} onItemClick={handleShow} onEdit={handleEdit} onCreate={handleAddTelecaller}  />
      </Grid>
      <Grid item xs={8}>
        {loading && <CircularProgress />}
        {/* {error && <Photo/>} */}

        {firstVisit && !loading && !error && (
          <WelcomeScreen />

        )}

        {/* {showAddDetails && (
          <AddTellecallingDetails show={handleBack} editData={editData} />
        )} */}

        {!loading && !error && rowDataToUpdate && !showHistory && !showAddDetails && !showDashboard && (
          <ListTransferOpportunity
            item={rowDataToUpdate}
            onDelete={handleDelete}
            onHistoryClick={handleShowHistory}
            onEdit={handleEdit}
          />
        )}
         {showDashboard && !loading && !error && (
         <WelcomeScreen/>
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
        <HistoryOpportunityTransfer item={rowDataToUpdate} onBack={handleBack} />
      </Box>
    )}

      </Grid>
    </Grid>
  );
};

export default TransferOpportunityData;
