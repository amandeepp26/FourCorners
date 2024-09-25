import React, { useState, useEffect } from 'react';
import { Box, Grid, Alert, Select, MenuItem, TextField, Typography, InputLabel, FormControl, Button, CardContent, Card } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const Addsubprojectdetails = ({ show, editData }) => {
  console.log(editData , 'SSUBPROECTT DETAILSSS');

  const [cookies, setCookie, removeCookie] = useCookies(["amr"]);
  const [formData, setFormData] = useState({
    CompanyID: "",
    ProjectID: "",
    SubProjectName: "",
    SubProjectCode: "",
    TotalCarParking: "",
    DefaultCarParkingsPerUnit: "",
    HSNCodeInstallmentLetter: "",
    TaxCodeInstallmentLetter: "",
    LoadingPercent: "",
    FloorsDescription: "",
    SeparateAgreementsConstructionLand: "",
    SalesGoLiveDate: null,
    FinancePostingInstallmentLetter: "",
    TotalUnits: "",
    TotalSaleAreaUnits: "",
    TotalShopsOffices: "",
    BasicRatePerSqft: "",
    UnitCancellationCharges: "",
    BrokeragePercentage: "",
    BrokerageDueAfterAmtReceivedPercentage: "",
    BankName: "",
    Favorof: "",
    IFSCCode: "",
    AccountNo: "",
    FloorRiseEntries: "",
    FromFloor: "",
    ToFloor: "",
    FloorRiseRate: "",
    AdditionSubtractionInBasicRate: "",
    CCEntries: "",
    Particulars: "",
    Date: null,
    ResponsiblePerson: "",
    CreateUID: cookies.amr?.UserID || 1,
    Status: 1,
    SubProjectID: "",
  });

  const [projectTypes, setProjectTypes] = useState([]);
  const [rows, setRows] = useState([]);
  const [subProjectIdData, setSubProjectIdData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchDataCompany();
  }, []);

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        SalesGoLiveDate: editData.SalesGoLiveDate ? new Date(editData.SalesGoLiveDate) : null,
        Date: editData.Date ? new Date(editData.Date) : null,
      });
    }
  }, [editData]);
  

  const fetchData = async () => {
    try {
      const response = await axios.get("https://apiforcornershost.cubisysit.com/api/api-dropdown-projectmaster.php");
      setProjectTypes(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };



  const fetchDataCompany = async () => {
    try {
      const response = await axios.get("https://apiforcornershost.cubisysit.com/api/api-fetch-companymaster.php");
      setRows(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    fetchDataSubProject();
  }, []);
  
  const fetchDataSubProject = async () => {
    try {
      const response = await axios.get("https://apiforcornershost.cubisysit.com/api/api-fetch-subprojectmaster.php");
      console.log(response.data.data , 'AAYAAA DATA DEKHHH');
      setSubProjectIdData(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subProjectIdData.length > 0) {
      setFormData(prevFormData => ({
        ...prevFormData,
        SubProjectID: parseInt(subProjectIdData[0].SubProjectID) || '' // Use the first SubProjectID from the fetched data
      }));
    }
  }, [subProjectIdData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const url = editData
      ? "https://proxy-forcorners.vercel.app/api/proxy/api-update-subprojectmaster.php"
      : "https://proxy-forcorners.vercel.app/api/proxy/api-insert-subprojectmaster.php";
  
    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.data.status === "Success") {
        setSubmitSuccess(true);
        setSubmitError(false);
        show(false);
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

        <Grid container spacing={2}>
  
        <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
              <Box>
              <Typography  variant="body2"
                  sx={{ marginTop: 5, fontWeight: "bold", fontSize: 20 }}>
          {editData ? 'Edit Subproject Details' : 'Add Subproject Details'}
        </Typography>

              </Box>
            </Grid>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={8} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Project Name</InputLabel>
                <Select
                  name="ProjectID"
                  value={formData.ProjectID}
                  onChange={handleChange}
                  label="Project Name"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {projectTypes.map((project) => (
                    <MenuItem key={project.ProjectID} value={project.ProjectID}>
                      {project.ProjectName || "No data available"}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={8} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Company Name</InputLabel>
                <Select
                  name="CompanyID"
                  value={formData.CompanyID}
                  onChange={handleChange}
                  label="Company Name"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {rows.map((company) => (
                    <MenuItem key={company.CompanyID} value={company.CompanyID}>
                      {company.CompanyName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Sub Project Name"
                name="SubProjectName"
                value={formData.SubProjectName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Sub Project Code"
                name="SubProjectCode"
                value={formData.SubProjectCode}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Total Car Parking"
                name="TotalCarParking"
                value={formData.TotalCarParking}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Default Car Parkings Per Unit"
                name="DefaultCarParkingsPerUnit"
                value={formData.DefaultCarParkingsPerUnit}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="HSN Code Installment Letter"
                name="HSNCodeInstallmentLetter"
                value={formData.HSNCodeInstallmentLetter}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Tax Code Installment Letter"
                name="TaxCodeInstallmentLetter"
                value={formData.TaxCodeInstallmentLetter}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Loading Percent"
                name="LoadingPercent"
                value={formData.LoadingPercent}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Floors Description"
                name="FloorsDescription"
                value={formData.FloorsDescription}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Separate Agreements Construction Land"
                name="SeparateAgreementsConstructionLand"
                value={formData.SeparateAgreementsConstructionLand}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Finance Posting Installment Letter"
                name="FinancePostingInstallmentLetter"
                value={formData.FinancePostingInstallmentLetter}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Total Units"
                name="TotalUnits"
                value={formData.TotalUnits}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Total Sale Area Units"
                name="TotalSaleAreaUnits"
                value={formData.TotalSaleAreaUnits}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Total Shops Offices"
                name="TotalShopsOffices"
                value={formData.TotalShopsOffices}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Basic Rate Per Sqft"
                name="BasicRatePerSqft"
                value={formData.BasicRatePerSqft}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Unit Cancellation Charges"
                name="UnitCancellationCharges"
                value={formData.UnitCancellationCharges}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Brokerage Percentage"
                name="BrokeragePercentage"
                value={formData.BrokeragePercentage}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Brokerage Due After Amount Received Percentage"
                name="BrokerageDueAfterAmtReceivedPercentage"
                value={formData.BrokerageDueAfterAmtReceivedPercentage}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Bank Name"
                name="BankName"
                value={formData.BankName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Favor of"
                name="Favorof"
                value={formData.Favorof}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="IFSC Code"
                name="IFSCCode"
                value={formData.IFSCCode}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Account No"
                name="AccountNo"
                value={formData.AccountNo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Floor Rise Entries"
                name="FloorRiseEntries"
                value={formData.FloorRiseEntries}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="From Floor"
                name="FromFloor"
                value={formData.FromFloor}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="To Floor"
                name="ToFloor"
                value={formData.ToFloor}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Floor Rise Rate"
                name="FloorRiseRate"
                value={formData.FloorRiseRate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Addition Subtraction In Basic Rate"
                name="AdditionSubtractionInBasicRate"
                value={formData.AdditionSubtractionInBasicRate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="CC Entries"
                name="CCEntries"
                value={formData.CCEntries}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Particulars"
                name="Particulars"
                value={formData.Particulars}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <DatePicker
                selected={formData.SalesGoLiveDate}
                onChange={(date) => setFormData({ ...formData, SalesGoLiveDate: date })}
                dateFormat="dd-MM-yyyy"
                placeholderText="Sales Go Live Date"
                customInput={<TextField fullWidth label="Sales Go Live Date" />}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <DatePicker
                selected={formData.Date}
                onChange={(date) => setFormData({ ...formData, Date: date })}
                dateFormat="dd-MM-yyyy"
                placeholderText="Date"
                customInput={<TextField fullWidth label="Date" />}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Responsible Person"
                name="ResponsiblePerson"
                value={formData.ResponsiblePerson}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Box mt={10}>
            {submitSuccess && (
              <Alert severity="success">
                Subproject details have been successfully submitted!
              </Alert>
            )}
            {submitError && (
              <Alert severity="error">There was an error submitting the form.</Alert>
            )}
            <Button type="submit" variant="contained" color="primary"  >
              {editData ? 'Update Subproject' : 'Add Subproject'}
            </Button>
          </Box>
        </form>

        </Grid>
      </CardContent>
    </Card>
  );
};

export default Addsubprojectdetails;
