import React, { useState, useEffect } from "react";
import { Grid, CircularProgress, Alert, Typography, Box } from "@mui/material";
import axios from "axios";
import { useCookies } from "react-cookie";
import TodayPaymentTemplate from "src/views/payment-reminder/TodayPaymentTemplate/TodayPaymentTemplate";
import TodayPayment from "src/views/payment-reminder/TodayPaymentSidebar/TodayPayment";

import TrendingUp from "mdi-material-ui/TrendingUp";
import CurrencyUsd from "mdi-material-ui/CurrencyUsd";
import CellphoneLink from "mdi-material-ui/CellphoneLink";
import AccountOutline from "mdi-material-ui/AccountOutline";
import CardContent from "@mui/material/CardContent";
import { useRouter } from "next/router";
import PieChartIcon from "@mui/icons-material/PieChart";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TodaysFollowupPayment = ({ initialRows }) => {
  const router = useRouter();
  const { lead } = router.query;
  const leadData = lead ? JSON.parse(lead) : null;
  const [rows, setRows] = useState(initialRows);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState(null);
  const [rowDataToUpdate, setRowDataToUpdate] = useState(null);
  const [showAddDetails, setShowAddDetails] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [firstVisit, setFirstVisit] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  const [counts, setCounts] = useState(null);
  const [cookies] = useCookies(["amr"]);
  const userid = cookies.amr?.UserID || "Role";

  useEffect(() => {
    if (!initialRows) {
      fetchData();
      fetchCounts();
    }
  }, []);

  const fetchData = async () => {

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-todayereminder.php?UserID=${userid}`
      );
      setRows(response.data.data || []);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };


      const fetchCounts = async () => {
        const userid = cookies.amr?.UserID || 25;
        try {
          const response = await axios.get(
            `https://apiforcornershost.cubisysit.com/api/api-graph-paymentreminder.php?UserID=${userid}`
          );
          console.warn("Payment API Response:", response.data);
          setCounts(response.data.data || {});
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(error);
          setLoading(false);
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
    setFirstVisit(false);
  };


  const salesData = [
    {
      stats: counts?.totalBacklogCount,
      title: "Total Backlog",
      color: "primary",
      icon: <TrendingUp sx={{ fontSize: "1.75rem" }} />,
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
    {
      stats: counts?.totalPaymentCount,
      title: "Total Payment",
      color: "success",
      icon: <AccountOutline sx={{ fontSize: "1.75rem" }} />,
    },
  ];

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
      {
        name: "Total Payment",
        value: counts.totalPaymentCount,
        color: "#82ca9d",
      },
      { name: "Total Open", value: counts.totalOpenCount, color: "#ffc658" },
      {
        name: "Total Today",
        value: counts.totalTodayCount,
        color: "#a4de6c",
      },
    ];
  };

  const pieData = getPieData();

  const renderStats = () => {
    return salesData.map((item, index) => (
      <Grid item xs={12} sm={3} key={index}>
        <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            variant="rounded"
            sx={{
              mr: 3,
              width: 44,
              height: 44,
              boxShadow: 3,
              color: "common.white",
              backgroundColor: `${item.color}.main`,
            }}
          >
            {item.icon}
          </Avatar>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="caption">{item.title}</Typography>
            <Typography variant="h6">{item.stats}</Typography>
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
              lineHeight: "2rem !important",
              letterSpacing: "0.15px !important",
            },
          }}
        />
        <CardContent sx={{ pt: (theme) => `${theme.spacing(3)} !important` }}>
          <Grid container spacing={[5, 0]}>
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

  const WelcomeScreen = () => {
    return (
      <Card>
        <Box sx={{ textAlign: "center", marginTop: "20px" }}>
          <PieChartIcon sx={{ fontSize: 60, color: "#333" }} />
          <Typography variant="h5" sx={{ marginTop: 2, fontWeight: "bold" }}>
            Welcome to Payment Dashboard
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
        <TodayPayment
          rows={rows}
          onItemClick={handleShow}
          onEdit={handleEdit}
          onCreate={handleAddTelecaller}
        />
      </Grid>
       <Grid item xs={8}>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error.message}</Alert>}
      {showDashboard && !loading && !error && <WelcomeScreen />}
      {!showDashboard && firstVisit && !loading && !error && !leadData && (
        <WelcomeScreen />
      )}

      {!loading && !error && rowDataToUpdate && !showHistory && !showAddDetails && (
        <TodayPaymentTemplate
          item={rowDataToUpdate}
          rows={rows}
          onHistoryClick={handleShowHistory}
          onEdit={handleEdit}
        />
      )}
      </Grid>
    </Grid>
  );
};



export default TodaysFollowupPayment;
