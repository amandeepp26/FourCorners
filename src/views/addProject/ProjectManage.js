
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
  Input,
  Chip,
  InputAdornment,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LanguageIcon from "@mui/icons-material/Language";
const ProjectManage = ({ show, editData }) => {
  const [formData, setFormData] = useState({
    projectstartdate: null,
    completiondate: null,
    possessiondate: null,
    ProjectName: "",
    Possession:"",
    ProjectCode: "",
    PlotAreaInSqft: "",
    ReraRegistrationNumber: "",
    approvedby: "",
    specification: "",
    WelcomeMessage: "",
    ProjectTypeID: "",
    amenitiesIDs: [], // Ensure amenitiesIDs is initialized as an array
    video: "",
    virtualvideo: "",
    keyword: "",
    ProjectAddress: "",
    cityID: "",
    Location: "",
    landmark: "",
    Pincode: "",
    assignebyID: "",
    ProjectManager: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [projectTypes, setProjectTypes] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [userMaster, setUserMaster] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [localities, setLocalities] = useState([]);
  useEffect(() => {
    if (editData) {
      const {
        ProjectID,
        projectstartdate,
        completiondate,
        possessiondate,
        ProjectName,
        ProjectCode,
        PlotAreaInSqft,
        ReraRegistrationNumber,
        approvedby,
        specification,
        WelcomeMessage,
        ProjectTypeID,
        amenitiesIDs,
        video,
        virtualvideo,
        keyword,
        ProjectAddress,
        cityID,
        Location,
        landmark,
        Pincode,
        assignebyID,
        ProjectManager,
        ModifyUID,
      } = editData;

      setFormData({
        ProjectID: ProjectID || "",
        projectstartdate: projectstartdate ? new Date(projectstartdate) : null,
        completiondate: completiondate ? new Date(completiondate) : null,
        possessiondate: possessiondate ? new Date(possessiondate) : null,
        ProjectName: ProjectName || "",
        ProjectCode: ProjectCode || "",
        PlotAreaInSqft: PlotAreaInSqft || "",
        ReraRegistrationNumber: ReraRegistrationNumber || "",
        approvedby: approvedby || "",
        specification: specification || "",
        WelcomeMessage: WelcomeMessage || "",
        ProjectTypeID: ProjectTypeID || "",
        amenitiesIDs: Array.isArray(amenitiesIDs)
          ? amenitiesIDs
          : [amenitiesIDs],
        video: video || "",
        virtualvideo: virtualvideo || "",
        keyword: keyword || "",
        ProjectAddress: ProjectAddress || "",
        cityID: cityID || "",
        Location: Location || "",
        landmark: landmark || "",
        Pincode: Pincode || "",
        assignebyID: assignebyID || "",
        ProjectManager: ProjectManager || "",
        ModifyUID: 1 || "",
      });
    }
  }, [editData]);

  useEffect(() => {
    axios
      .get("https://apiforcorners.cubisysit.com/api/api-fetch-usermaster.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setUserMaster(response.data.data);
          setLoading(false); // Set loading to false when data is fetched
        }
      })
      .catch((error) => {
        console.error("Error fetching user master data:", error);
        setLoading(false); // Also set loading to false on error
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://apiforcorners.cubisysit.com/api/api-fetch-transactiontype.php"
      )
      .then((response) => {
        if (response.data.status === "Success") {
          setProjectTypes(response.data.data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (formData.cityID) {
      axios
        .get(
          "https://apiforcorners.cubisysit.com/api/api-fetch-locationmaster.php",
          {
            params: { CityID: formData.cityID },
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
  }, [formData.cityID]);

  useEffect(() => {
    axios
      .get("https://apiforcorners.cubisysit.com/api/api-fetch-amenities.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setAmenities(response.data.data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    axios
      .get("https://apiforcorners.cubisysit.com/api/api-fetch-citymaster.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setCities(response.data.data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    axios
      .get("https://apiforcorners.cubisysit.com/api/api-fetch-statemaster.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setStates(response.data.data);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (formData.Location) {
      axios
        .get("https://apiforcorners.cubisysit.com/api/api-fetch-pincode.php", {
          params: { LocationID: formData.Location },
        })
        .then((response) => {
          if (response.data.status === "Success") {
            setPincodes(response.data.data);
          }
        })
        .catch((error) => console.error("Error fetching pincodes:", error));
    } else {
      setPincodes([]);
    }
  }, [formData.Location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date, name) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const handleAmenitiesChange = (event) => {
    const { value } = event.target;
    // Ensure value is always an array
    const selectedAmenities = Array.isArray(value) ? value : [value];
    setFormData({
      ...formData,
      amenitiesIDs: selectedAmenities,
    });
  };

  const handleDelete = (event, valueToDelete) => {
    event.stopPropagation(); // Ensure the event propagation is stopped
    setFormData((prevState) => ({
      ...prevState,
      amenitiesIDs: prevState.amenitiesIDs.filter(
        (value) => value !== valueToDelete
      ),
    }));
  };

  const handleTelecaller = (event) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      assignebyID: event.target.value,
    });
  };

  const [cookies, setCookie, removeCookie] = useCookies(["amr"]);
  const handleSubmitData = (event) => {
    event.preventDefault();

    const body = {
      ...formData,
      CountryID: 1,
      Status: 1,
      CreateUID: cookies.amr?.UserID || 1,
    };

    const url = editData
      ? "https://ideacafe-backend.vercel.app/api/proxy/api-update-projectmaster.php"
      : "https://ideacafe-backend.vercel.app/api/proxy/api-insert-projectmaster.php";

    axios
      .post(url, body)
      .then((response) => {
        if (response.data.status === "Success") {
          setFormData({}); // Reset form data after successful submission
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
            // window.location.reload();
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

  if (loading) return <p> Loading... </p>;

    return (
      <Card>
        <CardContent>
          <Box>
            <Typography
              variant="body2"
              sx={{ marginTop: 5, fontWeight: "bold", fontSize: 20 }}
            >
              {editData ? "Edit Project Master" : "Add Project Master"}
            </Typography>
          </Box>
          <Box>
            <form style={{ marginTop: "30px" }} onSubmit={handleSubmitData}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <DatePicker
                    selected={formData.projectstartdate}
                    onChange={(date) =>
                      handleDateChange(date, "projectstartdate")
                    }
                    dateFormat="dd-MM-yyyy"
                    className="form-control"
                    customInput={
                      <TextField
                        fullWidth
                        label="Launch date"
                        value={
                          formData.projectstartdate
                            ? formData.projectstartdate.toLocaleDateString()
                            : ""
                        }
                        InputProps={{ readOnly: true, sx: { width: "100%" } }}
                      />
                    }
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <DatePicker
                    selected={formData.completiondate}
                    onChange={(date) =>
                      handleDateChange(date, "completiondate")
                    }
                    dateFormat="dd-MM-yyyy"
                    className="form-control"
                    customInput={
                      <TextField
                        fullWidth
                        label="Completion date"
                        value={
                          formData.completiondate
                            ? formData.completiondate.toLocaleDateString()
                            : ""
                        }
                        InputProps={{ readOnly: true, sx: { width: "100%" } }}
                      />
                    }
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <DatePicker
                    selected={formData.possessiondate}
                    onChange={(date) =>
                      handleDateChange(date, "possessiondate")
                    }
                    dateFormat="dd-MM-yyyy"
                    className="form-control"
                    customInput={
                      <TextField
                        fullWidth
                        label="Possession date"
                        value={
                          formData.possessiondate
                            ? formData.possessiondate.toLocaleDateString()
                            : ""
                        }
                        InputProps={{ readOnly: true, sx: { width: "100%" } }}
                      />
                    }
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Project Name"
                    name="ProjectName"
                    value={formData.ProjectName}
                    onChange={handleInputChange}
                  />
                  {errors.ProjectName && (
                    <Alert severity="error">{errors.ProjectName}</Alert>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Project Code"
                    name="ProjectCode"
                    value={formData.ProjectCode}
                    onChange={handleInputChange}
                  />
                  {errors.ProjectCode && (
                    <Alert severity="error">{errors.ProjectCode}</Alert>
                  )}
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
                    label="RERA Registration Number"
                    name="ReraRegistrationNumber"
                    value={formData.ReraRegistrationNumber}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Project Area"
                    name="PlotAreaInSqft"
                    value={formData.PlotAreaInSqft}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Transaction Type</InputLabel>
                    <Select
                      name="ProjectTypeID"
                      label="Transaction Type"
                      value={formData.ProjectTypeID}
                      onChange={handleInputChange}
                    >
                      {projectTypes.map((projectType) => (
                        <MenuItem
                          key={projectType.transactionID}
                          value={projectType.transactionID}
                        >
                          {projectType.transactionName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Approved By"
                    name="approvedby"
                    value={formData.approvedby}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Specification"
                    name="specification"
                    value={formData.specification}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Amenities</InputLabel>
                    <Select
                      multiple
                      value={formData.amenitiesIDs} // Ensure amenitiesIDs is an array
                      onChange={handleAmenitiesChange}
                      input={<Input />}
                      renderValue={(selected) => (
                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                          {selected.map((value) => (
                            <div key={value} style={{ marginRight: "0.5rem" }}>
                              <Chip
                                label={
                                  amenities.find(
                                    (amenity) => amenity.amenitiesID === value
                                  )?.amenitiesName || value
                                }
                                onDelete={(event) => handleDelete(event, value)}
                                onMouseDown={(event) => {
                                  // Prevent the dropdown from opening when clicking the delete button
                                  event.stopPropagation();
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    >
                      {amenities.map((amenity) => (
                        <MenuItem
                          key={amenity.amenitiesID}
                          value={amenity.amenitiesID}
                        >
                          {amenity.amenitiesName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Video Link"
                    name="video"
                    value={formData.video}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Virtual Video Link"
                    name="virtualvideo"
                    value={formData.virtualvideo}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Website Keyword"
                    name="keyword"
                    value={formData.keyword}
                    onChange={handleInputChange}
                  />
                  {errors.Pincode && (
                    <Alert severity="error">{errors.Pincode}</Alert>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Project Address"
                    name="ProjectAddress"
                    value={formData.ProjectAddress}
                    onChange={handleInputChange}
                  />
                  {errors.ProjectAddress && (
                    <Alert severity="error">{errors.ProjectAddress}</Alert>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Pincode"
                    name="Pincode"
                    value={formData.Pincode}
                    onChange={handleInputChange}
                  />
                  {errors.Pincode && (
                    <Alert severity="error">{errors.Pincode}</Alert>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Assigned By</InputLabel>
                    <Select
                      value={formData.assignebyID}
                      onChange={handleTelecaller}
                      label="Assign By"
                    >
                      {userMaster.map((bhk) => (
                        <MenuItem key={bhk.UserID} value={bhk.UserID}>
                          {bhk.Name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Locality"
                    name="Location"
                    value={formData.Location}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Landmark"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>City</InputLabel>
                    <Select
                      name="cityID"
                      label="City"
                      value={formData.cityID}
                      onChange={handleInputChange}
                    >
                      {cities.map((city) => (
                        <MenuItem key={city.CityID} value={city.CityID}>
                          {city.CityName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.cityID && (
                      <Alert severity="error">{errors.cityID}</Alert>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Remarks"
                    name="WelcomeMessage"
                    value={formData.WelcomeMessage}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    {editData ? "Update Project" : "Create Project"}
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  {submitSuccess && (
                    <Alert severity="success">
                      Project submitted successfully!
                    </Alert>
                  )}
                  {submitError && (
                    <Alert severity="error">
                      Error submitting project. Please try again.
                    </Alert>
                  )}
                </Grid>
              </Grid>
            </form>
          </Box>
        </CardContent>
      </Card>
    );
};

export default ProjectManage;
