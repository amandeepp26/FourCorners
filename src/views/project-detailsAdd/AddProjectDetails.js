// ** React Imports
import { useEffect, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import AlertTitle from "@mui/material/AlertTitle";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";


const AddProjectDetails = ({show}) => {
  // const classes = useStyles();
  const [projectName, setProjectName] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  const [companyCode, setCompanyCode] = useState("");

  const [companyAddress, setCompanyAddress] = useState("");
  const [registeredAddress, setRegisteredAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [managerName, setManagerName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [gstinNumber, setGstinNumber] = useState("");
  const [remarks, setRemarks] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedProject, setSelectedProject] = useState('');
  const [plotArea, setplotarea] = useState('');
  const [ctsNo, setCtsNumber] = useState('');
  const [propertyTax, setProperty] = useState('');
  const [reraRegistration, setRera] = useState('');
  const [ReraDate, setRearDate] = useState('');
  const [broucherLink, setBroucher] = useState('');
  const [message, setMessage] = useState('');
  const [Status, setstatus] = useState('');
  const [uom, setUom] = useState('');

  




  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://apiforcorners.cubisysit.com/api/api-fetch-projectmaster.php');
      console.log('API Response:', response.data);
      setRows(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
      setLoading(false);
    }
  };



  const handleChangePlot = (event) => {
    setplotarea(event.target.value);
  };

  const handleCtsNumber = (event) => {
    setCtsNumber(event.target.value);
   
  };

  const handlePropertyTaxChange = (event) => {
    setProperty(event.target.value);
   
  };
  const handleReraNumber = (event) => {
    setRera(event.target.value);
   
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      setErrors((prevErrors) => ({ ...prevErrors, date: "" }));
    }
  };



  const handleBroucherLinkChange = (event) => {
    setBroucher(event.target.value);
   
  };


  const handleMesage = (event) => {
    const value = event.target.value;
   
    setMessage(value);
  };

  const handleUom = (event) => {
    const value = event.target.value;
    setUom(value);
  };
  const handleChange = (event) => {
    setSelectedProject(event.target.value);
  };



  const validateFields = () => {
    const newErrors = {};

    if (!selectedCompany) {
      newErrors.companyName = "Company Name is required";
    }
    if (!projectName) {
      newErrors.projectName = "Project Name is required";
    }
    if (!companyCode) {
      newErrors.companyCode = "Project Code is required";
    }
  
    if (!registeredAddress) {
      newErrors.registeredAddress = "Project Address is required";
    }
    if (!selectedDate) {
      newErrors.date = "Date is required";
    }
    if (!price) {
      newErrors.price = "Bookin from price is required";
    }
    if (!pincode) {
      newErrors.pincode = "Pincode is required";
    }
    if (!selectedCity) {
      newErrors.pincode = "City is required";
    }
    if (!selectedState) {
      newErrors.pincode = "State is required";
    }
    return newErrors;
  };

  

  const handleSubmitData = (event) => {
    console.log("presss");
    // event.preventDefault();
    // const newErrors = validateFields();
    // if (Object.keys(newErrors).length > 0) {
    //   setErrors(newErrors);
    // } else {
    //   setErrors({});


      const body = {
        ProjectID: selectedProject,
        UOM: uom,
        PlotArea: plotArea,
        CTSNo: ctsNo,
        PropertyTaxNo: propertyTax,
        RERARegistrationNo:reraRegistration,
        RERARegistrationDate:selectedDate,
        BrochureLink:broucherLink,
        WelcomeMessage:message
      };

      console.log(body, "ALL DATAAAAAAA PROJECTT DETAIL");

      axios
        .post(
          "https://apiforcorners.cubisysit.com/api/api-insert-projectdetails.php",
          body,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.data.status === "Success") {
            setSubmitSuccess(true);
            setSubmitError(false);
            show(false);
            setProjectName("");
            setCompanyCode("");
            setCompanyAddress("");
            setRegisteredAddress("");
            setPincode("");
            setPhone("");
            setMobilePhone("");
            setManagerName("");
            setPrice("");
            setLocation("");
            setGstinNumber("");
            setRemarks("");
            setSelectedDate(null);
            setSelectedCompany("");
            setSelectedCity("");
            setSelectedState("");
            setSelectedCityId("");
            setSelectedStateId("");

            console.log("BHAAIII DATAAAA");
          } else {
            setSubmitSuccess(false);
            setSubmitError(true);
          }
        })
        .catch((error) => {
          console.error("There was an error!", error);
          setSubmitSuccess(false);
          setSubmitError(true);
        });
    // }
  };

  return (
    <CardContent>
    <form>
      <Grid container spacing={7}>
        <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
          <Box>
            <Typography variant='body2' sx={{ marginTop: 5, fontWeight: 'bold', fontSize: 20 }}>
              Manage Project Details 
            </Typography>
          </Box>
        </Grid>

        
        <Grid item xs={8} sm={4}>
        <FormControl fullWidth>
          <InputLabel>Project Name</InputLabel>
          <Select
            value={selectedProject}
            onChange={handleChange}
            label="Project Name"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {rows.map((project) => (
              <MenuItem key={project.ProjectID} value={project.ProjectID}>
                {project.ProjectName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>



        <Grid item xs={8} sm={4}>
          <TextField
            fullWidth
            label='Plot Area'
            placeholder='Plot Area'
            value={plotArea}
            onChange={handleChangePlot}
          
            // error={!!errors.companyCode}
            // helperText={errors.companyCode}
          />
        </Grid>


        <Grid item xs={8} sm={4}>
          <TextField
            fullWidth
            type='text'
            label='CTS No'
            placeholder='CTS No'
            value={ctsNo}
            onChange={handleCtsNumber}
          
            // error={!!errors.companyAddress}
            // helperText={errors.companyAddress}
          />
        </Grid>


        <Grid item xs={8} sm={4}>
          <TextField
            fullWidth
            type='text'
            label='Property Tax No'
            placeholder='Property Tax No'
            value={propertyTax}
            onChange={handlePropertyTaxChange}
            name = 'property-tax'
            error={!!errors.registeredAddress}
            helperText={errors.registeredAddress}
          />
        </Grid>
       
        <Grid item xs={8} sm={4}>
          <TextField
            fullWidth
            type='text'
            label='RERA Registration No'
            placeholder='RERA Registration No'
            value={reraRegistration}
            onChange={handleReraNumber}

            error={!!errors.pincode}
            helperText={errors.pincode}
          />
        </Grid>


        <Grid item xs={8} sm={4}>
          <TextField
            fullWidth
            type='text'
            label='UOM'
            placeholder='UOM'
            value={uom}
            onChange={handleUom}
           
          />
        </Grid>


        <Grid item xs={8} sm={4}>
          <TextField
            fullWidth
            type='url'
            label='Broucher Link'
            placeholder='Broucher Link'
            value={broucherLink}
            onChange={handleBroucherLinkChange}

          
          />
        </Grid>
        <Grid item xs={8} sm={4}>
          <TextField
            fullWidth
            type='text'
            label='Welcome Message'
            placeholder='Welcome Message'
            value={message}
            onChange={handleMesage}
          
          />
        </Grid>
    
        <Grid item xs={8} sm={4}>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              customInput={
                <TextField
                  fullWidth
                  label="Start Date"
                  error={!!errors.date}
                  helperText={errors.date}
                  InputProps={{
                    readOnly: true,
                    sx: { width: "100%" },
                  }}
                />
              }
            />
          </Grid>

        <Grid item xs={12}>
          <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={handleSubmitData}>
            Submit
          </Button>
      
        </Grid>
      </Grid>
    </form>
  </CardContent>

  );
};

export default AddProjectDetails;
