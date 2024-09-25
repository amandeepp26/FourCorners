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

import { useCookies } from "react-cookie";
import Select from "@mui/material/Select";

import Avatar from "@mui/material/Avatar";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios"; // Import Axios for API requests
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts";
import StatisticsCardsales from "src/views/dashboard/StatisticsCardsales";
import Trophy from "src/views/dashboard/Trophy";
import WeeklyOverview from "src/views/dashboard/WeeklyOverview";
import TotalEarning from "src/views/dashboard/TotalEarning";
import CardStatisticsVerticalComponent from "src/@core/components/card-statistics/card-stats-vertical";
import SalesByCountries from "src/views/dashboard/SalesByCountries";
import DepositWithdraw from "src/views/dashboard/DepositWithdraw";
import { HelpCircleOutline, BriefcaseVariantOutline } from "mdi-material-ui";
import { Call, Contacts } from "@mui/icons-material";
import PhoneIcon from "@mui/icons-material/Phone";
import ShareIcon from "@mui/icons-material/Share";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import HistoryComponent from "src/components/history";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";

ChartJS.register(ArcElement, Tooltip, Legend);
const SaleDashboard = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fromdate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
    todate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
    SourceName: "",
    Status: 1,
  });
  const [cookies] = useCookies(["amr"]);
  const [telecallingData, setTelecallingData] = useState(null);
  const [source, setSource] = useState([]);
  const [errors, setErrors] = useState({});
  const [modalOpenHistoryOppo, setOpenHistoryOppo] = useState(false);

  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenContact, setModalOpenContact] = useState(false);
  const [modalOpenOpportunity, setModalOpenOpportunity] = useState(false);
  const [modalOpenBooking, setModalOpenBooking] = useState(false);
  const [rowData, setRowData] = useState([]);

  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

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

  const whatsappText = encodeURIComponent(
    `Hello, I wanted to discuss the following details:\n\nSource Name: ${selectedTelecaller?.SourceName}\nLocation: ${selectedTelecaller?.Location}\nAttended By: ${selectedTelecaller?.TelecallAttendedByName}`
  );

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        UserID: cookies?.amr?.UserID,
        fromdate: formData?.fromdate?.toISOString(),
        todate: formData?.todate?.toISOString(),
      });
      const response = await fetch(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-opportunitydashboard.php?${params}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTelecallingData(data);
    } catch (error) {
      console.error("Error fetching telecalling data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (type) => {
    if (type === "telecalling") {
      setSelectedData(telecallingData?.data?.telecallingRecords);
      setSelectedType("telecalling");
    } else if (type === "contacts") {
      setSelectedData(telecallingData?.data?.contactsRecords);
      setSelectedType("contacts");
    } else if (type === "opportunity") {
      setSelectedData(telecallingData?.data?.opportunityRecords);
      setSelectedType("opportunity");
    } else if (type === "booking") {
      setSelectedData(telecallingData?.data?.oproccessRecords);
      setSelectedType("booking");
    } else if (type === "loan") {
      setSelectedData(telecallingData?.data?.bookingremarkLoanRecords);
      setSelectedType("loan");
    } else if (type === "payment") {
      setSelectedData(telecallingData?.data?.bookingremarkRecords);
      setSelectedType("payment");
    }
  };
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
    const { value } = event.target;

    setErrors((prevErrors) => ({
      ...prevErrors,
      SourceName: undefined,
    }));

    setFormData({
      ...formData,
      SourceName: value,
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


  const fetchDataForBooking = async (BookingID) => {
    console.log("Oid AAYA", BookingID);
    console.log("press");
    try {
      const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-fetch-singel-bookingremark.php?BookingID=${BookingID}`;
      const response = await axios.get(apiUrl);

      if (response.data.status === "Success") {
        console.log(response.data, "Single booking data fetched for booking");
        setSelectedBooking(response.data.data);
        setModalOpenBooking(true);
      }
    } catch (error) {
      console.error("Error fetching single telecalling data:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const pieData = {
    labels: ["opportunity", "Booking"],
    datasets: [
      {
        data: [
          telecallingData?.data?.telecallingCount || 0,
          telecallingData?.data?.contactsCount || 0,
          telecallingData?.data?.opportunityCount || 0,
          telecallingData?.data?.oproccessCount || 0,

          0, // Adjust this value as needed for "Not Interested"
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
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
        {/* <Grid item xs={12} md={4}>
          <Trophy />
        </Grid> */}
        <Grid item xs={12}>
          <StatisticsCardsales />
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
                  Search Opportunity
                </Typography>
              </Box>
            </Grid>
            <CardContent>
              <Card>
                <CardContent>
                  <Grid container spacing={3}>
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
                      <Card onClick={() => handleCardClick("opportunity")}>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Contacts fontSize="large" color="primary" />
                          <Typography variant="h6" gutterBottom>
                            Opportunity
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Total Counts:{" "}
                            {telecallingData?.data?.opportunityCount}{" "}
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
                            Total Counts: {telecallingData?.data.oproccessCount}{" "}
                            {/* Adjust this key as needed */}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card onClick={() => handleCardClick("loan")}>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Contacts fontSize="large" color="primary" />
                          <Typography variant="h6" gutterBottom>
                            Todays Loan reminder
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Total Counts:{" "}
                            {telecallingData?.data.bookingremarkLoanCount}{" "}
                            {/* Adjust this key as needed */}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card onClick={() => handleCardClick("payment")}>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Contacts fontSize="large" color="primary" />
                          <Typography variant="h6" gutterBottom>
                            Todays Payment reminder
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Total Counts:{" "}
                            {telecallingData?.data.bookingremarkCount}{" "}
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
                        : selectedType === "opportunity"
                        ? selectedType === "opportunity"
                        : `${userName} Opportunity Data`
                        ? selectedType === "booking"
                        : `${userName} Booking Data`}
                    </Typography>
                  </Box>
                </Grid>
                {selectedData && (
                  <Grid item xs={12} sx={{ mt: 3 }}>
                    <TableContainer component={Box} sx={{ maxHeight: 400 }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            {selectedType === "payment" ||
                            selectedType === "loan" ? (
                              <>
                                <TableCell>Remark Name</TableCell>
                                <TableCell>Customer Name</TableCell>
                                <TableCell>Remark Date</TableCell>
                                <TableCell>Remark Amount</TableCell>
                                <TableCell>Mobile Number</TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell>Name</TableCell>
                                <TableCell>Mobile</TableCell>
                                {selectedType === "telecalling" ? (
                                  <TableCell>Next Follow Up</TableCell>
                                ) : (
                                  <TableCell>Created Date</TableCell>
                                )}
                                {selectedType !== "booking" && (
                                  <TableCell>Action</TableCell>
                                )}
                              </>
                            )}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(selectedData || [])?.map((row, index) => (
                            <TableRow key={index}>
                              {selectedType === "payment" ||
                              selectedType === "loan" ? (
                                <>
                                  <TableCell>{row.RemarkName}</TableCell>
                                  <TableCell>{row.CName}</TableCell>
                                  <TableCell>{row.RemarkDate}</TableCell>
                                  <TableCell>{row.Remarkamount}</TableCell>
                                  <TableCell>{row.Mobile}</TableCell>
                                </>
                              ) : (
                                <>
                                  <TableCell>{row.CName}</TableCell>
                                  <TableCell>{row.Mobile}</TableCell>
                                  <TableCell>
                                    {selectedType === "telecalling"
                                      ? row.NextFollowUpDate
                                      : row.CreateDate}
                                  </TableCell>
                                  {selectedType !== "booking" && (
                                    <TableCell>
                                      {selectedType === "telecalling" ? (
                                        <Button
                                          onClick={() =>
                                            fetchDataForModal(row.Tid)
                                          }
                                        >
                                          View Telecaller Profile
                                        </Button>
                                      ) : selectedType === "contacts" ? (
                                        <Button
                                          onClick={() =>
                                            fetchDataForModalContact(row.Cid)
                                          }
                                        >
                                          View Contact Profile
                                        </Button>
                                      ) : selectedType === "opportunity" ? (
                                        <Button
                                          onClick={() =>
                                            fetchDataForModalOpportunity(
                                              row.Oid
                                            )
                                          }
                                        >
                                          View Opportunity Profile
                                        </Button>
                                      ) : null}
                                    </TableCell>
                                  )}
                                </>
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
          sx={{ maxWidth: "90vw", width: "auto" }}
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
                      // alignItems: "center",
                      // ml: 15,
                    }}
                  >
                    <Box sx={{ display: "flex", mb: 2 , ml:5 }}>
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
                          marginRight: 5,
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
                          minWidth: "auto",
                          padding: "5px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: 2,
                          minHeight: 20,
                          marginRight: 12,
                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                        }}
                      >
                        Follow Up Time: {selectedOpportunity?.NextFollowUpTime}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", ml: 20, mt: 7 }}>
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
                        href={`https://wa.me/${
                          selectedOpportunity?.Mobile
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
                    <HistoryComponent type={'sales'} item={selectedOpportunity?.Oid}></HistoryComponent>
                  </Box>
                </DialogContent>
              </Dialog>  





        <Dialog
          open={modalOpenBooking}
          onClose={() => setModalOpenBooking(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedBooking ? (
            <>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogContent>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Grid container spacing={2}>
                      {/* City */}
                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{ borderRadius: 1, padding: "10px" }}
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
                            {selectedBooking?.CityName}
                          </Typography>
                        </Card>
                      </Grid>

                      {/* Wing */}
                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{ borderRadius: 1, padding: "10px" }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Wing Name
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedBooking?.WingName}
                          </Typography>
                        </Card>
                      </Grid>

                      {/* Project Name */}
                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{ borderRadius: 1, padding: "10px" }}
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
                            {selectedBooking?.ProjectName}
                          </Typography>
                        </Card>
                      </Grid>

                      {/* Flat No */}
                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{ borderRadius: 1, padding: "10px" }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Flat No
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedBooking?.FlatNo}
                          </Typography>
                        </Card>
                      </Grid>

                      {/* Floor No */}
                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{ borderRadius: 1, padding: "10px" }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Floor No
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedBooking?.FloorNo}
                          </Typography>
                        </Card>
                      </Grid>

                      {/* Unit Type */}
                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{ borderRadius: 1, padding: "10px" }}
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
                            {selectedBooking?.UnittypeName}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Remark Section */}
                  <Box
                    sx={{
                      width: "auto",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      ml: 12,
                      mt: 12,
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      Remarks
                    </Typography>
                    {selectedBooking?.remarksWithCreateDate.map(
                      (remark, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Card
                            variant="outlined"
                            sx={{
                              borderRadius: 1,
                              padding: "10px",
                              width: "100%",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                            >
                              {remark.RemarkName}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "0.7rem" }}
                            >
                              Amount: {remark.Remarkamount}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "0.7rem" }}
                            >
                              Date: {remark.RemarkDate}
                            </Typography>
                          </Card>
                        </Box>
                      )
                    )}
                  </Box>
                </Paper>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setModalOpenBooking(false)}>
                  Close
                </Button>
              </DialogActions>
            </>
          ) : (
            <DialogContent>
              <Typography>Loading...</Typography>
            </DialogContent>
          )}
        </Dialog>
      </Grid>
    </ApexChartWrapper>
  );
};

export default SaleDashboard;
