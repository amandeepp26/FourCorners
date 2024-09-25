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
import axios from "axios";
import { PrinterPosCheck } from "mdi-material-ui";
import "react-datepicker/dist/react-datepicker.css";
import Card from '@mui/material/Card';

const AddCustomerDetails = ({ onSubmitSuccess }) => {
  // const classes = useStyles();
    const [companyName, setCompanyName] = useState("");
    const [CityID, setCityID] = useState("");
    const [StateID, setStateID] = useState("");
    const [FundsArrangement, setFundsArrangement] = useState("");

    const [selectedDate, setSelectedDate] = useState(null);
    const [remarks, setRemarks] = useState("");
    const [selectedRemarks, setSelectedRemarks] = useState(null);
    const [errors, setErrors] = useState({});
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [selectedCityId, setSelectedCityId] = useState("");
    const [selectedStateId, setSelectedStateId] = useState("");

    const [mobileNum, setMobileNum] = useState("");
    const [partyName, setPartyName] = useState("");
    const [memberName, setMemberName] = useState("");
    const [address, setAddress] = useState("");
    const [location, setLocation] = useState("");
    const [compnayLocation, setCompanyLocation] = useState("");
    const [pincode, setPincode] = useState("");
    const [commpincode, setCommPincode] = useState("");

    const [email, setEmail] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [cMobile, setCMobile] = useState("");

    const [commAddress, setCommAddress] = useState("");
    const [dob, setDob] = useState("");
    const [marriageDate, setMarriageDate] = useState("");
    const [titleId, setTitleId] = useState("");
    const [dom, setDom] = useState("");
    const [memberCode, setMemberCode] = useState("");
    const [panNo, setPanNo] = useState("");
    const [directorNo, setDirectorNo] = useState("");
    const [selectedCommCity, setSelectedCommCity] = useState("");
    const [selectedCommCityId, setSelectedCommCityId] = useState("");
    const [selectedCommState, setSelectedCommState] = useState("");
    const [selectedCommStateId, setSelectedCommStateId] = useState("");

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

  const handleCommCityChange = (event) => {
    const selectedCommCityName = event.target.value;
    setSelectedCommCity(selectedCommCityName);

    // Find the CityID based on the selected CityName
    const selectedCommCityObject = cities.find(
      (city) => city.CityName === selectedCommCityName
    );
    if (selectedCommCityObject) {
      setSelectedCommCityId(selectedCommCityObject.CityID);
    }
  };
  const handleTitleChange = (event) => setTitleId(event.target.value);

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

  const handleCommStateChange = (event) => {
    const selectedCommStateName = event.target.value;
    setSelectedCommState(selectedCommStateName);

    const selectedCommStateObject = states.find(
      (state) => state.StateName === selectedCommStateName
    );
    if (selectedCommStateObject) {
      setSelectedCommStateId(selectedCommStateObject.StateID);
    }
  };




  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      setErrors((prevErrors) => ({ ...prevErrors, date: "" }));
    }
  };

  const handleDateChangeMarriage = (date) => {
    setMarriageDate(date);
    if (date) {
      setErrors((prevErrors) => ({ ...prevErrors, date: "" }));
    }
  };
  const handleDateChangeDob = (date) => {
    setDob(date);
    if (date) {
      setErrors((prevErrors) => ({ ...prevErrors, date: "" }));
    }
  };

  const handleMobileNoChange = (event) => {
    setMobileNum(event.target.value);
  };

  const handlePartyNameChange = (event) => {
    setPartyName(event.target.value);
    if (event.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, PartyName: "" }));
    }
  };
  const handleMemberName = (event) => {
    setMemberName(event.target.value);
    if (event.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, MemberName: "" }));
    }
  };

  const handleAddress = (event) => {
    const value = event.target.value;
    setAddress(value);
  };

  const handleLocation = (event) => {
    const value = event.target.value;
    setLocation(value);
  };

  const handleFundsArrangement = (event) => {
    setFundsArrangement(event.target.value);
  };
 


  const handlePincode = (event) => {
    setPincode(event.target.value);
  };

  const handleCommPincode = (event) => {
    setCommPincode(event.target.value);
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleCmobileNo = (event) => {
    setCMobile(event.target.value);
  };

  const handlePhoneNo = (event) => {
    setPhoneNo(event.target.value);
  };

  const handleCommAddress = (event) => {
    setCommAddress(event.target.value);
  };



  const handleCLocation = (event) => {
    setCompanyLocation(event.target.value);
  };



  const handleDOM = (event) => {
    setDom(event.target.value);
  };

  const handleReferenceMemberCode = (event) => {
    setMemberCode(event.target.value);
  };

  const handlePANNo = (event) => {
    setPanNo(event.target.value);
  };

  const handleDirectorPANNo = (event) => {
    setDirectorNo(event.target.value);
  };

  const handleRemarks = (event) => {
    setRemarks(event.target.value);
  };

  const handleStateChange = (event) => {
    const selectedStateName = event.target.value;
    setSelectedState(selectedStateName);

    // Find the StateID based on the selected StateName
    const selectedStateObject = states.find(
      (state) => state.StateName === selectedStateName
    );
    if (selectedStateObject) {
      setSelectedStateId(selectedStateObject.StateID);
    }
  };



  const resetForm = () => {
    setTitleId('');
    setMobileNum('');
    setPartyName('');
    setMemberName('');
    setAddress('');
    setLocation('');
    setPincode('');
    setEmail('');
    setPhoneNo('');
    setCommAddress('');
    setCompanyLocation('');
    setDom('');
    setMemberCode('');
    setPanNo('');
    setDirectorNo('');
    setFundsArrangement('');
    setRemarks('');
    // setDob(null);
    // selectedDate(null);
    // setMarriageDate(null);
    setSelectedCity('');
    setSelectedState('');
    setSelectedCommCity('');
    setSelectedCommState('');
    setSelectedCityId('');
    setSelectedStateId('');
    setSelectedCommCityId('');
    setSelectedCommStateId('');
  };


  // const handleSubmit = () => {
  //   const newErrors = valiRemarksFields();
  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //   } else {
  //     setErrors({});

  //   }
  // };

  const handleSubmit = (event) => {
    console.log("presss");
    event.preventDefault();

    const formData = {
      RegisterDate :selectedDate,
      TitleID:titleId,
      MobileNo:mobileNum,
      PartyName:partyName,
      MemberName:memberName,
      Address:address,
      Pincode:pincode,
      Email:email,
      PhoneNo:phoneNo,
      CommAddress: commAddress,
      Location:location,
      DOM:dom,
      ReferenceMemberCode:memberCode,
      PANNo:panNo,
      DirectorPANNo:directorNo,
      FundsArrangement:FundsArrangement,
      Remarks:remarks,
      DOB:dob,
      CountryID:1,
      StateID: selectedStateId,
      CStateID:selectedCommStateId,
      CityID:selectedCityId,
      CCityID:  selectedCommCityId,
      CCountryID:1,
      CMobileNo:cMobile,
      CLocation:compnayLocation,
      CPincode:commpincode



      
    };

    console.log(formData, "ALL DATAAAAAAA of company master");

    console.log(formData, "ALL DATAAAAAAA");

    axios
      .post(
        "https://proxy-forcorners.vercel.app/api/proxy/api-insert-customermaster.php",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.status === "Success") {
          setSubmitSuccess(true);
          resetForm()
          onSubmitSuccess();
          

          console.log("SUBMMITEDDD DATAAAA master");
        } else {
          setSubmitSuccess(false);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setSubmitSuccess(false);
      });
  };

  return (
    <Card>
      <CardContent>
        <form>
          <Grid container spacing={7}>
            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ marginTop: 5, fontWeight: "bold", fontSize: 20 }}
                >
                  Manage Company Details
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={8} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Title</InputLabel>
                <Select
                  value={titleId}
                  onChange={handleTitleChange}
                  label="Title"
                >
                  <MenuItem value="1">Master</MenuItem>
                  <MenuItem value="2">Miss</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Mobile No"
                placeholder="Mobile No"
                value={mobileNum}
                onChange={handleMobileNoChange}
                error={!!errors.MobileNo}
                helperText={errors.MobileNo}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Party Name"
                placeholder="Party Name"
                value={partyName}
                onChange={handlePartyNameChange}
                error={!!errors.PartyName}
                helperText={errors.PartyName}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Member Name"
                placeholder="Member name"
                value={memberName}
                onChange={handleMemberName}
                error={!!errors.MemberName}
                helperText={errors.MemberName}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Address"
                placeholder="Address"
                value={address}
                onChange={handleAddress}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Location"
                placeholder="Location"
                value={location}
                onChange={handleLocation}
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
              <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <Select label="State" defaultValue="India">
                  <MenuItem value="India">India</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Pincode"
                placeholder="Pincode"
                value={pincode}
                onChange={handlePincode}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Communitcation Pincode"
                placeholder="Communitcation Pincode"
                value={commpincode}
                onChange={handleCommPincode}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Email"
                placeholder="Email"
                value={email}
                onChange={handleEmail}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Phone No"
                placeholder="Phone No"
                value={phoneNo}
                onChange={handlePhoneNo}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="CMobile No"
                placeholder="CMobile No"
                value={cMobile}
                onChange={handleCmobileNo}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Communication Address"
                placeholder="Communication Address"
                value={commAddress}
                onChange={handleCommAddress}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Communication Location"
                placeholder="Communication Location"
                value={compnayLocation}
                onChange={handleCLocation}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Communication City</InputLabel>
                <Select
                  label="Communication City"
                  value={selectedCommCity}
                  onChange={handleCommCityChange}
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
                <InputLabel>Communication State</InputLabel>
                <Select
                  label="Communication State"
                  value={selectedCommState}
                  onChange={handleCommStateChange}
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
                label="DOM"
                placeholder="DOM"
                value={dom}
                onChange={handleDOM}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Reference Member Code "
                placeholder="Reference Member Code"
                value={memberCode}
                onChange={handleReferenceMemberCode}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="PAN No"
                placeholder="PAN No"
                value={panNo}
                onChange={handlePANNo}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Director PAN No"
                placeholder="Director PAN No"
                value={directorNo}
                onChange={handleDirectorPANNo}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Funds Arrangement"
                placeholder="Funds Arrangement"
                value={FundsArrangement}
                onChange={handleFundsArrangement}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Remarks"
                placeholder="Remarks"
                value={remarks}
                onChange={handleRemarks}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <DatePicker
                selected={dob}
                onChange={handleDateChangeDob}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                customInput={
                  <TextField
                    fullWidth
                    label="DOB"
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

            <Grid item xs={8} sm={4}>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                customInput={
                  <TextField
                    fullWidth
                    label="Registered Date"
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

            <Grid item xs={8} sm={4}>
              <DatePicker
                selected={marriageDate}
                onChange={handleDateChangeMarriage}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                customInput={
                  <TextField
                    fullWidth
                    label="Marriage Date"
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
              <Button
                variant="contained"
                sx={{ marginRight: 3.5 }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCustomerDetails;
