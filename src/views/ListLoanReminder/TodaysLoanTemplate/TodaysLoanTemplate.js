import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Table, TableBody, TableCell, Menu,
  MenuItem, TableContainer, TableRow, Paper, Button, Modal, IconButton, TextField } from '@mui/material';
import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';
import { Grid } from 'mdi-material-ui';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CancelIcon from "@mui/icons-material/Cancel";
import { useCookies } from "react-cookie";
import Swal from 'sweetalert2';


const StyledTableCell = styled(TableCell)({
  border: '2px solid black',
  padding: '4px', // Reduced padding
  textAlign: 'center',
});


const InvoiceBox = styled(Box)({
  maxWidth: '1500px', // Increased width
  margin: 'auto',
  padding: '20px', 
  border: '1px solid #eee',
  fontSize: '11px',
  lineHeight: '18px',
 
  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
});


  const TodaysLoanTemplate = ({ item  }) => {
    const printRef = useRef();
    const [cookies, setCookie, removeCookie] = useCookies(["amr"]);
  
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedBookingRemark, setSelectedBookingRemark] = useState("");
    const [bookingRemarkDetails, setBookingRemarkDetails] = useState({});
    const [bookingRemarks, setBookingRemarks] = useState([]);
    const [formData, setFormData] = useState("");
  
    const [error, setError] = useState(null);

    const handleClose = () => setOpen(false);


    const handlePrint = () => {
      const printContents = printRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
  
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Reload the page to reset the original contents
    };
  
    useEffect(() => {
      const fetchData = async () => {
        if (!item) return; // Exit if no item is provided
        try {
          const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-singel-bookingremark.php?BookingID=${item?.BookingID}`;
          const response = await axios.get(apiUrl);
  
          if (response.data.status === "Success") {
            console.log(response.data, 'data aaya deh');
            setData(response.data.data);
          } else {
            setError('Failed to fetch data');
          }
        } catch (error) {
          setError('Error fetching data');
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [item]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleAddPayment = async () => {
      setOpen(true);
  
      try {
        const response = await axios.get(
          `https://apiforcornershost.cubisysit.com/api/api-dropdown-loanbookingremark.php?BookingID=${item?.BookingID}`
        );
        if (response.data.status === "Success") {
          console.log(response.data.data, 'aagaya daata remakrs');
          const bookingRemarksData = response.data.data;
          setBookingRemarks(bookingRemarksData);

          if (bookingRemarksData.length > 0) {
            const firstBookingRemarkID = bookingRemarksData[0].BookingremarkID;
            await fetchBookingRemarkDetails(firstBookingRemarkID);
            setSelectedBookingRemark(firstBookingRemarkID); 
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
      await fetchBookingRemarkDetails(bookingRemarkID);
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
    
      if (!item || !selectedBookingRemark) {
        console.error("No valid item or selected booking remark found.");
        return;
      }
    
      const payload = {
        BookingID: item.BookingID,
        BookingremarkID:item.BookingremarkID,
        Remarkamount: bookingRemarkDetails.Remarkamount || 0,
        RemarkName: bookingRemarkDetails.RemarkName || '',
        RemarkDate: formData.NextFollowUpDate,
        AmountTypeID: 1,
        Loan:1 ,
        Note: formData.Note,
        CreateUID: cookies?.amr?.UserID || 1,
      };
    
      console.log(payload, "Payload to be sent to the API<<<<<<>>>>>>>>>>");
    
      const url = "https://proxy-forcorners.vercel.app/api/proxy/api-insert-paymentreminder.php";
    
      try {
        const response = await axios.post(url, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        if (response.data.status === "Success") {
          console.log('SUBMIITEDDD DATA ');
    
          // Clear the form fields
          setFormData("");
          setSelectedBookingRemark("");
          setBookingRemarkDetails({});
    
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
          });
        }
      } catch (error) {
        console.error("There was an error!", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong! Please try again later.",
        });
      }
    };
    
  
    if (loading) {
      return <Typography>Loading...</Typography>;
    }
  
    if (error) {
      return <Typography>Error loading data</Typography>;
    }
    return (
      <>   

<Box sx={{ padding: 3 }}>
      <Box sx={{ marginBottom: 2 }}>
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
      </Box>

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
            minHeight: 400,
          }}
        >
          <IconButton
            aria-label="cancel"
            onClick={handleClose}
            sx={{ position: "absolute", top: 6, right: 10 }}
          >
            <CancelIcon sx={{ color: "red" }} />
          </IconButton>
          <Typography
            id="modal-modal-title"
            variant="h7"
            component="h3"
            gutterBottom
            mt={4}
          >
            Select Next Follow-Up Date and Time
          </Typography>
          <Box container spacing={4}>
            <Box item xs={3}>
              <TextField
                select
                label="Select Booking Remark"
                value={selectedBookingRemark}
                onChange={handleBookingRemarkChange} // Updated this part
                fullWidth
              >
                {bookingRemarks.map((option) => (
                  <MenuItem
                    key={option.BookingremarkID}
                    value={option.BookingremarkID}
                  >
                    {option.RemarkName}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            {selectedBookingRemark && (
              <>
                <Box item xs={3}>
                  <TextField
                    label="Remark Amount"
                    value={bookingRemarkDetails.Remarkamount || ""}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Box>
                <Box item xs={3}>
                  <TextField
                    label="Remark Name"
                    value={bookingRemarkDetails.RemarkName || ""}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
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
                label="Next Follow Up Date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
            <Box item xs={3}>
              <TextField
                fullWidth
                label="Note"
                type="text"
                name="Note"
                value={formData.Note}
                onChange={handleChange}
                InputLabelProps={{ sx: { mb: 1 } }}
              />
            </Box>
          </Box>

          <Box sx={{ textAlign: "left", mt: 3 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#9155FD", color: "#FFFFFF" }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

      <InvoiceBox className="printableArea" ref={printRef}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow sx={{ height: '10px', padding: 0 }}>
                <StyledTableCell colSpan={3} sx={{ height: '10px', padding: 0 }}>
                  <Typography style={{ textAlign: 'center', fontSize: 20, fontWeight: 900 }}>QUOTATION</Typography>
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell colSpan={3} sx={{ padding: 0 }}>
                  <Typography style={{ textAlign: 'center', fontSize: 20, fontWeight: 700 }}>RERA NO.  {data.reraregistration}</Typography>
                  <Typography style={{ float: 'left', fontSize: 15, fontWeight: 200 }}>Date: {data.BookingDate}</Typography>
                  <Typography style={{ float: 'right', fontSize: 15, fontWeight: 200 }}>Booked By: {data.UserName}</Typography>
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell style={{ textAlign: 'center', padding: 0 }}>
                  <img src="{images}" alt="Logo" width="70" height="100" />
                </StyledTableCell>
                <StyledTableCell sx={{ padding: 0 }}>
                  <img src="https://i.postimg.cc/PJfmZCRv/Untitled-design-2024-04-12-T161558-455.png" alt="200 * 200" width="30" height="100" />
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell style={{ textAlign: 'left', width: '20%', padding: 0 }} colSpan={2}>
                  <Typography>Name Of Purchase</Typography>
                </StyledTableCell>
                <StyledTableCell style={{ width: '80%', padding: 0 }} colSpan={10}>
                  {data.BookingName}
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell style={{ textAlign: 'left', padding: 0 }} colSpan={2}>
                  <Typography>Address</Typography>
                </StyledTableCell>
                <StyledTableCell colSpan={10} style={{ textAlign: 'center', padding: 0 }}>{data.Address}</StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell style={{ textAlign: 'left', padding: 0 }} colSpan={2}>
                  <Typography>MOBILE No.</Typography>
                </StyledTableCell>
                <StyledTableCell colSpan={10} style={{ textAlign: 'center', padding: 0 }}>{data.Mobile}</StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell style={{ textAlign: 'left', padding: 0 }} colSpan={2}>
                  <Typography>PAN Card No.</Typography>
                </StyledTableCell>
                <StyledTableCell colSpan={10} style={{ textAlign: 'center', padding: 0 }}>{data.Pancard}</StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell colSpan={2} style={{ textAlign: 'left', padding: 0 }}>
                  <Typography>Aadhar No.</Typography>
                </StyledTableCell>
                <StyledTableCell colSpan={10} style={{ textAlign: 'center', padding: 0 }}>{data.Aadhar}</StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell style={{ textAlign: 'left', padding: 0 }} colSpan={2}>
                  <Typography>EMAIL ID.</Typography>
                </StyledTableCell>
                <StyledTableCell colSpan={10} style={{ textAlign: 'center', padding: 0 }}>{data.Email}</StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer component={Paper}>
          <Table style={{ border: '1px solid black' }}>
            <TableBody>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell style={{ width: '40%', padding: 0 }} colSpan={10}>
                  <Typography>Project</Typography>
                </StyledTableCell>
                <StyledTableCell style={{ width: '15%', padding: 0 }} colSpan={10}>
                  <Typography>Wing</Typography>
                </StyledTableCell>
                <StyledTableCell style={{ width: '15%', padding: 0 }} colSpan={10}>
                  <Typography>Floor</Typography>
                </StyledTableCell>
                <StyledTableCell style={{ width: '15%', padding: 0 }} colSpan={10}>
                  <Typography>Flat No.</Typography>
                </StyledTableCell>
                <StyledTableCell style={{ width: '15%', padding: 0 }} colSpan={10}>
                  <Typography>Type</Typography>
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell style={{ width: '40%', padding: 0 }} colSpan={10}>
                  {data.ProjectName}
                </StyledTableCell>
                <StyledTableCell style={{ width: '15%', padding: 0 }} colSpan={10}>
                  {data.WingName}
                </StyledTableCell>
                <StyledTableCell style={{ width: '15%', padding: 0 }} colSpan={10}>
                  {data.FloorNo}
                </StyledTableCell>
                <StyledTableCell style={{ width: '15%', padding: 0 }} colSpan={10}>
                  {data.FlatNo}
                </StyledTableCell>
                <StyledTableCell style={{ width: '15%', padding: 0 }} colSpan={10}>
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
  <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>Type of Booking</StyledTableCell>
  <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>{data.BookingTypeName}</StyledTableCell>
  <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>GST* (As per Govt.Notification)</StyledTableCell>
  <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>{data.Gst}</StyledTableCell>
</TableRow>
<TableRow sx={{ padding: 0 }}>
  <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>Area in Building (in Sq.Ft)</StyledTableCell>
  <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>{data.Area}</StyledTableCell>
  <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>Stamp Duty* (As per Govt.Notification)</StyledTableCell>
  <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>{data.StampDuty}</StyledTableCell>
</TableRow>
<TableRow sx={{ padding: 0 }}>
  <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>Rate Sq.Ft</StyledTableCell>
  <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>{data.Ratesqft}</StyledTableCell>
  <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>Registration* (As per Govt.Notification)</StyledTableCell>
  <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>{data.Registration}</StyledTableCell>
</TableRow>
<TableRow sx={{ padding: 0 }}>
  <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>TTL Amount As Per Builtup</StyledTableCell>
  <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>{data.TtlAmount}</StyledTableCell>
  <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>Advocate* (At time of registration)</StyledTableCell>
  <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>{data.Advocate}</StyledTableCell>
</TableRow>
<TableRow sx={{ padding: 0 }}>
        <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>Development Charges</StyledTableCell>
        <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>{data.Charges}</StyledTableCell>
        <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>Extra Cost (B)</StyledTableCell>
        <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>{data.ExtraCost}</StyledTableCell>
      </TableRow>
      <TableRow sx={{ padding: 0 }}>
        <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>Parking Facility</StyledTableCell>
        <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>{data.ParkingFacility}</StyledTableCell>
        <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>Total (A + B)</StyledTableCell>
        <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>{data.TotalCost}</StyledTableCell>
      </TableRow>
      <TableRow sx={{ padding: 0 }}>
        <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>Gross Flat Cost (A)</StyledTableCell>
        <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>{data.FlatCost}</StyledTableCell>
        <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>Booking Ref.Code (T & C)</StyledTableCell>
        <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>{data.BookingRef}</StyledTableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>

<TableContainer component={Paper}>
  <Table className="info-border">
    <TableBody>
      <TableRow style={{ border: '1px solid black', padding: 0 }}>
        <StyledTableCell style={{ textAlign: 'left', padding: 0 }} colSpan={10}>Rupees in words : {data.FlatCostInWords}</StyledTableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>

<TableContainer component={Paper}>
  <Table className="info-border">
    <TableBody>
    <TableRow sx={{ padding: 0 }}>
  <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>Usable Area in Sq.Ft</StyledTableCell>
  <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>{data.UsableArea}</StyledTableCell>
  <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>Agreement Carpet (RERA) in Sq.Ft</StyledTableCell>
  <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>{data.AgreementCarpet}</StyledTableCell>
</TableRow>



      <TableRow sx={{ padding: 0 }}>
        <StyledTableCell style={{ textAlign: 'left', fontSize: 15, fontWeight: 'bolder', padding: 0 }} colSpan={10}>ORIGINAL REMARKS:</StyledTableCell>
      </TableRow>

      {/* Map over remarksWithCreateDate array */}
      {data.remarksWithCreateDate && data.remarksWithCreateDate.map((remark, index) => (
        <TableRow key={`original-${index}`} sx={{ padding: 0 }}>
          <StyledTableCell style={{ textAlign: 'left', padding: 0 }} colSpan={10}>
            {index + 1}. Rs {remark.Remarkamount} {remark.RemarkName} {remark.RemarkDate}
          </StyledTableCell>
        </TableRow>
      ))}

      <TableRow sx={{ padding: 0 }}>
        <StyledTableCell style={{ textAlign: 'left', fontSize: 15, fontWeight: 'bolder', padding: 0 }} colSpan={10}>UPDATED REMARKS:</StyledTableCell>
      </TableRow>

      {/* Map over otherRemarks array */}
      {data.otherRemarks && data.otherRemarks.map((remark, index) => (
        <TableRow key={`updated-${index}`} sx={{ padding: 0 }}>
          <StyledTableCell style={{ textAlign: 'left', padding: 0 }} colSpan={10}>
            {index + 1}. Rs {remark.Remarkamount} {remark.Note} {remark.RemarkDate}
          </StyledTableCell>
        </TableRow>
      ))}





    </TableBody>
  </Table>
</TableContainer>

<TableContainer component={Paper}>
  <Table className="info-border">
    <TableBody>
      <TableRow style={{ border: '1px solid black', padding: 0 }}>
        <StyledTableCell colSpan={4} style={{ padding: 0 }}>Verified By</StyledTableCell>
        <StyledTableCell colSpan={4} style={{ padding: 0 }}>Maked By</StyledTableCell>
        <StyledTableCell colSpan={4} style={{ padding: 0 }}>Purchaser Signature & Date</StyledTableCell>
      </TableRow>
      {/* Add rows for signatures */}
      <TableRow style={{ padding: 0 }}>
        <StyledTableCell colSpan={4} style={{ height: '90px', padding: 0 }}></StyledTableCell>
        <StyledTableCell colSpan={4} style={{ height: '90px', padding: 0 }}></StyledTableCell>
        <StyledTableCell colSpan={4} style={{ height: '90px', padding: 0 }}></StyledTableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>

      </InvoiceBox>
</Box>
  </>
  );
};

export default TodaysLoanTemplate;
