import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import GetAppIcon from "@mui/icons-material/GetApp";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Checkbox, FormGroup } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Card from "@mui/material/Card";
import Swal from "sweetalert2";
import {
  Snackbar,
  FormControlLabel,
  RadioGroup,
  Radio,
  CircularProgress,
  FormLabel,
  Autocomplete,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useCookies } from "react-cookie";

const AddTellecallingDetails = ({
  show,
  editData,
  contactDataTele,
  onDashboardClick,
}) => {

  const initialFormData = {
    titleprefixID: "",
    Cid: "",
    CName: "",
    Mobile: "",
    AlternateMobileNo: "",
    TelephoneNo: null,
    Email: "",
    ProjectID: "",
    EstimatedbudgetID: "",
    leadstatusID: "",
    Comments: "",
    Location: "",
    FollowupThrough: "",
    NextFollowUpDate: null,
    NextFollowUpTime: getCurrentTime(),
    SourceID: "",
    SourceName: "",
    SourceDescription: "",
    TelecallAttendedByID: cookies?.amr?.UserID || 1,
    SmsNotification: 0,
    EmailNotification: 0,
    ModifyUID: 1,
    Tid: "",
    CreateUID: cookies?.amr?.UserID || 1,
    UnittypeID: "",
    Countrycode: "",
    Status: 1,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [titles, setTitles] = useState([]);
  const [errors, setErrors] = useState({});
  const [projectTypes, setProjectTypes] = useState([]);
  const [source, setSource] = useState([]);
  const [cNames, setCNames] = useState([]);
  const [selectedCid, setSelectedCid] = useState("");
  const [estimatedBudget, setEstimatedBudget] = useState([]);
  const [leadStatus, setLeadStatus] = useState([]);
  const [userMaster, setUserMaster] = useState([]);
  const [tellecallingID, setTellecallingID] = useState([]);
  const [bhkOptions, setBhkOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [cookies, setCookie] = useCookies(["amr"]);

  const [item, setItem] = useState(null);
  const [rowDataToUpdate, setRowDataToUpdate] = useState(null);

  useEffect(() => {
    fetchData();
    fetchDataBhk();
    // fetchDataTellecalling();
    fetchDataTitle();
  }, []);

  useEffect(() => {
    if (contactDataTele) {
      setFormData({
        ...contactDataTele,
        NextFollowUpDate: contactDataTele.NextFollowUpDate
          ? new Date(contactDataTele.NextFollowUpDate) 
          : null,
        NextFollowUpTime: contactDataTele.NextFollowUpTime || "",
        TelecallAttendedByID: cookies?.amr?.UserID || 1,
      });
    } else if (editData) {
      setFormData({
        ...editData,

        NextFollowUpDate: editData.NextFollowUpDate
          ? new Date(editData.NextFollowUpDate)
          : null,
        NextFollowUpTime: editData.NextFollowUpTime || "",
        TelecallAttendedByID: cookies?.amr?.UserID || 1,
      });
    }
  }, [contactDataTele, editData]);

  // Fetch source, estimated budget, lead status, and user master data (similar to your existing useEffects)

  useEffect(() => {
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-fetch-source.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setSource(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-fetch-cid.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setCNames(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://apiforcornershost.cubisysit.com/api/api-dropdown-estimatedbudget.php"
      )
      .then((response) => {
        if (response.data.status === "Success") {
          setEstimatedBudget(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-fetch-leadstatus.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setLeadStatus(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-fetch-usermaster.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setUserMaster(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const fetchDataBhk = async () => {
    try {
      const response = await axios.get(
        "https://apiforcornershost.cubisysit.com/api/api-fetch-unittype.php"
      );
      setBhkOptions(response.data.data || []);
    } catch (error) {
      console.error("Error fetching Bhk data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://apiforcornershost.cubisysit.com/api/api-dropdown-projectmaster.php"
      );
      setProjectTypes(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const fetchDataTitle = async () => {
    try {
      const response = await axios.get(
        "https://apiforcornershost.cubisysit.com/api/api-fetch-titleprefix.php"
      );
      setTitles(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleNotificationChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked ? 1 : 0,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Clear error for the field when it's being edited
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));

    // Update formData state based on the field name
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Handle specific formatting or validation logic if needed
    if (name === "Mobile" || name === "AlternateMobileNo") {
      const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: numericValue,
      }));
    }
  };

  const RequiredIndicator = () => {
    return <span style={{ color: "red", marginLeft: "5px" }}>*</span>;
  };

  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  useEffect(() => {
    // Set the default value to current time when the component mounts
    setFormData((prev) => ({
      ...prev,
      NextFollowUpTime: getCurrentTime(),
    }));
  }, []);

  const handleBhkChange = (event) => {
    setFormData({
      ...formData,
      UnittypeID: event.target.value,
    });
  };

  const handleEstimatedBudget = (event) => {
    setFormData({
      ...formData,
      EstimatedbudgetID: event.target.value,
    });
  };

  const handleTelecaller = (event) => {
    const { value } = event.target;

    setErrors((prevErrors) => ({
      ...prevErrors,
      TelecallAttendedByID: undefined,
    }));

    setFormData({
      ...formData,
      TelecallAttendedByID: value,
    });
  };

  const handleSource = (event) => {
    const { value } = event.target;

    setErrors((prevErrors) => ({
      ...prevErrors,
      SourceID: undefined,
    }));

    setFormData({
      ...formData,
      SourceID: value,
    });
  };

  const handleLeadStatus = (event) => {
    const { value } = event.target;

    setErrors((prevErrors) => ({
      ...prevErrors,
      leadstatusID: undefined,
    }));

    setFormData({
      ...formData,
      leadstatusID: value,
    });
  };
  const handleTitleChange = (event) => {
    setFormData({
      ...formData,
      titleprefixID: event.target.value,
    });
  };

  useEffect(() => {
    if (tellecallingID.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        Tid: parseInt(tellecallingID[0].Tid) || "",
      }));
    }
  }, [tellecallingID]);

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      
      "CName",
      "Mobile", 
      "Email",
      "ProjectID",
      "UnittypeID",
      "EstimatedbudgetID",
      "leadstatusID",
      "Location",
      "SourceID",
      "NextFollowUpDate",
      "Comments",
     
    ];
  
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });
  
    // Validate email format
    if (formData.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      newErrors.Email = "Invalid email address.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const isValid = validateForm();
    if (!isValid) {
      setLoading(false);
      return;
    }
  debugger;
    const url = editData
      ? "https://proxy-forcorners.vercel.app/api/proxy/api-update-telecalling.php"
      : "https://proxy-forcorners.vercel.app/api/proxy/api-insert-telecalling.php";
      debugger;
    const dataToSend = {
      ...formData,

      ModifyUID: cookies.amr?.UserID || 1,
      TelecallAttendedByID: cookies?.amr?.UserID || 1,
      titleprefixID: editData ? editData?.TitleID : contactDataTele?.TitleID,
    };

    console.log("Data to Send:", dataToSend);
debugger;
    try {
      const response = await axios.post(url, dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      if (response.data.status === "Success") {
        setFormData(initialFormData);
        setSubmitError(false);
        show(false);
        setErrors({});

        Swal.fire({
          icon: "success",
          title: editData
            ? "Data Updated Successfully"
            : "Data Added Successfully",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          window.location.reload();
        });
      } else {
        setSubmitError(true);
        Swal.fire({
          icon: "error",
          title: "Oopsii...",
          text: "Something went wrong!",
        });
        setLoading(false);
      }
    } catch (error) {
     
      setSubmitError(true);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Already In Telcalling OR Check The Fields  ",
      });
    
    }
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSubmitSuccess(false);
    setSubmitError(false);
  };
  const handleDateChange = (event) => {
    const date = event.target.value; // Get the value as a string (yyyy-mm-dd)
    console.log("date checking",date);
    setFormData({ ...formData, NextFollowUpDate: date });
  };
  
  

  return (
    <>
      <Card sx={{ height: "auto" }}>
        <CardContent>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="body2"
                sx={{ marginTop: 5, fontWeight: "bold", fontSize: 20 }}
              >
                {editData ? "Edit Lead Details" : "Add Lead Details"}
              </Typography>
              <Button
                variant="contained"
                onClick={onDashboardClick}
                style={{ marginTop: 0 }}
              >
                Dashboard
              </Button>
            </Box>
          </Grid>
          <form style={{ marginTop: "50px" }}>
            <Grid container spacing={7}>
              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  {editData ? (
                    <>
                      <InputLabel>
                        Title <RequiredIndicator />
                      </InputLabel>
                      <Select
                        value={
                          formData.titleprefixID ||
                          contactDataTele?.TitleID ||
                          ""
                        }
                        onChange={handleTitleChange}
                        label="Title"
                      >
                        {titles.map((title) => (
                          <MenuItem key={title.TitleID} value={title.TitleID}>
                            {title.TitleName}
                          </MenuItem>
                        ))}
                      </Select>
                    </>
                  ) : (
                    <Box
                      sx={{
                        padding: "16px",
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        color: "rgba(0, 0, 0, 0.87)",
                      }}
                    >
                      {contactDataTele?.TitleName || "No Code"}
                    </Box>
                  )}
                  {errors.titleprefixID && (
                    <Typography variant="caption" color="error">
                      {errors.titleprefixID}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  {editData ? (
                    // Display full name as a non-editable text when in edit mode
                    <Box
                      sx={{
                        padding: "16px",
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        color: "rgba(0, 0, 0, 0.87)",
                      }}
                    >
                      {contactDataTele?.CName || formData.CName || "No Name"}
                    </Box>
                  ) : (
                    // Optionally, you can provide a default message if not in edit mode
                    <Box
                      sx={{
                        padding: "16px",
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        color: "rgba(0, 0, 0, 0.87)",
                      }}
                    >
                      {contactDataTele?.CName || "No Name"}
                    </Box>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  {editData ? (
                    // Editable text field when in edit mode
                    <TextField
                      fullWidth
                      label={
                        <>
                          Country Code <RequiredIndicator />
                        </>
                      }
                      type="tel"
                      name="Countrycode"
                      value={
                        formData.Countrycode ||
                        contactDataTele?.CountryCode ||
                        ""
                      }
                      onChange={handleChange}
                      inputProps={{
                        pattern: "[0-9]*",
                      }}
                    />
                  ) : (
                    // Display country code as non-editable text when not in edit mode
                    <Box
                      sx={{
                        padding: "16px",
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        color: "rgba(0, 0, 0, 0.87)",
                      }}
                    >
                      {contactDataTele?.CountryCode || "No Code"}
                    </Box>
                  )}
                  {errors.Countrycode && (
                    <Typography variant="caption" color="error">
                      {errors.Countrycode}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="Mobile"
                  name="Mobile"
                  value={formData.Mobile || ""}
                  onChange={handleChange}
                  inputProps={{
                    pattern: "[0-9]*",
                 
                  }}
                  error={!!errors.Mobile}
    helperText={errors.Mobile || ""}
                />
                {/* Add error handling for Mobile if needed */}
              </Grid>

           

              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  {editData ? (
                    <TextField
                      fullWidth
                      label="Alternate Mobile Number"
                      name="AlternateMobileNo"
                      value={
                        formData.AlternateMobileNo !== undefined
                          ? formData.AlternateMobileNo
                          : contactDataTele?.OtherNumbers || ""
                      }
                      onChange={handleChange}
                      inputProps={{
                        pattern: "[0-9]*",
                        maxLength: 10,
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        padding: "16px",
                        border: "1px solid #ced4da",
                        borderRadius: "4px",
                        color: "rgba(0, 0, 0, 0.87)",
                      }}
                    >
                      {contactDataTele?.OtherNumbers ||
                        "No Alternate Mobile Number"}
                    </Box>
                  )}
                  {errors.AlternateMobileNo && (
                    <Typography variant="caption" color="error">
                      {errors.AlternateMobileNo}
                    </Typography>
                  )}
                </FormControl>
              </Grid>


              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="Email"
                  name="Email"
                  value={formData.Email || ""}
                  onChange={handleChange}
                  error={!!errors.Email}
    helperText={errors.Email || ""}
                />
                {/* Add error handling for Email if needed */}
              </Grid>

            

              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>
                    Project Name <RequiredIndicator />
                  </InputLabel>
                  <Select
                    value={formData.ProjectID}
                    name="ProjectID"
                    onChange={handleChange}
                    error={!!errors.ProjectID}
    helperText={errors.ProjectID || ""}
                    label={<>Project Name</>}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {projectTypes.map((project) => (
                      <MenuItem
                        key={project.ProjectID}
                        value={project.ProjectID}
                      >
                        {project.ProjectName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.ProjectID && (
                    <Typography variant="caption" color="error">
                      {errors.ProjectID}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>
                    Unit Type <RequiredIndicator />
                  </InputLabel>
                  <Select
                    value={formData.UnittypeID}
                    onChange={handleBhkChange}
                    error={!!errors.UnittypeID}
    helperText={errors.UnittypeID || ""}
                    label={
                      <>
                        Unit Type <RequiredIndicator />
                      </>
                    }
                  >
                    {bhkOptions.map((bhk) => (
                      <MenuItem key={bhk.UnittypeID} value={bhk.UnittypeID}>
                        {bhk.UnittypeName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.UnittypeID && (
                    <Typography variant="caption" color="error">
                      {errors.ProjectID}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Estimated Budget</InputLabel>
                  <Select
                    value={formData.EstimatedbudgetID}
                    onChange={handleEstimatedBudget}
                    error={!!errors.EstimatedbudgetID}
    helperText={errors.EstimatedbudgetID || ""}
                    label={
                      <>
                        Estimated Budget <RequiredIndicator />
                      </>
                    }
                  >
                    {estimatedBudget.map((bhk) => (
                      <MenuItem
                        key={bhk.EstimatedbudgetID}
                        value={bhk.EstimatedbudgetID}
                      >
                        {bhk.EstimatedbudgetName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.EstimatedbudgetID && (
                    <Typography variant="caption" color="error">
                      {errors.EstimatedbudgetID}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>
                    Lead Status <RequiredIndicator />
                  </InputLabel>
                  <Select
                    value={formData.leadstatusID}
                    onChange={handleLeadStatus}
                    error={!!errors.leadstatusID}
    helperText={errors.leadstatusID || ""}
                    label={
                      <>
                        Lead Status <RequiredIndicator />
                      </>
                    }
                  >
                    {leadStatus.map((project) => (
                      <MenuItem
                        key={project.leadstatusID}
                        value={project.leadstatusID}
                      >
                        {project.leadstatusName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.leadstatusID && (
                    <Typography variant="caption" color="error">
                      {errors.leadstatusID}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label={
                    <>
                      Location <RequiredIndicator />
                    </>
                  }
                  name="Location"
                  placeholder="Location"
                  value={
                    formData.Location ||
                    (contactDataTele ? contactDataTele.Location : "")
                  }
                  onChange={handleChange}
                  error={!!errors.Location}
                  helperText={errors.Location || ""}
                />
              </Grid>
              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>
                    Source <RequiredIndicator />
                  </InputLabel>
                  <Select
                    value={formData.SourceID}
                    onChange={handleSource}
                    
                    label="Source"
                    error={!!errors.SourceID}
                    helperText={errors.SourceID || ""}
                  >
                    {source.map((bhk) => (
                      <MenuItem key={bhk.SourceID} value={bhk.SourceID}>
                        {bhk.SourceName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.SourceID && (
                    <Typography variant="caption" color="error">
                      {errors.SourceID}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

         

              <Grid item xs={8} sm={4}>
             
                  
                
              <TextField
  fullWidth
  onChange={handleDateChange}
  type="date"
  className="form-control"
  value={formData.NextFollowUpDate}
  error={!!errors.NextFollowUpDate}
  helperText={errors.NextFollowUpDate || ""}
  label={
    <>
      Next follow up-date <RequiredIndicator />
    </>
  }
  variant="outlined"
  InputLabelProps={{ shrink: true }}
  showMonthDropdown
  showYearDropdown
  yearDropdownItemNumber={15} // Number of years to show in dropdown
  scrollableYearDropdown
/>

              
              </Grid>
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label={
                    <>
                      Next Follow Up-Time <RequiredIndicator />
                    </>
                  }
                  type="time"
                  name="NextFollowUpTime"
                  value={formData.NextFollowUpTime}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300, // 5 minute intervals
                  }}
                />
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="Comments"
                  name="Comments"
                  value={formData.Comments || ""}
                  onChange={handleChange}
                  error={!!errors.Comments}
                  helperText={errors.Comments || ""}
                />
              </Grid>

              <Grid item xs={8} sm={4}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    Notification Preferences
                  </FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.SmsNotification === 1}
                          onChange={handleNotificationChange}
                          name="SmsNotification"
                          value="sms"
                        />
                      }
                      label="Send on SMS"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.Notification === 1}
                          onChange={handleNotificationChange}
                          name="Notification"
                          value="notification"
                        />
                      }
                      label="Send on Notification"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
              <Button
        variant="contained"
        sx={{
          marginRight: 3.5,
          marginTop: 5,
          backgroundColor: "#9155FD",
          color: "#FFFFFF",
        }}
        onClick={handleSubmit}
        disabled={loading} 
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: "#fff" }} />
        ) : (
          "Submit"
        )}
      </Button>
              </Grid>
            </Grid>
          </form>

          <Snackbar
            open={submitSuccess}
            autoHideDuration={6000}
            onClose={handleAlertClose}
          >
            <MuiAlert
              onClose={handleAlertClose}
              severity="success"
              sx={{
                width: "100%",
                backgroundColor: "green",
                color: "#ffffff",
              }}
            >
              {editData
                ? "Data Updated Successfully"
                : submitSuccess
                ? "Data Added Successfully"
                : ""}
            </MuiAlert>
          </Snackbar>

          <Snackbar
            open={submitError}
            autoHideDuration={6000}
            onClose={handleAlertClose}
          >
            <MuiAlert
              onClose={handleAlertClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              {submitError.message}
            </MuiAlert>
          </Snackbar>
        </CardContent>
      </Card>
    </>
  );
};

export default AddTellecallingDetails;
