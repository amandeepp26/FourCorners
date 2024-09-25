import React, { useState, useEffect } from "react";
import { Grid, CircularProgress, Alert, Typography, Box } from "@mui/material";
import axios from "axios";
import { useCookies } from "react-cookie";
import TodayPaymentTemplate from "src/views/payment-reminder/TodayPaymentTemplate/TodayPaymentTemplate";
import TodayPayment from "src/views/payment-reminder/TodayPaymentSidebar/TodayPayment";

const TodaysFollowupPayment = ({ initialRows }) => {
  const [rows, setRows] = useState(initialRows);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState(null);
  const [rowDataToUpdate, setRowDataToUpdate] = useState(null);
  const [showAddDetails, setShowAddDetails] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [firstVisit, setFirstVisit] = useState(true);
  const [cookies] = useCookies(["amr"]);


  useEffect(() => {
    if (!initialRows) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
  const userid = cookies.amr?.UserID || 'Role';

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
      <Grid item xs={5}>
        <TodayPayment
          rows={rows}
          onItemClick={handleShow}
          onEdit={handleEdit}
          onCreate={handleAddTelecaller}
        />
      </Grid>

      {!loading && !error && rowDataToUpdate && !showHistory && !showAddDetails && (
        <TodayPaymentTemplate
          item={rowDataToUpdate}
          // onDelete={handleDelete}
          onHistoryClick={handleShowHistory}
          onEdit={handleEdit}
        />
      )}
    </Grid>
  );
};



export default TodaysFollowupPayment;
