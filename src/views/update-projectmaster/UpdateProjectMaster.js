import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Alert,
  AlertTitle,
} from "@mui/material";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCookies } from "react-cookie";

const UpdateProjectMaster = ({ show, rowData }) => {
  const [projectData, setProjectData] = useState(null);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedStateId, setSelectedStateId] = useState("");
  const [errors, setErrors] = useState({});
  const [rows, setRows] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    projectCode: "",
    projectStartDate: "",
    projectManager: "",
    contactDetails: "",
    gstInNo: "",
    location: "",
    selectedCity: "",
    selectedState: "",
    country: "",
    pincode: "",
    projectAddress: "",
    remarks: "",
    companyName: "",
    plotArea: "",
    broucherLink: "",
    ctsNo: "",
    propertyTax: "",
    reraRegistration: "",
    uom: "",
    projectType: "",
    unit: "",
    message: "",
    selectedDate: null,
    selectedDateRera: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://apiforcornershost.cubisysit.com/api/api-fetch-companymaster.php"
      );
      setRows(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    axios
      .get(
        "https://apiforcornershost.cubisysit.com/api/api-fetch-projecttypemaster.php"
      )
      .then((response) => {
        if (response.data.status === "Success") {
          setProjectTypes(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-fetch-citymaster.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setCities(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
      });

    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-fetch-statemaster.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setStates(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching states:", error);
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectId = rowData?.ProjectID;
        const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-singel-projectmaster.php?ProjectID=${projectId}`;

        const response = await axios.get(apiUrl);
        if (response.data.status === "Success") {
          const project = response.data.data[0];
          setProjectData(project);
          setFormData({
            projectName: project.ProjectName,
            projectCode: project.ProjectCode,
            projectStartDate: new Date(project.projectstartdate)
              .toISOString()
              .split("T")[0],
            projectManager: project.ProjectManager,
            contactDetails: project.ContactDetails,
            gstInNo: project.GstInNo,
            location: project.Location,
            selectedCity: project.cityID,
            selectedState: project.StateID,
            pincode: project.Pincode,
            projectAddress: project.ProjectAddress,
            remarks: project.Remarks,
            companyName: project.CompanyName,
            plotArea: project.PlotAreaInSqft,
            broucherLink: project.BrochureLink,
            ctsNo: project.CtsNo,
            propertyTax: project.PropertyTaxNumber,
            reraRegistration: project.ReraRegistrationNumber,
            projectType: project.ProjectType,
            unitofmeasurement: project.unit,
            message: project.WelcomeMessage,
            selectedDate: project.projectstartdate
              ? new Date(project.projectstartdate)
              : null,
            selectedDateRera: project.ReraRegistrationDate
              ? new Date(project.ReraRegistrationDate)
              : null,
          });
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
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

    const selectedCityObject = cities.find(
      (city) => city.CityName === selectedCityName
    );
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

    const selectedStateObject = states.find(
      (state) => state.StateName === selectedStateName
    );
    if (selectedStateObject) {
      setSelectedStateId(selectedStateObject.StateID);
    }
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      selectedDate: date,
    });
  };

  const handleDateChangeRera = (date) => {
    setFormData({
      ...formData,
      selectedDateRera: date,
    });
  };
  const [cookies, setCookie, removeCookie] = useCookies(["amr"]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const submitData = {
      CreateUID: cookies.amr?.UserID || 1,
      projecttypeid: formData.projectType,
      ProjectID: rowData?.ProjectID || 0,
      projectname: formData.projectName,
      projectcode: formData.projectCode,
      ProjectStartDate: formData.projectStartDate,
      projectmanager: formData.projectManager,
      ContactNo: formData.contactDetails,
      gstinno: formData.gstInNo,
      location: formData.location,
      city: selectedCityId,
      state: selectedStateId,
      country: 1,
      pincode: formData.pincode,
      projectaddress: formData.projectAddress,
      remarks: formData.remarks,
      CompanyID: formData.companyName,
      plotareainsqft: formData.plotArea,
      ctsno: formData.ctsNo,
      propertytaxnumber: formData.propertyTax,
      reraregistrationnumber: formData.reraRegistration,
      unitofmeasurement: "sdf",
      ProjectType: formData.projectType,
      brochurelink: formData.broucherLink,
      welcomemessage: formData.message,
      ...(formData.selectedDate && {
        projectstartdate: formData.selectedDate.toISOString().split("T")[0],
      }),
      ...(formData.selectedDateRera && {
        reraregistrationdate: formData.selectedDateRera
          .toISOString()
          .split("T")[0],
      }),
      status: 1,
    };

    axios
      .post(
        "https://proxy-forcorners.vercel.app/api/proxy/api-update-projectmaster.php",
        JSON.stringify(submitData),
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
          setFormData({
            projectName: "",
            projectCode: "",
            projectStartDate: "",
            projectManager: "",
            contactDetails: "",
            gstInNo: "",
            location: "",
            selectedCity: "",
            selectedState: "",
            country: "India",
            pincode: "",
            projectAddress: "",
            remarks: "",
            companyName: "",
            plotArea: "",
            broucherLink: "",
            ctsNo: "",
            propertyTax: "",
            reraRegistration: "",
            projectType: "",
            unit: "",
            message: "",
            selectedDate: null,
            selectedDateRera: null,
          });
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
  };

  return (
    <CardContent>
      <form onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom>
          Project Master
        </Typography>

        {submitSuccess && (
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            Project data submitted successfully!
          </Alert>
        )}

        {submitError && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            Failed to submit project data. Please try again.
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Project Name"
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              error={Boolean(errors.projectName)}
              helperText={errors.projectName}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Project Code"
              name="projectCode"
              value={formData.projectCode}
              onChange={handleInputChange}
              error={Boolean(errors.projectCode)}
              helperText={errors.projectCode}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <DatePicker
                selected={formData.selectedDate}
                onChange={handleDateChange}
                placeholderText="Select Date"
                dateFormat="yyyy-MM-dd"
                className="react-datepicker__input-text"
                customInput={<TextField label="Project Start Date" />}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Project Manager"
              name="projectManager"
              value={formData.projectManager}
              onChange={handleInputChange}
              error={Boolean(errors.projectManager)}
              helperText={errors.projectManager}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Contact Details"
              name="contactDetails"
              value={formData.contactDetails}
              onChange={handleInputChange}
              error={Boolean(errors.contactDetails)}
              helperText={errors.contactDetails}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="GSTIN No"
              name="gstInNo"
              value={formData.gstInNo}
              onChange={handleInputChange}
              error={Boolean(errors.gstInNo)}
              helperText={errors.gstInNo}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              error={Boolean(errors.location)}
              helperText={errors.location}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>City</InputLabel>
              <Select
                label="City"
                value={formData.selectedCity}
                onChange={handleCityChange}
                error={Boolean(errors.selectedCity)}
              >
                {cities.map((city) => (
                  <MenuItem key={city.CityID} value={city.CityName}>
                    {city.CityName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>State</InputLabel>
              <Select
                label="State"
                value={formData.selectedState}
                onChange={handleStateChange}
                error={Boolean(errors.selectedState)}
              >
                {states.map((state) => (
                  <MenuItem key={state.StateID} value={state.StateName}>
                    {state.StateName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              error={Boolean(errors.pincode)}
              helperText={errors.pincode}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Project Address"
              name="projectAddress"
              value={formData.projectAddress}
              onChange={handleInputChange}
              error={Boolean(errors.projectAddress)}
              helperText={errors.projectAddress}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              error={Boolean(errors.remarks)}
              helperText={errors.remarks}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Company Name</InputLabel>
              <Select
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                error={Boolean(errors.companyName)}
              >
                {rows.map((row) => (
                  <MenuItem key={row.CompanyID} value={row.CompanyID}>
                    {row.CompanyName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Plot Area In Sqft"
              name="plotArea"
              value={formData.plotArea}
              onChange={handleInputChange}
              error={Boolean(errors.plotArea)}
              helperText={errors.plotArea}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Brochure Link"
              name="broucherLink"
              value={formData.broucherLink}
              onChange={handleInputChange}
              error={Boolean(errors.broucherLink)}
              helperText={errors.broucherLink}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="CTS No"
              name="ctsNo"
              value={formData.ctsNo}
              onChange={handleInputChange}
              error={Boolean(errors.ctsNo)}
              helperText={errors.ctsNo}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Property Tax Number"
              name="propertyTax"
              value={formData.propertyTax}
              onChange={handleInputChange}
              error={Boolean(errors.propertyTax)}
              helperText={errors.propertyTax}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="RERA Registration Number"
              name="reraRegistration"
              value={formData.reraRegistration}
              onChange={handleInputChange}
              error={Boolean(errors.reraRegistration)}
              helperText={errors.reraRegistration}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <DatePicker
                selected={formData.selectedDateRera}
                onChange={handleDateChangeRera}
                placeholderText="Select Date"
                dateFormat="yyyy-MM-dd"
                className="react-datepicker__input-text"
                customInput={<TextField label="RERA Registration Date" />}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Project Type</InputLabel>
              <Select
                label="Project Type"
                name="projectType"
                value={formData.projectType}
                onChange={handleInputChange}
                error={Boolean(errors.projectType)}
              >
                {projectTypes.map((projectType) => (
                  <MenuItem
                    key={projectType.ProjectTypeID}
                    value={projectType.ProjectTypeID}
                  >
                    {projectType.ProjectTypeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Welcome Message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              error={Boolean(errors.message)}
              helperText={errors.message}
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button variant="contained" color="primary" type="submit">
            Update
          </Button>
        </Box>
      </form>
    </CardContent>
  );
};

export default UpdateProjectMaster;
