import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Box,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import AssignmentIcon from '@mui/icons-material/Assignment'; // Correct icon import

const ListLoanReport = ({ item }) => {
  const [workPercentage, setWorkPercentage] = useState("");
  const [takePercentage, setTakePercentage] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(""); // To track error message
  const [totalLoanAmountToDraw, setTotalLoanAmountToDraw] = useState(null); // State for allovertotalloamountotdrwn

  // Log to check what is passed as 'item'
  console.log("Row Data to Update:", item);

  // Fetch data from API based on input percentages
  const fetchData = async (workPercentage, takePercentage, fromDate, toDate) => {
    setLoading(true);
    setError(""); // Reset error message on new request
    if (!item?.ProjectID) {
      setLoading(false);
      
      setError("ProjectID is missing");
      return;
    }
   
    
    const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-fetch-loanreport.php?ProjectID=${item.ProjectID}&workpercentage=${workPercentage}&takepercentage=${takePercentage}&fromdate=${fromDate}&todate=${toDate}`;
    
    try {
      const response = await axios.get(apiUrl);
      if (response.data.status === "Success") {
        setData(response.data.data);
        setTotalLoanAmountToDraw(response.data.allovertotalloamountotdrwn); 
      } else {
        setData([]);
        setTotalLoanAmountToDraw(null); 
        Swal.fire("No data found", "", "info");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); // Clear data if there is an error
      setTotalLoanAmountToDraw(null); // Reset total loan amount to draw
      setError("Not found any data"); // Change error message here
    } finally {
      setLoading(false);
    }
  };

  // Handle input change for workpercentage, takepercentage, fromdate, and todate
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "workpercentage") {
      setWorkPercentage(value);
    } else if (name === "takepercentage") {
      setTakePercentage(value);
    } else if (name === "fromdate") {
      setFromDate(value);
    } else if (name === "todate") {
      setToDate(value);
    }
  };

  // Handle search
  useEffect(() => {
    if (searchQuery) {
      setFilteredData(
        data.filter(
          (item) =>
            item.FlatNo.toString().includes(searchQuery) ||
            item.Name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredData(data);
    }
  }, [searchQuery, data]);

  // Handle submit for fetching data with given percentages and dates
  const handleSubmit = () => {
    if (workPercentage || takePercentage) {
      fetchData(workPercentage, takePercentage, fromDate, toDate);
    } else {
      Swal.fire("Please enter either workpercentage or takepercentage", "", "warning");
    }
  };

  // Helper function to convert data to CSV
  const convertToCSV = (data) => {
    const header = [
      "Party Name", 
      "Wing Name", 
      "Flat No", 
      "Total Loan Amount", 
      "Loan Percentage", 
      "Self Percentage", 
      "Loan Amount to Draw",
      "Percentage"
    ];
    
    const rows = data.map(row => [
      row.Name,
      row.WingName,
      row.FlatNo,
      row.Remarkamount,
      row.loanpercentage,
      row.selfpercentage,
      row.loanAmountToDraw,
      workPercentage
    ]);
    
    const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
    return csvContent;
  };

  // Function to download the CSV file
  const downloadCSV = () => {
    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "loan_report.csv";
    link.click();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      {/* Top Heading with Enhanced UI */}
      <Box
        sx={{
          backgroundColor: "#9155FD", // Deep teal color for the background
          padding: "30px",
          borderRadius: "8px",
          marginBottom: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Shadow for depth
        }}
      >
      
        <Typography
          variant="h3"
          component="h1"
          sx={{
            color: "#ffffff", // White text for contrast
            fontWeight: "bold",
            fontSize: "36px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <AssignmentIcon sx={{ fontSize: "40px" }} /> Loan Report

        </Typography>
         

      </Box>

      
    
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 3,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Work Percentage"
          variant="outlined"
          value={workPercentage}
          name="workpercentage"
          onChange={handleChange}
          sx={{
            flex: 1,
            minWidth: "200px",
            maxWidth: "300px",
            marginBottom: 2,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">%</InputAdornment>
            ),
          }}
        />
        <TextField
          label="Take Percentage"
          variant="outlined"
          value={takePercentage}
          name="takepercentage"
          onChange={handleChange}
          sx={{
            flex: 1,
            minWidth: "200px",
            maxWidth: "300px",
            marginBottom: 2,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">%</InputAdornment>
            ),
          }}
        />
        <TextField
          label="From Date"
          type="date"
          variant="outlined"
          value={fromDate}
          name="fromdate"
          onChange={handleChange}
          sx={{
            flex: 1,
            minWidth: "200px",
            maxWidth: "300px",
            marginBottom: 2,
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="To Date"
          type="date"
          variant="outlined"
          value={toDate}
          name="todate"
          onChange={handleChange}
          sx={{
            flex: 1,
            minWidth: "200px",
            maxWidth: "300px",
            marginBottom: 2,
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{
            height: "fit-content",
            alignSelf: "center",
            minWidth: "150px",
            padding: "10px 20px",
            fontSize: "16px",
          }}
        >
          Submit
        </Button>
      </Box>

      {error && (
        <Typography variant="h6" color="error" sx={{ marginBottom: "20px", textAlign: "center" }}>
          {error}
        </Typography>
      )}

      {/* Display total loan amount to draw */}
      {totalLoanAmountToDraw !== null && (
        <Typography variant="h6" sx={{ marginBottom: "20px", textAlign: "center" }}>
          Total Loan Amount to Draw: ₹ {totalLoanAmountToDraw.toFixed(2)}
        </Typography>
      )}

      {/* Download button */}
      <Box sx={{ textAlign: "center", marginBottom: "20px" }}>
        <Button variant="contained" color="secondary" onClick={downloadCSV}>
          Download Report
        </Button>
      </Box>

      {/* Table to display data */}
      {loading ? (
        <CircularProgress />
      ) : (
        <Card sx={{ marginTop: 3, borderRadius: "8px" }}>
         <CardHeader
  title={`${item?.ProjectName || 'No Project Name'}`}  // Display Project Name dynamically
  sx={{
    backgroundColor: "#f4f4f4",
    textAlign: "center",
    fontWeight: "bold",
    padding: "16px",
  }}
/>
          <CardContent>
            {data.length === 0 ? (
              <Typography variant="h6" textAlign="center">
                No data available
              </Typography>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: "8px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e0e0e0" }}>
                        Party Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e0e0e0" }}>
                        Wing Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e0e0e0" }}>
                        Flat No
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e0e0e0" }}>
                        Total Loan Amount
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e0e0e0" }}>
                        Loan Percentage
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e0e0e0" }}>
                        Self Percentage
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", backgroundColor: "#e0e0e0" }}>
                        Loan Amount to Draw
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(searchQuery ? filteredData : data).map((row) => (
                      <TableRow key={row.BookingID} hover>
                        <TableCell>{row.Name}</TableCell>
                        <TableCell>{row.WingName}</TableCell>
                        <TableCell>{row.FlatNo}</TableCell>
                        <TableCell>₹{row.Remarkamount}</TableCell>
                        <TableCell>{row.loanpercentage}</TableCell>
                        <TableCell>{row.selfpercentage}</TableCell>
                        <TableCell>₹{row.loanAmountToDraw}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ListLoanReport;
