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

const ListNotInterested = ({ item, onDelete, onEdit, onHistoryClick }) => {
console.log(item , "not interestedddd dataa<<<<<<<<<<<<a");
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
  const convertToLead = async () => {
    const formData = {
      Tid: item?.Tid // Assuming formData is defined somewhere else in your code
    };
  console.log(formData , 'data aagaya');
    try {
      const response = await axios.post(
        "https://proxy-forcorners.vercel.app/api/proxy/api-insert-convertolead.php",
        formData, // Corrected: formData should be passed as the second argument
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
  
      console.log(item?.Tid, 'see thisss');
  
      if (response.data.status === "Success") {
        // Handle success
        Swal.fire({
          icon: "success",
          title: "Coverted to Lead Succesfully",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          window.location.reload();
        });
      } else {
        // Handle error
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to convert to lead. Please try again later."
        });
      }
    } catch (error) {
      console.error("Error converting to lead:", error);
      // Handle error
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to convert to lead. Please try again later."
      });
    }
  };
  

  const handleSave = () => {
    console.log(formData);
    setOpen(false);
  };


  useEffect(() => {
    const fetchData = async () => {
      if (!item) return; // Exit if no item is provided
      try {
        const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-singel-mylead.php?Nid=${item.Nid}`;

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

    // Ensure item and Nid are available
    if (!item || !item.Nid) {
      console.error("No valid item or Nid found.");
      return;
    }

    // Add Nid to formData
    const formDataWithNid = {
      ...formData,
      Tid: item.Tid,
    };

    const url =
      "https://proxy-forcorners.vercel.app/api/proxy/api-insert-nextfollowup.php";

    try {
      const response = await axios.post(url, formDataWithNid, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "Success") {
        setFormData(intialName);
        setOpen(false);
        setSubmitSuccess(true);
        setSubmitError(false);
     
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

  const handleHistoryClick = () => {
    if (onHistoryClick) {
      // toggleSidebar(false);
      onHistoryClick(item); // Pass item to parent component for showing history
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
        startIcon={<ArrowForwardIosIcon />}
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
        onClick={convertToLead}
      >
        Convert to Lead
      </Button>

     
    </Grid>

    {/* <Grid item>
      <Button
        variant="contained"
        startIcon={<ArrowForwardIosIcon />}
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
        onClick={handleHistoryClick}
      >
       History
      </Button>

     
    </Grid>

        */}
      </Grid>
      <Grid
        container
        justifyContent="center"
        spacing={2}
        sx={{ marginBottom: 5 }}
      >
     
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
                // label="Next Follow-Up Date"
                type="date"
                name="NextFollowUpDate"
                placeholder="Schedule date"

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
                placeholder="Schedule time"

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
                {item?.CName}
              </Typography>
              <Typography sx={{ fontSize: "0.8rem" }}>
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
                Source Name: {item?.SourceName}
              </Typography>
            </div>
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
                Location: {item?.CityName}/{item.LocationName}
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
                Alternate Mobile Number: {item?.OtherNumbers}
              </Typography>
            </div>
          </Box>

          <Box sx={{ display: "flex",  mt: 10 , ml:20}}>
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
        <a  style={{ marginRight: 10 }}>

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
          href={`https://wa.me/${item?.Mobile}`}
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
              width: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ml: 12,
              mt: 15,
            }}
          >
            {/* Email */}

            {/* Unit Type */}

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
                    Current Update Name
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.CurrentUpdateName}
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
                    Next Follow-Up Time
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.NextFollowUpTime}
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
                    Interest
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.Interest}
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
                    Note
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {item?.Note}
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card
                  variant="outlined"
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
            </Grid>
          </Box>
        </Paper>
      </Card>
    </>
  );
};

export default ListNotInterested;
