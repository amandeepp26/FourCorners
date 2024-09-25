// ** React Imports
import { useEffect, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import axios from "axios";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button, FormControl, InputLabel } from "@mui/material";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Card from '@mui/material/Card';
import { useCookies } from "react-cookie";

const AddProjectFinanceApproval = ({ show }) => {
  const [nameoffinancialinstitution, setNameofFinacialInstitution] =
    useState("");
  const [branch, setBranch] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [code, setCode] = useState("");
  const [city, setCity] = useState("");
  const [rows, setRows] = useState([]);

  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState("");
  const [contactperson, setContactPerson] = useState("");
  const [alternatecontactperson, setAlternateContactPerson] = useState("");
  const [telephoneno, setTelephoneNo] = useState("");
  const [alternatetelephoneno, setAlternateTelephoneNo] = useState("");
  const [mobileno, setMobileNo] = useState("");
  const [alternatemobileno, setAlternateMobileNo] = useState("");
  const [emailid, setEmailId] = useState("");
  const [projectname, setProjectName] = useState("");
  const [projectapprovalno, setProjectApprovalNo] = useState("");
  const [approvaldate, setApprovalDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [states, setStates] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-fetch-citymaster.php")
      .then((response) => {
        if (response.data.status === "Success") {
          console.log(response.data.data, "DATAA AAGAYAAAAAAAAAA");
          setCities(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-fetch-statemaster.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setStates(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://apiforcornershost.cubisysit.com/api/api-fetch-projectmaster.php"
      );
      console.log("API Response:", response.data);
      setRows(response.data.data || []);
    //   setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    //   setError(error);
    //   setLoading(false);
    }
  };



  const validateFields = () => {
    const newErrors = {};
    if (!nameoffinancialinstitution) {
      newErrors.nameoffinancialinstitution = "Financial Institute is required";
    }
    if (!branch) {
      newErrors.branch = "Branch is required";
    }
    if (!address) {
      newErrors.address = "Address is required";
    }
    if (!location) {
      newErrors.location = "Location is required";
    }
    if (!city) {
      newErrors.city = "City is required";
    }
    if (!state) {
      newErrors.state = "State is required";
    }
    if (!country) {
      newErrors.country = "Country is required";
    }
    if (!pincode) {
      newErrors.pincode = "Pincode is required";
    }
    if (!contactperson) {
      newErrors.contactperson = "Contact Person is required";
    }
    if (!alternatecontactperson) {
      newErrors.alternatecontactperson = "Alternate Contact Person is required";
    }
    if (!telephoneno) {
      newErrors.telephoneno = "Telephone No is required";
    }
    if (!alternatetelephoneno) {
      newErrors.alternatetelephoneno = "Alternate Telephone No is required";
    }
    if (!mobileno) {
      newErrors.mobileno = "Mobile No is required";
    }
    if (!alternatemobileno) {
      newErrors.alternatemobileno = "Alternate Mobile No is required";
    }
    if (!emailid) {
      newErrors.emailid = "Email ID is required";
    }
    if (!projectname) {
      newErrors.projectname = "Project Name is required";
    }
    if (!projectapprovalno) {
      newErrors.projectapprovalno = "Project Approval No is required";
    }
    if (!approvaldate) {
      newErrors.approvaldate = "Approval date is required";
    }
    if (!remarks) {
      newErrors.remarks = "Remarks is required";
    }
    return newErrors;
  };

  const handleChange = (event) => {
    const projectId = event.target.value;
    const selectedProj = rows.find(
      (project) => project.ProjectID === projectId
    );
    setSelectedProject(projectId);
    setProjectName(selectedProj ? selectedProj.ProjectName : "");
  };

  const handleCityChange = (event) => {
    const selectedCityName = event.target.value;
    setSelectedCity(selectedCityName);

    // Find the CityID based on the selected CityName
    const selectedCityObject = cities.find(
      (city) => city.CityName === selectedCityName
    );
    if (selectedCityObject) {
      setSelectedCityId(selectedCityObject.CityID);
    }
  };

  const handleStateChange = (event) => {
    const selectedStateName = event.target.value;
    setSelectedState(selectedStateName);
    const selectedStateObject = states.find(
      (state) => state.StateName === selectedStateName
    );
    if (selectedStateObject) {
      setSelectedStateId(selectedStateObject.StateID);
    }
  };

   const [cookies, setCookie, removeCookie] = useCookies(["amr"]);

  const handleSubmit = (event) => {
    event.preventDefault();
   

      const formData = {
        CreateUID: cookies.amr?.UserID || 1,
        NameOfFinancialInstitution: nameoffinancialinstitution,
        Branch: branch,
        Address: address,
        Location: location,
        City: city,
        State: state,
        Country: country,
        Pincode: pincode,
        ContactPerson: contactperson,
        AlternateContactPerson: alternatecontactperson,
        TelephoneNo: telephoneno,
        AlternateTelephoneNo: alternatetelephoneno,
        MobileNo: mobileno,
        AlternateMobileNo: alternatemobileno,
        EmailID: emailid,
        ProjectName: projectname,
        ProjectApprovalNo: projectapprovalno,
        ApprovalDate: approvaldate,
        Remarks: remarks,
        createid: 1,
      };

   
      axios
        .post(
          "https://proxy-forcorners.vercel.app/api/proxy/api-insert-projectfinanceapprovals.php",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.data.status === "Success") {
            // setSubmitSuccess(true);
            show(false);
            setNameofFinacialInstitution("");
            setBranch("");
            setAddress("");
            setLocation("");
            setCity("");
            setState("");
            setCountry("");
            setPincode("");
            setContactPerson("");
            setAlternateContactPerson("");
            setTelephoneNo("");
            setAlternateTelephoneNo("");
            setMobileNo("");
            setAlternateMobileNo("");
            setEmailId("");
            setProjectName("");
            setProjectApprovalNo("");
            setApprovalDate("");
            setRemarks("");

            console.log("SUBMITTED DATA");
          } else {
            // setSubmitSuccess(false);
          }
        })
        .catch((error) => {
          console.error("There was an error!", error);
        //   setSubmitSuccess(false);
        });

  };

  const handleDateChange = date => {
    setApprovalDate(date)
    if (date) {
      setErrors((prevErrors) => ({ ...prevErrors, date: '' }));
    }
  }

  return (

 <Card>
    <CardContent>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box>
              <Typography
                variant="body2"
                sx={{ marginTop: 5, fontWeight: "bold", fontSize: 20 }}
              >
                Finance Company Details
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={8} sm={4}>
            <TextField
              fullWidth
              type="text"
              label="Name Of Financial Institution"
              placeholder="Name Of Financial Institution"
              value={nameoffinancialinstitution}
              onChange={(e) => setNameofFinacialInstitution(e.target.value)}
              error={!!errors.nameoffinancialinstitution}
              helperText={errors.nameoffinancialinstitution}
            />
          </Grid>
          <Grid item xs={8} sm={4}>
            <TextField
              fullWidth
              type="text"
              label="Branch"
              placeholder="Branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              error={!!errors.branch}
              helperText={errors.branch}
            />
          </Grid>
          <Grid item xs={8} sm={4}>
            <TextField
              fullWidth
              type="text"
              label="Address"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              error={!!errors.address}
              helperText={errors.address}
            />
          </Grid>
          <Grid item xs={8} sm={4}>
            <TextField
              fullWidth
              type="text"
              label="Location"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              error={!!errors.location}
              helperText={errors.location}
            />
          </Grid>
          <Grid item xs={8} sm={4}>
            <FormControl fullWidth>
              <InputLabel>City</InputLabel>
              <Select
                label="City"
                value={selectedCity}
                onChange={handleCityChange}
              >
                {cities.map((city) => (
                  <MenuItem key={city.CityID} value={city.CityName}>
                    {city.CityName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={8} sm={4}>
            <FormControl fullWidth>
              <InputLabel>State</InputLabel>
              <Select
                label="State"
                value={selectedState}
                onChange={handleStateChange}
              >
                {states.map((state) => (
                  <MenuItem key={state.StateID} value={state.StateName}>
                    {state.StateName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={8} sm={4}>
            <TextField
              fullWidth
              type="text"
              label="Country"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              error={!!errors.country}
              helperText={errors.country}
            />
          </Grid>
          <Grid item xs={8} sm={4}>
            <TextField
              fullWidth
              type="text"
              label="Pincode"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              error={!!errors.pincode}
              helperText={errors.pincode}
            />
          </Grid>

          <Grid item xs={8} sm={4}>
            <TextField
              fullWidth
              type="text"
              label="Contact Person"
              placeholder="Contact Person"
              value={contactperson}
              onChange={(e) => setContactPerson(e.target.value)}
              error={!!errors.contactperson}
              helperText={errors.contactperson}
            />
          </Grid>

          <Grid item xs={8} sm={4}>
            <TextField
              fullWidth
              type="text"
              label="Alternate Contact Person"
              placeholder="Alternate Contact Person"
              value={alternatecontactperson}
              onChange={(e) => setAlternateContactPerson(e.target.value)}
              error={!!errors.alternatecontactperson}
              helperText={errors.alternatecontactperson}
            />
          </Grid>
          <Grid item xs={8} sm={4}>
            <TextField
              fullWidth
              type="text"
              label="Telephone No"
              placeholder="Telephone No"
              value={telephoneno}
              onChange={(e) => setTelephoneNo(e.target.value)}
              error={!!errors.telephoneno}
              helperText={errors.telephoneno}
            />
          </Grid>
          <Grid item xs={8} sm={4}>
            <TextField
              fullWidth
              type="text"
              label="Alternate Telephone No"
              placeholder="Alternate Telephone No"
              value={alternatetelephoneno}
              onChange={(e) => setAlternateTelephoneNo(e.target.value)}
              error={!!errors.alternatetelephoneno}
              helperText={errors.alternatetelephoneno}
            />
          </Grid>
          <Grid item xs={8} sm={4}>
            <TextField
              fullWidth
              type="text"
              label="Mobile No"
              placeholder="Mobile No"
              value={mobileno}
              onChange={(e) => setMobileNo(e.target.value)}
              error={!!errors.mobileno}
              helperText={errors.mobileno}
            />
          </Grid>
          <Grid item xs={8} sm={4}>
            <TextField
              fullWidth
              type="text"
              label="Alternate Mobile No"
              placeholder="Alternate Mobile No"
              value={alternatemobileno}
              onChange={(e) => setAlternateMobileNo(e.target.value)}
              error={!!errors.alternatemobileno}
              helperText={errors.alternatemobileno}
            />
          </Grid>
          <Grid item xs={8} sm={4}>
            <TextField
              fullWidth
              type="text"
              label="EmailID"
              placeholder="EmailID"
              value={emailid}
              onChange={(e) => setEmailId(e.target.value)}
              error={!!errors.emailid}
              helperText={errors.emailid}
            />
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
              type="text"
              label="Project Approval No"
              placeholder="Project Approval No"
              value={projectapprovalno}
              onChange={(e) => setProjectApprovalNo(e.target.value)}
              error={!!errors.projectapprovalno}
              helperText={errors.projectapprovalno}
            />
          </Grid>
          <Grid item xs={8} sm={4}>
            <DatePicker
              selected={approvaldate}
              onChange={handleDateChange}
              dateFormat='yyyy-MM-dd'
              className='form-control'
            
              customInput={
                <TextField
                  fullWidth
                  label='Approval Date'
                  error={!!errors.date}
              helperText={errors.date}
                  InputProps={{
                    readOnly: true,
                    sx: { width: '100%' }
                  }}
                />
              }
            />
          </Grid>
          <Grid item xs={8} sm={4}>
            <TextField
              fullWidth
              type="text"
              label="Remarks"
              placeholder="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              error={!!errors.remarks}
              helperText={errors.remarks}
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
    </Card>
  );
};

export default AddProjectFinanceApproval;
