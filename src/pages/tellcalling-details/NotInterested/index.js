import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress, Alert, Typography, Box, Card, CardContent, CardHeader, Avatar } from '@mui/material';
import axios from 'axios';
import PieChartIcon from '@mui/icons-material/PieChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CancelIcon from '@mui/icons-material/Cancel';
import LeadNotintrestedSidebar from 'src/views/TellecallingSidebar/LeadNotIntrested/LeadNotintrestedSidebar';
import ListNotInterested from 'src/views/list-tellecalling/Notintrested/ListNotInterested';
import { useCookies } from "react-cookie";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import AddTellecallingDetails from 'src/views/add-tellecallingDetails/AddTellecallingDetails'; // Uncomment if needed
import HistoryNotinterested from 'src/views/history-telecalling/HistoryNotinterested/HistoryNotinterested';

const NotIntrestedLead = () => {
  const [rows, setRows] = useState([]);
  const [counts, setCounts] = useState(null); // Add state for counts
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState(null);
  const [rowDataToUpdate, setRowDataToUpdate] = useState(null);
  const [showAddDetails, setShowAddDetails] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [firstVisit, setFirstVisit] = useState(true);
  const [cookies] = useCookies(["amr"]);

  const userid = cookies.amr?.UserID || 'Role';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const userid = cookies.amr?.UserID || 'Role';
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://apiforcornershost.cubisysit.com/api/api-graph-lead.php?UserID=${userid}`);
      console.log(response.data.counts , 'api res');
      
      setRows(response.data.data || []);
      setCounts(response.data.counts || {});
    } catch (error) {
      setError(error);
    } finally {
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
    setShowAddDetails(true);
    setRowDataToUpdate(null);
    setShowHistory(false);
    setFirstVisit(false);
  };

  const handleShowHistory = () => {
    setShowHistory(true);
    setShowAddDetails(false);
    setFirstVisit(false);
  };

  const renderStats = () => {
    if (!counts) return null;

    const salesData = [
     
      {
        stats: counts.notInterested || '0',
        title: 'Not Intrested',
        color: 'warning',
        icon: <FavoriteIcon sx={{ fontSize: '1.75rem' }} />
      },
     
    ];

    return salesData.map((item, index) => (
      <Grid item xs={12} sm={3} key={index}>
        <Box key={index} sx={{ display: 'flex', alignItems: 'center' , marginLeft:80}}>
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
    if (!counts) return [];

    return [
      // { name: 'Today Leads', value: counts.todayFollowup || 0, color: '#3f51b5' },
      // { name: 'Backlog Pending', value: counts.backlogFollowup || 0, color: '#4caf50' },
      { name: 'Not Interested', value: counts.notInterested || 0, color: '#ff9800' },
      // { name: 'Total follow up', value: counts.totalFollowup || 0, color: '#00acc1' }
    ];
  };

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
            Welcome to Not Interested Dashboard
          </Typography>
          <Grid variant="body1" sx={{ marginTop: 10, marginLeft: 20 }}>
            <StatisticsCard />
          </Grid>
        </Box>
      </Card>
    );
  };

  return (
    <Grid container spacing={6}>
    <Grid item xs={12} md={4} style={{background:"white",zIndex:"99",display:"flex", flexWrap:"wrap"}}>
        <LeadNotintrestedSidebar rows={rows} onItemClick={handleShow} onEdit={handleEdit} onCreate={handleAddTelecaller} />
      </Grid>
      <Grid item xs={8}>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">Error loading data: {error.message}</Alert>}

        {firstVisit && !loading && !error && (
          <WelcomeScreen />
        )}

        {showAddDetails && (
          <AddTellecallingDetails show={handleBack} editData={editData} />
        )}

        {!loading && !error && rowDataToUpdate && !showHistory && !showAddDetails && (
          <ListNotInterested
            item={rowDataToUpdate}
            onDelete={handleDelete}
            onHistoryClick={handleShowHistory}
            onEdit={handleEdit}
          />
        )}

{!loading && !error && showHistory && (
          <Box display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh">
            <Typography variant="body2" sx={{ marginTop: 5, fontWeight: "bold",textAlign:'center', fontSize: 20, }}>
              User History
            </Typography>
            <HistoryNotinterested item={rowDataToUpdate} onBack={handleBack} />
          </Box>
        )}

      </Grid>
    </Grid>
  );
};

export default NotIntrestedLead;
