import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress, Alert, Typography, Box } from '@mui/material';
import axios from 'axios';
import AddTellecallingDetails from 'src/views/add-tellecallingDetails/AddTellecallingDetails';
import MyleadSidebar from 'src/views/TellecallingSidebar/Mylead/MyleadSidebar';
import Listmylead from 'src/views/list-tellecalling/Mylead/Listmylead';
import HistoryTelecalling from 'src/views/history-telecalling/HistoryTelecalling';
import PieChartIcon from '@mui/icons-material/PieChart';
import Card from '@mui/material/Card'
import TrendingUp from 'mdi-material-ui/TrendingUp'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import CellphoneLink from 'mdi-material-ui/CellphoneLink'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import CardContent from '@mui/material/CardContent'
import { useCookies } from "react-cookie";
import CardHeader from '@mui/material/CardHeader'
import Avatar from '@mui/material/Avatar'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import ListNotIntrested from 'src/views/list-opportunity/NotIntrested/ListNotIntrested';
import OpportunityNotinterested from 'src/views/opportunitysidebar/NotInrested/OpportunityNotinterested';
import HistoryNotIntereted from 'src/views/history-apportunity/HistoryNotIntereted/HistoryNotIntereted';

const NotInterested = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState(null);
  const [rowDataToUpdate, setRowDataToUpdate] = useState(null);
  const [showAddDetails, setShowAddDetails] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [firstVisit, setFirstVisit] = useState(true);
  const [cookies, setCookie] = useCookies(["amr"]);
  const userid = cookies.amr?.UserID || 'Role';
  const [counts, setCounts] = useState(null);




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
        stats: counts.notInterested,
        color: 'warning',
        title: 'Not Intrested',
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
      <Grid item xs={4}>
        <OpportunityNotinterested rows={rows} onItemClick={handleShow} onEdit={handleEdit} onCreate={handleAddTelecaller} />
      </Grid>
      <Grid item xs={8}>
        {loading && <CircularProgress />}
        {/* {error && <Alert severity="error">Error fetching data: {error.message}</Alert>} */}

        {firstVisit && !loading && !error && (
          <WelcomeScreen />

        )}

        {/* {showAddDetails && (
          <AddTellecallingDetails show={handleBack} editData={editData} />
        )} */}

        {!loading && !error && rowDataToUpdate && !showHistory && !showAddDetails && (
          <ListNotIntrested
            item={rowDataToUpdate}
            // onDelete={handleDelete}
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
              <HistoryNotIntereted item={rowDataToUpdate} onBack={handleBack} />
            </Box>
          </Box>
        )}

      </Grid>
    </Grid>
  );
};

export default NotInterested;
