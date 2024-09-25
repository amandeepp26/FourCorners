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
import EditIcon from '@mui/icons-material/Edit';
import GetAppIcon from '@mui/icons-material/GetApp';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Card from "@mui/material/Card";
import Swal from 'sweetalert2';
import {
  Snackbar,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useCookies } from "react-cookie";


 
const AddContact = ({ show, editData  , onDashboardClick}) => {
  const [cookies, setCookie] = useCookies(["amr"]);
  console.log(editData, 'Edit data aaya contact ka');


  const initialFormData = {
    TitleID: "",
    CName:"",
    CustomerTypeID:"",
    ContactTypeID: "",
    CountryCodeID:"",
    Mobile: "",
    OtherNumbers: "",
    Email: "",
    CityID:"",
    LocationID:"",
    PinCode:"",
    KeyWordID:1,
    SourceID:"",
    SourceTypeID: "",
    UserID: cookies.amr?.UserID || 1 ,
    Status:1,
    CreateUID:1,
    Cid:"",
    ModifyUID: 1,

    
  };


  
  const [rows, setRows] = useState([]);
  const [localities, setLocalities] = useState([]);


  const [contactTypes, setContactTypes] = useState([]);
  const [countryCodes, setCountryCodes] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [sourceTypes, setSourceTypes] = useState([]);
  const [dynamicSourceID, setDynamicSourceID] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [titles, setTitles] = useState([]);
  // const [errors, setErrors] = useState({});
  const [projectTypes, setProjectTypes] = useState([]);
  const [customerType, setCustomerType] = useState([]);
  const requiredFields = ['TitleID', 'CName', 'CustomerTypeID', 'ContactTypeID', 'CountryCodeID', 'Mobile', 'Email', 'CityID', 'LocationID', 'PinCode', 'SourceID', 'SourceTypeID', 'UserID'];
  const [errors, setErrors] = useState({});
  
  
  const [source, setSource] = useState([]);
  const [estimatedBudget, setEstimatedBudget] = useState([]);
  const [leadStatus, setLeadStatus] = useState([]);
  const [userMaster, setUserMaster] = useState([]);
  const [tellecallingID, setTellecallingID] = useState([]);
  const [bhkOptions, setBhkOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    fetchData();
    fetchDataBhk();
  
    fetchDataTitle();
  }, []);

  useEffect(() => {
    if (editData) {
      // Destructure editData to access necessary properties
      const { TitleID, CName, CustomerTypeID, ContactTypeID, CountryCodeID, Mobile, OtherNumbers, Email, CityID, LocationID, PinCode, SourceID, SourceTypeID, UserID, Status, CreateUID, Cid, ModifyUID } = editData;
  
      // Set the form data using editData values
      setFormData({
        TitleID: TitleID || "",
        CName: CName || "",
        CustomerTypeID: CustomerTypeID || "",
        ContactTypeID: ContactTypeID || "",
        CountryCodeID: CountryCodeID || "",
        Mobile: Mobile || "",
        OtherNumbers: OtherNumbers || "",
        Email: Email || "",
        CityID: CityID || "",
        LocationID: LocationID || "", 
        PinCode: PinCode || "",
        SourceID: SourceID || "",
        UserID:  CreateUID || 1, 
        Status: Status || 1,
        CreateUID: CreateUID || 1,
        Cid: Cid || "",
        ModifyUID: ModifyUID || 1,
       
      });
  
      if (CustomerTypeID) {
        fetchContactTypes(CustomerTypeID);
      }
  
      
      if (SourceID) {
        setDynamicSourceID(SourceID);
      }
    }
  }, [editData]);
  

  useEffect(() => {
    fetchDataCustomerType();
    // fetchCountryCodes();
  }, []);

  const fetchDataCustomerType = async () => {
    try {
      const response = await axios.get(
        "https://apiforcornershost.cubisysit.com/api/api-fetch-customertype.php"
      );
      if (response.data.status === "Success") {
        setCustomerType(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchContactTypes = async (customerTypeID) => {
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-contacttype.php?CustomerTypeID=${customerTypeID}`
      );
      if (response.data.status === "Success") {
        setContactTypes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };



  useEffect(() => {
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-fetch-countrycode.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setCountryCodes(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching country codes:", error);
      });
  }, []);
  

  useEffect(() => {
    axios.get("https://apiforcornershost.cubisysit.com/api/api-fetch-citymaster.php")
      .then(response => {
        if (response.data.status === "Success") {
          setCities(response.data.data);
        }
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);



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


  useEffect(() => {
    fetchId();
  }, []);

  const fetchId = async () => {
    try {
      const response = await axios.get(
        "https://apiforcornershost.cubisysit.com/api/api-fetch-contacts.php"
      );
      console.log("API Response:", response.data);
      setRows(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      // setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.CityID) {
      axios
        .get(
          "https://apiforcornershost.cubisysit.com/api/api-fetch-locationmaster.php",
          {
            params: { CityID: formData.CityID },
          }
        )
        .then((response) => {
          if (response.data.status === "Success") {
            setLocalities(response.data.data);
          }
        })
        .catch((error) => console.error("Error fetching localities:", error));
    } else {
      setLocalities([]);
    }
  }, [formData.CityID]);

  useEffect(() => {
    if (dynamicSourceID) {
      axios.get(`https://apiforcornershost.cubisysit.com/api/api-fetch-sourcetype.php?SourceID=${dynamicSourceID}`)
        .then((response) => {
          if (response.data.status === "Success") {
            console.log(response.data.data , 'Source name');
            setSourceTypes(response.data.data);
          } else {
            console.error("Failed to fetch source types:", response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error fetching source types:", error);
        });
    }
  }, [dynamicSourceID]);


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
    const value = event.target.value === "sms" ? 1 : 0;
    setFormData({
      ...formData,
      SmsNotification: value,
      EmailNotification: value === 1 ? 0 : 1,
    });
  };
  

  const handleChange = (event) => {
    const { name, value } = event.target;
  
    // Clear the error for the current field when user starts typing
    setErrors({
      ...errors,
      [name]: "", // Clearing the error for the current field
    });
  
    // Handle numeric input formatting or other specific input manipulations
    if (["Mobile", "OtherNumbers", "TelephoneNo", "AlternateTelephoneNo", "Countrycode", "PinCode"].includes(name)) {
      const numericValue = value.replace(/\D/g, "");
      setFormData({
        ...formData,
        [name]: numericValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  
    // Handle specific state updates based on input changes (e.g., dynamic source types)
    if (name === 'SourceID') {
      setDynamicSourceID(value);
    }
  };
  
  

  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  useEffect(() => {
    // Set the default value to current time when the component mounts
    setFormData((prev) => ({
      ...prev,
      NextFollowUpTime: getCurrentTime(),
    }));
  }, []);


  const handleContactType = (event) => {
    const contactTypeID = event.target.value;

  setErrors((prevErrors) => ({
      ...prevErrors,
      ContactTypeID: undefined,
    }));

    setFormData({
      ...formData,
      ContactTypeID: contactTypeID,
    });
  };

  const handleCustomerType = (event) => {
    const customerTypeID = event.target.value;

    
    setErrors((prevErrors) => ({
      ...prevErrors,
      CustomerTypeID: undefined,
    }));
    setFormData({
      ...formData,
      CustomerTypeID: customerTypeID,
      ContactTypeID: "", // Reset Contact Type when Customer Type changes
    });
    fetchContactTypes(customerTypeID);
  };



  const handleNavigation = () => {
    setShowDashboard(true);
  };


  const handleLeadStatus = (event) => {
    setFormData({
      ...formData,
      leadstatusID: event.target.value,
    });
  };

  const handleTitleChange = (event) => {
    const { value } = event.target;


    setErrors((prevErrors) => ({
      ...prevErrors,
      TitleID: undefined,
    }));
    setFormData({
      ...formData,
      TitleID: value,
    });
  };

  useEffect(() => {
    if (rows.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        Cid: parseInt(rows[0].Cid) || "",
      }));
    }
  }, [rows]);

  const validateForm = (data) => {
    const errors = {};
    if (!data.TitleID) {
      errors.TitleID = "Title is required";
    }
    if (!data.CName) {
      errors.CName = "Customer Name is required";
    }
    if (!data.CustomerTypeID) {
      errors.CustomerTypeID = "Customer Type is required";
    }
    if (!data.ContactTypeID) {
      errors.ContactTypeID = "Contact Type is required";
    }
    if (!data.CountryCodeID) {
      errors.CountryCodeID = "Country Code is required";
    }
    if (!data.Mobile) {
      errors.Mobile = "Mobile is required";
    }else if (data.Mobile.length < 10) {
      errors.Mobile = "Mobile number must be 10 digits";
    }
    if (!data.Email) {
      errors.Email = "Email is required";
    }
    if (!data.CityID) {
      errors.CityID = "City is required";
    }
    if (!data.LocationID) {
      errors.LocationID = "Location is required";
    }
    if (!data.PinCode) {
      errors.PinCode = "Pin Code is required";
    }
    if (!data.SourceID) {
      errors.SourceID = "Source is required";
    }

    return errors;
  };


const handleSubmit = async (event) => {

  
    event.preventDefault();
    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log(formData , 'hehehe');
  
    // Prepare API URL based on editData flag
    const url = editData
      ? "https://proxy-forcorners.vercel.app/api/proxy/api-update-contacts.php"
      : "https://proxy-forcorners.vercel.app/api/proxy/api-insert-contacts.php";
  



      const dataToSend = editData
      ? formData
      : {
          ...formData,
          CreateUID: cookies.amr?.UserID || 1, 
        };


    try {
      const response = await axios.post(url, dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.data.status === "Success") {
        setFormData(initialFormData); // Reset form data after successful submission
        setErrors({});
        setSubmitSuccess(true);
        setSubmitError(false);
        show(false); // Hide the modal or close form
  
        Swal.fire({
          icon: "success",
          title: editData ? "Data Updated Successfully" : "Data Added Successfully",
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
          text: 'Something went wrong!',
        });
      }
    } catch (error) {
      console.error("There was an error!", error);
      setSubmitSuccess(false);
      setSubmitError(true);
  
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Mobile Number is already Exits!',
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
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      NextFollowUpDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days ahead
    }));
  }, []);


  const RequiredIndicator = () => {
    return (
      <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
    );
  };
  const handleCountryCode = (event) => {

       setErrors((prevErrors) => ({
      ...prevErrors,
      CountryCodeID: undefined,
    }));
    setFormData({
      ...formData,
      CountryCodeID: event.target.value,
    });
  };

  const handleCityChange = (event) => {
    setFormData({
      ...formData,
      CityID: event.target.value,
    });
  };
  

  const handleTelecaller = (event) => {

    const { value } = event.target;

    setErrors((prevErrors) => ({
      ...prevErrors,
      UserID: undefined,
    }));

    setFormData({
      ...formData,
      UserID: event.target.value,
    });
  };


  return (
    <>




    <Card sx={{ height:"auto" }}>
   
      <CardContent>
        <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>


          <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          variant="body2"
          sx={{ fontWeight: 'bold', fontSize: 20 }}
        >
          {editData
                ? "Edit Contact Details"
                : "Add Contact Details"}
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
                <InputLabel>Title <RequiredIndicator /></InputLabel>
                <Select
                  value={formData.TitleID}
                  onChange={handleTitleChange}
                  label="Title"
                  error={!!errors.TitleID}
                  helperText={errors.TitleID}
              
                >
                  {titles.map((title) => (
                    <MenuItem key={title.TitleID} value={title.TitleID}>
                      {title.TitleName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>


            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label={
                  <>
                    Full Name <RequiredIndicator />
                  </>
                }
                type="text"
                name="CName"
                value={formData.CName}
                onChange={handleChange}
                error={!!errors.CName}
                helperText={errors.CName}
            
              
              />
            </Grid>

     
      <Grid item xs={8} sm={4}>
        <FormControl fullWidth>
          <InputLabel>Customer Type <RequiredIndicator /></InputLabel>
          <Select
            value={formData.CustomerTypeID}
            onChange={handleCustomerType}
            label="Customer Type"
            error={!!errors.CustomerTypeID}
            helperText={errors.CustomerTypeID}
          >
            {customerType.map((type) => (
              <MenuItem key={type.CustomerTypeID} value={type.CustomerTypeID}>
                {type.CustomerTypeName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={8} sm={4}>
        <FormControl fullWidth>
          <InputLabel>Contact Type <RequiredIndicator /></InputLabel>
          <Select
            value={formData.ContactTypeID}
            onChange={handleContactType}
            label="Contact Type"
            error={!!errors.ContactTypeID}
            helperText={errors.ContactTypeID}
          >
            {contactTypes.map((type) => (
              <MenuItem key={type.ContactTypeID} value={type.ContactTypeID}>
                {type.ContactName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={8} sm={4}>
  <FormControl fullWidth>
    <InputLabel>Country Code <RequiredIndicator /></InputLabel>
    <Select
      value={formData.CountryCodeID}
      onChange={handleCountryCode}
      label="Country Code"
      name="CountryCodeID"
      error={!!errors.CountryCodeID}
      helperText={errors.CountryCodeID}
    >
      {countryCodes.map((country) => (
        <MenuItem key={country.CountryCode} value={country.CountryCode}>
          {country.CountryName}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>


            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label={
                  <>
                    Mobile <RequiredIndicator />
                  </>
                }
                type="tel"
                name="Mobile"
                value={formData.Mobile}
                onChange={handleChange}
                error={!!errors.Mobile}
                helperText={errors.Mobile}
                inputProps={{
                  pattern: "[0-9]*",
                  maxLength: 10
                }}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                type="tel"
                name="OtherNumbers"
                label="Alternate Mobile Number"
                placeholder="Alternate Mobile Number"
                value={formData.OtherNumbers}
                
                onChange={handleChange}
                inputProps={{
                  pattern: "[0-9]*",
                 maxLength: 10

                }}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label={
                  <>
                    Email <RequiredIndicator />
                  </>
                }
                name="Email"
                placeholder="E-Mail"
                value={formData.Email}
                error={!!errors.Email}
                helperText={errors.Email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={8} md={4}>
                <FormControl fullWidth>
                  <InputLabel>City <RequiredIndicator /></InputLabel>
                  <Select name="CityID"          error={!!errors.CityID}
            helperText={errors.CityID} value={formData.CityID} label='City' onChange={handleCityChange}>
                    {cities.map((city) => (
                      <MenuItem key={city.CityID} value={city.CityID}>
                        {city.CityName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.city && <Alert severity="error">{errors.city}</Alert>}
                </FormControl>
              </Grid>

       
              <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Locality</InputLabel>
                <Select
                  name="LocationID"
                  label="Location"
                  value={formData.LocationID}
                  onChange={handleChange}
                >
                  {localities.map((locality) => (
                    <MenuItem
                      key={locality.LocationID}
                      value={locality.LocationID}
                    >
                      {locality.LocationName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={8} sm={4}>
  <TextField
    fullWidth
    label={
      <>
        Pincode <RequiredIndicator />
      </>
    }
    name="PinCode"
    placeholder="Pincode"
    value={formData.PinCode}
    error={!!errors.PinCode}
    helperText={errors.PinCode}
    onChange={handleChange}
    inputProps={{
      pattern: "[0-9]*",
    }}
  />
</Grid>


        {/* Other form elements */}
        <Grid item xs={8} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Source <RequiredIndicator /></InputLabel>
            <Select
                     error={!!errors.SourceID}
                     helperText={errors.SourceID}
              value={formData.SourceID}
              name="SourceID"
              onChange={handleChange}
              label="Source"
            >
              {source.map((source) => (
                <MenuItem key={source.SourceID} value={source.SourceID}>
                  {source.SourceName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* <Grid item xs={8} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Source Type <RequiredIndicator /></InputLabel>
            <Select
              value={formData.SourceTypeID} // Assuming SourceName is the selected source type
              name="SourceTypeID"
              error={!!errors.SourceTypeID}
              helperText={errors.SourceTypeID}
              onChange={handleChange}
              label="Source Type"
            >
              {sourceTypes.map((sourceType) => (
                <MenuItem key={sourceType.SourceTypeID} value={sourceType.SourceTypeID}>
                  {sourceType.SourceTypename}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid> */}
        
        {/* Other form elements */}
  
      

            {/* <Grid item xs={8} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Telecall Attended By <RequiredIndicator /></InputLabel>
                <Select
                  value={formData.UserID}
                  onChange={handleTelecaller}
                  label="TelecallAttendedBy"
                  error={!!errors.UserID}
                  helperText={errors.UserID}
                >
                  {userMaster.map((bhk) => (
                    <MenuItem key={bhk.UserID} value={bhk.UserID}>
                      {bhk.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}

   
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
              >
                Submit
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

export default AddContact;
