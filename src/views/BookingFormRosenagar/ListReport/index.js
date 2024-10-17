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
  TablePagination,
  CircularProgress,
  Typography,
  IconButton,
  TextField,
  Avatar,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import axios from "axios";
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
    percentage : "",
    
  });

  const [paymentReceivedData, setPaymentReceivedData] = useState([]);
  const [upcomingPaymentData, setUpcomingPaymentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(true);
  const [page, setPage] = useState(0);
  const [amountsReceived, setAmountsReceived] = useState([]);
const [amountsUpcoming, setAmountsUpcoming] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [totalReceived, setTotalReceived] = useState({
    cash: 0,
    cheque: 0,
    total: 0
  });

  const [totalUpcoming, setTotalUpcoming] = useState({
    cash: 0,
    cheque: 0,
    total: 0
  });

   
  
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
  
      // Construct API URL based on whether percentage is provided
      let apiUrl = `https://apiforcornershost.cubisysit.com/api/api-project-networth.php?ProjectID=${item}&fromdate=${formattedFromDate}&todate=${formattedToDate}`;
      if (percentage) {
        apiUrl += `&percentage=${percentage}`;
      }
  
      const response = await axios.get(apiUrl);
  
      if (response.data.status === "Success") {
        const receivedRecords = response.data.receivedpayment || {};
        const upcomingRecords = response.data.upcomingpayment || {};
  
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
          register: upcomingRecords.register|| 0,
          total: upcomingRecords.total || 0,
        });
  
        setAmountsReceived(response.data.amountsReceived || []);
        setAmountsUpcoming(response.data.amountsUpcoming || []);
  
        setPaymentReceivedData(response.data.receivedRecords || []);
        setUpcomingPaymentData(response.data.upcomingRecords || []);
        setDataAvailable(true);
      } else {
        setDataAvailable(false);
      }
    } catch (error) {
      console.error("Error fetching payment data:", error);
      setDataAvailable(false);
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchData();
  }, [item, formData]); // Dependencies to re-run the effect when they change



  const handleDateChange = (date, field) => {
    setFormData({ ...formData, [field]: date });
  };



  const handleAddPayment = (row) => {
    // Implement your payment add logic here
    console.log("Add payment", row);
  };

  const SortableTableCell = ({ label }) => (
    <TableCell
    sx={{
      fontWeight: "bold",
      fontSize: "1rem",
      cursor: "pointer",

      top: 0,
      zIndex: 1,
      backgroundColor: "#ffffff", // Background color for the sticky header
    }}
  >
    {label}
  </TableCell>
  );

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={12}>
      <Card sx={{ padding: 3, marginBottom: 4 }}>
    <CardContent>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}
      >
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
                <Typography variant="body2">
                  Current : {totalReceived.cash?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="body2">
                  Post : {totalReceived.cheque?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="body2">
                  Loan : {totalReceived.loan?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="body2">
                  Register : {totalReceived.register?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Total: {totalReceived.total?.toLocaleString() || '0'}</strong>
                </Typography>

                {amountsReceived.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Upcoming Loan Amount:
                    </Typography>
                    {amountsReceived.map((amount, index) => (
                      <Typography key={index} variant="body2">
                        Amount: {amount.toLocaleString()}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Upcoming Payments:
                </Typography>
                <Typography variant="body2">
                  Currrent: {totalUpcoming.cash?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="body2">
                  Post: {totalUpcoming.cheque?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="body2">
                  Loan : {totalUpcoming.loan?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="body2">
                  Register : {totalUpcoming.register?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Total: {totalUpcoming.total?.toLocaleString() || '0'}</strong>
                </Typography>

                {amountsUpcoming.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Upcoming Loan amount:
                    </Typography>
                    {amountsUpcoming.map((amount, index) => (
                      <Typography key={index} variant="body2">
                        Amount: {amount.toLocaleString()}
                      </Typography>
                    ))}
                  </Box>
                )}
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
        />
      </Grid>

      {/* Percentage TextField */}
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="Percentage"
          value={formData.percentage || ''}
          onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
          InputProps={{
            sx: { width: "100%" },
          }}
        />
      </Grid>

      <Grid
        item
        xs={12}
        sm={3}
        mb={3}
        display="flex"
        justifyContent="center"
        alignItems="flex-end"
      >
        <Button variant="contained" onClick={fetchData}>
          Search
        </Button>
      </Grid>
    </Grid>
  </CardContent>
</Card>


<Grid container justifyContent="center" spacing={2} mt={5}>
  <Grid item>
    <Typography
      variant="h6"
      sx={{ fontWeight: "bold", textAlign: "center" }}
    >
      Dashboard of Payment Received
    </Typography>
  </Grid>
</Grid>

<Card sx={{ margin: "auto", padding: 2, height: 400, overflow: 'auto', mt: 5 }}>
  <CardContent>
    {loading ? (
      <CircularProgress />
    ) : paymentReceivedData.length > 0 ? (
      <>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 800 }} aria-label="payment received table">
            <TableHead>
              <TableRow>
                <SortableTableCell label="Purchaser Name" />
                <SortableTableCell label="Project Name" />
                <SortableTableCell label="Wing Name" />
                <SortableTableCell label="Flat No" />
                <SortableTableCell label="Post" />
                <SortableTableCell label="Current" />
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
                  <TableCell>{row.Cash}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
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

        <Grid container justifyContent="center" spacing={2} mt={5}>
          <Grid item>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              Dashboard of Upcoming Payment
            </Typography>
          </Grid>
        </Grid>

        <Card
  sx={{
    maxWidth: 1200,
    margin: "auto",
    padding: 2,
    height: 400,
    overflow: "auto",
    mt: 5,
  }}
>
  <CardContent>
    {loading ? (
      <CircularProgress />
    ) : dataAvailable ? (
      <>
        <TableContainer component={Paper}>
          <Table
            sx={{
              minWidth: 800,
              position: "relative",
              "& thead th": {
           
                top: 0,
                zIndex: 1,
                backgroundColor: "#ffffff", // You can change this to match your design
              },
            }}
            aria-label="upcoming payment table"
          >
            <TableHead>
              <TableRow>
                <SortableTableCell label="Purchaser Name" />
                <SortableTableCell label="Project Name" />
                <SortableTableCell label="Wing Name" />
                <SortableTableCell label="Flat No" />
                <SortableTableCell label="RemarkAmount" />
                <SortableTableCell label="Remark Date" />
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
        </TableContainer>
      </>
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
  );
};

export default ListReport;
