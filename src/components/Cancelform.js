import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  IconButton,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';

const Cancelform = ({ bookingID }) => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelDetails, setCancelDetails] = useState([{ cancelAmount: '', cancelRemark: '', cancelDate: '' }]);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get(`https://apiforcornershost.cubisysit.com/api/api-fetch-booking.php?BookingID=${bookingID}`);
        if (response.data.code === 0) {
          setBookingData(response.data.data[0]);
        } else {
          console.error("Error fetching booking data:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching booking data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (bookingID) {
      fetchBookingData();
    } else {
      setLoading(false);
    }
  }, [bookingID]);

  const handleAddRow = () => {
    setCancelDetails([...cancelDetails, { cancelAmount: '', cancelRemark: '', cancelDate: '' }]);
  };

  const handleRemoveRow = (index) => {
    const newDetails = cancelDetails.filter((_, i) => i !== index);
    setCancelDetails(newDetails);
  };

  const handleChange = (index, field, value) => {
    const newDetails = [...cancelDetails];
    newDetails[index][field] = value;
    setCancelDetails(newDetails);
  };
  const handleSubmit = async () => {
    const payload = {
      bookingcancelBookingID: bookingID,
      bookingcancelCid: bookingData.Cid, // Adjust as necessary based on your booking data structure
      bookingcancelBookingDate: bookingData.BookingDate, // Current date
      bookingcancelBookedByID: bookingData.BookedByID, // Adjust as necessary
      bookingcancelMobile: bookingData.Mobile, // Adjust as necessary
      bookingcancelTitleID: bookingData.TitleID, // Adjust as necessary
      bookingcancelName: bookingData.Name, // Adjust as necessary
      bookingcancelAddress: bookingData.Address, // Adjust as necessary
      bookingcancelAadhar: bookingData.Aadhar, // Adjust as necessary
      bookingcancelPancard: bookingData.Pancard, // Adjust as necessary
      bookingcancelEmail: bookingData.Email, // Adjust as necessary
      bookingcancelProjectID: bookingData.ProjectID, // Adjust as necessary
      bookingcancelWingID: bookingData.WingID, // Adjust as necessary
      bookingcancelFloorNo: bookingData.FloorNo, // Adjust as necessary
      bookingcancelFlatNo: bookingData.FlatNo, // Adjust as necessary
      bookingcancelUnittypeID: bookingData.UnittypeID, // Adjust as necessary
      bookingcancelBookingType: bookingData.BookingType, // Adjust as necessary
      bookingcancelArea: bookingData.Area, // Adjust as necessary
      bookingcancelRatesqft: bookingData.Ratesqft, // Adjust as necessary
      bookingcancelTtlAmount: bookingData.TtlAmount, // Adjust as necessary
      bookingcancelCharges: bookingData.Charges, // Adjust as necessary
      bookingcancelParkingFacility: bookingData.ParkingFacility, // Adjust as necessary
      bookingcancelParkingID: bookingData.ParkingID, // Adjust as necessary
      bookingcancelFlatCost: bookingData.FlatCost, // Adjust as necessary
      bookingcancelFlatCostInWords: bookingData.FlatCostInWords, // Adjust as necessary
      bookingcancelGst: bookingData.Gst, // Adjust as necessary
      bookingcancelStampDuty: bookingData.StampDuty, // Adjust as necessary
      bookingcancelRegistration: bookingData.Registration, // Adjust as necessary
      bookingcancelAdvocate: bookingData.Advocate, // Adjust as necessary
      bookingcancelExtraCost: bookingData.ExtraCost, // Adjust as necessary
      bookingcancelTotalCost: bookingData.TotalCost, // Adjust as necessary
      bookingcancelUsableArea: bookingData.UsableArea, // Adjust as necessary
      bookingcancelAgreementCarpet: bookingData.AgreementCarpet, // Adjust as necessary
      bookingcancelSourceName: bookingData.SourceName, // Adjust as necessary
      bookingcancelBookingRef: bookingData.BookingRef, // Adjust as necessary
      bookingcancelAggrementAmount: bookingData.AggrementAmount, // Adjust as necessary
      bookingcancelProccess: bookingData.Proccess, // Adjust as necessary
      bookingcancelStatus: 1, // Set status to Cancelled
      bookingcancelselfpercentage: bookingData.SelfPercentage, // Adjust as necessary
      bookingcancelloanpercentage: bookingData.LoanPercentage, // Adjust as necessary
      bookingcancelCreateUID: bookingData.CreateUID, // Adjust as necessary
      
      // Adjusted Remarks to match MySQL table fields
      Remarks: cancelDetails.map((detail) => ({
        bookingcancelremarksAmount: detail.cancelAmount,
        bookingcancelremarksRemark: detail.cancelRemark,
        bookingcancelremarksDate: detail.cancelDate,
      })),
    };
  
    try {
      const response = await axios.post('https://proxy-forcorners.vercel.app/api/proxy/api-insert-bookingcancel.php', payload);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to submit cancel details.',
      });
    }
  };
  

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        Cancel Form
      </Typography>
      <div style={{ borderBottom: '2px solid #000', margin: '10px 0' }}></div>
      {bookingData ? (
        <Box>
          <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography style={{ fontSize: 15, fontWeight: 800 }}>Party Name</Typography></TableCell>
                  <TableCell><Typography style={{ fontSize: 15, fontWeight: 800 }}>Project Name</Typography></TableCell>
                  <TableCell><Typography style={{ fontSize: 15, fontWeight: 800 }}>Wing Name</Typography></TableCell>
                  <TableCell><Typography style={{ fontSize: 15, fontWeight: 800 }}>Unit Type</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{bookingData.Name}</TableCell>
                  <TableCell>{bookingData.ProjectName}</TableCell>
                  <TableCell>{bookingData.WingName}</TableCell>
                  <TableCell>{bookingData.UnittypeName}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Remark Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookingData.remarks && bookingData.remarks.length > 0 ? (
                  bookingData.remarks.map((remark) => (
                    <TableRow key={remark.BookingRemarkID}>
                      <TableCell>{remark.RemarkName}</TableCell>
                      <TableCell>{remark.Remarkamount}</TableCell>
                      <TableCell>{remark.RemarkDate}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>No remarks available.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="h6" sx={{ marginBottom: 2, marginTop: 2 }}>Add Cancel Remark</Typography>
          {cancelDetails.map((detail, index) => (
            <Grid container spacing={2} key={index} style={{ marginBottom: '10px' }}>
              <Grid item xs={4}>
                <TextField
                  label="Cancel Amount"
                  value={detail.cancelAmount}
                  onChange={(e) => handleChange(index, 'cancelAmount', e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{ backgroundColor: "#ffffff" }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Cancel Remark"
                  value={detail.cancelRemark}
                  onChange={(e) => handleChange(index, 'cancelRemark', e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{ backgroundColor: "#ffffff" }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Cancel Date"
                  type="date"
                  value={detail.cancelDate}
                  onChange={(e) => handleChange(index, 'cancelDate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={{ backgroundColor: "#ffffff" }}
                />
              </Grid>
              <Grid item>
                <IconButton onClick={() => handleRemoveRow(index)} sx={{ color: 'red' }}>
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={handleAddRow} variant="outlined" sx={{ marginBottom: 2 }}>
                  <AddIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      ) : (
        <Typography variant="h6" color="error">No booking data found.</Typography>
      )}
    </Box>
  );
};

export default Cancelform;
