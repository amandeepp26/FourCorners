import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import HistoryIcon from "@mui/icons-material/History";
import EditIcon from "@mui/icons-material/Edit";
import GetAppIcon from "@mui/icons-material/GetApp";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CancelTemplate from "../../../components/canceltemplate"
import {
  Modal,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import Swal from "sweetalert2";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useCookies } from "react-cookie";
import PhoneIcon from "@mui/icons-material/Phone";
import ShareIcon from "@mui/icons-material/Share";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const ListCancel = ({ item, onDelete, onEdit, onHistoryClick }) => {
  const [cookies] = useCookies(['amr']);
  
  const initialFormState = {
    bookingcancelremarksbookingcancelID: '',
    bookingcancelremarksAmount: '',
    bookingcancelremarksRemark: '',
    bookingcancelremarksDate: '',
    cancelbookingupdateID: '',
    bookingcancelremarksProccess: 0,
    bookingcancelremarksID: '',
    CreateUID: cookies.amr?.UserID || 1,
  };
  
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [currentUpdate, setCurrentUpdate] = useState([]);
  const [bookingcancelID, setBookingID] = useState(null);
  const [currentRemark, setCurrentRemark] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openTemplate, setOpenTemplate] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    fetchDataCurrent();
    fetchDataRemark();
  }, []);
  
  const fetchDataCurrent = async () => {
    try {
      const response = await axios.get(
        'https://apiforcornershost.cubisysit.com/api/api-dropdown-cancelbookingupdate.php'
      );
      console.log('Current Update Response: ', response.data);
      if (response.data.status === 'Success') {
        setCurrentUpdate(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching current updates:', error);
    }
  };
  
  const fetchDataRemark = async () => {
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-cancelbookingremark.php?bookingcancelremarksbookingcancelID=${item?.bookingcancelID}`
      );
      console.log('Current Remark Response: ', response.data);
      if (response.data.status === 'Success') {
        setCurrentRemark(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching remarks:', error);
    }
  };
  
  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleDropdownClose = () => {
    setAnchorEl(null);
  };
  
  const handleAddFollowUpClick = () => {
    handleDropdownClose();
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormState);
  };
 
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle current update selection
  const handleCurrentUpdate = (event) => {
    const { value } = event.target;
    setFormData((prev) => ({ ...prev, cancelbookingupdateID: value }));
  };
  const handleCurrentRemark = (event) => {
    const { value } = event.target;
    const selectedRemark = currentRemark.find(
      (remark) => remark.bookingcancelremarksID === value
    );

    if (selectedRemark) {
      setFormData((prev) => ({
        ...prev,
        bookingcancelremarksID: selectedRemark.bookingcancelremarksID,
        bookingcancelremarksRemark: selectedRemark.bookingcancelremarksRemark,
        bookingcancelremarksAmount: selectedRemark.bookingcancelremarksAmount
      }));
    }
  };

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.bookingcancelremarksRemark) {
      setError('Remark name is required.');
      return; // Prevent submission if remark is empty
    }
    if (!formData.cancelbookingupdateID) {
      setError('Current Update is required.');
      return;
    }
    const formDataToSubmit = {
      bookingcancelremarksbookingcancelID: item?.bookingcancelID || '',
    };
  
 
    if (formData.cancelbookingupdateID === '3') {
    
      formDataToSubmit.bookingcancelremarksID = formData.bookingcancelremarksID; // currentrow bookingcancelremarksID
      formDataToSubmit.cancelbookingremarkbookingcancelID = item?.bookingcancelID; // Assigning bookingcancelID
    } else {
     
      if (!formData.cancelbookingupdateID) {
        setError('Current Update is required.');
        return;
      }
      formDataToSubmit.bookingcancelremarksID = formData.bookingcancelremarksID; // currentrow bookingcancelremarksID
      formDataToSubmit.bookingcancelremarksRemark = formData.bookingcancelremarksRemark; // remark
      formDataToSubmit.bookingcancelremarksAmount = formData.bookingcancelremarksAmount; // amount
      formDataToSubmit.bookingcancelremarksDate = formData.bookingcancelremarksDate; // date
      formDataToSubmit.cancelbookingupdateID = formData.cancelbookingupdateID; // cancelbookingupdateID
      formDataToSubmit.cancelbookingremarkbookingcancelID = item?.bookingcancelID; // Assigning bookingcancelID
    }
  
    // Conditionally determine which API URL to use
    const apiUrl =
      formData.cancelbookingupdateID === '3'
        ? 'https://proxy-forcorners.vercel.app/api/proxy/api-proccess-cancelremark.php' // API for cancelbookingupdateID === 3
        : 'https://proxy-forcorners.vercel.app/api/proxy/api-insert-cancelbookingremarkupdate.php'; // Default API
  
    try {
      const response = await axios.post(apiUrl, formDataToSubmit, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.data.status === 'Success') {
        setOpen(false);
        Swal.fire({
          icon: 'success',
          title: 'Follow Up detail saved successfully',
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: response.data.message || 'Something went wrong! Please try again later.',
        });
      }
    } catch (error) {
      console.error('There was an error!', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Please try again later.',
      });
    }
  };
  
  const handleCloseTemplate = () => {
    setOpenTemplate(false); // Close the modal
  
  };
 
  return (
    <>
      <Grid container justifyContent="left" spacing={2} sx={{ marginBottom: 5 }}>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleAddFollowUpClick}
            sx={{
              mr: 30,
              color: '#333333',
              fontSize: '0.6rem',
              backgroundColor: '#f0f0f0',
              minWidth: 'auto',
              minHeight: 20,
              '&:hover': {
                backgroundColor: '#dcdcdc',
              },
            }}
          >
            Next Follow Up
          </Button>
         
        </Grid>
      </Grid>

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            minWidth: 500,
            maxWidth: 700,
            mt: 5,
            mx: 2,
            minHeight: 400,
          }}
        >
          <IconButton aria-label="cancel" onClick={handleClose} sx={{ position: 'absolute', top: 6, right: 10 }}>
            <CancelIcon sx={{ color: 'red' }} />
          </IconButton>
          <Typography id="modal-modal-title" variant="h7" component="h3" gutterBottom>
            Select Next Follow-Ups
          </Typography>

          <Grid container spacing={2} mt={8}>
            {/* Current Update Dropdown */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Current Update</InputLabel>
                <Select
                  value={formData.cancelbookingupdateID}
                  onChange={handleCurrentUpdate}
                  label="Current Update"
                >
                  {currentUpdate.length > 0 ? (
                    currentUpdate.map((update) => (
                      <MenuItem key={update.cancelbookingupdateID} value={update.cancelbookingupdateID}>
                        {update.cancelbookingupdateName}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No updates available</MenuItem>
                  )}
                </Select>
                {error && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    Current Update is required.
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Remarks Dropdown */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Remarks</InputLabel>
                <Select
                  value={formData.bookingcancelremarksID}
                  onChange={handleCurrentRemark}
                  label="Remarks"
                >
                  {currentRemark.length > 0 ? (
                    currentRemark.map((remark) => (
                      <MenuItem key={remark.bookingcancelremarksID} value={remark.bookingcancelremarksID}>
                        {remark.bookingcancelremarksRemark} Date : {remark.bookingcancelremarksDate}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No remarks available</MenuItem>
                  )}
                </Select>
                {error && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    Remark is required.
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Conditionally render the fields only if cancelbookingupdateID is not 3 */}
            {formData.cancelbookingupdateID !== 3 && (
              <>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="date"
                    name="bookingcancelremarksDate"
                    value={formData.bookingcancelremarksDate}
                    onChange={handleChange}
                    label="Next Follow Up Date"
                    InputLabelProps={{ shrink: true }}
                  />
                    {error && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    Date is required.
                  </Typography>
                )}
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="New Remark"
                    type="text"
                    name="bookingcancelremarksRemark"
                    value={formData.bookingcancelremarksRemark}
                    onChange={handleChange}
                    InputLabelProps={{ sx: { mb: 1 } }}
                  />
                </Grid>

                {/* Amount Field - Read-Only once filled */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    name="bookingcancelremarksAmount"
                    value={formData.bookingcancelremarksAmount}
                    onChange={handleChange}
                    InputProps={{
                      readOnly: true,  // Make the Amount field read-only
                    }}
                  />
                </Grid>
              </>
            )}

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleSubmit}>
                Save Follow-Up
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
     
        <Card
          style={{
            maxWidth: "800px",
            margin: "auto",
         
            height: "90vh", // Set height relative to the viewport
            padding: "20px",
            overflowY: "auto", // Enable vertical scrolling if content overflows
          }}
        >
          <CancelTemplate
            bookingcancelID={item?.bookingcancelID}
           
          />
        </Card>
   
    </>
  );
};

export default ListCancel;
