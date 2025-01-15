import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress, Alert, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import Listprojectinfo from 'src/views/projectinfo/ListProjectinfo';
import AddProjectinfo from 'src/views/projectinfo/AddProjectinfo';
import Sidebarprojectinfo from 'src/views/projectinfo/Sidebarprojectinfo'
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
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';


const ProjectMaster = () => {
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
  const [counts, setCounts] = useState(null);
  const [totalProjects, setTotalProjects] = useState(0);


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (leadData) {
      console.log('Converted Lead:', leadData);
    }
  }, [leadData]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://apiforcornershost.cubisysit.com/api/api-fetch-projecttotal.php');
      console.log(response.data); // Verify API response
      setRows(response.data.data || []);
      setTotalProjects(response.data.totalProjects || 0); // Ensure totalProjects is set
      setLoading(false);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  



  const renderStats = () => {
    if (!counts && totalProjects === 0) { // Check if totalProjects is zero
      return null;
    }
  
    const dynamicSalesData = [
      {
        stats: totalProjects, // This should reflect the correct count
        title: 'Total Projects',
        color: 'primary',
        icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
      }
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
            <Typography variant='h6'>{item.stats}</Typography> {/* Display totalProjects here */}
          </Box>
        </Box>
      </Grid>
    ));
  };
  
  const getPieData = () => {
    if (counts) {
      return [];
    }

    return [
      { name: 'Total Projects', value: totalProjects, color: '#8884d8' },
    
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
            Welcome to Project Dashboard
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
        <Sidebarprojectinfo rows={rows} onItemClick={handleShow} onEdit={handleEdit} onCreate={handleAddTelecaller} />
      </Grid>
      <Grid item xs={8}>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">Error fetching data: {error.message}</Alert>}

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
          <AddProjectinfo show={handleBack} editData={editData} />
        )}

        {!loading && !error && rowDataToUpdate && !showHistory && !showAddDetails && (
          <Listprojectinfo
            item={rowDataToUpdate}
            // onDelete={handleDelete}
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

export default ProjectMaster;
