import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TablePagination,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/router";
import MenuItem from "@mui/material/MenuItem";
import PersonIcon from '@mui/icons-material/Person';

import { styled } from '@mui/system';
import HistoryIcon from "@mui/icons-material/History";
import CloseIcon from "@mui/icons-material/Close";

import { useCookies } from "react-cookie";
import Select from "@mui/material/Select";

import Avatar from "@mui/material/Avatar";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios"; // Import Axios for API requests
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts";
import StatisticsCard from "src/views/dashboard/StatisticsCard";
import Trophy from "src/views/dashboard/Trophy";
import WeeklyOverview from "src/views/dashboard/WeeklyOverview";
import TotalEarning from "src/views/dashboard/TotalEarning";
import CardStatisticsVerticalComponent from "src/@core/components/card-statistics/card-stats-vertical";
import SalesByCountries from "src/views/dashboard/SalesByCountries";
import DepositWithdraw from "src/views/dashboard/DepositWithdraw";
import HistoryComponent from "src/components/history";
import {
  HelpCircleOutline,
  BriefcaseVariantOutline,
  Timeline,
} from "mdi-material-ui";
import { Call, Contacts } from "@mui/icons-material";
import PhoneIcon from "@mui/icons-material/Phone";
import ShareIcon from "@mui/icons-material/Share";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

import { Modal } from "@mui/base";
import {
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineContent,
  TimelineSeparator,
  CustomPaper,
  CheckCircleIcon,
  TimelineConnector,
} from "@mui/lab";
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ onHistoryClick }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    FromDate: null,
    ToDate: null,
    SourceID: "",
    UserID: "",
    Status: 1,
  });
  const [cookies] = useCookies(["amr"]);

  const [telecallingData, setTelecallingData] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [source, setSource] = useState([]);
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenHistory, setOpenHistory] = useState(false);
  const [modalOpenHistoryOppo, setOpenHistoryOppo] = useState(false);
  const [modalOpenContact, setModalOpenContact] = useState(false);
  const [modalOpenOpportunity, setModalOpenOpportunity] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [selectedTelecaller, setSelectedTelecaller] = useState(null);
  const userName = cookies.amr?.FullName || "User";
  useEffect(() => {
    if (!cookies || !cookies.amr || !cookies.amr.UserID) {
      router.push("/pages/login");
    }
  }, []);

  const handleDateChange = (date, field) => {
    setFormData({ ...formData, [field]: date });
  };

  const formatCreateDate = (createDate) => {
    if (!createDate) return ""; // Handle case where createDate might be null or undefined
    const parts = createDate.split(" "); // Split date and time
    const dateParts = parts[0].split("-"); // Split yyyy-mm-dd into parts
    const time = parts[1]; // Get hh-ss-mm
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]} ${time}`; // dd-mm-yyyy format
    return formattedDate;
  };
  const handleDownload = () => {
    // Ensure we only proceed if selectedType is 'booking' and there is data
    if (selectedType !== "booking" || !selectedData || selectedData.length === 0) {
      console.error("No booking data available for download.");
      return;
    }
  
    // Define the headers for the CSV file
    const headers = [
      { label: "Name", key: "Name" },
      { label: "Mobile", key: "Mobile" },
      { label: "SourceName", key: "SourceName" },
      { label: "Created Date", key: "CreateDate" },
    ];
  
    // Prepare the data
    const csvData = selectedData.map((row) => ({
      Name: row.Name,
      Mobile: row.Mobile,
      SourceName: row.SourceName,
      CreateDate: row.CreateDate,
    }));
  
    // Convert data to CSV format
    const csvString = [
      headers.map((header) => header.label).join(","), // Create header row
      ...csvData.map((row) =>
        headers.map((header) => row[header.key] || "").join(",")
      ),
    ].join("\n");
  
    // Create a blob and download it
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "booking_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  
  const whatsappText = encodeURIComponent(
    `Hello, I wanted to discuss the following details:\n\nSource Name: ${selectedTelecaller?.SourceName}\nLocation: ${selectedTelecaller?.Location}\nAttended By: ${selectedTelecaller?.TelecallAttendedByName}`
  );
  const CustomTimeline = styled(Timeline)({
    width: '100%',
    margin: '0 auto',
  });
  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        UserID: formData.UserID, // If "All" is selected, this will be 0
        FromDate: formData?.FromDate?.toISOString(),
        ToDate: formData?.ToDate?.toISOString(),
        SourceID: formData.SourceID,
      });
  
      console.log(params.toString(), "Request Parameters");
  
      const response = await fetch(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-admindashboard.php?${params}`
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }
  
      const data = await response.json();
      console.log(data, "Dashboard Data");
      setTelecallingData(data);
    } catch (error) {
      console.error("Error fetching telecalling data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  

  const handleCardClick = (type) => {
    if (type === "todayLeads") {
      setSelectedData(telecallingData?.data?.nextFollowup?.records || []);
      setSelectedType("todayLeads");
    } else if (type == "Salesopportunity") {
      setSelectedData(telecallingData?.data?.opportunityRecords?.records || []);
      setSelectedType("Salesopportunity");
    } else if (type == "contacts") {
      setSelectedData(telecallingData?.data?.contactsRecords?.records || []);
      setSelectedType("contacts");
    } else if (type == "telecalling") {
      setSelectedData(telecallingData?.data?.telecallingRecords?.records || []);
      setSelectedType("telecalling");
    } else if (type == "todaysLoan") {
      setSelectedData(
        telecallingData?.data?.bookingRemarkWithLoan?.records || []
      );
      setSelectedType("todaysLoan");

      // Handle other cases if needed
    } else if (type == "todaysOppo") {
      setSelectedData(
        telecallingData?.data?.opportunityFollowup?.records || []
      );
      setSelectedType("todaysOppo");

      // Handle other cases if needed
    } else if (type == "todaysPayment") {
      setSelectedData(
        telecallingData?.data?.bookingRemarkWithoutLoan?.records || []
      );
      setSelectedType("todaysPayment");

      // Handle other cases if needed
    } else if (type == "booking") {
      setSelectedData(telecallingData?.data?.bookingRecords?.records || []);
      setSelectedType("booking");

      // Handle other cases if needed
    }
  };

  useEffect(() => {
    // Fetch the data from the API
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-fetch-telesales.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setUsers(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching the users:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-fetch-source.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setSource(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const fetchDataForModal = async (Tid) => {
    try {
      const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-singel-telecalling.php?Tid=${Tid}`;
      const response = await axios.get(apiUrl);

      if (response.data.status === "Success") {
        console.log(response.data.data[0], "Single telecalling data fetched");
        setSelectedTelecaller(response.data.data[0]);
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching single telecalling data:", error);
    }
  };
  const handleSource = (event) => {
    setFormData({
      ...formData,
      SourceID: event.target.value, 
    });
  };
  

  const handleUser = (event) => {
    setFormData({
      ...formData,
      UserID: event.target.value, 
    });
  };

  const fetchDataForModalContact = async (Cid) => {
    console.log("CID AAYA", Cid);
    console.log("press");
    try {
      const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-singel-contacts.php?Cid=${Cid}`;
      const response = await axios.get(apiUrl);

      if (response.data.status === "Success") {
        console.log(
          response.data.data,
          "Single telecalling data fetched for cotact"
        );
        setSelectedContact(response.data.data);
        setModalOpenContact(true);
      }
    } catch (error) {
      console.error("Error fetching single telecalling data:", error);
    }
  };

  const fetchDataForModalOpportunity = async (Oid) => {
    console.log("Oid AAYA", Oid);
    console.log("press");
    try {
      const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-singel-opportunity.php?Oid=${Oid}`;
      const response = await axios.get(apiUrl);

      if (response.data.status === "Success") {
        console.log(
          response.data.data[0],
          "Single telecalling data fetched for Opportunity"
        );
        setSelectedOpportunity(response.data.data[0]);
        setModalOpenOpportunity(true);
      }
    } catch (error) {
      console.error("Error fetching single telecalling data:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleHistoryClick = async () => {
    debugger;
    const fetchData = async () => {
      try {
        const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-singel-opportunityfollowup.php?Oid=${selectedOpportunity?.Oid}`;
        const response = await axios.get(apiUrl);
        if (response.data.status === "Success") {
          console.log(response.data, "aagaayaa oid dataaaa<<<<<>>>>>>>>>>>");
          setRowData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching single opportunity data:", error);
      }
    };

    await fetchData();
  };


  const handleHistoryClickLead = async () => {
    try {
      debugger;
      const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-fetch-nextfollowup.php?Tid=${selectedTelecaller?.Tid}`;
      const response = await axios.get(apiUrl);
      if (response.data.status === "Success") {
        console.log(response.data, "TID dataaaa<<<<<>>>>>>>>>>>");
        setRowData(response.data.data); // Use response.data.data to set the rowData
        setOpenHistory(true);
      } else {
        console.error("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCloseHistory = () => {
    setOpenHistory(false);
  };


  const handleHistoryClickOppo = async () => {
    try {
      debugger;
      const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-singel-opportunityfollowup.php?Oid=${selectedOpportunity?.Oid}`;
      const response = await axios.get(apiUrl);
      if (response.data.status === "Success") {
        console.log(response.data, "OID OID OID ODI  OID dataaaa<<<<<>>>>>>>>>>>");
        setRowData(response.data.data); 
        setOpenHistoryOppo(true);
      } else {
        console.error("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCloseHistoryOppo = () => {
    setOpenHistoryOppo(false);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const pieData = {
    labels: [
      "Telecalling",
      "Contacts",
      "Opportunity",
      "Booking",
      "Todays Lead FollowUp",
      "Todays Payment Followup",
      "Todays Loan FollowUp",
    ],
    datasets: [
      {
        data: [
          telecallingData?.data?.telecallingRecords?.count || 0,
          telecallingData?.data?.contactsRecords?.count || 0,
          telecallingData?.data?.opportunityRecords?.count || 0,
          telecallingData?.data?.bookingRecords?.count || 0,
          telecallingData?.data?.nextFollowup?.count || 0,
          telecallingData?.data?.opportunityFollowup?.count || 0,
          telecallingData?.data?.bookingRemarkWithoutLoan?.count || 0,
        ],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FFCD56",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FFCD56",
        ],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <StatisticsCard />
        </Grid>

        <Grid item xs={12}>
          <Card>
            <Grid
              item
              xs={12}
              sx={{ marginTop: 4.8, marginBottom: 3, marginLeft: 8 }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{ marginTop: 5, fontWeight: "bold", fontSize: 20 }}
                >
                  Search Date-Wise
                </Typography>
              </Box>
            </Grid>
            <CardContent>
              <Card>
                <CardContent>
                  <Grid container spacing={3}>
                  <Grid item xs={6} sm={3}>
  <FormControl fullWidth>
    <InputLabel>User</InputLabel>
    <Select
      value={formData.UserID}
      onChange={handleUser}
      label="User"
    >
      <MenuItem value={0}>All</MenuItem> 
      {users.map((user) => (
        <MenuItem key={user.UserID} value={user.UserID}>
          {user.Name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>

<Grid item xs={6} sm={3}>
  <FormControl fullWidth>
    <InputLabel>Source</InputLabel>
    <Select
      value={formData.SourceID}
      onChange={handleSource}
      label="Source"
    >
      <MenuItem value={0}>All</MenuItem> {/* Setting value to 0 for "All" */}
      {source.map((bhk) => (
        <MenuItem key={bhk.SourceID} value={bhk.SourceID}>
          {bhk.SourceName}
        </MenuItem>
      ))}
    </Select>
    {errors.SourceID && (
      <Typography variant="caption" color="error">
        {errors.SourceID}
      </Typography>
    )}
  </FormControl>
</Grid>

                    <Grid item xs={12} sm={3}>
                      <DatePicker
                        selected={formData.FromDate}
                        onChange={(date) => handleDateChange(date, "FromDate")}
                        dateFormat="yyyy-MM-dd"
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
                        selected={formData.ToDate}
                        onChange={(date) => handleDateChange(date, "ToDate")}
                        dateFormat="yyyy-MM-dd"
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

                    <Grid
                      item
                      xs={10}
                      mb={5}
                      sm={3}
                      sx={{ display: "flex", alignItems: "flex-end" }}
                    >
                      <Button variant="contained" onClick={handleSearch}>
                        Search
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Grid
                container
                spacing={3}
                sx={{ display: "flex", justifyContent: "center", mt: 3 }}
              >
                <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                  <Grid
                    container
                    spacing={3}
                    sx={{ maxWidth: "1200px", width: "100%" }}
                  >
                    <Grid item xs={12} sm={4}>
                      <Card onClick={() => handleCardClick("telecalling")}>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Call fontSize="large" color="primary" />
                          <Typography variant="h6" gutterBottom>
                            Lead
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Total Counts:{" "}
                            {telecallingData?.data?.telecallingRecords.count}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card onClick={() => handleCardClick("contacts")}>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Contacts fontSize="large" color="primary" />
                          <Typography variant="h6" gutterBottom>
                            Contact
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Total Contacts:{" "}
                            {telecallingData?.data?.contactsRecords.count}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card onClick={() => handleCardClick("Salesopportunity")}>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Contacts fontSize="large" color="primary" />
                          <Typography variant="h6" gutterBottom>
                            Opportunity
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Total Counts:{" "}
                            {telecallingData?.data?.opportunityRecords.count}{" "}
                            {/* Adjust this key as needed */}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Card onClick={() => handleCardClick("booking")}>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Contacts fontSize="large" color="primary" />
                          <Typography variant="h6" gutterBottom>
                            Booking
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Total Counts:{" "}
                            {telecallingData?.data?.bookingRecords?.count}{" "}  <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          sx={{ mt: 2, mb: 2 }}>
          Download CSV
        </Button> 
                            {/* Adjust this key as needed */}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card onClick={() => handleCardClick("todaysLoan")}>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Contacts fontSize="large" color="primary" />
                          <Typography variant="h6" gutterBottom>
                            Todays Loan Reminder
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Total Counts:{" "}
                            {telecallingData?.data.bookingRemarkWithLoan.count}{" "}
                            {/* Adjust this key as needed */}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card onClick={() => handleCardClick("todayLeads")}>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Contacts fontSize="large" color="primary" />
                          <Typography variant="h6" gutterBottom>
                            Todays Lead FollowUp
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Total Counts:{" "}
                            {telecallingData?.data?.nextFollowup?.count}{" "}
                            {/* Adjust this key as needed */}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Card onClick={() => handleCardClick("todaysOppo")}>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Contacts fontSize="large" color="primary" />
                          <Typography variant="h6" gutterBottom>
                            Todays Opportunity
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Total Counts:{" "}
                            {telecallingData?.data?.opportunityFollowup.count}{" "}
                            {/* Adjust this key as needed */}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card onClick={() => handleCardClick("todaysPayment")}>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Contacts fontSize="large" color="primary" />
                          <Typography variant="h6" gutterBottom>
                            Todays Payment
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Total Counts:{" "}
                            {telecallingData?.data?.bookingRemarkWithoutLoan
                              ?.count || 0}
                            {/* Adjust this key as needed */}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Data Distribution
                      </Typography>
                      <div style={{ height: "300px" }}>
                        <Pie data={pieData} options={pieOptions} />
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
    

        {selectedType && (
          <Grid item xs={12} sx={{ display: "flex", mt: 3 }}>
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <Grid
                  item
                  xs={12}
                  sx={{ marginTop: 4.8, marginBottom: 3, marginLeft: 8 }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ marginTop: 5, fontWeight: "bold", fontSize: 20 }}
                    >
                      {selectedType === "telecalling"
                        ? `${userName} Telecalling Data`
                        : selectedType === "contacts"
                          ? `${userName} Contact Data`
                          : selectedType === "booking"
                            ? `${userName} Booking`
                            : ""}
                            
                    </Typography>
                  </Box>
                </Grid>
                {selectedData && (
                  <Grid item xs={12} sx={{ mt: 3 }}>
                    <TableContainer component={Box} sx={{ maxHeight: 400 }}>
                    <Table stickyHeader>
  <TableHead>
    <TableRow>
      <TableCell>Name</TableCell>
      <TableCell>Mobile</TableCell>
      {selectedType === "telecalling" ? (
        <TableCell>Next Follow Up</TableCell>
      ) : (
        <TableCell>Created Date</TableCell>
      )}
      {selectedType !== "booking" && <TableCell>Action</TableCell>}
    </TableRow>
  </TableHead>
  <TableBody>
      {selectedData?.map((row, index) => (
     
        
        
        <TableRow key={index}>
        
          <TableCell>
            {selectedType === "booking" ? row.Name : row.CName}
            
          </TableCell>
          <TableCell>{row.Mobile}</TableCell> 
          <TableCell>
          {selectedType === "telecalling"
            ? row.NextFollowUpDate
            : row.CreateDate}
        </TableCell>
        {selectedType !== "booking" && (
          <TableCell>
            {(() => {
              switch (selectedType) {
                case "telecalling":
                  return (
                    <Button onClick={() => fetchDataForModal(row.Tid)}>
                      View Lead Profile
                    </Button>
                  );
                case "contacts":
                  return (
                    <Button onClick={() => fetchDataForModalContact(row.Cid)}>
                      View Contact Profile
                    </Button>
                  );
                case "Salesopportunity":
                  return (
                    <Button
                      onClick={() => fetchDataForModalOpportunity(row.Oid)}
                    >
                      View Opportunity Profile
                    </Button>
                  );
                case "todayLeads":
                  return (
                    <Button onClick={() => fetchDataForModal(row.Tid)}>
                      View Opportunity Profile
                    </Button>
                  );
                default:
                  return null;
              }
            })()}
          </TableCell>
        )}
      </TableRow>
    ))}
  </TableBody>
</Table>

                    </TableContainer>
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        <Dialog
          open={modalOpenOpportunity}
          onClose={() => setModalOpenOpportunity(false)}
          sx={{ height: "80%", width: "100%" }}
        >
          {selectedOpportunity ? (
            <>
              <DialogTitle>Opportunity Profile</DialogTitle>
              <DialogContent>
                <Paper sx={{ padding: 5 }}>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      padding: 5,
                    }}
                  >
                    <Avatar
                      alt="John Doe"
                      sx={{ width: 60, height: 60, mr: 6 }}
                      src="/images/avatars/1.png"
                    />
                    <Box sx={{ flex: "1 1" }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 500, fontSize: "1.0rem" }}
                      >
                        {selectedOpportunity?.CName}
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem" }}>
                        {selectedOpportunity?.Mobile}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                   
                    }}
                  >
                    <Box sx={{ display: "flex", mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#333333",
                          fontSize: "0.7rem",
                          minWidth: "auto",
                          padding: "5px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: 2,
                          minHeight: 20,
                          marginLeft: 2,
                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                        }}
                      >
                        Looking For: {selectedOpportunity?.LookingTypeName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#333333",
                          fontSize: "0.7rem",
                          minWidth: "auto",
                          padding: "5px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: 2,
                          minHeight: 20,
                          marginLeft: 2,
                         
                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                        }}
                      >
                        Follow Up Date: {selectedOpportunity?.NextFollowUpDate}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#333333",
                          fontSize: "0.7rem",
                        
                          padding: "5px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: 2,
                          minHeight: 20,
                          marginLeft: 2,
                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                        }}
                      >
                        Follow Up Time: {selectedOpportunity?.NextFollowUpTime}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", mt: 7, justifyContent:"center" }}>
                      <a
                        href={`tel:${selectedOpportunity?.Mobile}`}
                        style={{ marginRight: 40 }}
                      >
                        <IconButton
                          aria-label="phone"
                          size="small"
                          sx={{
                            color: "green",
                            backgroundColor: "#e0f7fa",
                            borderRadius: "50%",
                            padding: "10px",
                            "&:hover": {
                              backgroundColor: "#b2ebf2",
                            },
                          }}
                        >
                          <PhoneIcon />
                        </IconButton>
                      </a>
                      <a style={{ marginRight: 40 }}>
                        <IconButton
                          aria-label="share"
                          size="small"
                          sx={{
                            color: "blue",
                            backgroundColor: "#e3f2fd",
                            borderRadius: "50%",
                            padding: "10px",

                            "&:hover": {
                              backgroundColor: "#bbdefb",
                            },
                          }}
                          onClick={handleHistoryClickOppo}
                        >
                          <HistoryIcon />
                        </IconButton>
                      </a>
                      <a style={{ marginRight: 40 }}>
                        <IconButton
                          aria-label="share"
                          size="small"
                          sx={{
                            color: "blue",
                            backgroundColor: "#e3f2fd",
                            borderRadius: "50%",
                            padding: "10px",
                       
                            "&:hover": {
                              backgroundColor: "#bbdefb",
                            },
                          }}
                        >
                          <ShareIcon />
                        </IconButton>
                      </a>
                      <a
                        href={`mailto:${selectedOpportunity?.Email}`}
                        style={{ marginRight: 35 }}
                      >
                        <IconButton
                          aria-label="email"
                          size="small"
                          sx={{
                            color: "red",
                            backgroundColor: "#ffebee",
                            borderRadius: "50%",
                            padding: "10px",
                            "&:hover": {
                              backgroundColor: "#ffcdd2",
                            },
                          }}
                        >
                          <EmailIcon />
                        </IconButton>
                      </a>
                      <a
                        href={`https://wa.me/${selectedOpportunity?.Mobile
                          }?text=${encodeURIComponent(whatsappText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconButton
                          aria-label="whatsapp"
                          size="small"
                          sx={{
                            color: "green",
                            backgroundColor: "#e8f5e9",
                            borderRadius: "50%",
                            padding: "10px",
                            "&:hover": {
                              backgroundColor: "#c8e6c9",
                            },
                          }}
                        >
                          <WhatsAppIcon />
                        </IconButton>
                      </a>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ml: 12,
                      mt: 15,
                    }}
                  >
                    <Grid container spacing={3}>
                      {/* Email */}
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Estimated Budget
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedOpportunity?.EstimatedbudgetName}
                          </Typography>
                        </Card>
                      </Grid>

                      {/* Project Name */}
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Purpose
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedOpportunity?.PurposeName}
                          </Typography>
                        </Card>
                      </Grid>

                      {/* Unit Type */}
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Time period
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedOpportunity?.PropertyAgeName}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box
                    sx={{
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      ml: 12,
                      mt: 12,
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,

                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Source Name
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedOpportunity?.SourceName}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,

                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            City
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedOpportunity?.CityName}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,

                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Area from
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedOpportunity?.AreaFrom}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Source Description, Telecall Attended By, Alternate Mobile Number */}
                  <Box
                    sx={{
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      ml: 12,
                      mt: 12,
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,

                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Area to
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedOpportunity?.AreaTo}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,

                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Scale
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedOpportunity?.ScaleName}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            width: "100%",
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Description
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedOpportunity?.Description}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </DialogContent>
             
            </>
          ) : (
            <DialogContent>
              <DialogTitle>Opportunity Profile</DialogTitle>
              <DialogContent>
                <Typography>No data available for selected Name.</Typography>
              </DialogContent>
            </DialogContent>
         )}
        </Dialog>
        <Dialog open={modalOpenHistoryOppo} onClose={handleCloseHistoryOppo} sx={{width:'100%'}}>
                <DialogTitle>
                 Opportunity Follow-Up Data
                  <IconButton edge="end" color="inherit" onClick={handleCloseHistoryOppo} aria-label="close" style={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent >
                  <Box >
                    <HistoryComponent item={selectedOpportunity?.Oid}></HistoryComponent>
                  </Box>
                </DialogContent>
              </Dialog>  
        <Dialog
          open={modalOpenContact}
          onClose={() => setModalOpenContact(false)}
          sx={{ maxWidth: "90vw", width: "auto" }}
        >
          {selectedContact ? (
            <>
              <DialogTitle>Contact Profile</DialogTitle>
              <DialogContent>
                <Paper sx={{ padding: 5 }}>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      padding: 5,
                    }}
                  >
                    <Avatar
                      alt="John Doe"
                      sx={{ width: 60, height: 60, mr: 6 }}
                      src="/images/avatars/1.png"
                    />
                    <Box sx={{ flex: "1 1" }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 500, fontSize: "1.0rem" }}
                      >
                        {selectedContact?.CName}
                      </Typography>
                      <Typography sx={{ fontSize: "0.9rem" }}>
                        {selectedContact?.Mobile}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      ml: 20,
                    }}
                  >
                    <div style={{ mr: 5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          backgroundColor: "#f0f0f0",
                          color: "#333333",
                          fontSize: "0.7rem",
                          minWidth: "auto",
                          padding: "5px",
                          borderRadius: 2,
                          minHeight: 20,
                          marginLeft: 2,
                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                        }}
                      >
                        Source: {selectedContact?.SourceName}
                      </Typography>
                    </div>
                    <div style={{ marginRight: 5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          backgroundColor: "#f0f0f0",
                          color: "#333333",
                          fontSize: "0.7rem",
                          minWidth: "auto",
                          padding: "5px",
                          borderRadius: 2,
                          minHeight: 20,
                          marginLeft: 2,

                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                        }}
                      >
                        City: {selectedContact?.CityName}/{selectedContact?.LocationName}
                      </Typography>
                    </div>
                    <div style={{ marginRight: 5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          backgroundColor: "#f0f0f0",
                          color: "#333333",
                          fontSize: "0.7rem",
                          minWidth: "auto",
                          padding: "5px",
                          borderRadius: 2,
                          minHeight: 20,
                          marginLeft: 2,

                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                        }}
                      >
                        Attended By: {selectedContact?.Name}
                      </Typography>
                    </div>
                  </Box>

                  <Box sx={{ display: "flex", mt: 10, ml: 10 }}>
                    <a
                      href={`tel:${selectedContact?.Mobile}`}
                      style={{ marginRight: 40 }}
                    >
                      <IconButton
                        aria-label="phone"
                        size="small"
                        sx={{
                          color: "green",
                          backgroundColor: "#e0f7fa",
                          borderRadius: "50%",
                          padding: "10px",
                          "&:hover": {
                            backgroundColor: "#b2ebf2",
                          },
                        }}
                      >
                        <PhoneIcon />
                      </IconButton>
                    </a>
                    <a style={{ marginRight: 10 }}>
                      <IconButton
                        aria-label="share"
                        size="small"
                        sx={{
                          color: "blue",
                          backgroundColor: "#e3f2fd",
                          borderRadius: "50%",
                          padding: "10px",
                          marginRight: 15,
                          "&:hover": {
                            backgroundColor: "#bbdefb",
                          },
                        }}
                      >
                        <ShareIcon />
                      </IconButton>
                    </a>

                    <a
                      href={`mailto:${selectedContact?.Email}`}
                      style={{ marginRight: 35 }}
                    >
                      <IconButton
                        aria-label="email"
                        size="small"
                        sx={{
                          color: "red",
                          backgroundColor: "#ffebee",
                          borderRadius: "50%",
                          padding: "10px",
                          "&:hover": {
                            backgroundColor: "#ffcdd2",
                          },
                        }}
                      >
                        <EmailIcon />
                      </IconButton>
                    </a>
                    <a
                      href={`https://wa.me/${selectedContact?.Mobile}?text=${whatsappText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconButton
                        aria-label="whatsapp"
                        size="small"
                        sx={{
                          color: "green",
                          backgroundColor: "#e8f5e9",
                          borderRadius: "50%",
                          padding: "10px",
                          "&:hover": {
                            backgroundColor: "#c8e6c9",
                          },
                        }}
                      >
                        <WhatsAppIcon />
                      </IconButton>
                    </a>
                  </Box>

                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      mt: 15,
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{ borderRadius: 1, padding: "10px" }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              fontSize: "0.9rem",
                              alignContent: "center",
                            }}
                          >
                            Email
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.8rem" }}
                          >
                            {selectedContact?.Email}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{ borderRadius: 1, padding: "10px" }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.9rem", fontWeight: 500 }}
                          >
                            Type
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.8rem" }}
                          >
                            {selectedContact?.CustomerTypeName}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{ borderRadius: 1, padding: "10px" }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.9rem", fontWeight: 500 }}
                          >
                            Contact Type
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.8rem" }}
                          >
                            {selectedContact?.ContactName}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",

                      mt: 12,
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{ borderRadius: 1, padding: "10px" }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, fontSize: "0.9rem" }}
                          >
                            Create Date
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.8rem" }}
                          >
                            {formatCreateDate(selectedContact?.CreateDate)}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{ borderRadius: 1, padding: "10px" }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.9rem", fontWeight: 500 }}
                          >
                            Country Code
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.8rem" }}
                          >
                            {selectedContact?.CountryName}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{ borderRadius: 1, padding: "10px" }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.9rem", fontWeight: 500 }}
                          >
                            City Name
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.8rem" }}
                          >
                            {selectedContact?.CityName}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",

                      mt: 12,
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{ borderRadius: 1, padding: "10px" }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, fontSize: "0.9rem" }}
                          >
                            Source
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.8rem" }}
                          >
                            {selectedContact?.SourceName}
                          </Typography>
                        </Card>
                      </Grid>
                     
                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{ borderRadius: 1, padding: "10px" }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, fontSize: "0.9rem" }}
                          >
                            Attended By
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.8rem" }}
                          >
                            {selectedContact?.Name}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </DialogContent>
            </>
          ) : (
            <DialogContent>
              <DialogTitle>Contact Profile</DialogTitle>
              <DialogContent>
                <Typography>No data available for selected contact.</Typography>
              </DialogContent>
            </DialogContent>
          )}
        </Dialog>
     
        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          sx={{ maxWidth: "90vw", width: "auto" }}
        >
          {selectedTelecaller ? (
            <>
              <DialogTitle>Telecaller Profile</DialogTitle>
              <DialogContent>
                <Paper sx={{ padding: 2 }}>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      padding: 5,
                    }}
                  >
                    <Avatar
                      alt="John Doe"
                      sx={{ width: 60, height: 60, mr: 6 }}
                      src="/images/avatars/1.png"
                    />
                    <Box sx={{ flex: "1 1" }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 500, fontSize: "1.0rem" }}
                      >
                        {selectedTelecaller?.CName}
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem" }}>
                        {selectedTelecaller?.Mobile}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mr: 10 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#333333",
                          fontSize: "0.7rem",
                          minWidth: "auto",
                          padding: "5px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: 2,
                          minHeight: 20,
                          // marginLeft: 20,
                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                        }}
                      >
                        Source Name: {selectedTelecaller?.SourceName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#333333",
                          fontSize: "0.7rem",
                          minWidth: "auto",
                          padding: "5px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: 2,
                          minHeight: 20,
                          marginLeft: 2,
                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                          // Add margin-right to separate the items
                        }}
                      >
                        Location: {selectedTelecaller?.Location}/{selectedTelecaller?.CityName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#333333",
                          fontSize: "0.7rem",
                          minWidth: "auto",
                          padding: "5px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: 2,
                          minHeight: 20,
                          marginLeft: 2,
                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                        }}
                      >
                        Attended By:{" "}
                        {selectedTelecaller?.TelecallAttendedByName}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", mt: 10, justifyContent: "center" }}>
                      <a
                        href={`tel:${selectedTelecaller?.Mobile}`}
                        style={{ marginRight: 40 }}
                      >
                        <IconButton
                          aria-label="phone"
                          size="small"
                          sx={{
                            color: "green",
                            backgroundColor: "#e0f7fa",
                            borderRadius: "50%",
                            padding: "10px",
                            "&:hover": {
                              backgroundColor: "#b2ebf2",
                            },
                          }}
                        >
                          <PhoneIcon />
                        </IconButton>
                      </a>
                      <a style={{ marginRight: 40 }}>
                        <IconButton
                          aria-label="share"
                          size="small"
                          sx={{
                            color: "blue",
                            backgroundColor: "#e3f2fd",
                            borderRadius: "50%",
                            padding: "10px",

                            "&:hover": {
                              backgroundColor: "#bbdefb",
                            },
                          }}
                          onClick={handleHistoryClickLead}
                        >
                          <HistoryIcon />
                        </IconButton>
                      </a>
                      <a style={{ marginRight: 40 }}>
                        <IconButton
                          aria-label="share"
                          size="small"
                          sx={{
                            color: "blue",
                            backgroundColor: "#e3f2fd",
                            borderRadius: "50%",
                            padding: "10px",

                            "&:hover": {
                              backgroundColor: "#bbdefb",
                            },
                          }}
                        >
                          <ShareIcon />
                        </IconButton>
                      </a>
                      <a
                        href={`mailto:${selectedTelecaller?.Email}`}
                        style={{ marginRight: 40 }}
                      >
                        <IconButton
                          aria-label="email"
                          size="small"
                          sx={{
                            color: "red",
                            backgroundColor: "#ffebee",
                            borderRadius: "50%",
                            padding: "10px",
                            "&:hover": {
                              backgroundColor: "#ffcdd2",
                            },
                          }}
                        >
                          <EmailIcon />
                        </IconButton>
                      </a>
                      <a
                        href={`https://wa.me/${selectedTelecaller?.Mobile}?text=${whatsappText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconButton
                          aria-label="whatsapp"
                          size="small"
                          sx={{
                            color: "green",
                            backgroundColor: "#e8f5e9",
                            borderRadius: "50%",
                            padding: "10px",
                            "&:hover": {
                              backgroundColor: "#c8e6c9",
                            },
                          }}
                        >
                          <WhatsAppIcon />
                        </IconButton>
                      </a>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ml: 12,
                      mt: 15,
                    }}
                  >
                    <Grid container spacing={3}>
                      {/* Email */}
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Email
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.Email}
                          </Typography>
                        </Card>
                      </Grid>

                      {/* Project Name */}
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Project Name
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.ProjectName}
                          </Typography>
                        </Card>
                      </Grid>

                      {/* Unit Type */}
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Unit Type
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.UnittypeName}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box
                    sx={{
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      ml: 12,
                      mt: 12,
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Estimated Budget
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.EstimatedbudgetName}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Lead Status
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.leadstatusName}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Follow-Up Date
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.NextFollowUpDate}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Source Description, Telecall Attended By, Alternate Mobile Number */}
                  <Box
                    sx={{
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      ml: 12,
                      mt: 12,
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Created At
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.CreateDate}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Attended By
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.TelecallAttendedByName}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Alternate Number
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.OtherNumbers}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Comments */}
                  <Box
                    sx={{
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      ml: 12,
                      mt: 12,
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Comments
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.Comments}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </DialogContent>
              <Dialog open={modalOpenHistory} onClose={handleCloseHistory} sx={{width:'100%'}}>
                <DialogTitle>
                  Follow-Up Data
                  <IconButton edge="end" color="inherit" onClick={handleCloseHistory} aria-label="close" style={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent >
                  <Box >
                    <HistoryComponent item={selectedTelecaller?.Tid}></HistoryComponent>
                  </Box>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <>
              <DialogTitle>Contact Profile</DialogTitle>
              <DialogContent>
                <Paper sx={{ padding: 2 }}>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      padding: 5,
                    }}
                  >
                    <Avatar
                      alt="John Doe"
                      sx={{ width: 60, height: 60, mr: 6 }}
                      src="/images/avatars/1.png"
                    />
                    <Box sx={{ flex: "1 1" }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 500, fontSize: "1.0rem" }}
                      >
                        {selectedTelecaller?.CName}
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem" }}>
                        {selectedTelecaller?.Mobile}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ width: "100%", ml: 20 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mr: 10 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#333333",
                          fontSize: "0.7rem",
                          minWidth: "auto",
                          padding: "5px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: 2,
                          minHeight: 20,
                          // marginLeft: 20,
                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                        }}
                      >
                        Source Name: {selectedTelecaller?.SourceName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#333333",
                          fontSize: "0.7rem",
                          minWidth: "auto",
                          padding: "5px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: 2,
                          minHeight: 20,
                          marginLeft: 2,
                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                          mr: 2, // Add margin-right to separate the items
                        }}
                      >
                        Location: {selectedTelecaller?.Location}/{selectedTelecaller?.CityName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#333333",
                          fontSize: "0.7rem",
                          minWidth: "auto",
                          padding: "5px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: 2,
                          minHeight: 20,
                          marginLeft: 2,
                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                        }}
                      >
                        Attended By:{" "}
                        {selectedTelecaller?.TelecallAttendedByName}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", mt: 10, ml: 20 }}>
                      <a
                        href={`tel:${selectedTelecaller?.Mobile}`}
                        style={{ marginRight: 40 }}
                      >
                        <IconButton
                          aria-label="phone"
                          size="small"
                          sx={{
                            color: "green",
                            backgroundColor: "#e0f7fa",
                            borderRadius: "50%",
                            padding: "10px",
                            "&:hover": {
                              backgroundColor: "#b2ebf2",
                            },
                          }}
                        >
                          <PhoneIcon />
                        </IconButton>
                      </a>
                      <a style={{ marginRight: 10 }}>
                        <IconButton
                          aria-label="share"
                          size="small"
                          sx={{
                            color: "blue",
                            backgroundColor: "#e3f2fd",
                            borderRadius: "50%",
                            padding: "10px",
                            marginRight: 15,
                            "&:hover": {
                              backgroundColor: "#bbdefb",
                            },
                          }}
                        >
                          <ShareIcon />
                        </IconButton>
                      </a>

                      <a
                        href={`mailto:${selectedTelecaller?.Email}`}
                        style={{ marginRight: 35 }}
                      >
                        <IconButton
                          aria-label="email"
                          size="small"
                          sx={{
                            color: "red",
                            backgroundColor: "#ffebee",
                            borderRadius: "50%",
                            padding: "10px",
                            "&:hover": {
                              backgroundColor: "#ffcdd2",
                            },
                          }}
                        >
                          <EmailIcon />
                        </IconButton>
                      </a>
                      <a
                        href={`https://wa.me/${selectedTelecaller?.Mobile}?text=${whatsappText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconButton
                          aria-label="whatsapp"
                          size="small"
                          sx={{
                            color: "green",
                            backgroundColor: "#e8f5e9",
                            borderRadius: "50%",
                            padding: "10px",
                            "&:hover": {
                              backgroundColor: "#c8e6c9",
                            },
                          }}
                        >
                          <WhatsAppIcon />
                        </IconButton>
                      </a>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ml: 12,
                      mt: 15,
                    }}
                  >
                    <Grid container spacing={3}>
                      {/* Email */}
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Email
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.Email}
                          </Typography>
                        </Card>
                      </Grid>

                      {/* Project Name */}
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Project Name
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.ProjectName}
                          </Typography>
                        </Card>
                      </Grid>

                      {/* Unit Type */}
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Unit Type
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.UnittypeName}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box
                    sx={{
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      ml: 12,
                      mt: 12,
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Estimated Budget
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.EstimatedbudgetName}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Lead Status
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.leadstatusName}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Follow-Up Date
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.NextFollowUpDate}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Source Description, Telecall Attended By, Alternate Mobile Number */} 
                  <Box
                    sx={{
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      ml: 12,
                      mt: 12,
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Created At
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.TelecallingCreateDate}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Attended By
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.TelecallAttendedByName}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Alternate Number
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.OtherNumbers}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Comments */}
                  <Box
                    sx={{
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      ml: 12,
                      mt: 12,
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Comments
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.Comments}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </DialogContent>
            </>
          )}
        </Dialog>
        {/* 
        <Grid item xs={12} md={6}>
          <WeeklyOverview />
        </Grid>
        <Grid item xs={12} md={6}>
          <TotalEarning />
        </Grid> */}
        {/* <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats="862"
                trend="negative"
                trendNumber="-18%"
                title="New Project"
                subtitle="Yearly Project"
                icon={<BriefcaseVariantOutline />}
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats="15"
                color="warning"
                trend="negative"
                trendNumber="-18%"
                subtitle="Last Week"
                title="Sales Queries"
                icon={<HelpCircleOutline />}
              />
            </Grid>
          </Grid>
        </Grid> */}
        {/* <Grid item xs={12} md={6} lg={4}>
          <SalesByCountries />
        </Grid>
        <Grid item xs={12} md={12} lg={8}>
          <DepositWithdraw />
        </Grid> */}
      </Grid>
    </ApexChartWrapper>
  );
};

export default Dashboard;
