import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Box,
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
  TablePagination,
  CircularProgress,
  Typography,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  MenuItem,
  TextField,
  Modal,
  Avatar,
  Menu,
  FormControlLabel,
  Checkbox,
  InputAdornment,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import axios from "axios";
import { useRouter } from "next/router";
import CancelTemplate from "../../components/canceltemplate"
import { useCookies } from "react-cookie";
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DownloadIcon from '@mui/icons-material/Download';

const NoDataIcon = () => (
  <Avatar alt="No Data" sx={{ width: 500, height: "auto" }} src="/images/avatars/nodata.svg" />
);

const ListBookingCancel = ({ onChequeReceiptClick, item }) => {
  const router = useRouter();
  const [cookies] = useCookies(["amr"]);
  const [wings, setWings] = useState([]);
  const [selectedWing, setSelectedWing] = useState(null);
  const [wingDetails, setWingDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [dataAvailable, setDataAvailable] = useState(true);
  const [openTemplate, setOpenTemplate] = useState(false);
  const [followupData, setFollowupData] = useState({ note: '', followupDate: new Date() });
  const [remarks, setRemarks] = useState([]);
  const [selectedRemark, setSelectedRemark] = useState("");
  const [bookingcancelID, setBookingID] = useState(null);
  const [amount, setAmount] = useState("");
 
  useEffect(() => {
    if (!item) return;
    const fetchWings = async () => {
      try {
        const { data } = await axios.get(`https://apiforcornershost.cubisysit.com/api/api-fetch-projectwings.php?ProjectID=${item.ProjectID}`);
        if (data.status === "Success") {
          setWings(data.data);
        }
      } catch (error) {
        console.error("Error fetching wings data:", error);
      }
    };
    fetchWings();
  }, [item]);

  // Fetch wing details when a wing is selected
  const handleWingClick = async (wing) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`https://apiforcornershost.cubisysit.com/api/api-fetch-projectwingcancel.php?WingID=${wing.WingID}&ProjectID=${item.ProjectID}`);
      if (data.status === "Success") {
        setWingDetails(data.data);
        setSelectedWing(wing);
        setDataAvailable(data.data.length > 0);
      } else {
        setDataAvailable(false);
      }
    } catch (error) {
      console.error("Error fetching wing details:", error);
      setDataAvailable(false);
    } finally {
      setLoading(false);
    }
  };
 
    const fetchRemarks = async () => {
      if (bookingCancelID) {
        try {
          const response = await axios.get(
            `https://apiforcornershost.cubisysit.com/api/api-fetch-cancelremark.php?bookingcancelremarksbookingcancelID=${bookingCancelID}`
          );
          if (response.data.status === "Success") {
            setRemarks(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching cancellation remarks:", error);
        }
      }
    };

  const handleFollowupChange = (event) => {
    const { name, value } = event.target;
    setFollowupData((prev) => ({ ...prev, [name]: value }));

    if (name === "selectedRemark") {
      const selected = remarks.find(remark => remark.bookingcancelremarksID === value);
      setSelectedRemark(value);
      setAmount(selected ? selected.bookingcancelremarksAmount : "");
    }
  };

  // Filter rows based on search query
  useEffect(() => {
    if (searchQuery) {
      setFilteredRows(wingDetails.filter(row =>
        row.bookingcancelFlatNo?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.bookingcancelName?.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    } else {
      setFilteredRows(wingDetails);
    }
  }, [searchQuery, wingDetails]);

  // Handle input changes for follow-up data


  // Handle form submission for follow-up
  const handleFollowupSubmit = () => {
    // Here you would handle the submit logic (e.g., sending data to an API)
    console.log("Follow-up Data:", followupData);
    setOpenTemplate(false); // Close modal after submission
  };


  const handleTemplateClick = (bookingcancelID) => {
    console.log("Adding payment for Booking ID:", bookingcancelID);
    setBookingID(bookingcancelID); 
    setOpenTemplate(true); 
  };
// Handle Download CSV
const downloadCSV = () => {
  const headers = [
    'Booking Date',
    'Mobile',
    'Name',
    'Address',
    'Aadhar',
    'Pancard',
    'Email',
    'Project Name',
    'Wing Name',
    'Floor No',
    'Flat No',
    'Unit Type',
    'Area (sqft)',
    'Rate per sqft',
    'Total Amount',
    'Charges',
    'Parking Facility',
    'Parking Availability',
    'Flat Cost',
    'GST',
    'Stamp Duty',
    'Registration',
    'Advocate',
    'Extra Cost',
    'Total Cost',
    'Usable Area',
    'Agreement Carpet Area',
    'Source Name',
    'Booking Ref',
    'Agreement Amount',
    'Created Date'
  ];

  let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";

  // Loop through the data (either filtered rows or all wing details)
  (searchQuery ? filteredRows : wingDetails).forEach((row) => {
    const rowData = [
      row.bookingcancelBookingDate,   // Booking Date
      row.bookingcancelMobile,         // Mobile
      row.bookingcancelName,           // Name
      `"${row.bookingcancelAddress.replace(/"/g, '""')}"`,        // Address
      row.bookingcancelAadhar,         // Aadhar
      row.bookingcancelPancard,        // Pancard
      row.bookingcancelEmail,          // Email
      row.ProjectName,                 // Project Name
      row.WingName,                    // Wing Name
      row.bookingcancelFloorNo,        // Floor No
      row.bookingcancelFlatNo,         // Flat No
      row.UnittypeName,                // Unit Type (e.g., 3 BHK)
      row.bookingcancelArea,           // Area
      row.bookingcancelRatesqft,       // Rate per sqft
      row.bookingcancelTtlAmount,      // Total Amount
      row.bookingcancelCharges,        // Charges
      row.bookingcancelParkingFacility,// Parking Facility
      row.ParkingAvilability,          // Parking Availability
      row.bookingcancelFlatCost,       // Flat Cost
      row.bookingcancelGst,            // GST
      row.bookingcancelStampDuty,      // Stamp Duty
      row.bookingcancelRegistration,   // Registration
      row.bookingcancelAdvocate,       // Advocate
      row.bookingcancelExtraCost,      // Extra Cost
      row.bookingcancelTotalCost,      // Total Cost
      row.bookingcancelUsableArea,     // Usable Area
      row.bookingcancelAgreementCarpet, // Agreement Carpet Area
      row.bookingcancelSourceName,     // Source Name
      row.bookingcancelBookingRef,     // Booking Ref
      row.bookingcancelAggrementAmount,// Agreement Amount
      row.CreateDate     // Created Date
    ];

    csvContent += rowData.join(",") + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "wing_details.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  const handleCloseTemplate = () => {
    setOpenTemplate(false); // Close the modal
    setBookingID(null); // Reset the booking ID (optional)
  };



  return (
    <>
        <Modal open={openTemplate} onClose={handleCloseTemplate}>
        <Card
          style={{
            maxWidth: "800px",
            margin: "auto",
            marginTop: "50px",
            height: "90vh", // Set height relative to the viewport
            padding: "20px",
            overflowY: "auto", // Enable vertical scrolling if content overflows
          }}
        >
          <CancelTemplate
            bookingcancelID={bookingcancelID}
            handleCancel={handleCloseTemplate}
          />
        </Card>
      </Modal>

      <Grid container justifyContent="center" spacing={2} sx={{ marginBottom: 5 }}>
        {wings.map((wing) => (
          <Grid item key={wing.WingID}>
            <Button
              variant="contained"
              onClick={() => handleWingClick(wing)}
              sx={{
                color: "#333333",
                fontSize: "0.6rem",
                backgroundColor: "#f0f0f0",
                minWidth: "auto",
                minHeight: 20,
                "&:hover": {
                  backgroundColor: "#dcdcdc",
                },
              }}
            >
              Wing {wing.WingName}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ padding: 2, marginBottom: 2 }}>
        <TextField
          fullWidth
          label="Search by Flat No or Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
        />
      </Box>

      {selectedWing && (
        <Card sx={{ maxWidth: 1200, margin: "auto", padding: 2, height: 700, overflow: "auto" }}>
          <CardHeader title={`${selectedWing.WingName} Details`} />
          <CardContent>
            {loading ? (
              <CircularProgress />
            ) : dataAvailable ? (
              <>
               <Button variant="contained" color="primary" onClick={downloadCSV} sx={{ marginBottom: 2 }}>
                  <DownloadIcon sx={{ marginRight: 1 }} /> Download CSV
                </Button>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 800 }} aria-label="wing details table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Party Name</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Project Name</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Wing Name</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Flat No</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(searchQuery ? filteredRows : wingDetails).map((row) => (
                        <TableRow key={row.bookingcancelID}>
                          <TableCell>{row.bookingcancelName}</TableCell>
                          <TableCell>{row.ProjectName}</TableCell>
                          <TableCell>{row.WingName}</TableCell>
                          <TableCell>{row.bookingcancelFlatNo}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleTemplateClick(row.bookingcancelID)} color="primary">
                              <FileCopyIcon />   
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <Box textAlign="center">
                <Typography variant="h6">No data available</Typography>
                <NoDataIcon />
              </Box>
            )}
          </CardContent>
        </Card>
      )}

<Modal >
      <Box sx={{ padding: 4, backgroundColor: 'white', borderRadius: 2 }}>
        <Typography variant="h6">Follow-up Details</Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Remark</InputLabel>
          <Select
            name="selectedRemark"
            value={selectedRemark}
            onChange={handleFollowupChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {remarks.map((remark) => (
              <MenuItem key={remark.bookingcancelremarksID} value={remark.bookingcancelremarksID}>
                {remark.bookingcancelremarksRemark}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Amount"
          value={amount}
          InputProps={{ readOnly: true }}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Note"
          name="note"
          value={followupData.note}
          onChange={handleFollowupChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Follow-up Date"
          name="followupDate"
          type="date"
          value={followupData.followupDate.toISOString().split('T')[0]}
          onChange={handleFollowupChange}
          margin="normal"
        />

        <Button onClick={handleFollowupSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Modal>
    </>
  );
};

export default ListBookingCancel;
