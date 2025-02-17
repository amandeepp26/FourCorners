import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Avatar,
  TextField,
} from "@mui/material";
import axios from "axios";
import { styled } from '@mui/system';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const NoDataIcon = () => (
  <Avatar
    alt="No Data"
    sx={{ width: 500, height: "auto" }}
    src="/images/avatars/nodata.svg"
  />
);

const ListReport = ({ item }) => {
  const [formData, setFormData] = useState({
    fromdate: new Date(),
    todate: new Date(),
    ProjectID: item?.ProjectID || "",
    percentage: "",
  });

  const [paymentReceivedData, setPaymentReceivedData] = useState([]);
  const [upcomingPaymentData, setUpcomingPaymentData] = useState([]);

  const [loanAmountToDraw, setLoanAmountToDraw] = useState(0); // Default to 0

  const [loading, setLoading] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(true);


  const [totalReceived, setTotalReceived] = useState({
    cash: 0,
    cheque: 0,
    loan: 0,
    register: 0,
    total: 0,
  });

  const [totalUpcoming, setTotalUpcoming] = useState({
    cash: 0,
    cheque: 0,
    loan: 0,
    register: 0,
    total: 0,
  });

  const escapeCSVValue = (value) => {
    // Handle null, undefined, and empty values
    if (value == null) {
      return '';
    }

    if (typeof value === 'string') {
      // Escape double quotes by replacing with two quotes
      value = value.replace(/"/g, '""');

      // If the value contains commas, newlines, or quotes, wrap it in double quotes
      if (value.includes(',') || value.includes('\n') || value.includes('"')) {
        value = `"${value}"`;
      }
    }

    return value;
  };
  const convertToCSV = (data, type) => {
    const header = [
      "Party Name",
      "Project Name",
      "Rera Registration",
      "Address",
      "Floor No",
      "Flat No",
      "Area",
      "Rate per Sqft",
      "Total Amount",
      "Charges",
      "Parking Facility",
      "Flat Cost",
      "GST",
      "Stamp Duty",
      "Registration",
      "Advocate",
      "Extra Cost",
      "Total Cost",
      "Usable Area",
      "Agreement Carpet",
      "Source Name",
      "Current",
      "Post",
      "balance",
      "Remark Name",
      "Remark Date",
    ];

    const rows = data.map(row => {
      // Initialize "Current" and "Post" as empty

      let current = '';
      let post = '';

      // Logic for handling 'Received' payments
      if (type === 'received') {
        if (row.Bookingremarktype == 1) {
          current = row.Cash; // For received payments, use 'Cash' for current
        } else if (row.Bookingremarktype == 2) {
          post = row.ChequeAmount; // For received payments, use 'Cheque' for post
        }
      }

      // Logic for handling 'Upcoming' payments
      if (type === 'upcoming') {
        if (row.Bookingremarktype == 1) {
          current = row.Remarkamount;
        } else if (row.Bookingremarktype == 2) {
          post = row.Remarkamount;
        }
      }

      return [
        escapeCSVValue(row.Name),
        escapeCSVValue(row.ProjectName),
        escapeCSVValue(row.reraregistration),
        escapeCSVValue(row.Address),
        escapeCSVValue(row.FloorNo),
        escapeCSVValue(row.FlatNo),
        escapeCSVValue(row.Area),
        escapeCSVValue(row.Ratesqft),
        escapeCSVValue(row.TtlAmount),
        escapeCSVValue(row.Charges),
        escapeCSVValue(row.ParkingFacility),
        escapeCSVValue(row.FlatCost),
        escapeCSVValue(row.Gst),
        escapeCSVValue(row.StampDuty),
        escapeCSVValue(row.Registration),
        escapeCSVValue(row.Advocate),
        escapeCSVValue(row.ExtraCost),
        escapeCSVValue(row.TotalCost),
        escapeCSVValue(row.UsableArea),
        escapeCSVValue(row.AgreementCarpet),
        escapeCSVValue(row.SourceName),
        escapeCSVValue(current),
        escapeCSVValue(post),
        escapeCSVValue(row.balance),
        escapeCSVValue(row.RemarkName),
        escapeCSVValue(row.RemarkDate),
      ];

    });

    const csvRows = [header, ...rows]
      .map(e => e.join(","))
      .join("\n");

    return csvRows;

  };

  const downloadCSV = (data, type, fileName) => {

    // Check if the data is an array and not empty
    if (!Array.isArray(data) || data.length === 0) {
      alert("No data available to download.");
      return;
    }

    const csvData = convertToCSV(data, type);

    if (!csvData) {
      alert("Error generating CSV.");
      return;
    }

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");


    const timestamp = new Date().toISOString().replace(/[^\w\s]/gi, '-');
    const defaultFileName = `${fileName || 'data'}_${timestamp}.csv`;

    link.href = URL.createObjectURL(blob);
    link.download = defaultFileName; // Use the passed filename or the default
    link.click();
  };


  const fetchData = async () => {
    if (!item) return;

    const { fromdate, todate, percentage } = formData;

    const formatDate = (date) => {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    };

    const formattedFromDate = formatDate(fromdate);
    const formattedToDate = formatDate(todate);

    try {
      setLoading(true);

      // Start building the URL
      let apiUrl = `https://apiforcornershost.cubisysit.com/api/api-project-networth.php?ProjectID=${item}&fromdate=${formattedFromDate}&todate=${formattedToDate}`;

      // Append the percentage if it exists
      if (percentage) {
        apiUrl += `&workpercentage=${percentage}`;
      }


      const response = await axios.get(apiUrl);

      if (response.data.status === "Success") {
        const receivedRecords = response.data.receivedpayment || {};
        const upcomingRecords = response.data.upcomingpayment || {};

        // Set the state with the values received from the API
        setLoanAmountToDraw(response.data.totalLoanAmountToDraw || 0); // Ensure value is being set
        console.log("Loan Amount to Draw:", response.data.totalLoanAmountToDraw); // Debugging log

        setTotalReceived({
          cash: receivedRecords.cash || 0,
          cheque: receivedRecords.cheque || 0,
          loan: receivedRecords.loan || 0,
          register: receivedRecords.register || 0,
          total: receivedRecords.total || 0,
        });

        setTotalUpcoming({
          cash: upcomingRecords.cash || 0,
          cheque: upcomingRecords.cheque || 0,
          loan: upcomingRecords.loan || 0,
          register: upcomingRecords.register || 0,
          total: upcomingRecords.total || 0,
        });

        setPaymentReceivedData(response.data.receivedRecords || []);
        setUpcomingPaymentData(response.data.upcomingRecords || []);
        console.log("Loan Amount to Draw:", response.data.setPaymentReceivedData);
        setDataAvailable(true);
      } else {
        setDataAvailable(false); // Handle API failure or no data
      }
    } catch (error) {
      console.error("Error fetching payment data:", error);
      setDataAvailable(false); // Handle errors
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchData();
  }, [item, formData]); // Fetch data whenever item or formData changes

  const handleDateChange = (date, field) => {
    setFormData({ ...formData, [field]: date });
  };


  const CustomTableContainer = styled(TableContainer)(({ theme }) => ({
    '&::-webkit-scrollbar': {
      width: '6px', // Custom width for the scrollbar
      height: '6px', // Optional for horizontal scrollbars
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#9155FD', // Scrollbar thumb color
      borderRadius: '10px', // Rounded edges for the thumb
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#f4f4f4', // Scrollbar track color
    },
  }));



  const formatIndianNumber = (num) => {
    return num.toLocaleString("en-IN");
  };
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={12}>
        <Card sx={{ padding: 3, marginBottom: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}>
              Total Payment Summary
            </Typography>
            {loading ? (
              <Typography variant="body1" sx={{ textAlign: 'center' }}>Loading...</Typography>
            ) : (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Received Payments:
                      </Typography>
                     <Typography variant="body2">Post: {formatIndianNumber(totalReceived.cheque) || '0'}</Typography>
                      <Typography variant="body2">Loan: {formatIndianNumber(totalReceived.loan) || '0'}</Typography>
                      <Typography variant="body2">Register: {formatIndianNumber(totalReceived.register) || '0'}</Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Total: {formatIndianNumber(totalReceived.total) || '0'}</strong>
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Upcoming Payments:
                      </Typography>
                    <Typography variant="body2">Post: {formatIndianNumber(totalUpcoming.cheque) || '0'}</Typography>
                      <Typography variant="body2">Loan: {formatIndianNumber(totalUpcoming.loan) || '0'}</Typography>
                      <Typography variant="body2">Register: {formatIndianNumber(totalUpcoming.register) || '0'}</Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Total: {formatIndianNumber(totalUpcoming.total) || '0'}</strong>
                      </Typography>

                    </Box>
                  </Grid>
                </Grid>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={3}>
                <DatePicker
                  selected={formData.fromdate}
                  onChange={(date) => handleDateChange(date, "fromdate")}
                  dateFormat="dd-MM-yyyy"
                  className="form-control"
                  customInput={
                    <TextField
                      fullWidth
                      label="From When"
                      InputProps={{
                        readOnly: true,
                        sx: { width: "100%" },
                      }}
                    />
                  }
                  showMonthDropdown
                  showYearDropdown
                  yearDropdownItemNumber={15} // Number of years to show in dropdown
                  scrollableYearDropdown
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <DatePicker
                  selected={formData.todate}
                  onChange={(date) => handleDateChange(date, "todate")}
                  dateFormat="dd-MM-yyyy"
                  className="form-control"
                  customInput={
                    <TextField
                      fullWidth
                      label="Till When"
                      InputProps={{
                        readOnly: true,
                        sx: { width: "100%" },
                      }}
                    />

                  }
                  showMonthDropdown
                  showYearDropdown
                  yearDropdownItemNumber={15} // Number of years to show in dropdown
                  scrollableYearDropdown
                />
              </Grid>

              <Grid item xs={12} sm={3} mb={3} display="flex" justifyContent="center" alignItems="flex-end">
                <Button variant="contained" onClick={fetchData}>
                  Search
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container justifyContent="space-around" sx={{ mt: 4, display: "flex", }}>
          <Grid item xs={12} sm={5}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => downloadCSV(paymentReceivedData, 'received', 'received_payments.csv')}
              sx={{ width: "100%" }}
            >
              Download Received Payments CSV
            </Button>
          </Grid>
          <Grid item xs={12} sm={5}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => downloadCSV(upcomingPaymentData, 'upcoming', 'upcoming_payments.csv')}
              sx={{ width: "100%" }}
            >
              Download Upcoming Payments CSV
            </Button>
          </Grid>
        </Grid>

        {/* Payment Received Table */}
        <Grid container justifyContent="center" sx={{ mt: 4 }}>

          <Card sx={{ width: "100%", padding: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', pl: 10 }}>
              Received Payments:
            </Typography>
            <CardContent>
              {loading ? (
                <CircularProgress />
              ) : paymentReceivedData.length > 0 ? (
                <CustomTableContainer component={Paper}>
                  <Table sx={{ minWidth: 800 }} aria-label="payment received table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Party Name</TableCell>
                        <TableCell>Project Name</TableCell>
                        <TableCell>Wing Name</TableCell>
                        <TableCell>Flat No</TableCell>
                        <TableCell>Post</TableCell>
                        <TableCell>Payment Date</TableCell>

                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paymentReceivedData.map((row) => (
                        <TableRow key={row.paymentID}>
                          <TableCell>{row.Name}</TableCell>
                          <TableCell>{row.ProjectName}</TableCell>
                          <TableCell>{row.WingName}</TableCell>
                          <TableCell>{row.FlatNo}</TableCell>
                          <TableCell>{row.ChequeAmount}</TableCell>
                        
                          <TableCell>{row.paymentDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CustomTableContainer>
              ) : (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  minHeight={200}
                >
                  <NoDataIcon />
                  <Typography variant="h6" color="textSecondary" align="center">
                    No data available for this booking.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Payment Table */}
        <Grid container justifyContent="center" sx={{ mt: 4 }}>
          <Card sx={{ width: "100%", padding: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', pl: 10 }}>
              Upcoming Payments:
            </Typography>
            <CardContent>
              {loading ? (
                <CircularProgress />
              ) : upcomingPaymentData.length > 0 ? (
                <CustomTableContainer component={Paper}>

                  <Table sx={{ minWidth: 800 }} aria-label="upcoming payment table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Party Name</TableCell>
                        <TableCell>Project Name</TableCell>
                        <TableCell>Wing Name</TableCell>
                        <TableCell>Flat No</TableCell>
                        <TableCell>Remark Amount</TableCell>
                        <TableCell>RemarkDate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {upcomingPaymentData.map((row) => (
                        <TableRow key={row.paymentID}>
                          <TableCell>{row.Name}</TableCell>
                          <TableCell>{row.ProjectName}</TableCell>
                          <TableCell>{row.WingName}</TableCell>
                          <TableCell>{row.FlatNo}</TableCell>
                          <TableCell>{row.Remarkamount}</TableCell>
                          <TableCell>{row.RemarkDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                </CustomTableContainer>
              ) : (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  minHeight={200}
                >
                  <NoDataIcon />
                  <Typography variant="h6" color="textSecondary" align="center">
                    No data available for this booking.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ListReport;
