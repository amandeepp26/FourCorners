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
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
const OpenLoanlist = ({ item, onDelete, onEdit, onHistoryClick }) => {
  console.log(item, 'CIDD MIL JAYEGAA<<<>>>>>>');
  const [cookies, setCookie, removeCookie] = useCookies(["amr"]);
  const intialName = {
    Tid: "",
    CurrentUpdateID: "",
    NextFollowUpDate: "",
    NextFollowUpTime: "",
    Interest: "",
    Note: "",
    CreateUID: cookies?.amr?.UserID || 1,
  };

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(intialName);

  const [userMaster, setUserMaster] = useState([]);

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [currentUpdate, setCurrentUpdate] = useState([]);
  const [selectedBookingRemark, setSelectedBookingRemark] = useState("");
  const [bookingRemarkDetails, setBookingRemarkDetails] = useState({});
  const [bookingRemarks, setBookingRemarks] = useState([]);
  const [anchorElOpportunity, setAnchorElOpportunity] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCurrentUpdate = (event) => {
    setFormData({
      ...formData,
      CurrentUpdateID: event.target.value,
    });
  };

  useEffect(() => {
    fetchDataCurrent();
  }, []);

  const fetchDataCurrent = async () => {
    try {
      const response = await axios.get(
        "https://apiforcornershost.cubisysit.com/api/api-fetch-currentupdate.php"
      );
      setCurrentUpdate(response.data.data || []);
    } catch (error) {
      console.error("Error fetching Bhk data:", error);
    }
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };
  const whatsappText = encodeURIComponent(
    `Hello, I wanted to discuss the following details:\n\nSource Name: ${item?.SourceName}\nLocation: ${item?.Location}\nAttended By: ${item?.TelecallAttendedByName}`
  );

  const handleAddFollowUpClick = () => {
    handleDropdownClose();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  const handleHistoryClick = () => {
    if (onHistoryClick) {
      // toggleSidebar(false);
      onHistoryClick(item); // Pass item to parent component for showing history
    }
  };

  

  const handleAddPayment = async () => {
    setOpen(true);
  
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-dropdown-loanbookingremark.php?BookingID=${item?.BookingID}`
      );
      if (response.data.status === "Success") {
        console.log(response.data.data, 'Received booking remarks data');
        const bookingRemarksData = response.data.data;
        setBookingRemarks(bookingRemarksData);
  
        // Fetch details for the first booking remark if available
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
    await fetchBookingRemarkDetails(bookingRemarkID);
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure item and selected booking remark are available
    if (!item || !selectedBookingRemark) {
      console.error("No valid item or selected booking remark found.");
      return;
    }

    // Prepare the data object to be sent to the API
    const payload = {
      BookingID: item.BookingID,
      Remarkamount: bookingRemarkDetails.Remarkamount || 0,
      RemarkName: bookingRemarkDetails.RemarkName || '',
      RemarkDate: formData.NextFollowUpDate, // Use the NextFollowUpDate as RemarkDate
      AmountTypeID: bookingRemarkDetails.AmountTypeID || 1, // Use the fetched AmountTypeID
      Loan: bookingRemarkDetails.Loan || formData.Loan || 0, // Use the fetched Loan value
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
        setFormData("");
        setOpen(false);
        // setSubmitSuccess(true);
        // setSubmitError(false);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Follow-up details saved successfully.",
        });
      } else {
        // setSubmitSuccess(false);
        // setSubmitError(true);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong! Please try again later.",
        });
      }
    } catch (error) {
      console.error("There was an error!", error);
      setSubmitSuccess(false);
      setSubmitError(true);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again later.",
      });
    }
};
  const jsonToCSV = (json) => {
    const header = Object.keys(json[0]).join(",");
    const values = json.map((obj) => Object.values(obj).join(",")).join("\n");
    return `${header}\n${values}`;
  };

  const downloadCSV = () => {
    const csvData = [
      {
        "C Name ": item.CName,
        Mobile: item.Mobile,
        Email: item.Email,
        "Project Name": item.ProjectName,
        "Unit Type": item.UnittypeName,
        "Estimated Budget": item.EstimatedbudgetName,
        "Lead Status": item.leadstatusName,
        "Next Follow Up-Date": item.NextFollowUpDate,
        "Source Description": item.SourceDescription,
        "Telecall Attended By": item.TelecallAttendedByName,
        "Alternate Mobile Number": item.AlternateMobileNo,
        Comments: item.Comments,
        "Source Name": item.SourceName,
        Location: item.Location,
        "Attended By": item.TelecallAttendedByName,
      },
    ];

    const csv = jsonToCSV(csvData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Telecalling.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(item); // Pass item to parent component for editing
    }
  };

  return (
    <>
      <Grid
        container
        justifyContent="center"
        spacing={2}
        sx={{ marginBottom: 5 }}
      >
        <Grid item>
          <Button
            variant="contained"
            onClick={handleEdit}
            startIcon={<EditIcon />}
            sx={{
              // Light gray background color
              color: "#333333", // Dark gray text color
              fontSize: "0.6rem",
              backgroundColor: "#f0f0f0",
              minWidth: "auto",
              minHeight: 20, // Decrease button height
              "&:hover": {
                backgroundColor: "#dcdcdc", // Darken background on hover
              },
            }}
          >
            Edit Details
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={downloadCSV}
            startIcon={<GetAppIcon />}
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
            Download
          </Button>
        </Grid>
        <Grid item>
          
          <Menu
            anchorEl={anchorElOpportunity}
            open={Boolean(anchorElOpportunity)}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 300, // Set the desired height in pixels
                overflowY: "auto", // Make the content scrollable if it exceeds the height
              },
            }}
          >
            <MenuItem disabled>
              <Typography variant="subtitle1">Convert Lead to</Typography>
            </MenuItem>
            {userMaster.length > 0 ? (
              userMaster.map((user, index) => (
                <MenuItem key={user.UserID} onClick={(event) => handleMenuItemClick(event, user.UserID)}>
                  {index + 1}. {user.Name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No data available</MenuItem>
            )}
          </Menu>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={handleAddPayment}
            startIcon={<PersonAddIcon />}
            sx={{
              mr: 30,

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
            Next FollowUp
          </Button>
         
        </Grid>
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
      >
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
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <TextField
                select
                label="Select Booking Remark"
                value={selectedBookingRemark}
                onChange={handleBookingRemarkChange}
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
            </Grid>
            {selectedBookingRemark && (
              <>
                <Grid item xs={6}>
                  <TextField
                    label="Remark Amount"
                    value={bookingRemarkDetails.Remarkamount || ""}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6 }>
                  <TextField
                    label="Remark Name"
                    value={bookingRemarkDetails.RemarkName || ""}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={6}>
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Note"
                type="text"
                name="Note"
                value={formData.Note}
                onChange={handleChange}
                InputLabelProps={{ sx: { mb: 1 } }}
              />
            </Grid>
          </Grid>

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
                {item?.Name}
              </Typography>
              <Typography sx={{ fontSize: "0.8rem" }}>
                {item?.Mobile}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ width: "100%", ml: 20 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
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
                  mr: 2, // Add margin-right to separate the items
                }}
              >
                Remark Amount: {item?.Remarkamount}
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
                  mr: 2, // Add margin-right to separate the items
                }}
              >
                Date: {item?.RemarkDate}
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
                Words Given: {item?.RemarkName}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", mt: 10, ml: 20 }}>
              <a href={`tel:${item?.Mobile}`} style={{ marginRight: 40 }}>
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
              <a style={{ marginRight: 1 }}>
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
              <a style={{ marginRight:1 }}>
                <IconButton
                  aria-label="share"
                  size="small"
                  sx={{
                    color: "#000",
                    backgroundColor: "#e3f2fd",
                    borderRadius: "50%",
                    padding: "10px",
                    marginRight: 15,
                    "&:hover": {
                      backgroundColor: "#bbdefb",
                    },
                  }}
                  onClick={handleHistoryClick}
                >
                  <HistoryIcon />
                </IconButton>
              </a>
              <a href={`mailto:${item?.Email}`} style={{ marginRight: 35 }}>
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
                href={`https://wa.me/${item?.Mobile}?text=${whatsappText}`}
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
                    Email
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.Email}
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
                    Project Name
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.ProjectName}
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
                    Aadhar
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.Aadhar}
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
                  Flat Number 
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.FlatNo}
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
                    Total Cost
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.TotalCost}
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
                   Pancard Number
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.Pancard}
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
           
          </Box>

          {/* Comments */}
          <Box
            sx={{
              width: "auto",
              display: "flex",
              alignItems: "center",
              ml: 12,
              mt: 12,
            }}
          >

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
                    Address
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.Address}
                  </Typography>
                </Card>
           
            </Grid>
          </Box>
        </Paper>
      </Card>
    </>
  );
};

export default OpenLoanlist;
