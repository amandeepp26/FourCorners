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
import YouTubeIcon from "@mui/icons-material/YouTube";
import axios from "axios";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";

const Addprojectinfo = ({ show, editData }) => {
  const [formData, setFormData] = useState({
    projectstartdate: null,
    completiondate: null,
    possessiondate: null,
    ProjectName: "",
    Possession: "",
    ProjectID: "",
    ProjectCode: "",
    PlotAreaInSqft: "",
    specification: "",
    WelcomeMessage: "",
    ProjectTypeID: "",
    amenitiesIDs: [], 
    video: "",
    virtualvideo: "",
    keyword: "",
    ProjectManager: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [projectTypes, setProjectTypes] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [userMaster, setUserMaster] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

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
        specification,
        WelcomeMessage,
        ProjectTypeID,
        amenitiesIDs,
        video,
        virtualvideo,
        keyword,
        ProjectAddress,
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
        specification: specification || "",
        WelcomeMessage: WelcomeMessage || "",
        ProjectTypeID: ProjectTypeID || "",
        amenitiesIDs: Array.isArray(amenitiesIDs) ? amenitiesIDs : [amenitiesIDs],
        video: video || "",
        virtualvideo: virtualvideo || "",
        keyword: keyword || "",
        ProjectAddress: ProjectAddress || "",
        ProjectManager: ProjectManager || "",
        ModifyUID: 1 || "",
      });
    }
  }, [editData]);

  useEffect(() => {
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-fetch-usermaster.php")
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
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-fetch-amenities.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setAmenities(response.data.data);
          setLoading(false);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);



  useEffect(() => {
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-fetch-projectmaster.php")
      .then((response) => {
        if (response.data.status === "Success") {
            setProjectTypes(response.data.data);
            setLoading(false);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);


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
    const selectedAmenities = Array.isArray(value) ? value : [value];
    setFormData({
      ...formData,
      amenitiesIDs: selectedAmenities,
    });
  };

  const handleDelete = (event, valueToDelete) => {
    event.stopPropagation();
    setFormData((prevState) => ({
      ...prevState,
      amenitiesIDs: prevState.amenitiesIDs.filter(
        (value) => value !== valueToDelete
      ),
    }));
  };

  const [cookies, setCookie, removeCookie] = useCookies(["amr"]);

  const handleSubmitData = (event) => {
    event.preventDefault();
  
    // Your validation logic...
    
    const body = {
      LaunchDate: formData.projectstartdate ? formData.projectstartdate.toISOString() : "",
      CompletionDate: formData.completiondate ? formData.completiondate.toISOString() : "",
      PossessionDate: formData.possessiondate ? formData.possessiondate.toISOString() : "",
      ProjectCode: formData.ProjectCode,
      ProjectID: formData.ProjectID,
      ProjectManager: formData.ProjectManager,
      Areasqft: parseFloat(formData.PlotAreaInSqft) || 0,
      VirtualLink: formData.virtualvideo,
      VideoLink: formData.video,
      Remark: formData.WelcomeMessage,
      CreateUID: cookies.amr?.UserID || 1,
      AmenitiesIDs: formData.amenitiesIDs,
    };
  
    const url = editData
      ? "https://proxy-forcorners.vercel.app/api/proxy/api-update-projectmaster.php"
      : "https://proxy-forcorners.vercel.app/api/proxy/api-insert-projectdetails.php";
  
    axios
      .post(url, body)
      .then((response) => {
        if (response.data.status === "Success") {
          // Reset only the relevant fields, including amenitiesIDs as an empty array
          setFormData({
            projectstartdate: null,
            completiondate: null,
            possessiondate: null,
            ProjectName: "",
            Possession: "",
            ProjectID: "",
            ProjectCode: "",
            PlotAreaInSqft: "",
            specification: "",
            WelcomeMessage: "",
            ProjectTypeID: "",
            amenitiesIDs: [],
            video: "",
            virtualvideo: "",
            keyword: "",
            ProjectManager: "",
          }); 
          setErrors({});
          setSubmitSuccess(true);
          setSubmitError(false);
          show(false);
  
          Swal.fire({
            icon: "success",
            title: editData ? "Data Updated Successfully" : "Data Added Successfully",
            showConfirmButton: false,
            timer: 1000,
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
                  onChange={(date) => handleDateChange(date, "completiondate")}
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
                  onChange={(date) => handleDateChange(date, "possessiondate")}
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
                <FormControl fullWidth>
                  <InputLabel id="project-manager-label">Project Manager</InputLabel>
                  <Select
                    labelId="project-manager-label"
                    id="ProjectManager"
                    name="ProjectManager"
                    value={formData.UserID}
                    onChange={handleInputChange}
                  >
                    {userMaster.map((user) => (
                      <MenuItem key={user.UserID} value={user.UserID}>
                        {user.Name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.ProjectManager && <Alert severity="error">{errors.ProjectManager}</Alert>}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
  <FormControl fullWidth>
    <InputLabel id="project-type-label">Project Name</InputLabel>
    <Select
      labelId="project-type-label"
      id="ProjectName"
      name="ProjectID" // Change the name to ProjectID
      value={formData.ProjectID} // Ensure this is linked to ProjectID
      onChange={(e) => {
        const selectedProject = projectTypes.find(type => type.ProjectID === e.target.value);
        setFormData(prevState => ({
          ...prevState,
          ProjectID: e.target.value,
          ProjectName: selectedProject ? selectedProject.ProjectName : "", // Set ProjectName based on selection
        }));
      }}
      label="Project Name"
    >
      {projectTypes.map((type) => (
        <MenuItem key={type.ProjectID} value={type.ProjectID}>
          {type.ProjectName}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Plot Area in Sqft"
                  name="PlotAreaInSqft"
                  value={formData.PlotAreaInSqft}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Sq.ft</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Amenities</InputLabel>
                  <Select
                    label="Amenities"
                    multiple
                    value={formData.amenitiesIDs}
                    onChange={handleAmenitiesChange}
                    input={<Input />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={
                              amenities.find((amenity) => amenity.amenitiesID === value)?.amenitiesName ||
                              ""
                            }
                            onDelete={(event) => handleDelete(event, value)}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {amenities.map((amenity) => (
                      <MenuItem key={amenity.amenitiesID} value={amenity.amenitiesID}>
                        {amenity.amenitiesName	}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Video URL"
                  name="video"
                  value={formData.video}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <YouTubeIcon sx={{ color: "red", fontSize: "24px" }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Virtual Video URL"
                  name="virtualvideo"
                  value={formData.virtualvideo}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <YouTubeIcon sx={{ color: "red", fontSize: "24px" }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Remarks"
                    name="WelcomeMessage"
                    value={formData.WelcomeMessage}
                    onChange={handleInputChange}
                  />
                </Grid>
              <Grid item xs={12} textAlign="center">
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                  {editData ? "Update Project" : "Add Project"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Addprojectinfo;
