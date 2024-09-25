// ** React Imports
import { useEffect, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
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
import Card from "@mui/material/Card";

const AddChannelPartner = ({ show }) => {
  const [date, setDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [VoucherTypename, setVoucherTypename] = useState("");
  const [nameOfCompany, setNameOfCompany] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [subProject, setSubProject] = useState("");
  const [carParkingType, setCarParkingType] = useState("");
  const [manualParkingNumber, setManualParkingNumber] = useState("");
  const [parkingLevel, setParkingLevel] = useState("");
  const [comments, setComments] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [ParticularsofAdditionalChargesname, setParticularsofAdditionalChargesname] = useState("");
  const [IncludeInPaymentSchedulename, setIncludeInPaymentSchedulename] = useState("");
  const [TypeofAdditionalChargesname, setTypeofAdditionalChargesname] = useState("");
  const [RatePerUoMnamee, setRatePerUoMname] = useState("");
  const [UnitTypename, setUnitTypename] = useState("");
  const [UnitTypeAmountname, setUnitTypeAmountname] = useState("");
  const [FixedAmountname, setFixedAmountname] = useState("");
  const [SaleAreaname, setSaleAreaname] = useState("");
  const [NoofMonthsname, setNoofMonthsname] = useState("");

  const [VendorName, setVendorName] = useState("");
  const [Groupname, setGroupName] = useState("");
  const [ContactPersonname, setContactPersonname] = useState("");
  const [MobileNoname, setMobileNoname] = useState("");
  const [EmailIdName, setEmailIdname] = useState("");
  const [Locationname, setLocationname] = useState("");
  const [Cityname, setCityname] = useState("");
  const [Statename, setStatename] = useState("");
  const [PincodeName, setPincodeName] = useState("");
  const [UpdateBrokerDetailsname, setUpdateBrokerDetailsName] = useState("");
  const [CompanyStatusname, setCompanyStatusname] = useState("");
  const [CompanyTypename, setCompanyTypename] = useState("");
  const [TDSCategoryname, setTDSCategoryname] = useState("");
  const [PANNoname, setPANNoname] = useState("");
  const [AadharCardNo, setAadharCardNo] = useState("");
  const [GSTTypenumber, setGSTTypenumber] = useState("");
  const [GSTINNo, setGSTINNo] = useState("");
  const [VendorRERARegistrationNumber, setVendorRERARegistrationNumber] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [companyStatus, setCompanyStatus] = useState([]);
  const [selectedCompanyStatus, setSelectedCompanyStatus] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://apiforcornershost.cubisysit.com/api/api-fetch-subprojectdetails.php"
      );
      console.log("API Response:", response.data);
      setRows(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };

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
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-fetch-companystatus.php")
      .then((response) => {
        if (response.data.status === "Success") {
          console.log(response.data.data , 'dataa aayaaaa');
          setCompanyStatus(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

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


  const handleCompanyStatusChange = (event) => {
    setSelectedCompanyStatus(event.target.value);
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

  const handleSubmitData = async (event) => {
    event.preventDefault();

    const body = {
        nameofcompany:nameOfCompany,
      vendorname: VendorName,
      date: date,
      groupname: Groupname,
      contactperson: ContactPersonname,
      mobileno: MobileNoname,
      emailid: EmailIdName,
      location: Locationname,
      city: selectedCityId,
      state: selectedStateId,
      pincode: PincodeName,
      updatebrokerdetails: UpdateBrokerDetailsname,
      companystatus: selectedCompanyStatus,
      companytype: CompanyTypename,
      tdscategory: TDSCategoryname,
      panno: PANNoname,
      aadharcardno: AadharCardNo,
      gsttype: GSTTypenumber,
      gstinno: GSTINNo,
      vendorreraregistrationnumber: VendorRERARegistrationNumber
    };

    try {
      const response = await axios.post(
        "https://proxy-forcorners.vercel.app/api/proxy/api-insert-chanelpartner.php",
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "Success") {
        setSubmitSuccess(true);
        setSubmitError(false);
        show(false);
        // Clear form fields
        setDate(null);
        setProjectName("");
        setNameOfCompany("");
        setProjectCode("");
        setSubProject("");
        setCarParkingType("");
        setManualParkingNumber("");
        setParkingLevel("");
        setComments("");
      } else {
        setSubmitSuccess(false);
        setSubmitError(true);
      }
    } catch (error) {
      console.error("There was an error!", error);
      setSubmitSuccess(false);
      setSubmitError(true);
    }
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
                  Manage Channel Partner Details
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Name of Company"
                placeholder="Name of Company"
                value={nameOfCompany}
                onChange={(e) => setNameOfCompany(e.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Vendor Name"
                placeholder="Vendor Name"
                value={VendorName}
                onChange={(e) => setVendorName(e.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Group Name"
                placeholder="Group Name"
                value={Groupname}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Mobile No."
                placeholder="Mobile No."
                value={MobileNoname}
                onChange={(e) => setMobileNoname(e.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Email Id"
                placeholder="Email Id"
                value={EmailIdName}
                onChange={(a) => setEmailIdname(a.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Contact Person"
                placeholder="Contact Person"
                value={ContactPersonname}
                onChange={(e) => setContactPersonname(e.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Location"
                placeholder="Location"
                value={Locationname}
                onChange={(a) => setLocationname(a.target.value)}
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
                label="Pincode"
                placeholder="Pincode"
                value={PincodeName}
                onChange={(a) => setPincodeName(a.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Update Broker Details"
                placeholder="Update Broker Details"
                value={UpdateBrokerDetailsname}
                onChange={(a) => setUpdateBrokerDetailsName(a.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
      <FormControl fullWidth>
        <InputLabel>Company Status</InputLabel>
        <Select
          label="Company Status"
          value={selectedCompanyStatus}
          onChange={handleCompanyStatusChange}
        >
          {companyStatus.map((status) => (
            <MenuItem key={status.CompanyStatusID} value={status.CompanyStatusID}>
              {status.CompanyStatusName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid> 


            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Company Type"
                placeholder="Company Type"
                value={CompanyTypename}
                onChange={(a) => setCompanyTypename(a.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="TDS Category"
                placeholder="TDS Category"
                value={TDSCategoryname}
                onChange={(a) => setTDSCategoryname(a.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Aadhar Card No"
                placeholder="Aadhar Card No"
                value={AadharCardNo}
                onChange={(e) => setAadharCardNo(e.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="PAN No."
                placeholder="PAN No."
                value={PANNoname}
                onChange={(e) => setPANNoname(e.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="GST Type"
                placeholder="GST Type"
                value={GSTTypenumber}
                onChange={(a) => setGSTTypenumber(a.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="GSTIN No."
                placeholder="GSTIN No."
                value={GSTINNo}
                onChange={(a) => setGSTINNo(a.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Vendor RERA Registration Number"
                placeholder="Vendor RERA Registration Number"
                value={VendorRERARegistrationNumber}
                onChange={(a) => setVendorRERARegistrationNumber(a.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                sx={{ marginRight: 3.5 }}
                onClick={handleSubmitData}
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

export default AddChannelPartner;
