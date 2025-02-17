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
      bookingcancelCid: bookingData.Cid,
      bookingcancelBookingDate: bookingData.BookingDate,
      bookingcancelBookedByID: bookingData.BookedByID,
      bookingcancelMobile: bookingData.Mobile,
      bookingcancelTitleID: bookingData.TitleID,
      bookingcancelName: bookingData.Name,
      bookingcancelAddress: bookingData.Address,
      bookingcancelAadhar: bookingData.Aadhar,
      bookingcancelPancard: bookingData.Pancard,
      bookingcancelEmail: bookingData.Email,
      bookingcancelProjectID: bookingData.ProjectID,
      bookingcancelWingID: bookingData.WingID,
      bookingcancelFloorNo: bookingData.FloorNo,
      bookingcancelFlatNo: bookingData.FlatNo,
      bookingcancelUnittypeID: bookingData.UnittypeID,
      bookingcancelBookingType: bookingData.BookingType,
      bookingcancelArea: bookingData.Area,
      bookingcancelRatesqft: bookingData.Ratesqft,
      bookingcancelTtlAmount: bookingData.TtlAmount,
      bookingcancelCharges: bookingData.Charges,
      bookingcancelParkingFacility: bookingData.ParkingFacility,
      bookingcancelParkingID: bookingData.ParkingID,
      bookingcancelFlatCost: bookingData.FlatCost,
      bookingcancelFlatCostInWords: bookingData.FlatCostInWords,
      bookingcancelGst: bookingData.Gst,
      bookingcancelStampDuty: bookingData.StampDuty,
      bookingcancelRegistration: bookingData.Registration,
      bookingcancelAdvocate: bookingData.Advocate,
      bookingcancelExtraCost: bookingData.ExtraCost,
      bookingcancelTotalCost: bookingData.TotalCost,
      bookingcancelUsableArea: bookingData.UsableArea,
      bookingcancelAgreementCarpet: bookingData.AgreementCarpet,
      bookingcancelSourceName: bookingData.SourceName,
      bookingcancelBookingRef: bookingData.BookingRef,
      bookingcancelAggrementAmount: bookingData.AggrementAmount,
      bookingcancelProccess: bookingData.Proccess,
      bookingcancelStatus: 1,
      bookingcancelselfpercentage: bookingData.SelfPercentage,
      bookingcancelloanpercentage: bookingData.LoanPercentage,
      bookingcancelCreateUID: bookingData.CreateUID,
      Remarks: cancelDetails.map((detail) => ({
        bookingcancelremarksbookingcancelID: bookingID, // Make sure this matches your API
        bookingcancelremarksAmount: detail.cancelAmount,
        bookingcancelremarksRemark: detail.cancelRemark,
        bookingcancelremarksDate: detail.cancelDate,
      })),
    };
debugger;
    try {
      const response = await axios.post(
        'https://proxy-forcorners.vercel.app/api/proxy/api-insert-bookingcancel.php',
        payload
      );
      console.log('API response:', response.data);
debugger;
      // Hide the modal after successful submission
      setBookingData(null); // This will close the modal (or reset the form)

      // Trigger SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message,
      });
      setTimeout(() => {
        window.location.reload(); // This will refresh the page
      }, 2000); 
    } catch (error) {
      console.error('API error:', error);

      // Show error message
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
                  showMonthDropdown
                  showYearDropdown
                  yearDropdownItemNumber={15} // Number of years to show in dropdown
                  scrollableYearDropdown
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
