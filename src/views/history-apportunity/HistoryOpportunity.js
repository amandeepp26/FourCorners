import { styled } from '@mui/system';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, TextField, IconButton, Grid, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import Swal from 'sweetalert2';
import { useCookies } from 'react-cookie';


const CustomPaper = styled(Paper)({
  padding: '6px 16px',
  maxWidth: '600px',
});


const CustomTimeline = styled(Timeline)({
  width: '100%',
  margin: '0',
});

const NoDataSVG = 'https://path-to-your-svg-image.svg'; 

export default function HistoryOpportunity({ item }) {
console.log(item  , 'aagaya dataa oid ');
  const [cookies, setCookie, removeCookie] = useCookies(["amr"]);
  const initialName = {
    Oid: "",
    CurrentUpdateID: "",
    NextFollowUpDate: "",
    NextFollowUpTime: "",
    Interest: "",
    Note: "",
    CreateUID: cookies.amr?.UserID || 1,
  };

  const [rowData, setRowDataToUpdate] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialName);
  const [currentUpdate, setCurrentUpdate] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleAddFollowUpClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
      console.error("Error fetching current update data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!item) return;
      try {
        const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-singel-opportunityfollowup.php?Oid=${item.Oid}`;
        const response = await axios.get(apiUrl);
        if (response.data.status === 'Success') {
          console.log(response.data , 'history checkkk karrr<<<<<<>>>>>>');
          setRowDataToUpdate(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching single telecalling data:', error);
      }
    };
    fetchData();
  }, [item]);

  const handleCurrentUpdate = (event) => {
    setFormData({
      ...formData,
      CurrentUpdateID: event.target.value,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!item || !item.Oid) {
      console.error('No valid item or Oid found.');
      return;
    }
    const formDataWithOid = {
      ...formData,
      Oid: item.Oid
    };
    const url = "https://proxy-forcorners.vercel.app/api/proxy/api-insert-opportunityfollowup.php";
    try {
      const response = await axios.post(url, formDataWithOid, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.status === "Success") {
        setFormData(initialName);
        setOpen(false);
        setSubmitSuccess(true);
        setSubmitError(false);
        Swal.fire({
            icon: "success",
            title: "Follow Up detail saved successfully",
            showConfirmButton: false,
            timer: 1000,
          }).then(() => {
            window.location.reload();
          });
      } else {
        setSubmitSuccess(false);
        setSubmitError(true);
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
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Please try again later.',
      });
    }
  };

  return (
    <Box minHeight="100vh">
      <Box flex="1"  >
        <CustomTimeline align="alternate" display="flex" justifyContent="right">
          {rowData.length > 0 ? rowData.map((data, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent>
                <Typography variant="body2" color="textSecondary">
                  {data.NextFollowUpDate}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot style={{ backgroundColor: 'green' }}>
                  <CheckCircleIcon style={{ color: 'white' }} />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <CustomPaper elevation={3}>
                  <Typography variant="h6" component="h1" style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon style={{ marginRight: 8 }} />
                      <span style={{ fontWeight: 'bold' }}>
                        {data.UserRole}
                      </span>
                    </span>
                    <Typography variant="body2" color="textSecondary" style={{ marginLeft: '16px' }}>
                      Time: {data.NextFollowUpTime}
                    </Typography>
                  </Typography>
                  <Typography>Note: {data.Note}</Typography>
                </CustomPaper>
              </TimelineContent>
            </TimelineItem>
          )) : (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="50vh">
              <Typography variant="h6" color="textSecondary" style={{ marginTop: '16px' }}>
                No data available
              </Typography>
            </Box>
          )}
        </CustomTimeline>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: '16px' }}
          onClick={handleAddFollowUpClick}
        >
          Add New Follow Up
        </Button>
      </Box>
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
      <Box
        component="img"
        sx={{
          display: rowData.length > 0 ? 'none' : 'block',
          width: '50%',
          height: 'auto',
          marginLeft: 'auto',
        }}
        src={NoDataSVG}
        alt="No data available"
      />
    </Box>
  );
}
