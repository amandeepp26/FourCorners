// ** React Imports
import { useEffect, useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import axios from 'axios';
import Card from '@mui/material/Card';
import { useCookies } from 'react-cookie';
const UpdateCompanyMaster = ({ show, rowData }) => {
  const id = rowData?.CompanyID
  const [companyData, setCompanyData] = useState(null);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState('');
  const [selectedStateId, setSelectedStateId] = useState('');
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    companyCode: '',
    companyAddress: '',
    registeredAddress: '',
    selectedCity: '',
    selectedState: '',
    country: 'India',
    pincode: '',
    phone: '',
    mobilePhone: '',
    email: '',
    price: '',
    panIt: '',
    gstinNumber: '',
    tanNumber: '',
    vatTinNumber: '',
    cstTinNumber: '',
    serviceTax: '',
    cessNumber: '',
    cinNumber: '',
    remarks: '',
    selectedDate: '',
  });

  useEffect(() => {
    axios.get('https://apiforcornershost.cubisysit.com/api/api-fetch-citymaster.php')
      .then(response => {
        if (response.data.status === 'Success') {
          setCities(response.data.data);
        }
      })
      .catch(error => {
        console.error('Error fetching cities:', error);
      });

    axios.get('https://apiforcornershost.cubisysit.com/api/api-fetch-statemaster.php')
      .then(response => {
        if (response.data.status === 'Success') {
          setStates(response.data.data);
        }
      })
      .catch(error => {
        console.error('Error fetching states:', error);
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyId = rowData?.CompanyID;
        const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-singel-companymaster.php?CompanyID=${companyId}`;

        const response = await axios.get(apiUrl);
        if (response.data.status === 'Success') {
          debugger;
          const company = response.data.data[0];
          setCompanyData(company);
          setFormData({
            companyName: company.CompanyName,
            companyCode: company.CompanyCode,
            companyAddress: company.CommAddress,
            registeredAddress: company.RegisteredAddress,
            selectedCity: company.CityID, // Assuming you fetch city and state data separately
            selectedState: company.StateID, // Assuming you fetch city and state data separately
            pincode: company.Pincode,
            phone: company.PhoneNo,
            mobilePhone: company.MobileNo,
            email: company.Email,
            price: company.BookBeginingFrom,
            panIt: company.PanITNo,
            gstinNumber: company.GSTINNo,
            tanNumber: company.TANNo,
            vatTinNumber: company.VATTINNo,
            cstTinNumber: company.CSTTINNo,
            serviceTax: company.ServiceTaxNo,
            cessNumber: company.CessNo,
            cinNumber: company.CINNo,
            remarks: company.Remarks,
            selectedDate: new Date(company.ERPLiveDate).toISOString().split('T')[0],
          });
          debugger;
          getCityData(company.StateID);
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };
    if (rowData) {
      fetchData();
    }
  }, [rowData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCityChange = (event) => {
    const selectedCityName = event.target.value;
    setFormData({
      ...formData,
      selectedCity: selectedCityName,
    });

    const selectedCityObject = cities.find(city => city.CityName === selectedCityName);
    if (selectedCityObject) {
      setSelectedCityId(selectedCityObject.CityID);
    }
  };

  const handleStateChange = (event) => {
    const selectedStateName = event.target.value;
    setFormData({
      ...formData,
      selectedState: selectedStateName,
      
    });

    const selectedStateObject = states.find(state => state.StateName === selectedStateName);
    debugger;
    if (selectedStateObject) {
      setSelectedStateId(selectedStateObject.StateID);
      getCityData(selectedStateObject.StateID);

    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (!formData.companyName) {
      newErrors.companyName = 'Company Name is required';
    }
    if (!formData.companyCode) {
      newErrors.companyCode = 'Company Code is required';
    }
    if (!formData.companyAddress) {
      newErrors.companyAddress = 'Company Address is required';
    }
    if (!formData.registeredAddress) {
      newErrors.registeredAddress = 'Registered Address is required';
    }
    if (!formData.selectedDate) {
      newErrors.selectedDate = 'ERP Live Date is required';
    }
    if (!formData.price) {
      newErrors.price = 'Book Beginning From is required';
    }
    if (!formData.pincode) {
      newErrors.pincode = 'Pincode is required';
    }
    return newErrors;
  };

  const getCityData = (stateID) => {
    debugger;
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-singel-citymaster.php?StateID= " + stateID)
      .then((response) => {
        // debugger;
        if (response.data.status === "Success") {
          debugger;
          console.log(response.data.data, "DATAA AAGAYAAAAAAAAAA");
          setCities(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const [cookies, setCookie, removeCookie] = useCookies(["amr"]);
  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});

      const submitData = {
        CreateUID: cookies.amr?.UserID || 1,
        CompanyName: formData.companyName,
        CompanyCode: formData.companyCode,
        CommAddress: formData.companyAddress,
        CityID: formData.selectedCity,
        StateID: formData.selectedState,
        CountryID: 1,
        Pincode: formData.pincode,
        PhoneNo: formData.phone,
        MobileNo: formData.mobilePhone,
        Email: formData.email,
        RegisteredAddress: formData.registeredAddress,
        ERPLiveDate: formData.selectedDate,
        BookBeginingFrom: formData.price,
        PanITNo: formData.panIt,
        GSTINNo: formData.gstinNumber,
        TANNo: formData.tanNumber,
        VATTINNo: formData.vatTinNumber,
        CSTTINNo: formData.cstTinNumber,
        ServiceTaxNo: formData.serviceTax,
        CessNo: formData.cessNumber,
        CINNo: formData.cinNumber,
        Status: 1,
        CompanyStatusID: 1,
        Remarks: formData.remarks,
        CompanyID:id
      };
    //  debugger;
      console.log(submitData, 'ALL DATAAAAAAA');

      axios.post('https://proxy-forcorners.vercel.app/api/proxy/api-update-companymaster.php', submitData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (response.data.status === 'Success') {
            console.log("UPDATEDDDDD");
            setSubmitSuccess(true);
            show('list');
            setFormData({
              companyName: '',
              companyCode: '',
              companyAddress: '',
              registeredAddress: '',
              selectedCity: '',
              selectedState: '',
              country: 'India',
              pincode: '',
              phone: '',
              mobilePhone: '',
              email: '',
              price: '',
              panIt: '',
              gstinNumber: '',
              tanNumber: '',
              vatTinNumber: '',
              cstTinNumber: '',
              serviceTax: '',
              cessNumber: '',
              cinNumber: '',
              remarks: '',
              selectedDate: '',
            });
          } else {
            setSubmitSuccess(false);
          }
        })
        .catch(error => {
          console.error('There was an error!', error);
          setSubmitSuccess(false);
        });
    }
  };

  return (

    <Card>
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box>
              <Typography variant='body2' sx={{ marginTop: 5, fontWeight: 'bold', fontSize: 20 }}>
                Edit Company Details
              </Typography>
            </Box>
          </Grid>

          {companyData && (
            <>
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label='Company Name'
                  placeholder='Company Name'
                  value={formData.companyName}
                  onChange={handleInputChange}
                  name="companyName"
                  error={!!errors.companyName}
                  helperText={errors.companyName}
                />
              </Grid>
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label='Company Code'
                  placeholder='Company Code'
                  value={formData.companyCode}
                  onChange={handleInputChange}
                  name="companyCode"
                  error={!!errors.companyCode}
                  helperText={errors.companyCode}
                />
              </Grid>
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label='Company Address'
                  placeholder='Company Address'
                  value={formData.companyAddress}
                  onChange={handleInputChange}
                  name="companyAddress"
                  error={!!errors.companyAddress}
                  helperText={errors.companyAddress}
                />
              </Grid>
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label='Registered Address'
                  placeholder='Registered Address'
                  value={formData.registeredAddress}
                  onChange={handleInputChange}
                  name="registeredAddress"
                  error={!!errors.registeredAddress}
                  helperText={errors.registeredAddress}
                />
              </Grid>

              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <Select
                    value={formData.selectedState}
                    onChange={handleStateChange}
                    name="selectedState"
                    label='State'
                  >
                    {states.map(state => (
                      <MenuItem key={state.StateID} value={state.StateID}>
                        {state.StateName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>City</InputLabel>
                  <Select
                    value={formData.selectedCity}
                    onChange={handleCityChange}
                    name="selectedCity"
                    label='City'
                  >
                    {cities.map(city => (
                      <MenuItem key={city.CityID} value={city.CityID}>
                        {city.CityName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
        
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label='Pincode'
                  placeholder='Pincode'
                  value={formData.pincode}
                  onChange={handleInputChange}
                  name="pincode"
                  error={!!errors.pincode}
                  helperText={errors.pincode}
                />
              </Grid>
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label='Phone'
                  placeholder='Phone'
                  value={formData.phone}
                  onChange={handleInputChange}
                  name="phone"
                />
              </Grid>
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label='Mobile Phone'
                  placeholder='Mobile Phone'
                  value={formData.mobilePhone}
                  onChange={handleInputChange}
                  name="mobilePhone"
                />
              </Grid>
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label='Email'
                  placeholder='Email'
                  value={formData.email}
                  onChange={handleInputChange}
                  name="email"
                />
              </Grid>
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label='Book Beginning From'
                  placeholder='Book Beginning From'
                  value={formData.price}
                  onChange={handleInputChange}
                  name="price"
                  error={!!errors.price}
                  helperText={errors.price}
                />
              </Grid>
              {/* <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label='Pan IT'
                  placeholder='Pan IT'
                  value={formData.panIt}
                  onChange={handleInputChange}
                  name="panIt"
                />
              </Grid>
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label='GSTIN Number'
                  placeholder='GSTIN Number'
                  value={formData.gstinNumber}
                  onChange={handleInputChange}
                  name="gstinNumber"
                />
              </Grid>
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label='TAN Number'
                  placeholder='TAN Number'
                  value={formData.tanNumber}
                  onChange={handleInputChange}
                  name="tanNumber"
                />
              </Grid>
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label='VAT TIN Number'
                  placeholder='VAT TIN Number'
                  value={formData.vatTinNumber}
                  onChange={handleInputChange}
                  name="vatTinNumber"
                />
              </Grid>
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label='CST TIN Number'
                  placeholder='CST TIN Number'
                  value={formData.cstTinNumber}
                  onChange={handleInputChange}
                  name="cstTinNumber"
                />
              </Grid>
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label='Service Tax'
                  placeholder='Service Tax'
                  value={formData.serviceTax}
                  onChange={handleInputChange}
                  name="serviceTax"
                />
              </Grid>
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label='Cess Number'
                  placeholder='Cess Number'
                  value={formData.cessNumber}
                  onChange={handleInputChange}
                  name="cessNumber"
                />
              </Grid>
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label='CIN Number'
                  placeholder='CIN Number'
                  value={formData.cinNumber}
                  onChange={handleInputChange}
                  name="cinNumber"
                />
              </Grid> */}
          
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  type="date"
                  label='ERP Live Date'
                  placeholder='ERP Live Date'
                  value={formData.selectedDate}
                  onChange={handleInputChange}
                  name="selectedDate"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!errors.selectedDate}
                  helperText={errors.selectedDate}
                />
              </Grid>

              <Grid item xs={24} sm={14}>
                <TextField
                  fullWidth
                  label='Remarks'
                  placeholder='Remarks'
                  value={formData.remarks}
                  onChange={handleInputChange}
                  name="remarks"
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Button variant='contained' color='primary' onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
    </Card>
  );
};

export default UpdateCompanyMaster;
