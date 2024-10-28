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
import CampaignIcon from '@mui/icons-material/Campaign';
import ShareIcon from "@mui/icons-material/Share";
import Chip from '@mui/material/Chip';

import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
const Listcampaign = ({ item, onDelete, onEdit, onHistoryClick }) => {
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
        const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-singel-telecalling.php?Tid=${item.Tid}`;

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
        "https://apiforcornershost.cubisysit.com/api/api-fetch-usersales.php"
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
      "https://proxy-forcorners.vercel.app/api/proxy/api-insert-convtoppo.php";

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
      "https://proxy-forcorners.vercel.app/api/proxy/api-insert-nextfollowup.php";

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  };

  const formatTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}Z`);
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${hours}:${minutes} ${ampm}`;
  };


  const contactNames = item?.contactNames ? item.contactNames.split(',').map(contact => {
    const name = contact.split(' (ID:')[0]; // Remove ID part
    return name.trim();
  }) : [];

  return (
    <>
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
            <CampaignIcon sx={{ width: 60, height: 60, mr: 6 }} />
            <Box sx={{ flex: "1 1" }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 500, fontSize: "1.0rem" }}
              >
                {item?.CampaignName}
              </Typography>
              <Typography sx={{ fontSize: "0.8rem" }}>
                Create By : {item?.Name}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ width: "100%", ml: 2 }}>
            <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                  Campaign Type
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                  {item?.CampaignTypeName}
                  </Typography>
                </Card> 
              </Grid>
              {/* Campaign ID */}
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                  Date
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                  {formatDate(item?.Date)} 
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                  Time
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                  {formatTime(item?.Time)}
                  </Typography>
                </Card>
              </Grid>
           
            </Grid>
         


            <Grid container spacing={3} sx={{ mb: 6 }} >
              {/* Template Name */}
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    Template Name
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.TName}
                  </Typography>
                </Card>
              </Grid>

              {/* Template Type */}
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    Template Type
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.templatetypeName}
                  </Typography>
                </Card>
              </Grid>

              {/* Project Name */}
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    Project Name
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.ProjectName}
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Display contact names below project information */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem", mb: 1 }}>
                Contacts:
              </Typography>
              {contactNames.map((contact, index) => (
                <Chip
                  key={index}
                  label={contact}
                  sx={{
                    margin: 0.5,
                    backgroundColor: "#e0e0e0",
                    "&:hover": {
                      backgroundColor: "#dcdcdc",
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Paper>
      </Card>
    </>
  );
  
  
};

export default Listcampaign;
