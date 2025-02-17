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
    ProjectDetailsID: null,
    projectstartdate: null,
    completiondate: null,
    possessiondate: null,
    ProjectName: "",
    ProjectID: "",
    ProjectCode: "",
    PlotAreaInSqft: "",
    WelcomeMessage: "",
    amenitiesIDs: [],
    video: "",
    virtualvideo: "",
    Para: "",
    Latitude: "",
    Cc: "",
    Oc: "",
    FacebookLink: "",
    InstagramLink: "",
    ModifyUID: 1,
    ProjectManager: "",
  });
  const [cookies] = useCookies(["amr"]);
  const [loading, setLoading] = useState(true);
  const [projectTypes, setProjectTypes] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [userMaster, setUserMaster] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (editData) {
        try {
          const response = await axios.get(`https://apiforcornershost.cubisysit.com/api/api-fetch-projectdetails.php?ProjectID=${editData.ProjectID}`);
          if (response.data.status === "Success" && response.data.data.length > 0) {
            const projectDetails = response.data.data[0];
            setFormData({
              ProjectDetailsID: projectDetails.ProjectDetailsID,
              projectstartdate: formatDate(new Date(projectDetails.LaunchDate)),
              completiondate: formatDate(new Date(projectDetails.CompletionDate)),
              possessiondate: formatDate(new Date(projectDetails.PossessionDate)),
              ProjectID: projectDetails.ProjectID,
              ProjectCode: projectDetails.ProjectCode,
              PlotAreaInSqft: projectDetails.Areasqft,
              WelcomeMessage: projectDetails.Remark,
              ProjectName: projectDetails.ProjectName,
              Para: projectDetails.Para,
              Latitude: projectDetails.Latitude,
              Cc: projectDetails.Cc,
              Oc: projectDetails.Oc,
              FacebookLink: projectDetails.FacebookLink,
              InstagramLink: projectDetails.InstagramLink,
              amenitiesIDs: projectDetails.AmenitiesID.split(',').map(id => id.trim()),
              video: projectDetails.VideoLink || "",
              virtualvideo: projectDetails.VirtualLink || "",
              ProjectManager: projectDetails.UserID
            });
          }
        } catch (error) {
          console.error("Error fetching project details:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // Set loading to false if no editData
      }
    };

    fetchProjectDetails();
  }, [editData]);

  // Fetch user master, amenities, and project types
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userMasterResponse, amenitiesResponse, projectTypesResponse] = await Promise.all([
          axios.get("https://apiforcornershost.cubisysit.com/api/api-fetch-usermaster.php"),
          axios.get("https://apiforcornershost.cubisysit.com/api/api-fetch-amenities.php"),
          axios.get("https://apiforcornershost.cubisysit.com/api/api-fetch-projectmaster.php"),
        ]);

        if (userMasterResponse.data.status === "Success") {
          setUserMaster(userMasterResponse.data.data);
        }
        if (amenitiesResponse.data.status === "Success") {
          setAmenities(amenitiesResponse.data.data);
        }
        if (projectTypesResponse.data.status === "Success") {
          setProjectTypes(projectTypesResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (dateString, field) => {
    // Check if the dateString is valid (this assumes dateString is a valid ISO date string)
    const date = new Date(dateString);
  
    if (isNaN(date)) {
      console.error("Invalid date:", dateString);
      return; // Don't update state with an invalid date
    }
  
    // Format the date to "YYYY-MM-DD"
    const formattedDate = formatDate(date);
  
    setFormData({
      ...formData,
      [field]: formattedDate, // Store the formatted date string
    });
  };
  
  // Function to format date as YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Adding leading zero if necessary
    const day = date.getDate().toString().padStart(2, "0"); // Adding leading zero if necessary
    return `${year}-${month}-${day}`;
  };
  
  const handleAmenitiesChange = (event) => {
    const { value } = event.target;

    // Remove duplicates by converting the array to a Set and back to an array
    const uniqueAmenities = Array.from(new Set(value));

    setFormData({
      ...formData,
      amenitiesIDs: uniqueAmenities,
    });
  };


  const handleSubmitData = async (event) => {
    event.preventDefault();

    const body = {
      ProjectDetailsID: formData.ProjectDetailsID,
      LaunchDate: formData.projectstartdate,
      CompletionDate: formData.completiondate,
      PossessionDate: formData.possessiondate,
      ProjectID: formData.ProjectID,
      ProjectCode: formData.ProjectCode,
      Remark: formData.WelcomeMessage,
      Para: formData.Para,
      Latitude: formData.Latitude,
      Cc: formData.Cc,
      Oc: formData.Oc,
      FacebookLink: formData.FacebookLink,
      InstagramLink: formData.InstagramLink,
      VideoLink: formData.video,
      VirtualLink: formData.virtualvideo,
      ModifyUID: cookies.amr?.UserID || 1,
      AmenitiesIDs: formData.amenitiesIDs,
      Areasqft: formData.PlotAreaInSqft,
      ProjectManager: formData.ProjectManager,
      CreateUID: cookies.amr?.UserID || 1,
    };
debugger;
console.log("paased data ", body);
    const url = formData.ProjectDetailsID
      ? "https://proxy-forcorners.vercel.app/api/proxy/api-update-projectdetails.php"
      : "https://proxy-forcorners.vercel.app/api/proxy/api-insert-projectdetails.php";
debugger;
    try {
      const response = await axios.post(url, body);
      if (response.data.status === "Success") {
        show(false);
        Swal.fire({
          icon: "success",
          title: formData.ProjectDetailsID ? "Data Updated Successfully" : "Data Added Successfully",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          window.location.reload(); 
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
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
            {editData ? "Edit Project Info" : "Add Project Info"}
          </Typography>
        </Box>
        <Box>
          <form style={{ marginTop: "30px" }} onSubmit={handleSubmitData}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>

                <TextField
                  fullWidth
                  type="date"
                  label="Launch date"
                  value={formData.projectstartdate}
                  onChange={(e) => handleDateChange(e.target.value, "projectstartdate")}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  showMonthDropdown
                  showYearDropdown
                  yearDropdownItemNumber={15}
                  scrollableYearDropdown
                />



              </Grid>

              <Grid item xs={12} md={4}>
  <TextField
    fullWidth
    type="date"
    label="Completion date"
    value={formData.completiondate}
    onChange={(e) => handleDateChange(e.target.value, "completiondate")}
    variant="outlined"
    InputLabelProps={{ shrink: true }}
    sx={{ backgroundColor: "#ffffff" }}
    showMonthDropdown
    showYearDropdown
    yearDropdownItemNumber={15}
    scrollableYearDropdown
    required
  />
</Grid>


              <Grid item xs={12} md={4}>


                <TextField
                  fullWidth
                  type="date"
                  label="Possession date"
                 
                  onChange={(e) => handleDateChange(e.target.value, "possessiondate")}
    
                  value={formData.possessiondate}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
             
                  showMonthDropdown
                  showYearDropdown
                  yearDropdownItemNumber={15} // Number of years to show in dropdown
                  scrollableYearDropdown
                  required
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
                {errors.ProjectCode && <Alert severity="error">{errors.ProjectCode}</Alert>}
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="project-manager-label">Project Manager</InputLabel>
                  <Select
                    labelId="project-manager-label"
                    id="ProjectManager"
                    name="ProjectManager"
                    value={formData.ProjectManager || ""} // Ensure it reflects the formData correctly
                    onChange={handleInputChange}
                    label="Project Manager"
                  >
                    {userMaster.map((user) => (
                      <MenuItem key={user.UserID} value={user.UserID}>
                        {user.Name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="project-type-label">Project Name</InputLabel>
                  <Select
                    labelId="project-type-label"
                    id="ProjectName"
                    name="ProjectID"
                    value={formData.ProjectID}
                    onChange={(e) => {
                      const selectedProject = projectTypes.find(type => type.ProjectID === e.target.value);
                      setFormData(prevState => ({
                        ...prevState,
                        ProjectID: e.target.value,
                        ProjectName: selectedProject ? selectedProject.ProjectName : "",
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
                <TextField
                  fullWidth
                  label="Video URL"
                  name="video"
                  value={formData.video}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: <YouTubeIcon sx={{ color: "red", fontSize: "24px" }} />,
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
                    endAdornment: <YouTubeIcon sx={{ color: "red", fontSize: "24px" }} />,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Unit Type"
                  name="WelcomeMessage"
                  value={formData.WelcomeMessage}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Paragraph"
                  name="Para"
                  value={formData.Para}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Project Location"
                  name="Latitude"
                  value={formData.Latitude}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Cc"
                  name="Cc"
                  value={formData.Cc}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Oc"
                  name="Oc"
                  value={formData.Oc}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Facebook Link"
                  name="FacebookLink"
                  value={formData.FacebookLink}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Instagram Link"
                  name="InstagramLink"
                  value={formData.InstagramLink}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={12}>
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
                            label={amenities.find((amenity) => amenity.amenitiesID === value)?.amenitiesName || ""}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {amenities.map((amenity) => (
                      <MenuItem key={amenity.amenitiesID} value={amenity.amenitiesID}>
                        {amenity.amenitiesName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

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
