import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TextField,
  Card,
  TableContainer,
  Grid,
  TableRow,
  Paper,
  Button,
  Modal,
  IconButton,
  colors,
} from "@mui/material";
import { createGlobalStyle } from "styled-components";
import styled from "styled-components";
import { useRouter } from "next/router";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CancelIcon from "@mui/icons-material/Cancel";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import { red } from "@mui/material/colors";

const GlobalStyle = createGlobalStyle`
  @media print {
    body * {
      visibility: hidden;
    }
    .printableArea, .printableArea * {
      visibility: visible;
    }
    .printableArea {
      position: absolute;
   
      width: 100%;
    }
  }
`;

const StyledTableCell = styled(TableCell)({
  border: "2px solid black",
  padding: "0px", // Removed padding
  textAlign: "center",
});

const InvoiceBox = styled(Box)({
 
  border: "1px solid #eee",
  fontSize: "11px",
  lineHeight: "18px",
  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
});

const TodayPaymentTemplate = ({ item }) => {
  const router = useRouter();
 
  const printRef = useRef();
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["amr"]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBookingRemark, setSelectedBookingRemark] = useState("");
  const [bookingRemarkDetails, setBookingRemarkDetails] = useState({});
  const [bookingRemarks, setBookingRemarks] = useState([]);
  const [payments, setPayments] = useState([]);
  const [remarkType, setRemarkType] = useState('complete'); // Default to 'partial'

  const [formData, setFormData] = useState("");

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Reload the page to reset the original contents
  };

  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!item?.BookingID) return; // Ensure valid BookingID before making the API call.
  
      setLoading(true); // Start loading.
      setError(null); // Reset any previous error.
  
      try {
        const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-singel-bookingremark.php?BookingID=${item.BookingID}`;
        const response = await axios.get(apiUrl);
  
        if (response.data.status === "Success") {
          setPayments(response.data.data.payments || []); // Handle cases where payments might be null.
          setData(response.data.data);
          console.log("Data received:", response.data);
        } else {
          setError("Failed to fetch data");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Error fetching data");
      } finally {
        setLoading(false); // Stop loading in all cases.
      }
    };
  
    fetchData();
  }, [item?.BookingID]); // Watch specifically for changes to BookingID.
  
  const totalCash = payments.reduce(
    (sum, payment) => sum + (payment.Cash || 0),
    0
  );
  const totalCheque = payments.reduce(
    (sum, payment) => sum + (payment.ChequeAmount || 0),
    0
  );
  const totalAPlusB = totalCash + totalCheque;

  let balance = data?.TotalCost;

  finalRows = finalRows?.map((row, index) => {
    const currentAPlusB = row.Cash + row.ChequeAmount;
    const currentBalance = balance - currentAPlusB;

    const updatedRow = {
      ...row,
      TotalAPlusB: currentAPlusB,
      Balance: currentBalance,
    };

    // Update balance for the next row
    balance = currentBalance;

    return updatedRow;
  });
  // Start with the total cost as the initial running balance
  let runningBalance = data?.TotalCost || 0;

  const rows = payments.map((payment) => {
    const cash = payment.Cash || 0;
    const chequeAmount = payment.ChequeAmount || 0;
    const totalAPlusB = cash + chequeAmount;

    // Conditionally set the Date value based on the presence of ChequeAmount
    const displayDate = payment.Date;

    // Calculate the current balance by subtracting the current TotalAPlusB from the running balance
    const currentBalance = runningBalance - totalAPlusB;

    // Prepare the row data with the current balance
    const row = {
      Date: displayDate, 
      Cash: cash,
      ChequeAmount: chequeAmount,
      TotalAPlusB: totalAPlusB,
      Balance: currentBalance,
      Wing: data?.WingName || "",
      Floor: data?.FloorNo || "",
      FlatNo: data?.FlatNumber || "",
      Type: data?.Type || "",
    };

    // Update the running balance to the current balance for the next iteration
    runningBalance = currentBalance;

    return row;
  });

  // Ensure there are always 15 rows displayed
  const totalRows = 23;
  const defaultRowsCount = Math.max(totalRows - rows.length, 0);
  const defaultRows = new Array(defaultRowsCount).fill({
    Date: "",
    Cash: "",
    ChequeAmount: "",
    TotalAPlusB: "",
    Balance: "",
    Wing: "",
    Floor: "",
    FlatNo: "",
    Type: "",
  });

  const finalRows = [...rows, ...defaultRows];
  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error loading data</Typography>;
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddPayment = async () => {
    setOpen(true);

    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-dropdown-bookingremark.php?BookingID=${item?.BookingID}`
      );
      if (response.data.status === "Success") {
        console.log(response.data.data, "aagaya daata remakrs");
        const bookingRemarksData = response.data.data;
        setBookingRemarks(bookingRemarksData);

        // Assuming you want to fetch the details for the first booking remark in the list
        if (bookingRemarksData.length > 0) {
          const firstBookingRemarkID = bookingRemarksData[0].BookingremarkID;
          await fetchBookingRemarkDetails(firstBookingRemarkID);
        }
      }
    } catch (error) {
      console.error("Error fetching booking remarks:", error);
    }
  };
  const fetchBookingRemarkDetails = async (bookingRemarkID) => {
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-dropdown-bookingremarkdetails.php?BookingremarkID=${bookingRemarkID}`
      );
      if (response.data.status === "Success") {
        setBookingRemarkDetails(response.data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching booking remark details:", error);
    }
  };

  const handleBookingRemarkChange = async (e) => {
    const bookingRemarkID = e.target.value;
    setSelectedBookingRemark(bookingRemarkID);

    if (bookingRemarkID) {
      await fetchBookingRemarkDetails(bookingRemarkID);
    } else {
      setBookingRemarkDetails({}); 
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!item || !selectedBookingRemark) {
      console.error("No valid item or selected booking remark found.");
      return;
    }

    // Check for required fields
    if (!formData.NextFollowUpDate || !formData.Note || !formData.Remarkamount) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all required fields.",
      });
      setLoading(false);
      setOpen(false);
      return;
    }

    // Additional validation for partial remark type
    if (remarkType === "partial" && (!formData.RemainingRemarkAmount || !formData.RemainingRemarkName || !formData.RemainingRemarkDate)) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all remaining remark fields.",
      });
      setLoading(false);
      setOpen(false);
      return;
    }

    const payload = {
      BookingID: item.BookingID,
      BookingremarkID: item.BookingremarkID,
      Remarkamount: formData.Remarkamount,
      RemarkName:  formData.Note,
      RemarkDate: formData.NextFollowUpDate,
      AmountTypeID: bookingRemarkDetails.AmountTypeID,
      Loan: bookingRemarkDetails.Loan || 0,
      Registraion: bookingRemarkDetails.Registraion || 0,
      Note: formData.Note,
      CreateUID: cookies?.amr?.UserID || 1,
      RemainingRemarkAmount: formData.RemainingRemarkAmount || 0,
      RemainingRemarkName: formData.RemainingRemarkName || "",
      RemainingRemarkDate: formData.RemainingRemarkDate || "",
      RemainingRemarkAmountTypeID:bookingRemarkDetails.AmountTypeID,
      RemainingRemarkLoan:bookingRemarkDetails.Loan || 0,
      RemainingRemarkRegistraion:bookingRemarkDetails.Registraion || 0,
       RemainingRemarkNote:  formData.RemainingRemarkName || "",
        RemainingBookingremarkID: selectedBookingRemark || "", 

    };

    const url = "https://proxy-forcorners.vercel.app/api/proxy/api-insert-paymentreminder.php";
    try {
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "Success") {
  
        console.log("SUBMIITEDDD DATA ");
        
        setFormData("");
        setOpen(false);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Follow-up details saved successfully.",
        }).then(() => {
          window.location.reload();
        });
      } else {

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong! Please try again later.",
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      
      console.error("There was an error!", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again later.",
      }).then(() => {
        window.location.reload();
      });
    }
  };
  const handleRemarkTypeChange = (event) => {
    const type = event.target.value;
    setRemarkType(type);

    if (type === "complete") {
      setFormData((prev) => ({
        ...prev,
        RemainingRemarkAmount: "",
        RemainingRemarkName: "",
        RemainingRemarkDate: "",
      }));
    }
  };
  const RequiredIndicator = () => {
    return (
      <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
    );
  };
     if (loading) {
        return <Typography>Loading...</Typography>;
      }
    
      if (error) {
        return <Typography>Error loading data</Typography>;
      }
  return (
    <>
    <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            minWidth: 500,
            maxWidth: 700,
            borderRadius: 2,
          }}
        >
          <IconButton
            aria-label="cancel"
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "#f5f5f5",
              "&:hover": {
                backgroundColor: "#ffdddd",
              },
            }}
          >
            <CancelIcon sx={{ color: "#d32f2f" }} />
          </IconButton>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            align="center"
            sx={{ fontWeight: "bold", color: "#333", mb: 5 }}
          >
            Select Next Follow-Up Date and Time
          </Typography>

          <Box
            container
            spacing={3}
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
              marginBottom: 5,
            }}
          >
            {/* Booking Remark Dropdown */}
            <Box item xs={3}>
  <TextField
    select
    label="Select Booking Remark"
    value={selectedBookingRemark}
    onChange={handleBookingRemarkChange}
    fullWidth
    variant="outlined"
    sx={{ mb: 2 }}
  >
    {bookingRemarks.map((option) => (
      <MenuItem key={option.BookingremarkID} value={option.BookingremarkID}>
        <Box
          sx={{
            maxWidth: '200px', // or any desired width
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {option.Remarkamount} {option.RemarkName}
        </Box>
      </MenuItem>
    ))}
  </TextField>
</Box>


            {selectedBookingRemark && (
              <>
                <Box item xs={3}>
                  <TextField
                    label="Remark Amount"
                    name="Remarkamount"
                    value={ bookingRemarkDetails.Remarkamount || ""}
              
                    fullWidth
                  
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Box>
                <Box item xs={3}>
                  <TextField
                    label="Remark Name"
                    name="RemarkName"
                    value={bookingRemarkDetails.RemarkName || ""}
                 
                    fullWidth
              
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Box>
              </>
            )}

            <Box item xs={3}>
              <TextField
                fullWidth
                type="date"
                name="NextFollowUpDate"
                value={formData.NextFollowUpDate}
                onChange={handleChange}
           
                label={
                  <>
                   Next Follow Up Date <RequiredIndicator />
                  </>
                }
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: new Date().toISOString().split("T")[0],
                }}
                variant="outlined"
                sx={{ mb: 2 }}
                error={formData.NextFollowUpDate === ""}
                helperText={formData.NextFollowUpDate === "" ? "This field is required" : ""}
              />
            
            </Box>

            <Box item xs={3}>
              <TextField
                fullWidth
         
                label={
                  <>
                    Remark amount <RequiredIndicator />
                  </>
                }
                type="number"
                name="Remarkamount"
                value={formData.Remarkamount}
                onChange={handleChange}
                variant="outlined"
                sx={{ mb: 2 }}
                error={formData.Remarkamount === ""}
                helperText={formData.Remarkamount === "" ? "This field is required" : ""}
              />

            </Box>
            <Box item xs={3}>
              <TextField
                fullWidth
                label={
                  <>
                    Note <RequiredIndicator />
                  </>
                }
                type="text"
                name="Note"
                value={formData.Note}
                onChange={handleChange}
                variant="outlined"
                sx={{ mb: 2 }}
                error={formData.Note === ""}
                helperText={formData.Note === "" ? "This field is required" : ""}
              />
            </Box>

            {/* Remark Type Dropdown (Complete / Partial) */}
            <Box item xs={3}>
              <TextField
                select
                label="Remark Type"
                value={remarkType}
                onChange={handleRemarkTypeChange}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              >
                <MenuItem value="partial">Remark Partial</MenuItem>
                <MenuItem value="complete">Remark Complete</MenuItem>
              </TextField>
            </Box>

            {/* Show/Hide Remaining Remark Fields based on Remark Type */}
            {remarkType === "partial" && (
              <>
                <Box item xs={3}>
                  <TextField
                    fullWidth
                 
                    label={
                      <>
                       Remaining Remark Amount <RequiredIndicator />
                      </>
                    }
                    type="number"
                    name="RemainingRemarkAmount"
                    value={formData.RemainingRemarkAmount || ""}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    error={formData.RemainingRemarkAmount === ""}
                    helperText={formData.RemainingRemarkAmount === "" ? "This field is required" : ""}
                  />
                </Box>
                <Box item xs={3}>
                  <TextField
                    fullWidth
                  label={
                      <>
                       Remaining Remark Name <RequiredIndicator />
                      </>
                    }
                    type="text"
                    name="RemainingRemarkName"
                    value={formData.RemainingRemarkName || ""}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    error={formData.RemainingRemarkName === ""}
                    helperText={formData.RemainingRemarkName === "" ? "This field is required" : ""}
                  />
                </Box>
                <Box item xs={3}>
                  <TextField
                    fullWidth
                    type="date"
                    name="RemainingRemarkDate"
                    label={
                      <>
                       Remaining Remark Date <RequiredIndicator />
                      </>
                    }
                    value={formData.RemainingRemarkDate || ""}
                    onChange={handleChange}
                   
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: new Date().toISOString().split("T")[0],
                    }}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    error={formData.RemainingRemarkDate === ""}
                    helperText={formData.RemainingRemarkDate === "" ? "This field is required" : ""}
                  />
                </Box>
              </>
            )}
          </Box>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#9155FD",
                color: "#FFFFFF",
                padding: "10px 30px",
                borderRadius: "20px",
                "&:hover": {
                  backgroundColor: "#7a33d7",
                },
                position: "relative",
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ position: "absolute" }} />
              ) : (
                "Submit"
              )}
            </Button>
          </Box>
        </Box>
      </Modal>
      <Box sx={{ marginBottom: 100}}>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleAddPayment}
          sx={{
            color: "#333333",
            fontSize: "0.875rem",
            backgroundColor: "#f0f0f0",
            "&:hover": {
              backgroundColor: "#dcdcdc",
            },
          }}
        >
          Next Follow-Up
        </Button>
     
  
      <InvoiceBox className="printableArea" ref={printRef}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow sx={{ height: "10px", padding: 0 }}>
                <StyledTableCell
                  colSpan={3}
                  sx={{ height: "10px", padding: 0 }}
                >
                  <Typography
                    style={{
                      textAlign: "center",
                      fontSize: 20,
                      fontWeight: 900,
                    }}
                  >
                    QUOTATION
                  </Typography>
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell colSpan={3} sx={{ padding: 0 }}>
                  <Typography
                    style={{
                      textAlign: "center",
                      fontSize: 20,
                      fontWeight: 700,
                    }}
                  >
                    RERA NO. {data.reraregistration}
                  </Typography>
                  <Typography
                    style={{ float: "left", fontSize: 15, fontWeight: 200 }}
                  >
                    Date: {data.BookingDate}
                  </Typography>
                  <Typography
                    style={{ float: "right", fontSize: 15, fontWeight: 200 }}
                  >
                    Booked By: {data.UserName}
                  </Typography>
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
              <StyledTableCell sx={{width: "150px" , alignItems:"center"}}>
<img
      src={`https://apiforcornershost.cubisysit.com/projectimage/${data.images || "rosenagar.png"}`}
      alt="Logo"
      width={350}
      height={150}
    />                </StyledTableCell>
                <StyledTableCell sx={{ padding: 0 }}>
                  <img
                    src="https://static.thenounproject.com/png/3764342-200.png"
                    alt="200 * 200"
                  width="80px" height="100px"
                  />
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ textAlign: "left", width: "20%", padding: 0 }}
                  colSpan={2}
                >
                  <Typography>Name Of Purchase</Typography>
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "80%", padding: 0 }}
                  colSpan={10}
                >
                  {data.BookingName}
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ textAlign: "left", padding: 0 }}
                  colSpan={2}
                >
                  <Typography>Address</Typography>
                </StyledTableCell>
                <StyledTableCell
                  colSpan={10}
                  style={{ textAlign: "center", padding: 0 }}
                >
                  {data.Address}
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ textAlign: "left", padding: 0 }}
                  colSpan={2}
                >
                  <Typography>MOBILE No.</Typography>
                </StyledTableCell>
                <StyledTableCell
                  colSpan={10}
                  style={{ textAlign: "center", padding: 0 }}
                >
                  {data.Mobile}
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ textAlign: "left", padding: 0 }}
                  colSpan={2}
                >
                  <Typography>PAN Card No.</Typography>
                </StyledTableCell>
                <StyledTableCell
                  colSpan={10}
                  style={{ textAlign: "center", padding: 0 }}
                >
                  {data.Pancard}
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  colSpan={2}
                  style={{ textAlign: "left", padding: 0 }}
                >
                  <Typography>Aadhar No.</Typography>
                </StyledTableCell>
                <StyledTableCell
                  colSpan={10}
                  style={{ textAlign: "center", padding: 0 }}
                >
                  {data.Aadhar}
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ textAlign: "left", padding: 0 }}
                  colSpan={2}
                >
                  <Typography>EMAIL ID.</Typography>
                </StyledTableCell>
                <StyledTableCell
                  colSpan={10}
                  style={{ textAlign: "center", padding: 0 }}
                >
                  {data.Email}
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer component={Paper}>
          <Table style={{ border: "1px solid black" }}>
            <TableBody>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ width: "40%", padding: 0 }}
                  colSpan={10}
                >
                  <Typography>Project</Typography>
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "15%", padding: 0 }}
                  colSpan={10}
                >
                  <Typography>Wing</Typography>
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "15%", padding: 0 }}
                  colSpan={10}
                >
                  <Typography>Floor</Typography>
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "15%", padding: 0 }}
                  colSpan={10}
                >
                  <Typography>Flat No.</Typography>
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "15%", padding: 0 }}
                  colSpan={10}
                >
                  <Typography>Type</Typography>
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ width: "40%", padding: 0 }}
                  colSpan={10}
                >
                  {data.ProjectName}
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "15%", padding: 0 }}
                  colSpan={10}
                >
                  {data.WingName}
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "15%", padding: 0 }}
                  colSpan={10}
                >
                  {data.FloorNo}
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "15%", padding: 0 }}
                  colSpan={10}
                >
                  {data.FlatNo}
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "15%", padding: 0 }}
                  colSpan={10}
                >
                  {data.UnittypeName}
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer component={Paper}>
          <Table className="info-border">
            <TableBody>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ width: "30%", padding: 0 }}
                  colSpan={4}
                >
                  Type of Booking
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "20%", padding: 0 }}
                  colSpan={1}
                >
                  {data.BookingTypeName}
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "30%", padding: 0 }}
                  colSpan={4}
                >
                  GST* (As per Govt.Notification)
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "20%", padding: 0 }}
                  colSpan={1}
                >
                  {data.Gst}
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ width: "30%", padding: 0 }}
                  colSpan={4}
                >
                  Area in Building (in Sq.Ft)
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "20%", padding: 0 }}
                  colSpan={1}
                >
                  {data.Area}
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "30%", padding: 0 }}
                  colSpan={4}
                >
                  Stamp Duty* (As per Govt.Notification)
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "20%", padding: 0 }}
                  colSpan={1}
                >
                  {data.StampDuty}
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ width: "30%", padding: 0 }}
                  colSpan={4}
                >
                  Rate Sq.Ft
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "20%", padding: 0 }}
                  colSpan={1}
                >
                  {data.Ratesqft}
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "30%", padding: 0 }}
                  colSpan={4}
                >
                  Registration* (As per Govt.Notification)
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "20%", padding: 0 }}
                  colSpan={1}
                >
                  {data.Registration}
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ width: "30%", padding: 0 }}
                  colSpan={4}
                >
                  TTL Amount As Per Builtup
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "20%", padding: 0 }}
                  colSpan={1}
                >
                  {data.TtlAmount}
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "30%", padding: 0 }}
                  colSpan={4}
                >
                  Advocate* (At time of registration)
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "20%", padding: 0 }}
                  colSpan={1}
                >
                  {data.Advocate}
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ width: "30%", padding: 0 }}
                  colSpan={4}
                >
                  Development Charges
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "20%", padding: 0 }}
                  colSpan={1}
                >
                  {data.Charges}
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "30%", padding: 0 }}
                  colSpan={4}
                >
                  Extra Cost (B)
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "20%", padding: 0 }}
                  colSpan={1}
                >
                  {data.ExtraCost}
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ width: "30%", padding: 0 }}
                  colSpan={4}
                >
                  Parking Facility
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "20%", padding: 0 }}
                  colSpan={1}
                >
                  {data.ParkingFacility}
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "30%", padding: 0 }}
                  colSpan={4}
                >
                  Total (A + B)
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "20%", padding: 0 }}
                  colSpan={1}
                >
                  {data.TotalCost}
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ width: "30%", padding: 0 }}
                  colSpan={4}
                >
                  Gross Flat Cost (A)
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "20%", padding: 0 }}
                  colSpan={1}
                >
                  {data.FlatCost}
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "30%", padding: 0 }}
                  colSpan={4}
                >
                  Booking Ref.Code (T & C)
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "20%", padding: 0 }}
                  colSpan={1}
                >
                  {data.BookingRef}
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer component={Paper}>
          <Table className="info-border">
            <TableBody>
              <TableRow style={{ border: "1px solid black", padding: 0 }}>
                <StyledTableCell
                  style={{ textAlign: "left", padding: 0 }}
                  colSpan={10}
                >
                  Rupees in words : {data.FlatCostInWords}
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer component={Paper}>
          <Table className="info-border">
            <TableBody>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ width: "30%", padding: 0 }}
                  colSpan={4}
                >
                  Usable Area in Sq.Ft
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "20%", padding: 0 }}
                  colSpan={1}
                >
                  {data.UsableArea}
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "30%", padding: 0 }}
                  colSpan={4}
                >
                  Agreement Carpet (RERA) in Sq.Ft
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "20%", padding: 0 }}
                  colSpan={1}
                >
                  {data.AgreementCarpet}
                </StyledTableCell>
              </TableRow>

              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{
                    textAlign: "left",
                    fontSize: 15,
                    fontWeight: "bolder",
                    padding: 0,
                  }}
                  colSpan={10}
                >
                  ORIGINAL REMARKS:
                </StyledTableCell>
              </TableRow>

              {/* Map over remarksWithCreateDate array */}
              {data.remarksWithCreateDate &&
                data.remarksWithCreateDate.map((remark, index) => (
                  <TableRow key={`original-${index}`} sx={{ padding: 0 }}>
                    <StyledTableCell
                      style={{ textAlign: "left", padding: 0 }}
                      colSpan={10}
                    >
                      {index + 1}. Rs {remark.Remarkamount} {remark.RemarkName}{" "}
                      {remark.RemarkDate}
                    </StyledTableCell>
                  </TableRow>
                ))}

              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{
                    textAlign: "left",
                    fontSize: 15,
                    fontWeight: "bolder",
                    padding: 0,
                  }}
                  colSpan={10}
                >
                  UPDATED REMARKS:
                </StyledTableCell>
              </TableRow>

              {/* Map over otherRemarks array */}
              {data.otherRemarks &&
                data.otherRemarks.map((remark, index) => (
                  <TableRow key={`updated-${index}`} sx={{ padding: 0 }}>
                    <StyledTableCell
                      style={{ textAlign: "left", padding: 0 }}
                      colSpan={10}
                    >
                      {index + 1}. Rs {remark.Remarkamount} {remark.Note}{" "}
                      {remark.RemarkDate}
                    </StyledTableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer component={Paper}>
          <Table className="info-border">
            <TableBody>
              <TableRow style={{ border: "1px solid black", padding: 0 }}>
                <StyledTableCell colSpan={4} style={{ padding: 0 }}>
                  Verified By
                </StyledTableCell>
                <StyledTableCell colSpan={4} style={{ padding: 0 }}>
                  Maked By
                </StyledTableCell>
                <StyledTableCell colSpan={4} style={{ padding: 0 }}>
                  Purchaser Signature & Date
                </StyledTableCell>
              </TableRow>
              {/* Add rows for signatures */}
              <TableRow style={{ padding: 0 }}>
                <StyledTableCell
                  colSpan={4}
                  style={{ height: "90px", padding: 0 }}
                ></StyledTableCell>
                <StyledTableCell
                  colSpan={4}
                  style={{ height: "90px", padding: 0 }}
                ></StyledTableCell>
                <StyledTableCell
                  colSpan={4}
                  style={{ height: "90px", padding: 0 }}
                ></StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </InvoiceBox>
      <InvoiceBox className="printableArea" ref={printRef}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
          
              <TableRow>
                <StyledTableCell
                  colSpan={5}
                  style={{ textAlign: "center", borderBottom: "none" }}
                >
                  <Typography style={{ fontSize: 20, fontWeight: 700 }}>
                    PROJECT
                  </Typography>
                  <Typography style={{ fontSize: 20, fontWeight: 700 }}>
                    {data.ProjectName}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell style={{ textAlign: "center" }}>
                  <Typography variant="body1">WING</Typography>
                  <Typography variant="body2">{data?.WingName}</Typography>
                </StyledTableCell>

                <StyledTableCell style={{ textAlign: "center" }}>
                  <Typography variant="body1">FLOOR</Typography>
                  <Typography variant="body2">{data?.FloorNo}</Typography>
                </StyledTableCell>
                <StyledTableCell style={{ textAlign: "center" }}>
                  <Typography variant="body1">FLAT NO</Typography>
                  <Typography variant="body2">{data?.FlatNo}</Typography>
                </StyledTableCell>
                <StyledTableCell style={{ textAlign: "center" }}>
                  <Typography variant="body1">TYPE</Typography>
                  <Typography variant="body2">{data?.UnittypeName}</Typography>
                </StyledTableCell>
              </TableRow>

               <TableRow>
              <StyledTableCell style={{ textAlign: "center" }}>
                 Sr No.
                </StyledTableCell>
                <StyledTableCell style={{ textAlign: "center" }}>
                 Date
                </StyledTableCell>
         
                <StyledTableCell colSpan={4} style={{ textAlign: "center" }}>
                  Amount
                </StyledTableCell>
               
                <StyledTableCell style={{ textAlign: "center" }}>
                  Balance
                </StyledTableCell>
                <StyledTableCell colSpan={2} style={{ textAlign: "center" }}>
                  Sign.
                </StyledTableCell>
              </TableRow>

              {/* Render Rows */}
              {finalRows?.map((row, index) => (
                <TableRow key={index}>
                   <StyledTableCell style={{ textAlign: "center" }}>
                    {index+1}
                  </StyledTableCell>
                  <StyledTableCell style={{ textAlign: "center" }}>
                    {row.Date}
                  </StyledTableCell>
            
                  <StyledTableCell colSpan={4} style={{ textAlign: "center" }}>
                    {row.ChequeAmount}
                  </StyledTableCell>
                  <StyledTableCell style={{ textAlign: "center" }}>
                    {row.Balance}
                  </StyledTableCell>
                  <StyledTableCell colSpan={2} style={{ textAlign: "center" }}>
                    {" "}
                
                  </StyledTableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>
        </TableContainer>
       
      </InvoiceBox>
      </Box>
    </>
  );
};

export default TodayPaymentTemplate;
