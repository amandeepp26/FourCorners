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
import { useCookies } from "react-cookie";
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
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [followupData, setFollowupData] = useState({ note: '', followupDate: new Date() });
  const [remarks, setRemarks] = useState([]);
  const [selectedRemark, setSelectedRemark] = useState("");
  const [amount, setAmount] = useState("");
  // Fetch wings based on the selected project
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
        row.FlatNo.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.Partyname?.toLowerCase().includes(searchQuery.toLowerCase())
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
    setOpenPaymentModal(false); // Close modal after submission
  };

  const handleAddPayment = (bookingID) => {
    // Logic to handle adding payment for a specific booking
    console.log("Adding payment for Booking ID:", bookingID);
    setOpenPaymentModal(true);
  };

  return (
    <>
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
                            <IconButton onClick={() => handleAddPayment(row.bookingcancelID)} color="primary">
                              <DownloadIcon />
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
