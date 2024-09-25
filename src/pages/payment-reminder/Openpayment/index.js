import React, { useState, useEffect } from "react";
import { Grid, CircularProgress, Alert, Typography, Box } from "@mui/material";
import axios from "axios";
// import AddTellecallingDetails from 'src/views/add-tellecallingDetails/AddTellecallingDetails';
import BacklogSidebar from "src/views/opportunitysidebar/backlog/BacklogSidebar";
import Listbacklog from "src/views/list-tellecalling/Backlog/Listbacklog";
import HistoryTelecalling from "src/views/history-telecalling/HistoryTelecalling";
import PieChartIcon from "@mui/icons-material/PieChart";
import Card from "@mui/material/Card";
import TrendingUp from "mdi-material-ui/TrendingUp";
import CurrencyUsd from "mdi-material-ui/CurrencyUsd";
import DotsVertical from "mdi-material-ui/DotsVertical";
import CellphoneLink from "mdi-material-ui/CellphoneLink";
import AccountOutline from "mdi-material-ui/AccountOutline";
import CardContent from "@mui/material/CardContent";

import AddIcon from "@mui/icons-material/Add";
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
import { useCookies } from "react-cookie";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ScheduleIcon from "@mui/icons-material/Schedule";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CancelIcon from "@mui/icons-material/Cancel";
import ListOpportunitybacklog from "src/views/list-opportunity/backlog/ListOpportunitybacklog";
import HistoryOpportunitybacklog from "src/views/history-apportunity/HistoryOpportunityBacklog/HistoryOpportunitybacklog";
import BacklogPaymentSidebar from "src/views/payment-reminder/ BacklogPaymentSidebar/BacklogPaymentSidebar";
import BacklogPaymentTemplate from "src/views/payment-reminder/BacklogPaymentTemplate/BacklogPaymentTemplate";
import OpenPaymentSidebar from "src/views/payment-reminder/OpenPaymentSidebar/OpenPaymentSidebar";
import OpenpaymentTemplate from "src/views/payment-reminder/OpenpaymentTemplate/OpenpaymentTemplate";
import TemplateRosenagar from "src/views/TemplateRosenagar/TemplateRosenagar";
const salesData = [
  {
    stats: "50",
    title: "Today Leads",
    color: "primary",
    icon: <AccountBalanceWalletIcon sx={{ fontSize: "1.75rem" }} />,
  },
  {
    stats: "15",
    title: "Followup",
    color: "success",
    icon: <ScheduleIcon sx={{ fontSize: "1.75rem" }} />,
  },
  {
    stats: "20",
    color: "warning",
    title: "Interested",
    icon: <FavoriteIcon sx={{ fontSize: "1.75rem" }} />,
  },
  {
    stats: "02",
    color: "info",
    title: "Disqualified",
    icon: <CancelIcon sx={{ fontSize: "1.75rem" }} />,
  },
];

const pieData = [
  { name: "Today Leads", value: 50, color: "#3f51b5" },
  { name: "Followup", value: 15, color: "#4caf50" },
  { name: "Interested", value: 20, color: "#ff9800" },
  { name: "Disqualified", value: 2, color: "#00acc1" },
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
        // action={
        //   <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
        //     <DotsVertical />
        //   </IconButton>
        // }
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


const OpenPayment = () => {
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
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
       `https://apiforcornershost.cubisysit.com/api/api-fetch-openreminder.php?UserID=${userid}`
      );
      setRows(response.data.data || []);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(
        "https://proxy-forcorners.vercel.app/api/proxy/api-delete-telecalling.php",
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
        <OpenPaymentSidebar
          rows={rows}
          onItemClick={handleShow}
          onEdit={handleEdit}
          onCreate={handleAddTelecaller}
        />
      </Grid>

      {!loading && !error && rowDataToUpdate && !showHistory && !showAddDetails && (
          <OpenpaymentTemplate
            item={rowDataToUpdate}
            rows={rows}
            onDelete={handleDelete}
            onHistoryClick={handleShowHistory}
            onEdit={handleEdit}
          />
        )}
     
    </Grid>
  );
};

export default OpenPayment;
