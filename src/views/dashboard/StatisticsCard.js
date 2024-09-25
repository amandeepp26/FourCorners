import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
// import TrendingUp from 'mdi-material-ui/TrendingUp';
import CurrencyUsd from "mdi-material-ui/CurrencyUsd";
import DotsVertical from "mdi-material-ui/DotsVertical";
import CellphoneLink from "mdi-material-ui/CellphoneLink";
import AccountOutline from "mdi-material-ui/AccountOutline";
import CircularProgress from "@mui/material/CircularProgress";
import { useCookies } from "react-cookie";
import {
  CalendarToday,
  TrendingUp,
  History,
  AccountCircle,
  Payment,
  PhoneInTalk,
  DateRange,
  CurrencyExchange,
  EventNote,
  AttachMoney,
  List,
  Cancel,
} from "@mui/icons-material";
// import { TrendingUp, AccountCircle, PhoneInTalk, CurrencyExchange, Cancel, List } fro
const StatisticsCard = () => {
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(["amr"]);
  const userid = cookies.amr?.UserID || "Role";
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    const fetchApiData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://apiforcornershost.cubisysit.com/api/api-graph-admin.php?UserID=${userid}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        
        setApiData(data); // Store full API response
      } catch (error) {
        console.error("Error fetching API data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApiData();
  }, [userid]);

  const renderStats = () => {
    if (loading) {
      return (
        <Grid item xs={12} sm={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        </Grid>
      );
    }

    return (
      <>
        {/* Opportunity Data Section */}

        {/* Telecalling Data Section */}
        <Box>
          <Typography
            variant="body2"
            sx={{ marginTop: 4, fontWeight: "bold", fontSize: 20 }}
          >
            Telecalling Stats
          </Typography>
        </Box>
        <Grid
          container
          spacing={2}
          sx={{ flexWrap: "nowrap", overflowX: "auto", mt: 5 }}
        >
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                variant="rounded"
                sx={{
                  mr: 3,
                  width: 44,
                  height: 44,
                  boxShadow: 3,
                  color: "common.white",
                  backgroundColor: "primary.main",
                }}
              >
                <TrendingUp sx={{ fontSize: "1.75rem" }} />
              </Avatar>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="caption">Today's Follow Up</Typography>
                <Typography variant="h6">
                  {apiData?.data?.nextFollowupCounts?.todayFollowupCount || 0}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                variant="rounded"
                sx={{
                  mr: 3,
                  width: 44,
                  height: 44,
                  boxShadow: 3,
                  color: "common.white",
                  backgroundColor: "success.main",
                }}
              >
                <History sx={{ fontSize: "1.75rem" }} />
              </Avatar>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="caption">Backlog Follow Up</Typography>
                <Typography variant="h6">
                  {apiData?.data?.nextFollowupCounts?.backlogFollowupCount || 0}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                variant="rounded"
                sx={{
                  mr: 3,
                  width: 44,
                  height: 44,
                  boxShadow: 3,
                  color: "common.white",
                  backgroundColor: "warning.main",
                }}
              >
                <PhoneInTalk sx={{ fontSize: "1.75rem" }} />
              </Avatar>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="caption">Next Follow Up</Typography>
                <Typography variant="h6">
                  {apiData?.data?.nextFollowupCounts?.nextFollowupCount || 0}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                variant="rounded"
                sx={{
                  mr: 3,
                  width: 44,
                  height: 44,
                  boxShadow: 3,
                  color: "common.white",
                  backgroundColor: "info.main",
                }}
              >
                <CurrencyExchange sx={{ fontSize: "1.75rem" }} />
              </Avatar>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="caption">
                  Transferred to Opportunity
                </Typography>
                <Typography variant="h6">
                  {apiData?.data?.nextFollowupCounts?.transfertoOppCount ||
                    0}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                variant="rounded"
                sx={{
                  mr: 3,
                  width: 44,
                  height: 44,
                  boxShadow: 3,
                  color: "common.white",
                  backgroundColor: "secondary.main",
                }}
              >
                <Cancel sx={{ fontSize: "1.75rem" }} />
              </Avatar>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="caption">Not Interested</Typography>
                <Typography variant="h6">
                  {apiData?.data?.nextFollowupCounts?.notInterestedCount || 0}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                variant="rounded"
                sx={{
                  mr: 3,
                  width: 44,
                  height: 44,
                  boxShadow: 3,
                  color: "common.white",
                  backgroundColor: "warning.main",
                }}
              >
                <List sx={{ fontSize: "1.75rem" }} />
              </Avatar>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="caption">Total Lead</Typography>
                <Typography variant="h6">
                  {apiData?.counts?.totalNextFollowupCount || 0}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box>
          <Typography
            variant="body2"
            sx={{ marginTop: 9, fontWeight: "bold", fontSize: 20 }}
          >
            Opportunity Stats
          </Typography>
        </Box>
        <Grid
          container
          spacing={3}
          direction="row"
          wrap="nowrap"
          sx={{ flexWrap: "nowrap", overflowX: "auto", mt: 5 }}
        >
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                variant="rounded"
                sx={{
                  mr: 3,
                  width: 44,
                  height: 44,
                  boxShadow: 3,
                  color: "common.white",
                  backgroundColor: "primary.main",
                }}
              >
                <TrendingUp sx={{ fontSize: "1.75rem" }} />
              </Avatar>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="caption">Today's Follow Up</Typography>
                <Typography variant="h6">
                  {apiData?.data?.opportunityFollowupCounts
                    ?.todayFollowupCount || 0}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                variant="rounded"
                sx={{
                  mr: 3,
                  width: 44,
                  height: 44,
                  boxShadow: 3,
                  color: "common.white",
                  backgroundColor: "success.main",
                }}
              >
                <History sx={{ fontSize: "1.75rem" }} />
              </Avatar>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="caption">Backlog Follow Up</Typography>
                <Typography variant="h6">
                  {apiData?.data?.opportunityFollowupCounts
                    ?.backlogFollowupCount || 0}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                variant="rounded"
                sx={{
                  mr: 3,
                  width: 44,
                  height: 44,
                  boxShadow: 3,
                  color: "common.white",
                  backgroundColor: "warning.main",
                }}
              >
                <PhoneInTalk sx={{ fontSize: "1.75rem" }} />
              </Avatar>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="caption">Next Follow Up</Typography>
                <Typography variant="h6">
                  {apiData?.data?.opportunityFollowupCounts
                    ?.nextFollowupCount || 0}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                variant="rounded"
                sx={{
                  mr: 3,
                  width: 44,
                  height: 44,
                  boxShadow: 3,
                  color: "common.white",
                  backgroundColor: "info.main",
                }}
              >
                <CurrencyExchange sx={{ fontSize: "1.75rem" }} />
              </Avatar>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="caption">
                  Transferred to Booking
                </Typography>
                <Typography variant="h6">
                  {apiData?.data?.opportunityFollowupCounts
                    ?.transfertoBookingCount || 0}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                variant="rounded"
                sx={{
                  mr: 3,
                  width: 44,
                  height: 44,
                  boxShadow: 3,
                  color: "common.white",
                  backgroundColor: "secondary.main",
                }}
              >
                <Cancel sx={{ fontSize: "1.75rem" }} />
              </Avatar>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="caption">Not Interested</Typography>
                <Typography variant="h6">
                  {apiData?.data?.opportunityFollowupCounts
                    ?.notInterestedCount || 0}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                variant="rounded"
                sx={{
                  mr: 3,
                  width: 44,
                  height: 44,
                  boxShadow: 3,
                  color: "common.white",
                  backgroundColor: "warning.main",
                }}
              >
                <List sx={{ fontSize: "1.75rem" }} />
              </Avatar>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="caption">Total Opportunity</Typography>
                <Typography variant="h6">
                  {apiData?.counts?.totalOpportunityFollowupCount || 0}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Container for Payment and Loan Reminders */}
        <Grid container spacing={3} sx={{ mt: 9 }}>
          {/* Payment Reminder Section */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", fontSize: 20 }}
              >
                Payment Reminder
              </Typography>
            </Box>

            {/* Payment Reminder Data */}
            <Grid
              container
              spacing={3}
              direction="row"
              wrap="nowrap"
              sx={{ flexWrap: "nowrap", overflowX: "auto", mt: 2 }}
            >
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    variant="rounded"
                    sx={{
                      mr: 3,
                      width: 44,
                      height: 44,
                      boxShadow: 3,
                      color: "common.white",
                      backgroundColor: "primary.main",
                    }}
                  >
                    <CalendarToday sx={{ fontSize: "1.75rem" }} />
                  </Avatar>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="caption">Today's Follow Up</Typography>
                    <Typography variant="h6">
                      {apiData?.data?.bookingRemarkLoanNullOrZeroCounts
                        ?.todayFollowupCount || 0}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    variant="rounded"
                    sx={{
                      mr: 3,
                      width: 44,
                      height: 44,
                      boxShadow: 3,
                      color: "common.white",
                      backgroundColor: "success.main",
                    }}
                  >
                    <History sx={{ fontSize: "1.75rem" }} />
                  </Avatar>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="caption">Backlog Follow Up</Typography>
                    <Typography variant="h6">
                      {apiData?.data?.bookingRemarkLoanNullOrZeroCounts
                        ?.backlogFollowupCount || 0}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    variant="rounded"
                    sx={{
                      mr: 3,
                      width: 44,
                      height: 44,
                      boxShadow: 3,
                      color: "common.white",
                      backgroundColor: "warning.main",
                    }}
                  >
                    <Payment sx={{ fontSize: "1.75rem" }} />
                  </Avatar>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="caption">Upcoming payment</Typography>
                    <Typography variant="h6">
                      {apiData?.data?.bookingRemarkLoanNullOrZeroCounts
                        ?.nextFollowupCount || 0}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Loan Reminder Section */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", fontSize: 20 }}
              >
                Loan Reminder
              </Typography>
            </Box>

            {/* Loan Reminder Data */}
            <Grid
              container
              spacing={3}
              direction="row"
              wrap="nowrap"
              sx={{ flexWrap: "nowrap", overflowX: "auto", mt: 2 }}
            >
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    variant="rounded"
                    sx={{
                      mr: 3,
                      width: 44,
                      height: 44,
                      boxShadow: 3,
                      color: "common.white",
                      backgroundColor: "info.main",
                    }}
                  >
                    <DateRange sx={{ fontSize: "1.75rem" }} />
                  </Avatar>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="caption">
                      Today's Loan Follow Up
                    </Typography>
                    <Typography variant="h6">
                      {apiData?.data?.bookingRemarkLoanOneCounts
                        ?.todayFollowupCount || 0}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    variant="rounded"
                    sx={{
                      mr: 3,
                      width: 44,
                      height: 44,
                      boxShadow: 3,
                      color: "common.white",
                      backgroundColor: "error.main",
                    }}
                  >
                    <EventNote sx={{ fontSize: "1.75rem" }} />
                  </Avatar>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="caption">
                      Backlog Loan Follow Up
                    </Typography>
                    <Typography variant="h6">
                      {apiData?.data?.bookingRemarkLoanOneCounts
                        ?.backlogFollowupCount || 0}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    variant="rounded"
                    sx={{
                      mr: 3,
                      width: 44,
                      height: 44,
                      boxShadow: 3,
                      color: "common.white",
                      backgroundColor: "warning.main",
                    }}
                  >
                    <AttachMoney sx={{ fontSize: "1.75rem" }} />
                  </Avatar>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="caption">
                      Upcoming Loan Payment
                    </Typography>
                    <Typography variant="h6">
                      {apiData?.data?.bookingRemarkLoanOneCounts
                        ?.nextFollowupCount || 0}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <Card>
      <Box>
        <Typography
          variant="body2"
          sx={{ marginTop: 5, fontWeight: "bold", fontSize: 20, marginLeft: 5 }}
        >
          Statistics Card
        </Typography>
      </Box>
      <CardContent>{renderStats()}</CardContent>
    </Card>
  );
};

export default StatisticsCard;
