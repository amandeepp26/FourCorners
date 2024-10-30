import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import TransformIcon from '@mui/icons-material/Transform';
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import HistoryIcon from "@mui/icons-material/History";
import EditIcon from "@mui/icons-material/Edit";
import GetAppIcon from "@mui/icons-material/GetApp";
import CloseIcon from "@mui/icons-material/Close";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Modal, TextField, IconButton, Menu, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import Swal from 'sweetalert2';
import EmailIcon from '@mui/icons-material/Email';
import { useCookies } from "react-cookie";
import { useRouter } from 'next/router';

import PhoneIcon from "@mui/icons-material/Phone";
import ShareIcon from "@mui/icons-material/Share";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const ListContact = ({ item, onDelete, onEdit, onHistoryClick }) => {
  console.log(item, 'dekh bhaiiiiii<<<<<>>>>>>>>>');

  const [cookies, setCookie, removeCookie] = useCookies(["amr"]);
  const intialName = {
    Tid: "",
    CurrentUpdateID: "",
    NextFollowUpDate: "",
    NextFollowUpTime: "",
    Interest: "",
    Note: "",
    CreateUID: cookies.amr?.UserID || 1,
  }




  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(intialName);

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const [bhkOptions, setBhkOptions] = useState([]);
  const [currentUpdate, setCurrentUpdate] = useState([]);

  const [setRowDataToUpdate] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const router = useRouter();


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

  const whatsappText = encodeURIComponent(
    `Hello, I wanted to discuss the following details:\n\nSource Name: ${item?.SourceName}\nLocation: ${item?.Location}\nAttended By: ${item?.TelecallAttendedByName}`
  );




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
  // const handlenavigate =() => {
  //   window.location.href = "/tellcalling-details/";

  // }

  const handleNavigation = () => {
    // Store the contact data in local storage
    localStorage.setItem('selectedContact', JSON.stringify(item));
    localStorage.setItem('showAddDetails', 'true'); // Set flag

    // Redirect to the telecalling-details page
    router.push('/tellcalling-details');
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
        const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-singel-contacts.php?Cid=${item.Cid}`;

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
    debugger;
    event.preventDefault();

    // Ensure selectedProject and selectedTemplate are available
    if (!selectedProject || !selectedTemplate) {
      console.error('Project or Template not selected.');
      return;
    }

    try {
      console.log('IIIIIIIIIIIIIIDDDDDDDDDDDDDDDDDDDDD', selectedProject.ProjectID)
      const projectResponse = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-projectdetails.php?ProjectID=${selectedProject.ProjectID}`
      );
      console.log('Project Response:', projectResponse.data);
      // Fetch template details
      const templateResponse = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-templatedetails.php?templateID=${selectedTemplate.templateID}`
      );
      console.log('Template Response:', templateResponse.data);
      const emailData = {
        projectID: projectResponse.data.data[0].ProjectID,
        projectName: projectResponse.data.data[0].ProjectName,
        projectCode: projectResponse.data.data[0].ProjectCode,
        projectManager: projectResponse.data.data[0].ProjectManager,
        areaSqft: projectResponse.data.data[0].Areasqft,
        videoLink: projectResponse.data.data[0].VideoLink,
        virtualLink: projectResponse.data.data[0].VirtualLink,
        launchDate: projectResponse.data.data[0].LaunchDate,
        completionDate: projectResponse.data.data[0].CompletionDate,
        possessionDate: projectResponse.data.data[0].PossessionDate,
        remark: projectResponse.data.data[0].Remark,
        amenities: projectResponse.data.data[0].AmenitiesNames,

        // Access the first item in the template response's data array
        templateID: templateResponse.data.data[0].templateID,
        templateName: templateResponse.data.data[0].TName,
        templateTypeID: templateResponse.data.data[0].templatetypeID,
        content: templateResponse.data.data[0].content,
        name: item.CName,
        email: item.Email,

        // Add any additional data needed for the email
      };
      console.log("email data ", emailData)
      const emailResponse = await axios.post(
        "https://proxy-forcorners.vercel.app/api/proxy/api-email.php",
        emailData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("email data ", emailResponse)
      // Check the response from the email API
      if (emailResponse.data.status === "Success") {
        Swal.fire({
          icon: 'success',
          title: 'Email Sent!',
          text: 'The email has been sent successfully.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to send the email. Please try again.',
        });
      }

      // Reset the form or handle other UI changes
      setModalVisible(false);

    } catch (error) {
      console.error("There was an error!", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while processing your request. Please try again later.',
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
        "Party Name": item.PartyName,
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
  const formatCreateDate = (createDate) => {
    if (!createDate) return ""; // Handle case where createDate might be null or undefined
    const parts = createDate.split(" "); // Split date and time
    const dateParts = parts[0].split("-"); // Split yyyy-mm-dd into parts
    const time = parts[1]; // Get hh-ss-mm
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]} ${time}`; // dd-mm-yyyy format
    return formattedDate;
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchTemplate();
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        "https://apiforcornershost.cubisysit.com/api/api-fetch-projectmaster.php"
      );
      console.log("API Response project:", response.data);
      setProjects(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchTemplate = async () => {
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-templateselect.php?ProjectID=${selectedProject.ProjectID}`
      );
      console.log("API Response Templates:", response.data);
      setTemplates(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };



  return (
    <>
      <Modal open={modalVisible} onClose={() => setModalVisible(false)}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: { xs: '90%', sm: '500px' },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            mx: 'auto',
            mt: '10%',
          }}
        >
          <IconButton
            onClick={() => setModalVisible(false)}

            sx={{ alignSelf: 'flex-end' }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Share Details
          </Typography>

          <Grid container spacing={2}>
            {/* Project Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Projects</InputLabel>
                <Select
                  value={selectedProject || ""}
                  onChange={(event) => setSelectedProject(event.target.value)}
                  label="Projects"
                >
                  {projects?.map((item) => (
                    <MenuItem key={item.ProjectID} value={item}>
                      {item.ProjectName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Template Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Templates</InputLabel>
                <Select
                  value={selectedTemplate || ""}
                  onChange={(event) => {
                    debugger;
                    setSelectedTemplate(event.target.value)
                  }}
                  label="Templates"
                >
                  {templates?.map((template) => (
                    <MenuItem key={template.templateID} value={template}>
                      {template.TName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
                sx={{ mt: 2 }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <Grid
        container
        justifyContent="center"
        spacing={2}
        sx={{ marginBottom: 5 }}
      >
        <Grid item>
          <Button
            variant="contained"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(item);
            }}
            startIcon={<EditIcon />}
            sx={{
              backgroundColor: "#f0f0f0", // Light gray background color
              color: "#333333", // Dark gray text color
              fontSize: "0.6rem",
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
              backgroundColor: "#f0f0f0",
              color: "#333333",
              fontSize: "0.6rem",
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
            onClick={handleNavigation}
            startIcon={<TransformIcon />}
            sx={{
              backgroundColor: "#f0f0f0",
              color: "#333333",
              fontSize: "0.6rem",
              minWidth: "auto",
              minHeight: 20,
              "&:hover": {
                backgroundColor: "#dcdcdc",
              },
            }}
          >
            Convert To Lead
          </Button>
        </Grid>
        {/* <Grid item>
          <Button
            variant="contained"
            onClick={handleDropdownClick}
            startIcon={<PersonAddIcon />}
            sx={{
              mr: 30,
              backgroundColor: "#f0f0f0",
              color: "#333333",
              fontSize: "0.6rem",
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
        </Grid> */}
      </Grid>
      {/* <Modal
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
                // label="Next Follow-Up Date"
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
      </Modal> */}
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
              <Typography sx={{ fontSize: "0.9rem" }}>
                {item?.Mobile}
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
                  backgroundColor: "#f0f0f0",
                  color: "#333333",
                  fontSize: "0.7rem",
                  minWidth: "auto",
                  padding: "5px",
                  borderRadius: 2,
                  minHeight: 20,
                  marginLeft: 2,
                  "&:hover": {
                    backgroundColor: "#dcdcdc",
                  },
                }}
              >
                Source: {item?.SourceName}
              </Typography>
            </div>
            <div style={{ marginRight: 5 }}>
              <Typography
                variant="body2"
                sx={{
                  backgroundColor: "#f0f0f0",
                  color: "#333333",
                  fontSize: "0.7rem",
                  minWidth: "auto",
                  padding: "5px",
                  borderRadius: 2,
                  minHeight: 20,
                  marginLeft: 2,

                  "&:hover": {
                    backgroundColor: "#dcdcdc",
                  },
                }}
              >
                City: {item?.CityName}/{item.Location}
              </Typography>
            </div>
            <div style={{ marginRight: 5 }}>
              <Typography
                variant="body2"
                sx={{
                  backgroundColor: "#f0f0f0",
                  color: "#333333",
                  fontSize: "0.7rem",
                  minWidth: "auto",
                  padding: "5px",
                  borderRadius: 2,
                  minHeight: 20,
                  marginLeft: 2,

                  "&:hover": {
                    backgroundColor: "#dcdcdc",
                  },
                }}
              >
                Alternate Mobile: {item?.OtherNumbers}
              </Typography>
            </div>
          </Box>

          <Box sx={{ display: "flex", mt: 10, ml: 50 }}>
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
            <a style={{ marginRight: 10 }}>

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

            <a onClick={() => setModalVisible(true)} style={{ marginRight: 35 }}>
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

          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              mt: 15,
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.9rem", alignContent: "center" }}>
                    Email
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>{item?.Email}</Typography>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontSize: "0.9rem", fontWeight: 500 }}>
                    Customer Type
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>{item?.CustomerTypeName}</Typography>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontSize: "0.9rem", fontWeight: 500 }}>
                    Contact Type
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>{item?.ContactName}</Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",

              mt: 12,
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
                    Create Date
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    {formatCreateDate(item?.CreateDate)}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontSize: "0.9rem", fontWeight: 500 }}>
                    Country Code
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    {item?.CountryName}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontSize: "0.9rem", fontWeight: 500 }}>
                    City Name
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    {item?.CityName}
                  </Typography>
                </Card>
              </Grid>

            </Grid>
          </Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",

              mt: 12,
            }}
          >

            <Grid container spacing={3}>

              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontSize: "0.9rem", fontWeight: 500 }}>
                    Locality
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    {item?.Location}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
                    Attended By
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>{item?.Name}</Typography>
                </Card>
              </Grid>

            </Grid>
          </Box>

        </Paper>
      </Card>
    </>
  );
};

export default ListContact;
