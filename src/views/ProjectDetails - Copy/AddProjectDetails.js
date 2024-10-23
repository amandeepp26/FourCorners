import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Alert,
  Select,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  CardContent,
  FormControl,
  Button,
  Card,
  Chip,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddProjectDetails = ({ show, editData }) => {
  const [formData, setFormData] = useState({
    ProjectID: "",
    CompanyID: "",
    ProjectCode: "",
    ProjectManager: "",
    ReraRegistrationNumber: "",
    ProjectTypeID: "",
    ApprovedBy: "",
    Specification: "",
    Video: "",
    VirtualVideo: "",
    ProjectAddress: "",
    Pincode: "",
    Location: "",
    Landmark: "",
    CityID: "",
    WelcomeMessage: "",
    ProjectStartDate: null,
    CompletionDate: null,
    PossessionDate: null,
    AmenitiesIDs: [],
    image: null, // Add image field
  });

  const [userMaster, setUserMaster] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [projectTypes, setProjectTypes] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [cookies] = useCookies(["amr"]);

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        ModifyUID: cookies.amr?.UserID || 1,
      });
    }
  }, [editData, cookies.amr]);

  useEffect(() => {
    axios
      .get(
        "https://apiforcornershost.cubisysit.com/api/api-fetch-companymaster.php"
      )
      .then((response) => {
        if (response.data.status === "Success") {
          setUserMaster(response.data.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching user master data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
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
    fetchData();
  }, []);

  useEffect(() => {
    axios.get('https://apiforcornershost.cubisysit.com/api/api-fetch-amenities.php')
      .then(response => {
        if (response.data.status === 'Success') {
          setAmenities(response.data.data);
        } else {
          console.error('Failed to fetch amenities');
        }
      })
      .catch(error => {
        console.error('Error fetching amenities:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleDateChange = (date, field) => {
    setFormData({
      ...formData,
      [field]: date,
    });
  };

  const handleAmenitiesChange = (e) => {
    setFormData({
      ...formData,
      AmenitiesIDs: e.target.value,
    });
  };

  const handleDelete = (event, value) => {
    event.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      AmenitiesIDs: prev.AmenitiesIDs.filter((id) => id !== value),
    }));
  };

  const validateFields = (data) => {
    const newErrors = {};
    if (!data.ProjectCode) newErrors.ProjectCode = "Project Code is required";
    if (!data.ProjectAddress) newErrors.ProjectAddress = "Project Address is required";
    if (!data.Pincode) newErrors.Pincode = "Pincode is required";
    if (!data.CityID) newErrors.CityID = "City is required";
    return newErrors;
  };

  const handleSubmitData = (event) => {
    event.preventDefault();

    const newErrors = validateFields(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formDataToSubmit = new FormData();
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        formDataToSubmit.append(key, formData[key]);
      }
    }

    const url = editData
      ? "https://proxy-forcorners.vercel.app/api/proxy/api-update-projectmaster.php"
      : "https://proxy-forcorners.vercel.app/api/proxy/api-insert-projectdetails.php";

    axios
      .post(url, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        if (response.data.status === "Success") {
          setFormData({
            ProjectID: "",
            CompanyID: "",
            ProjectCode: "",
            ProjectManager: "",
            ReraRegistrationNumber: "",
            ProjectTypeID: "",
            ApprovedBy: "",
            Specification: "",
            Video: "",
            VirtualVideo: "",
            ProjectAddress: "",
            Pincode: "",
            Location: "",
            Landmark: "",
            CityID: "",
            WelcomeMessage: "",
            ProjectStartDate: null,
            CompletionDate: null,
            PossessionDate: null,
            AmenitiesIDs: [],
            image: null,
          }); // Reset form data after successful submission
          setErrors({});
          setSubmitSuccess(true);
          setSubmitError(false);
          show(false); // Hide the modal or close form

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
          setSubmitSuccess(false);
          setSubmitError(true);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        }
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        setSubmitSuccess(false);
        setSubmitError(true);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
  };


  if (loading) return <p>Loading...</p>;

  return (
    <Card>
      <CardContent>
        <Box>
          <Typography
            variant="body2"
            sx={{ marginTop: 5, fontWeight: "bold", fontSize: 20 }}
          >
            {editData ? "Edit Project Master" : "Add Project Details"}
          </Typography>
        </Box>
        <Box>
          <form style={{ marginTop: "30px" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth error={!!errors.CompanyID}>
                  <InputLabel>Company Name</InputLabel>
                  <Select
                    value={formData.CompanyID || ""}
                    onChange={handleInputChange}
                    name="CompanyID"
                    label="Company Name"
                  >
                    {userMaster.map((company) => (
                      <MenuItem
                        key={company.CompanyID}
                        value={company.CompanyID}
                      >
                        {company.CompanyName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.CompanyID && (
                    <Alert severity="error">{errors.CompanyID}</Alert>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth error={!!errors.ProjectTypeID}>
                  <InputLabel>Project Type</InputLabel>
                  <Select
                    value={formData.ProjectTypeID || ""}
                    onChange={handleInputChange}
                    name="ProjectTypeID"
                    label="Project Type"
                  >
                    {projectTypes.map((project) => (
                      <MenuItem
                        key={project.ProjectID}
                        value={project.ProjectID}
                      >
                        {project.ProjectName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.ProjectTypeID && (
                    <Alert severity="error">{errors.ProjectTypeID}</Alert>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Image</InputLabel>
                  <input
                    type="file"
                    accept=".jpg,.png,.jpeg"
                    name="image"
                    onChange={handleFileChange}
                    style={{ marginRight: "10px" }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Project Code"
                  name="ProjectCode"
                  value={formData.ProjectCode}
                  onChange={handleInputChange}
                  error={!!errors.ProjectCode}
                  helperText={errors.ProjectCode}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Project Manager"
                  name="ProjectManager"
                  value={formData.ProjectManager}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Rera Registration Number"
                  name="ReraRegistrationNumber"
                  value={formData.ReraRegistrationNumber}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Approved By"
                  name="ApprovedBy"
                  value={formData.ApprovedBy}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="                  Specification"
                  name="Specification"
                  value={formData.Specification}
                  onChange={handleInputChange}
                  multiline
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Project Address"
                  name="ProjectAddress"
                  value={formData.ProjectAddress}
                  onChange={handleInputChange}
                  error={!!errors.ProjectAddress}
                  helperText={errors.ProjectAddress}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Pincode"
                  name="Pincode"
                  value={formData.Pincode}
                  onChange={handleInputChange}
                  error={!!errors.Pincode}
                  helperText={errors.Pincode}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Location"
                  name="Location"
                  value={formData.Location}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Landmark"
                  name="Landmark"
                  value={formData.Landmark}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="City"
                  name="CityID"
                  value={formData.CityID}
                  onChange={handleInputChange}
                  error={!!errors.CityID}
                  helperText={errors.CityID}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Video URL"
                  name="Video"
                  value={formData.Video}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Virtual Video URL"
                  name="VirtualVideo"
                  value={formData.VirtualVideo}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePicker
                  selected={formData.ProjectStartDate}
                  onChange={(date) => handleDateChange(date, "ProjectStartDate")}
                  dateFormat="dd-MM-yyyy"
                  className="form-control"
                  customInput={
                    <TextField
                      fullWidth
                      label="Launch Date"
                      InputProps={{ readOnly: true, sx: { width: "100%" } }}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePicker
                  selected={formData.CompletionDate}
                  onChange={(date) => handleDateChange(date, "CompletionDate")}
                  dateFormat="dd-MM-yyyy"
                  className="form-control"
                  customInput={
                    <TextField
                      fullWidth
                      label="Completion Date"
                      InputProps={{ readOnly: true, sx: { width: "100%" } }}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePicker
                  selected={formData.PossessionDate}
                  onChange={(date) => handleDateChange(date, "PossessionDate")}
                  dateFormat="dd-MM-yyyy"
                  className="form-control"
                  customInput={
                    <TextField
                      fullWidth
                      label="Possession Date"
                      InputProps={{ readOnly: true, sx: { width: "100%" } }}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.AmenitiesIDs}>
                  <InputLabel>Amenities</InputLabel>
                  <Select
                    multiple
                    value={formData.AmenitiesIDs || []}
                    onChange={handleAmenitiesChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={amenities.find((amenity) => amenity.amenitiesID === value)?.amenitiesName || value}
                            onDelete={(e) => handleDelete(e, value)}
                          />
                        ))}
                      </Box>
                    )}
                    name="AmenitiesIDs"
                    label="Amenities"
                  >
                    {amenities.map((amenity) => (
                      <MenuItem key={amenity.amenitiesID} value={amenity.amenitiesID}>
                        {amenity.amenitiesName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.AmenitiesIDs && <Alert severity="error">{errors.AmenitiesIDs}</Alert>}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Welcome Message"
                  name="WelcomeMessage"
                  value={formData.WelcomeMessage}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
            <Box mt={3}>
              <Button variant="contained" color="primary" type="submit" onClick={handleSubmitData}>
                {editData ? "Update Project" : "Add Project"}
              </Button>
            </Box>
          </form>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddProjectDetails;

