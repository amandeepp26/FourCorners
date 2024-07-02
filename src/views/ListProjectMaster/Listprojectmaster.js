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
import { Modal, TextField, IconButton, Menu, MenuItem , FormControl , InputLabel , Select} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import Swal from 'sweetalert2';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
const Listprojectmaster = ({ item, onDelete, onEdit , onHistoryClick }) => {

  const intialName = {
    Tid: "",
    CurrentUpdateID: "",
    NextFollowUpDate: "",
    NextFollowUpTime: "",
    Interest: "",
    Note: "",
    CreateUID: 1,
  }




  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(intialName);

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const [bhkOptions, setBhkOptions] = useState([]);
  const [currentUpdate, setCurrentUpdate] = useState([]);

  const [setRowDataToUpdate] = useState(null);

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

  const handleSave = () => {
    console.log(formData);
    setOpen(false);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Ensure item and Tid are available
    if (!item || !item.Tid) {
      console.error('No valid item or Tid found.');
      return;
    }
  
    // Add Tid to formData
    const formDataWithTid = {
      ...formData,
      Tid: item.Tid
    };

    console.log(formDataWithTid , 'sdf');
  
    const url = "https://ideacafe-backend.vercel.app/api/proxy/api-insert-nextfollowup.php";
  
    try {
      const response = await axios.post(url, formDataWithTid, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(formDataWithTid ,  'sdf');
      
  
      if (response.data.status === "Success") {
        setFormData(intialName);
        setOpen(false);
        setSubmitSuccess(true);
        setSubmitError(false);
        // Show success message using SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Follow-up details saved successfully.',
        });
      } else {
        setSubmitSuccess(false);
        setSubmitError(true);
        // Show error message using SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong! Please try again later.',
        });
      }
    } catch (error) {
      console.error("There was an error!", error);
      setSubmitSuccess(false);
      setSubmitError(true);
      // Show error message using SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Please try again later.',
      });
    }
  };
  
  const handlenavigate =() => {
    window.location.href = "/opportunity/";
  
  }
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
            height: 'auto', 
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
                    <MenuItem  key={bhk.CurrentUpdateID} value={bhk.CurrentUpdateID}>
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
                InputLabelProps={{ sx: { mb: 1 } }}
          
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
              
                InputLabelProps={{ sx: { mb: 1 } }}
              
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
                {item?.ProjectName}
              </Typography>
              <Typography sx={{ fontSize: "0.8rem" }}>
                Contact Details : {item?.ContactDetails}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              ml: 20,
            }}
          >
            <div style={{ mr: 5 }}>
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
             Project Manager: {item?.ProjectManager}
              </Typography>
            </div>
            <div style={{ marginRight: 5 }}>
              <Typography
                variant="body2"
                sx={{
               
                  color: "#333333",
                  fontSize: "0.7rem",
                  minWidth: "auto",
                  padding: "5px",
                  borderRadius: 2,
                  minHeight: 20,
                  marginLeft: 2,
                  backgroundColor: "#f0f0f0",
                  "&:hover": {
                    backgroundColor: "#dcdcdc",
                  },
                }}
              >
               Project Start Date : {item?.projectstartdate}
              </Typography>
            </div>
            <div style={{ marginRight: 5 }}>
              <Typography
                variant="body2"
                sx={{
               
                  color: "#333333",
                  fontSize: "0.7rem",
                  minWidth: "auto",
                  padding: "5px",
                  borderRadius: 2,
                  minHeight: 20,
                  marginLeft: 2,
                  backgroundColor: "#f0f0f0",
                  "&:hover": {
                    backgroundColor: "#dcdcdc",
                  },
                }}
              >
                Gstin Number :  {item?.GstInNo}
              </Typography>
            </div>
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
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
              Project Code
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
              {item?.ProjectCode}
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
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
              Location
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
              {item?.Location}
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
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
              State Name
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
              {item?.StateName}
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
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
              CtsNo
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                {item?.CtsNo}
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
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                Company Name
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                {item?.CompanyName}
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
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
            City Name
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                {item?.CityName}
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
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
              ReraRegistratio Number
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                {item?.ReraRegistrationNumber}
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
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
              ReraRegistration Date
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                {item?.ReraRegistrationDate}
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
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
              Property Tax Number
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                {item?.PropertyTaxNumber}
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
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
              WelcomeMessage
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                {item?.WelcomeMessage}
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

export default Listprojectmaster;