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
    bookingcancelremarksID: '', // Adjust if needed
    CreateUID: cookies.amr?.UserID || 1,
  };
  
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [currentUpdate, setCurrentUpdate] = useState([]);
  const [currentRemark, setCurrentRemark] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Fetch current updates on component mount
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
    setFormData(initialFormState); // Reset form data when closing
  };
  
  const handleCurrentUpdate = (event) => {
    setFormData({ ...formData, cancelbookingupdateID: event.target.value });
  };
  
  const handleCurrentRemark = (event) => {
    setFormData({ ...formData, bookingcancelremarksID: event.target.value });
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formDataToSubmit = {
      bookingcancelremarksbookingcancelID: item?.bookingcancelID || '',
    };
  
    // Conditionally add fields based on the cancelbookingupdateID
    if (formData.cancelbookingupdateID === '3') {
      // For cancelbookingupdateID === 3
      formDataToSubmit.bookingcancelremarksID = formData.bookingcancelremarksID; // currentrow bookingcancelremarksID
      formDataToSubmit.cancelbookingremarkbookingcancelID = item?.bookingcancelID; // Assigning bookingcancelID
    } else {
      // For other IDs, add all required fields
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
  
  return (
    <>
      <Grid container justifyContent="center" spacing={2} sx={{ marginBottom: 5 }}>
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
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleDropdownClose}>
            <MenuItem onClick={handleAddFollowUpClick}>
              <AddIcon sx={{ mr: 1 }} />
              Add Follow Up
            </MenuItem>
            <MenuItem onClick={onHistoryClick}>
              <HistoryIcon sx={{ mr: 1 }} />
              History
            </MenuItem>
          </Menu>
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
    </FormControl>
  </Grid>

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
              {remark.bookingcancelremarksRemark}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No remarks available</MenuItem>
        )}
      </Select>
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
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Interest In"
          type="text"
          name="bookingcancelremarksRemark"
          value={formData.bookingcancelremarksRemark}
          onChange={handleChange}
          InputLabelProps={{ sx: { mb: 1 } }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Amount"
          type="number"
          name="bookingcancelremarksAmount"
          value={formData.bookingcancelremarksAmount}
          onChange={handleChange}
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
      <Card sx={{}}>
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
             {item?.TitleName}   {item?.bookingcancelName}
              </Typography>
              <Typography sx={{ fontSize: "0.8rem" }}>
                {item?.bookingcancelMobile}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              // alignItems: "center",
              ml: 20,
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
                Source Name: {item?.bookingcancelSourceName}
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
                Email: {item?.bookingcancelEmail}
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
                Aadhar Card: {item?.bookingcancelAadhar}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", ml: 35, mt: 7 }}>
              <a href={`tel:${item?.bookingcancelMobile}`} style={{ marginRight: 40 }}>
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
          
              <a style={{ marginRight: 30 }}>
                <IconButton
                  aria-label="share"
                  size="small"
                  sx={{
                    color: "#000",
                    backgroundColor: "#e3f2fd",
                    borderRadius: "50%",
                    padding: "10px",
                    marginRight: 1,
                    "&:hover": {
                      backgroundColor: "#bbdefb",
                    },
                  }}
                  // onClick={handleHistoryClick}
                >
                  <HistoryIcon />
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
                    Project Name
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.ProjectName}
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
                    Wing Name
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.WingName}
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
                   Flat No
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.bookingcancelFlatNo}
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
                 Unit Type
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                  {item?.UnittypeName}
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
                 Booking Type
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.BookingTypeName}
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
                    Area 
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.bookingcancelArea}
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
                   FollowUp Remark
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.bookingcancelremarksRemark}
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
                   FollowUp Amount
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.bookingcancelremarksAmount}
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
                    FollowUp Date
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.bookingcancelremarksDate}
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Card>
    </>
  );
};

export default ListCancel;
