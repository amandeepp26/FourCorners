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
const ListTellecalling = ({ item, onDelete, onEdit, onHistoryClick }) => {
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

  const [setRowDataToUpdate] = useState(null);
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
        "https://apiforcorners.cubisysit.com/api/api-fetch-currentupdate.php"
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

  const handleCloseConvert = () => {
    setAnchorElOpportunity(false);
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

  useEffect(() => {
    const fetchData = async () => {
      if (!item) return; // Exit if no item is provided
      try {
        const apiUrl = `https://apiforcorners.cubisysit.com/api/api-singel-telecalling.php?Tid=${item.Tid}`;

        const response = await axios.get(apiUrl);

        if (response.data.status === "Success") {
          console.log(response.data.data[0], "Single telecalling data fetched");
          // Update item state with fetched data
          setRowDataToUpdate(response.data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching single telecalling data:", error);
      }
    };
    fetchData();
  }, [item]);
  const fetchUserMasterData = async () => {
    try {
      const response = await axios.get(
        "https://apiforcorners.cubisysit.com/api/api-fetch-usersales.php"
      );
      if (response.data.status === "Success") {
        setUserMaster(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleMenuItemClick = async (event, userID) => {
    event.preventDefault();

    // Ensure item and Tid are available
    if (!item || !item.Tid) {
      console.error("No valid item or Tid found.");
      return;
    }

    // Add Tid to formData
    const formData = {
      UserID: userID,
      Cid: item?.Cid,
      Tid: item.Tid,
      Status: 1,
      CreateUID: cookies?.amr?.UserID || 1,

    };

    console.log(formData, "COVERT TO OPPORTUNITY Data 1");

    const url =
      "https://ideacafe-backend.vercel.app/api/proxy/api-insert-convtoppo.php";

    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(formData, "COVERT TO OPPORTUNITY Data 2");

      if (response.data.status === "Success") {
        // setFormData(intialName);
        setOpen(false);
        
        setSubmitSuccess(true);
        setSubmitError(false);
        // Show success message using SweetAlert
        Swal.fire({
          icon: "success",
          title:
            "Lead Converted to opportunity Successfully",

          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          window.location.reload();
        });
      } else {
        setSubmitSuccess(false);
        setSubmitError(true);
        // Show error message using SweetAlert
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
      // Show error message using SweetAlert
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again later.",
      });
    }
  };
  const handleClick = (event) => {
    setAnchorElOpportunity(event.currentTarget);
    fetchUserMasterData();
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure item and Tid are available
    if (!item || !item.Tid) {
      console.error("No valid item or Tid found.");
      return;
    }

    // Add Tid to formData
    const formDataWithTid = {
      ...formData,
      Tid: item.Tid,
    };

    console.log(formDataWithTid, "sdf");

    const url =
      "https://ideacafe-backend.vercel.app/api/proxy/api-insert-nextfollowup.php";

    try {
      const response = await axios.post(url, formDataWithTid, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(formDataWithTid, "sdf");

      if (response.data.status === "Success") {
        setFormData(intialName);
        setOpen(false);
        setSubmitSuccess(true);
        setSubmitError(false);
        // Show success message using SweetAlert
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Follow-up details saved successfully.",
        });
      } else {
        setSubmitSuccess(false);
        setSubmitError(true);
        // Show error message using SweetAlert
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
      // Show error message using SweetAlert
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again later.",
      });
    }
  };

  const handlenavigate = () => {
    window.location.href = "/opportunity/";
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
          <Button
            variant="contained"
            startIcon={<ArrowForwardIosIcon />}
            onClick={handleClick}
            sx={{
              color: "#333333",
              backgroundColor: "#f0f0f0",
              fontSize: "0.6rem",
              minWidth: "auto",
              minHeight: 20,
              "&:hover": {
                backgroundColor: "#dcdcdc",
              },
            }}
          >
            Opportunity
          </Button>
          <Menu
            anchorEl={anchorElOpportunity}
            open={Boolean(anchorElOpportunity)}
            onClose={handleCloseConvert}
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
            onClick={handleDropdownClick}
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
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleDropdownClose}
          >
            <MenuItem onClick={handleAddFollowUpClick}>
              <AddIcon sx={{ mr: 1 }} />
              Add Follow Up
            </MenuItem>
            <MenuItem onClick={handleHistoryClick}>
              <HistoryIcon sx={{ mr: 1 }} />
              History
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
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
            maxWidth: 700, // Adjust the maxWidth to accommodate two text fields in a row
            mt: 5,
            mx: 2,
            minHeight: 400, // Adjust the minHeight to increase the height of the modal
            height: "auto",
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
          >
            Select Next Follow-Up Date and Time
          </Typography>

          <Grid container spacing={2} mt={8}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Current Update</InputLabel>
                <Select
                  value={formData.CurrentUpdateID}
                  onChange={handleCurrentUpdate}
                  label="Current Update"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 180, // Adjust as needed
                      },
                    },
                  }}
                >
                  {currentUpdate.map((bhk) => (
                    <MenuItem
                      key={bhk.CurrentUpdateID}
                      value={bhk.CurrentUpdateID}
                    >
                      {bhk.CurrentUpdateName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

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
            <Grid item xs={6}>
              <TextField
                fullWidth
                // label="Next Follow-Up Time"
                type="time"
                name="NextFollowUpTime"
                value={formData.NextFollowUpTime}
                onChange={handleChange}
                label="Next Follow Up Time"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Interest In"
                type="text"
                name="Interest"
                value={formData.Interest}
                onChange={handleChange}
                InputLabelProps={{ sx: { mb: 1 } }}
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

          <Box sx={{ textAlign: "left" }}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                sx={{
                  marginRight: 3.5,
                  marginTop: 15,
                  backgroundColor: "#9155FD",
                  color: "#FFFFFF",
                }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Grid>
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
                {item?.CName}
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
                Source Name: {item?.SourceName}
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
                Location: {item?.CityName}/{item?.Location}
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
                Attended By: {item?.TelecallAttendedByName}
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
              <a style={{ marginRight:10 }}>
                <IconButton
                  aria-label="share"
                  size="small"
                  sx={{
                    color: "#000",
                    backgroundColor: "#e3f2fd",
                    borderRadius: "50%",
                    padding: "10px",
                    marginRight: 10,
                    "&:hover": {
                      backgroundColor: "#bbdefb",
                    },
                  }}
                  onClick={handleHistoryClick}
                >
                  <HistoryIcon />
                </IconButton>
              </a>
              <a href={`mailto:${item?.Email}`} style={{ marginRight: 15 }}>
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
                    Unit Type
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.UnittypeName}
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
                    Estimated Budget
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.EstimatedbudgetName}
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
                    Lead Status
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.leadstatusName}
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
                    Next Follow-Up Date
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.NextFollowUpDate}
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
                    Created At
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.TelecallingCreateDate}
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
                    Telecall Attended By
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.TelecallAttendedByName}
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
                    Alternate Mobile Number
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.OtherNumbers}
                  </Typography>
                </Card>
              </Grid>
            </Grid>
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
                    Comments
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.Comments}
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

export default ListTellecalling;
