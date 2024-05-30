
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Typography,
  Alert,
  AlertTitle,
} from '@mui/material';
import CardActions from '@mui/material/CardActions'; // Importing CardActions
import { DatePicker } from 'react-datepicker'; // Ensure you have installed react-datepicker
import 'react-datepicker/dist/react-datepicker.css'; // Include CSS for DatePicker

const Addsubprojectdetails = () => {
  const [companies, setCompanies] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [plotArea, setPlotArea] = useState('');
  const [projectId, setProjectId] = useState('');
  const [totalCarParking, setTotalCarParking] = useState('');
  const [defaultCarParkingsPerUnit, setDefaultCarParkingsPerUnit] = useState('');
  const [HSNCodeInstallmentLetter, setHSNCodeInstallmentLetter] = useState('');
  const [taxCodeInstallmentLetter, setTaxCodeInstallmentLetter] = useState('');
  const [loadingPercent, setLoadingPercent] = useState('');
  const [floorsDescription, setFloorsDescription] = useState('');
  const [separateAgreementsConstructionLand, setSeparateAgreementsConstructionLand] = useState('');
  const [salesGoLiveDate, setSalesGoLiveDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [gstinNumber, setGstinNumber] = useState('');
  const [tanNumber, setTanNumber] = useState('');
  const [vatTinNumber, setVatTinNumber] = useState('');
  const [cstTinNumber, setCstTinNumber] = useState('');
  const [serviceTax, setServiceTax] = useState('');
  const [cessNumber, setCessNumber] = useState('');
  const [cinNumber, setCinNumber] = useState('');
  const [remarks, setRemarks] = useState('');
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('/api/companies');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    const fetchStates = async () => {
      try {
        const response = await axios.get('/api/states');
        setStates(response.data);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };

    const fetchCities = async () => {
      try {
        const response = await axios.get('/api/cities');
        setCities(response.data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCompanies();
    fetchStates();
    fetchCities();
  }, []);

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handlePlotAreaChange = (event) => {
    setPlotArea(event.target.value);
  };

  const handleProjectIdChange = (event) => {
    setProjectId(event.target.value);
  };

  const handleTotalCarParkingChange = (event) => {
    setTotalCarParking(event.target.value);
  };

  const handleDefaultCarParkingsPerUnitChange = (event) => {
    setDefaultCarParkingsPerUnit(event.target.value);
  };

  const handleHSNCodeInstallmentLetterChange = (event) => {
    setHSNCodeInstallmentLetter(event.target.value);
  };

  const handleTaxCodeInstallmentLetterChange = (event) => {
    setTaxCodeInstallmentLetter(event.target.value);
  };

  const handleLoadingPercentChange = (event) => {
    setLoadingPercent(event.target.value);
  };

  const handleFloorsDescriptionChange = (event) => {
    setFloorsDescription(event.target.value);
  };

  const handleSeparateAgreementsConstructionLandChange = (event) => {
    setSeparateAgreementsConstructionLand(event.target.value);
  };

  const handleSalesGoLiveDateChange = (event) => {
    setSalesGoLiveDate(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleGstinChange = (event) => {
    setGstinNumber(event.target.value);
  };

  const handleTanChange = (event) => {
    setTanNumber(event.target.value);
  };

  const handleVatTinNumberChange = (event) => {
    setVatTinNumber(event.target.value);
  };

  const handleCstTinNumberChange = (event) => {
    setCstTinNumber(event.target.value);
  };

  const handleServiceTaxChange = (event) => {
    setServiceTax(event.target.value);
  };

  const handleCessChange = (event) => {
    setCessNumber(event.target.value);
  };

  const handleCinChange = (event) => {
    setCinNumber(event.target.value);
  };

  const handleRemarksChange = (event) => {
    setRemarks(event.target.value);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedCompany) newErrors.selectedCompanyId = 'Company is required';
    if (!selectedState) newErrors.selectedStateId = 'State is required';
    if (!selectedCity) newErrors.selectedCityId = 'City is required';
    if (!plotArea) newErrors.plotArea = 'Plot area is required';
    if (!projectId) newErrors.projectId = 'Project ID is required';
    if (!totalCarParking) newErrors.totalCarParking = 'Total car parking is required';
    if (!defaultCarParkingsPerUnit) newErrors.defaultCarParkingsPerUnit = 'Default car parkings per unit is required';
    if (!HSNCodeInstallmentLetter) newErrors.HSNCodeInstallmentLetter = 'HSN code installment letter is required';
    if (!separateAgreementsConstructionLand) newErrors.separateAgreementsConstructionLand = 'This field is required';
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      try {
        const url =
          'https://apiforcorners.cubisysit.com/api/api-add-subprojectdetails.php';
        const formData = new FormData();
        formData.append('CompanyID', selectedCompany);
        formData.append('StateID', selectedState);
        formData.append('CityID', selectedCity);
        formData.append('PlotArea', plotArea);
        formData.append('ProjectID', projectId);
        formData.append('TotalCarParking', totalCarParking);
        formData.append('DefaultCarParkingsPerUnit', defaultCarParkingsPerUnit);
        formData.append('HSNCodeInstallmentLetter', HSNCodeInstallmentLetter);
        formData.append('TaxCodeInstallmentLetter', taxCodeInstallmentLetter);
        formData.append('LoadingPercent', loadingPercent);
        formData.append('FloorsDescription', floorsDescription);
        formData.append('SeparateAgreementsConstructionLand', separateAgreementsConstructionLand);
        formData.append('SalesGoLiveDate', salesGoLiveDate);

        // Additional optional fields
        if (gstinNumber) formData.append('GSTIN', gstinNumber);
        if (tanNumber) formData.append('TAN', tanNumber);
        if (vatTinNumber) formData.append('VAT_TIN', vatTinNumber);
        if (cstTinNumber) formData.append('CST_TIN', cstTinNumber);
        if (serviceTax) formData.append('ServiceTax', serviceTax);
        if (cessNumber) formData.append('CessNumber', cessNumber);
        if (cinNumber) formData.append('CINNumber', cinNumber);
        if (remarks) formData.append('Remarks', remarks);

        const response = await axios.post(url, formData);

        if (response.data.status === 'Success') {
          setSubmitSuccess(true);
          setSelectedCompany('');
          setSelectedState('');
          setSelectedCity('');
          setPlotArea('');
          setProjectId('');
          setTotalCarParking('');
          setDefaultCarParkingsPerUnit('');
          setHSNCodeInstallmentLetter('');
          setTaxCodeInstallmentLetter('');
          setLoadingPercent('');
          setFloorsDescription('');
          setSeparateAgreementsConstructionLand('');
          setSalesGoLiveDate('');
          setGstinNumber('');
          setTanNumber('');
          setVatTinNumber('');
          setC
setVatTinNumber('');
setCstTinNumber('');
setServiceTax('');
setCessNumber('');
setCinNumber('');
setRemarks('');
} else {
// Handle error response
console.error('Error submitting form:', response.data.message);
setSubmitSuccess(false);
}
} catch (error) {
console.error('Error submitting form:', error);
setSubmitSuccess(false);
}
}
};

return (
<Box>
<CardContent>
<form onSubmit={handleSubmit}>
<Grid container spacing={3}>
  <Grid item xs={12}>
    <Typography variant="h6" component="div">
      Add Sub Project Details
    </Typography>
  </Grid>
  {submitSuccess && (
    <Grid item xs={12} sm={4}>
      <Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        Form submitted successfully!
      </Alert>
    </Grid>
  )}
  <Grid item xs={12} sm={4}>
    <FormControl fullWidth>
      <InputLabel>Company Name</InputLabel>
      <Select
        value={selectedCompany}
        onChange={handleCompanyChange}
      >
        {companies.map((company) => (
          <MenuItem key={company.id} value={company.id}>
            {company.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    {errors.selectedCompanyId && (
      <Typography variant="caption" color="error">
        {errors.selectedCompanyId}
      </Typography>
    )}
  </Grid>
  <Grid item xs={12} sm={4}>
    <FormControl fullWidth>
      <InputLabel>State</InputLabel>
      <Select
        value={selectedState}
        onChange={handleStateChange}
      >
        {states.map((state) => (
          <MenuItem key={state.id} value={state.id}>
            {state.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    {errors.selectedStateId && (
      <Typography variant="caption" color="error">
        {errors.selectedStateId}
      </Typography>
    )}
  </Grid>
  <Grid item xs={12} sm={4}>
    <FormControl fullWidth>
      <InputLabel>City</InputLabel>
      <Select
        value={selectedCity}
        onChange={handleCityChange}
      >
        {cities.map((city) => (
          <MenuItem key={city.id} value={city.id}>
            {city.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    {errors.selectedCityId && (
      <Typography variant="caption" color="error">
        {errors.selectedCityId}
      </Typography>
    )}
  </Grid>
  <Grid item xs={12} sm={4}>
    <FormControl fullWidth>
      <TextField
        label="Plot Area"
        value={plotArea}
        onChange={handlePlotAreaChange}
        error={!!errors.plotArea}
        helperText={errors.plotArea}
      />
    </FormControl>
  </Grid>
  <Grid item xs={12} sm={4}>
    <FormControl fullWidth>
      <TextField
        label="Project ID"
        value={projectId}
        onChange={handleProjectIdChange}
        error={!!errors.projectId}
        helperText={errors.projectId}
      />
    </FormControl>
  </Grid>
  <Grid item xs={12} sm={4}>
    <FormControl fullWidth>
      <TextField
        label="Total Car Parking"
        value={totalCarParking}
        onChange={handleTotalCarParkingChange}
        error={!!errors.totalCarParking}
        helperText={errors.totalCarParking}
      />
    </FormControl>
  </Grid>
  <Grid item xs={12} sm={4}>
    <FormControl fullWidth>
      <TextField
        label="Default Car Parkings Per Unit"
        value={defaultCarParkingsPerUnit}
        onChange={handleDefaultCarParkingsPerUnitChange}
        error={!!errors.defaultCarParkingsPerUnit}
        helperText={errors.defaultCarParkingsPerUnit}
      />
    </FormControl>
  </Grid>
  <Grid item xs={12} sm={4}>
    <FormControl fullWidth>
      <TextField
        label="HSN Code for Installment Letter"
        value={HSNCodeInstallmentLetter}
        onChange={handleHSNCodeInstallmentLetterChange}
        error={!!errors.HSNCodeInstallmentLetter}
        helperText={errors.HSNCodeInstallmentLetter}
      />
    </FormControl>
  </Grid>
  <Grid item xs={12} sm={4}>
    <FormControl fullWidth>
      <TextField
        label="Tax Code for Installment Letter"
        value={taxCodeInstallmentLetter}
        onChange={handleTaxCodeInstallmentLetterChange}
        error={!!errors.taxCodeInstallmentLetter}
        helperText={errors.taxCodeInstallmentLetter}
      />
    </FormControl>
  </Grid>
  <Grid item xs={12} sm={4}>
    <FormControl fullWidth>
      <TextField
        label="Loading Percent"
        value={loadingPercent}
        onChange={handleLoadingPercentChange}
        error={!!errors.loadingPercent}
        helperText={errors.loadingPercent}
      />
    </FormControl>
  </Grid>
  <Grid item xs={12} sm={4}>
    <FormControl fullWidth>
      <TextField
        label="Floors Description"
        value={floorsDescription}
        onChange={handleFloorsDescriptionChange}
        error={!!errors.floorsDescription}
        helperText={errors.floorsDescription}
      />
    </FormControl>
  </Grid>
  <Grid item xs={12} sm={4}>
    <FormControl fullWidth>
      <TextField
        label="Separate Agreements Construction Land"
        value={separateAgreementsConstructionLand}
        onChange={handleSeparateAgreementsConstructionLandChange}
        error={!!errors.separateAgreementsConstructionLand}
        helperText={errors.separateAgreementsConstructionLand}
      />
    </FormControl>
  </Grid>
  <Grid item xs={12} sm={4}>
    <FormControl fullWidth>
      <TextField
        label="Sales Go Live Date"
        type="date"
        value={salesGoLiveDate}
        onChange={handleSalesGoLiveDateChange}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </FormControl>
  </Grid>
  <Grid item xs={12} sm={4}>
    <Button variant="contained" type="submit">
      Submit
    </Button>
  </Grid>
</Grid>
</form>
</CardContent>
</Box>
);
};



export default Addsubprojectdetails;
