import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress, Alert, Typography, Box, Avatar, Card, CardContent, CardHeader } from '@mui/material';
import { useRouter } from 'next/router';
import { useCookies } from "react-cookie";
import axios from 'axios';

import AddTellecallingDetails from 'src/views/add-tellecallingDetails/AddTellecallingDetails';
import Sidebar from 'src/views/TellecallingSidebar/Sidebar';
import ListTellecalling from 'src/views/list-tellecalling/ListTellecalling';
import HistoryTelecalling from 'src/views/history-telecalling/HistoryTelecalling';
import PieChartIcon from '@mui/icons-material/PieChart';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import TrendingUp from 'mdi-material-ui/TrendingUp';
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd';
import CellphoneLink from 'mdi-material-ui/CellphoneLink';
import AccountOutline from 'mdi-material-ui/AccountOutline';
import TodaysLoanRemidnerSidebar from 'src/views/SidebarLoan/TodaysLoanRemidnerSidebar';
import TodaysLoanlist from 'src/views/ListLoanReminder/TodaysLoanlist';
import OpenpaymentTemplate from 'src/views/payment-reminder/OpenpaymentTemplate/OpenpaymentTemplate';
import TodaysLoanTemplate from 'src/views/ListLoanReminder/TodaysLoanTemplate/TodaysLoanTemplate';

const TodaysLoanReminder = () => {
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
  const [showDashboard, setShowDashboard] = useState(false);
  const [counts, setCounts] = useState(null);

  const [cookies] = useCookies(["amr"]);
  const userName = cookies.amr?.FullName || 'User';
  const roleName = cookies.amr?.RoleName || 'Admin';


  useEffect(() => {
    fetchData();
    fetchCounts();
  }, []);

  useEffect(() => {
    if (leadData) {
      console.log('Converted Lead:', leadData);
    }
  }, [leadData]);

  const fetchData = async () => {
    const userid = cookies.amr?.UserID || 25;
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-todayloan.php?UserID=${userid}`
      );
      console.log("Loan API Response:", response.data);
      setRows(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };

    const fetchCounts = async () => {
      const userid = cookies.amr?.UserID || 25;
      try {
        const response = await axios.get(
          `https://apiforcornershost.cubisysit.com/api/api-graph-loanreminder.php?UserID=${userid}`
        );
        console.warn("Loan API Response:", response.data);
        setCounts(response.data.data || {});
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
    setShowDashboard(false);

    fetchData();
    fetchCounts();
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
    setShowDashboard(false);
  };

  const handleAddTelecaller = () => {
    setEditData(null);
    setShowAddDetails(false);
    setRowDataToUpdate(null);
    setShowHistory(false);
    setFirstVisit(false);
    setShowDashboard(false);

    setTimeout(() => {
      setShowAddDetails(true);
    }, 0);
  };

  const handleShowHistory = () => {
    setShowHistory(true);
    setShowAddDetails(false);
    setShowDashboard(false);

    setFirstVisit(false);
  };

  const handleNavigation = () => {
    setShowDashboard(true);
    setShowAddDetails(false);
  };

  const renderStats = () => {
    console.log(counts, 'dekh>>>>>>>>>>>>>>>>>>');
    
    if (!counts) {
      return null;
    }

    const dynamicSalesData = [
      {
        stats: counts?.totalBacklogCount,
        title: "Total Backlog",
        color: "primary",
        icon: <TrendingUp sx={{ fontSize: "1.75rem" }} />,
      },
      {
        stats: counts?.totalLoanCount,
        title: "Total Loan",
        color: "success",
        icon: <AccountOutline sx={{ fontSize: "1.75rem" }} />,
      },
      {
        stats: counts?.totalOpenCount,
        color: "warning",
        title: "Total Open",
        icon: <CellphoneLink sx={{ fontSize: "1.75rem" }} />,
      },
      {
        stats: counts?.totalTodayCount,
        color: "info",
        title: "Total Today",
        icon: <CurrencyUsd sx={{ fontSize: "1.75rem" }} />,
      },
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
      {
        name: "Total Backlog",
        value: counts.totalBacklogCount,
        color: "#8884d8",
      },
      { name: "Total Open", value: counts.totalOpenCount, color: "#ffc658" },
      {
        name: "Total Today",
        value: counts.totalTodayCount,
        color: "#a4de6c",
      },
      {
        name: "Total Loan",
        value: counts.totalLoanCount,
        color: "#82ca9d",
      },
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
            Welcome to Loan Dashboard
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
        <TodaysLoanRemidnerSidebar
          rows={rows} 
          onItemClick={handleShow} 
          onEdit={handleEdit} 
          onCreate={handleAddTelecaller} 
          onDashboardClick={handleNavigation} 
        />
      </Grid>
      <Grid item xs={8}>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error.message}</Alert>}
        {showDashboard && !loading && !error && <WelcomeScreen />}
        {!showDashboard && firstVisit && !loading && !error && !leadData && (
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

        {showAddDetails && !showDashboard && (
          <AddTellecallingDetails show={handleBack} editData={editData} />
        )}

{!loading && !error && rowDataToUpdate && !showHistory && !showAddDetails && (
          <TodaysLoanTemplate
            item={rowDataToUpdate}
            rows={rows}
            onDelete={handleDelete}
            onHistoryClick={handleShowHistory}
            onEdit={handleEdit}
          />
        )}

        
      </Grid>
    </Grid>
  );
};

export default TodaysLoanReminder;
