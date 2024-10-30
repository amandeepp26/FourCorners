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
import ShareIcon from "@mui/icons-material/Share";
import CloseIcon from "@mui/icons-material/Close";
import GetAppIcon from "@mui/icons-material/GetApp";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ApartmentIcon from "@mui/icons-material/Apartment";

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
const Listprojectmaster = ({ item, onDelete, onEdit, onHistoryClick }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["amr"]);

  const intialName = {
    Tid: "",
    CurrentUpdateID: "",
    NextFollowUpDate: "",
    NextFollowUpTime: "",
    Interest: "",
    Note: "",
    CreateUID: cookies.amr?.UserID || 1,
  };

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(intialName);

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const [bhkOptions, setBhkOptions] = useState([]);
  const [currentUpdate, setCurrentUpdate] = useState([]);

  const [setRowDataToUpdate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [email, setEmail] = useState("");

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


  const handleEdit = () => {
    if (onEdit) {
      onEdit(item); // Pass item to parent component for editing
    }
  };

  const handleShare = () => {
    setModalVisible(true);
  };

  const userid = cookies.amr?.UserID || "Role";
console.log('UserID',userid)
  useEffect(() => {
    fetchContacts();
    fetchTemplate();
  }, []);
  const fetchContacts = async () => {
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-contacts.php?UserID=${userid}`
      );
      console.log("API Response:", response.data);
      setContacts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchTemplate = async () => {
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-templateselect.php?ProjectID=${item.ProjectID}`
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
      width: { xs: '90%', sm: '500px' }, // Responsive width
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 24,
      p: 4,
      mx: 'auto', // Center modal horizontally
      mt: '10%', // Center modal vertically
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
      <Grid item xs={12}>
      <FormControl fullWidth>
            <InputLabel>Contacts</InputLabel>
            <Select
              value={selectedContact || ""}
              onChange={(event) => setSelectedContact(event.target.value)}
              label="Contacts"
            >
              {contacts.map((contact) => (
                <MenuItem key={contact.Cid} value={contact}>
                  {contact.CName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
      </Grid>

      {selectedContact?.Email === undefined && selectedContact && (
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="Email"
            variant="outlined"
          />
        </Grid>
      )}

      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Templates</InputLabel>
          <Select
            value={selectedTemplate || ""}
            onChange={(event) => setSelectedTemplate(event.target.value)}
            label="Templates"
          >
            {templates.map((temp) => (
              <MenuItem key={temp.templateID} value={temp}>
                {temp.TName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

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
          <Button
            variant="contained"
            onClick={handleShare}
            startIcon={<ShareIcon />}
            sx={{
              // Light gray background color
              color: "#333333", // Dark gray text color
              fontSize: "0.6rem",
              marginLeft: 5,
              backgroundColor: "#f0f0f0",
              minWidth: "auto",
              minHeight: 20, // Decrease button height
              "&:hover": {
                backgroundColor: "#dcdcdc", // Darken background on hover
              },
            }}
          >
            Share
          </Button>
        </Grid>
      </Grid>

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
            <ApartmentIcon
              style={{
                fontSize: 30,
                textAlign: "center",
                width: 60,
                height: 60,
                mr: 6,
                color: "#b187fd",
              }}
            />

            <Box sx={{ flex: "1 1" }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 500, fontSize: "1.0rem" }}
              >
                {item?.ProjectName}
              </Typography>
              <Typography sx={{ fontSize: "0.8rem" }}>
                Created By : {item?.Name}
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
          ></Box>

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
                    Company Name
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.CompanyName}
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
                    Created By
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.Name}
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
                    Created At
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.CreateDate}
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
