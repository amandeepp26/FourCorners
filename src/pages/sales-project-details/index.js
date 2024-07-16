import React, { useState, useEffect } from "react";
import { Grid, CircularProgress, Alert, Typography, Box } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import AddTellecallingDetails from "src/views/add-tellecallingDetails/AddTellecallingDetails";

import ListTellecalling from "src/views/list-tellecalling/ListTellecalling";
import HistoryTelecalling from "src/views/history-telecalling/HistoryTelecalling";
import PieChartIcon from "@mui/icons-material/PieChart";
import Card from "@mui/material/Card";
import TrendingUp from "mdi-material-ui/TrendingUp";
import CurrencyUsd from "mdi-material-ui/CurrencyUsd";
import DotsVertical from "mdi-material-ui/DotsVertical";
import CellphoneLink from "mdi-material-ui/CellphoneLink";
import AccountOutline from "mdi-material-ui/AccountOutline";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { useCookies } from "react-cookie";

import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AddcampaignDetails from "src/views/AddcampaignDetail/AddcampaignDetail";
import Sidebar from "src/views/salesProjectDetailsSidebar/Sidebar";
import AddProjectDetails from "src/views/AddProjectDetails/AddProjectDetails";

const salesData = [
  {
    stats: "245k",
    title: "Sales",
    color: "primary",
    icon: <TrendingUp sx={{ fontSize: "1.75rem" }} />,
  },
  {
    stats: "12.5k",
    title: "Customers",
    color: "success",
    icon: <AccountOutline sx={{ fontSize: "1.75rem" }} />,
  },
  {
    stats: "1.54k",
    color: "warning",
    title: "Products",
    icon: <CellphoneLink sx={{ fontSize: "1.75rem" }} />,
  },
  {
    stats: "$88k",
    color: "info",
    title: "Revenue",
    icon: <CurrencyUsd sx={{ fontSize: "1.75rem" }} />,
  },
];

const pieData = [
  { name: "Sales", value: 2000, color: "#3f51b5" },
  { name: "Customers", value: 1200, color: "#4caf50" },
  { name: "Products", value: 1540, color: "#ff9800" },
  { name: "Revenue", value: 8000, color: "#00acc1" },
];

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
        subheader={
          <Typography variant="body2">
            <Box
              component="span"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Total 48.5% growth
            </Box>{" "}
            😎 this month
          </Typography>
        }
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
          Welcome to Project detail Dashboard
        </Typography>
        <Grid variant="body1" sx={{ marginTop: 10, marginLeft: 20 }}>
          <StatisticsCard />
        </Grid>
      </Box>
    </Card>
  );
};

const SalesProjectDetails = () => {
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
      console.log("Converted Lead:", leadData);
    }
  }, [leadData]);

  const [cookies, setCookie] = useCookies(["amr"]);
  const userName = cookies.amr?.FullName || "User";
  const roleName = cookies.amr?.RoleName || "Admin";
  const userid = cookies.amr?.UserID || "Role";
  console.log(userName, "ye dekh username");
  console.log(roleName, "ye dekh rolname");
  console.log(userid, "ye dekh roleide");
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://apiforcorners.cubisysit.com/api/api-fetch-telecalling.php?UserID=${userid}`
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
      const response = await axios.post(
        "https://ideacafe-backend.vercel.app/api/proxy/api-delete-telecalling.php",
        {
          Tid: id,
          DeleteUID: 1,
        }
      );
      if (response.data.status === "Success") {
        setRows(rows.filter((row) => row.Tid !== id));
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
      <Grid item xs={4}>
        <Sidebar
          rows={rows}
          onItemClick={handleShow}
          onEdit={handleEdit}
          onCreate={handleAddTelecaller}
        />
      </Grid>
      <Grid item xs={8}>
        {loading && <CircularProgress />}
        {error && (
          <Alert severity="error">Error fetching data: {error.message}</Alert>
        )}

        {firstVisit && !loading && !error && !leadData && <WelcomeScreen />}

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
          <AddProjectDetails show={handleBack} editData={editData} />
        )}

        {!loading &&
          !error &&
          rowDataToUpdate &&
          !showHistory &&
          !showAddDetails && (
            <ListTellecalling
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
            <Typography
              variant="body2"
              sx={{
                marginTop: 5,
                fontWeight: "bold",
                alignItems: "center",
                textAlign: "center",
                fontSize: 20,
              }}
            >
              User History
            </Typography>
            <HistoryTelecalling item={rowDataToUpdate} onBack={handleBack} />
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default SalesProjectDetails;
