import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";

const AddOpportunityDetails = ({
  show,
  leadData,
  editData,
  onDashboardClick,
}) => {
  

  const [cookies, setCookie, removeCookie] = useCookies(["amr"]);
  const [formData, setFormData] = useState({
    LookingForID: "",
    EstimatedbudgetID: "",
    AreaFrom: "",
    AreaTo: "",
    ScaleID: "",
    CityID: "",
    LocationID: "",
    UnittypeID: "",
    PropertyAgeID: "",
    PurposeID: "",
    ScheduleDate: null,
    ScheduleTime:  getCurrentTime(),
    KeywordID: "",
    SourceID: "",
    ProjectID: "",
    ProjectName: "",
    OpportunityAttendedByID: cookies.amr?.UserID || 1,
    Description: "",
    Cid: "",
    Status: 1,
    CreateUID: cookies.amr?.UserID || 1,
    ModifyUID: 1,
    Oid: "",
  });

  const [rows, setRows] = useState([]);
  const [lookingForOptions, setLookingForOptions] = useState([]);
  const [estimatedBudgets, setEstimatedBudgets] = useState([]);
  const [project, setproject] = useState([]);
  const [cities, setCities] = useState([]);
  const [units, setUnits] = useState([]);
  const [scales, setScales] = useState([]);
  const [sources, setSources] = useState([]);
  const [userMaster, setUserMaster] = useState([]);
  const [sourceTypes, setSourceTypes] = useState([]);
  const [propertyAges, setPropertyAges] = useState([]);
  const [purposes, setPurposes] = useState([]);
  const [localities, setLocalities] = useState([]);

  const [contacts, setContacts] = useState([]);
  const [submitError, setSubmitError] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const isUpdate = formData.Oid !== "";

  // Function to create the payload
  const createPayload = () => {
    const payload = { ...formData };

    if (!isUpdate) {
      delete payload.ModifyUID;
      delete payload.Oid;
    }

    return payload;
  };

  useEffect(() => {
    if (leadData) {
      
      setFormData((prevFormData) => ({
        ...prevFormData,
        ProjectID: leadData.ProjectID || prevFormData.ProjectID,
        ProjectName: leadData.ProjectName || prevFormData.ProjectName,
        Tid: leadData.Tid || prevFormData.Tid,
        LookingForID: leadData.LookingForID || prevFormData.LookingForID,
        CName: leadData.CName || prevFormData.CName,
        EstimatedbudgetID:
          leadData.EstimatedbudgetID || prevFormData.EstimatedbudgetID,
        AreaFrom: leadData.AreaFrom || prevFormData.AreaFrom,
        AreaTo: leadData.AreaTo || prevFormData.AreaTo,
        ScaleID: leadData.ScaleID || prevFormData.ScaleID,
        CityID: leadData.CityID || prevFormData.CityID,
        LocationID: leadData.LocationID || prevFormData.LocationID,
        UnittypeID: leadData.UnittypeID || prevFormData.UnittypeID,
        PropertyAgeID: leadData.PropertyAgeID || prevFormData.PropertyAgeID,
        PurposeID: leadData.PurposeID || prevFormData.PurposeID,
        KeywordID: leadData.KeywordID || prevFormData.KeywordID,
        SourceID: leadData.SourceID || prevFormData.SourceID,
        SourceNameID: leadData.SourceNameID || prevFormData.SourceNameID,
        OpportunityAttendedByID: cookies.amr?.UserID || 1,
        Description: leadData.Description || prevFormData.Description,
        Cid: leadData.Cid || prevFormData.Cid,
        Status: 1,
        CreateUID: cookies.amr?.UserID || 1,
      }));
    }
  }, [leadData]);
  useEffect(() => {
    if (editData) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        CName: editData.CName || prevFormData.CName,
        LookingForID: editData.LookingForID || prevFormData.LookingForID,
        EstimatedbudgetID:
          editData.EstimatedbudgetID || prevFormData.EstimatedbudgetID,
        AreaFrom: editData.AreaFrom || prevFormData.AreaFrom,
        AreaTo: editData.AreaTo || prevFormData.AreaTo,
        ScaleID: editData.ScaleID || prevFormData.ScaleID,
        CityID: editData.CityID || prevFormData.CityID,
        LocationID: editData.LocationID || prevFormData.LocationID,
        UnittypeID: editData.UnittypeID || prevFormData.UnittypeID,
        PropertyAgeID: editData.PropertyAgeID || prevFormData.PropertyAgeID,
        PurposeID: editData.PurposeID || prevFormData.PurposeID,
        ScheduleDate: editData.ScheduleDate || prevFormData.ScheduleDate,
        ScheduleTime: editData.ScheduleTime || prevFormData.ScheduleTime,
        KeywordID: editData.KeywordID || prevFormData.KeywordID,
        SourceID: editData.SourceID || prevFormData.SourceID,
        SourceNameID: 1 || 1,
        OpportunityAttendedByID:
          editData.OpportunityAttendedByID ||
          prevFormData.OpportunityAttendedByID,
        Description: editData.Description || prevFormData.Description,
        Cid: editData.Cid || prevFormData.Cid,
        Status: editData.Status || prevFormData.Status,
        CreateUID: cookies.amr?.UserID || 1,
        ModifyUID: 1,
        Oid: editData.Oid || prevFormData.Oid,
        ProjectID: editData.ProjectID || prevFormData.ProjectID,  // Ensure ProjectID is updated
        ProjectName: editData.ProjectName || prevFormData.ProjectName,  // Ensure ProjectName is updated
      }));
    }
  }, [editData]);
  

  console.log('Project Data:', project);





  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  useEffect(() => {
    // Set the default value to current time when the component mounts
    setFormData((prev) => ({
      ...prev,
      ScheduleTime: getCurrentTime(),
    }));
  }, []);

  useEffect(() => {
    if (formData.CityID) {
      axios
        .get(
          "https://apiforcornershost.cubisysit.com/api/api-fetch-locationmaster.php",
          {
            params: { CityID: formData.CityID },
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
  }, [formData.CityID]);

  useEffect(() => {
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-fetch-usermaster.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setUserMaster(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    const userid = cookies.amr?.UserID || "Role";
    const fetchData = async () => {
      try {
        const lookingForRes = await axios.get(
          "https://apiforcornershost.cubisysit.com/api/api-fetch-lookingtype.php"
        );
        const estimatedBudgetsRes = await axios.get(
          "https://apiforcornershost.cubisysit.com/api/api-dropdown-estimatedbudget.php"
        );
        const citiesRes = await axios.get(
          "https://apiforcornershost.cubisysit.com/api/api-fetch-citymaster.php"
        );
        const projectres = await axios.get(
          "https://apiforcornershost.cubisysit.com/api/api-dropdown-projectmaster.php"
        );
        const unitsRes = await axios.get(
          "https://apiforcornershost.cubisysit.com/api/api-fetch-unittype.php"
        );
        const scalesRes = await axios.get(
          "https://apiforcornershost.cubisysit.com/api/api-fetch-scale.php"
        );
        const propertyAgesRes = await axios.get(
          "https://apiforcornershost.cubisysit.com/api/api-fetch-propertyage.php"
        );
        const purposesRes = await axios.get(
          "https://apiforcornershost.cubisysit.com/api/api-fetch-purpose.php"
        );
        const contactsRes = await axios.get(
          `https://apiforcornershost.cubisysit.com/api/api-fetch-convtooppo.php?UserID=${userid}`
        );
        const sourcesRes = await axios.get(
          "https://apiforcornershost.cubisysit.com/api/api-fetch-source.php"
        );

        setLookingForOptions(lookingForRes.data.data);
        setEstimatedBudgets(estimatedBudgetsRes.data.data);
        setproject(projectres.data.data);
        setCities(citiesRes.data.data);
        setUnits(unitsRes.data.data);
        setScales(scalesRes.data.data);
        setPropertyAges(propertyAgesRes.data.data);
        setPurposes(purposesRes.data.data);
        setContacts(contactsRes.data.data || []);
        setSources(sourcesRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    if (rows.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        Oid: parseInt(rows[0].Oid) || "",
      }));
    }
  }, [rows]);

  const handleSourceChange = (event) => {
    const selectedSourceId = event.target.value;
    setFormData({ ...formData, SourceID: selectedSourceId });

    axios
      .get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-sourcetype.php?SourceID=${selectedSourceId}`
      )
      .then((response) => {
        setSourceTypes(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching source types:", error);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const RequiredIndicator = () => {
    return <span style={{ color: "red", marginLeft: "5px" }}>*</span>;
  };



  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      setLoading(false);
      return;
    }
  debugger;
    setLoading(true);
    const payload = createPayload();
    const url = editData
      ? "https://proxy-forcorners.vercel.app/api/proxy/api-update-opportunity.php"
      : "https://proxy-forcorners.vercel.app/api/proxy/api-insert-opportunity.php";

    try {
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      debugger;
      setLoading(false);
      console.log("API Response:", response.data);
      console.log("API Response:", payload);
      debugger;
      if (response.data.status === "Success") {
        setSubmitSuccess(true);
        setSubmitError(false);
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
        throw new Error(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("There was an error!", error);
      setSubmitSuccess(false);
      setSubmitError(true);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong!",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSubmitError(false);
    setSubmitSuccess(false);
  };


  const validate = () => {
    let tempErrors = {};
  
    // Clear previous errors (optional, but can help with consistency)
    setErrors({});
  
    // Validate all the required fields
    tempErrors.LookingForID = formData.LookingForID ? "" : "This field is required.";
    tempErrors.EstimatedbudgetID = formData.EstimatedbudgetID ? "" : "This field is required.";
    tempErrors.AreaFrom = formData.AreaFrom ? "" : "This field is required.";
    tempErrors.AreaTo = formData.AreaTo ? "" : "This field is required.";
    tempErrors.ScaleID = formData.ScaleID ? "" : "This field is required.";
    tempErrors.CityID = formData.CityID ? "" : "This field is required.";
    tempErrors.LocationID = formData.LocationID ? "" : "This field is required.";
    tempErrors.UnittypeID = formData.UnittypeID ? "" : "This field is required.";
    tempErrors.PropertyAgeID = formData.PropertyAgeID ? "" : "This field is required.";
    tempErrors.PurposeID = formData.PurposeID ? "" : "This field is required.";
    tempErrors.ScheduleDate = formData.ScheduleDate ? "" : "This field is required.";
    tempErrors.ScheduleTime = formData.ScheduleTime ? "" : "This field is required.";
    tempErrors.SourceID = formData.SourceID ? "" : "This field is required.";
    tempErrors.OpportunityAttendedByID = formData.OpportunityAttendedByID ? "" : "This field is required.";
    tempErrors.Description = formData.Description ? "" : "This field is required.";
    tempErrors.ProjectID = formData.ProjectID ? "" : "This field is required."; // Ensure ProjectID is correctly populated
  
    // You can add additional custom validations here as needed, like format checks or specific value ranges
  
    // Set the error messages if any
    setErrors({ ...tempErrors });
  
    // Return true if no errors are present
    return Object.values(tempErrors).every((x) => x === "");
  };
  
  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography
                variant="body2"
                sx={{ marginTop: 5, fontWeight: "bold", fontSize: 20 }}
              >
                {editData
                  ? "Edit Opportunity Details"
                  : "Add Opportunity Details"}
              </Typography>
            </Grid>
            {contacts && contacts.length > 0 && (
  <Grid item xs={4}>
    <FormControl fullWidth error={!!errors.Cid}>
      <InputLabel shrink>Contact</InputLabel>
      <TextField
        label="Contact"
        value={formData.CName}
        InputProps={{
          readOnly: true,
        }}
      />
      <input type="hidden" name="Cid" value={formData.Cid} />
      {!!errors.Cid && (
        <Typography variant="caption" color="error">
          {errors.Cid}
        </Typography>
      )}
    </FormControl>
  </Grid>
)}

<Grid item xs={4}>
<FormControl fullWidth error={!!errors.ProjectID}>
  <InputLabel>Project Name</InputLabel>
  <Select
    label="Project Name"
    value={formData.ProjectID || ''}  
    onChange={(e) => {
      const selectedProjectID = e.target.value;
      const selectedProject = project.find(p => p.ProjectID === selectedProjectID);
      setFormData({
        ...formData,
        ProjectID: selectedProjectID,
        ProjectName: selectedProject ? selectedProject.ProjectName : '', 
      });
    }}
  >
    {project.map((projectnames) => (
      <MenuItem
        key={projectnames.ProjectID}
        value={projectnames.ProjectID}
      >
        {projectnames.ProjectName || 'NA'}
      </MenuItem>
    ))}
  </Select>
  {!!errors.ProjectID && (
    <Typography variant="caption" color="error">
      {errors.ProjectID}
    </Typography>
  )}
</FormControl>


            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth error={!!errors.LookingForID}>
                <InputLabel>Looking For</InputLabel>
                <Select
                  label="Looking For"
                  value={formData.LookingForID}
                  onChange={(e) =>
                    setFormData({ ...formData, LookingForID: e.target.value })
                  }
                >
                  {lookingForOptions.map((option) => (
                    <MenuItem
                      key={option.LookingTypeID}
                      value={option.LookingTypeID}
                    >
                      {option.LookingTypeName}
                    </MenuItem>
                  ))}
                </Select>
                {!!errors.LookingForID && (
                  <Typography variant="caption" color="error">
                    {errors.LookingForID}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth error={!!errors.EstimatedbudgetID}>
                <InputLabel>Estimated Budget</InputLabel>
                <Select
                  label="Estimated Budget"
                  value={formData.EstimatedbudgetID}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      EstimatedbudgetID: e.target.value,
                    })
                  }
                >
                  {estimatedBudgets.map((budget) => (
                    <MenuItem
                      key={budget.EstimatedbudgetID}
                      value={budget.EstimatedbudgetID}
                    >
                      {budget.EstimatedbudgetName || "NA"}
                    </MenuItem>
                  ))}
                </Select>
                {!!errors.estimatedBudgetId && (
                  <Typography variant="caption" color="error">
                    {errors.estimatedBudgetId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Area From"
                value={formData.AreaFrom}
                name="AreaFrom"
                onChange={(e) =>
                  setFormData({ ...formData, AreaFrom: e.target.value })
                }
              />
             {!!errors.AreaFrom && (
                  <Typography variant="caption" color="error">
                    {errors.AreaFrom}
                  </Typography>
                )}
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                name="AreaTo"
                label="Area To"
                value={formData.AreaTo}
                onChange={(e) =>
                  setFormData({ ...formData, AreaTo: e.target.value })
                }
              />
              {!!errors.AreaTo && (
                  <Typography variant="caption" color="error">
                    {errors.AreaTo}
                  </Typography>
                )}
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth error={!!errors.ScaleID}>
                <InputLabel>Scale</InputLabel>
                <Select
                  label="Scale"
                  value={formData.ScaleID}
                  onChange={(e) =>
                    setFormData({ ...formData, ScaleID: e.target.value })
                  }
                >
                  {scales.map((scale) => (
                    <MenuItem key={scale.ScaleID} value={scale.ScaleID}>
                      {scale.ScaleName}
                    </MenuItem>
                  ))}
                </Select>
                {!!errors.ScaleID && (
                  <Typography variant="caption" color="error">
                    {errors.ScaleID}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth error={!!errors.CityID}>
                <InputLabel>City</InputLabel>
                <Select
                  label="City"
                  value={formData.CityID}
                  onChange={(e) =>
                    setFormData({ ...formData, CityID: e.target.value })
                  }
                >
                  {cities.map((city) => (
                    <MenuItem key={city.CityID} value={city.CityID}>
                      {city.CityName}
                    </MenuItem>
                  ))}
                </Select>
                {!!errors.CityID && (
                  <Typography variant="caption" color="error">
                    {errors.CityID}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Locality</InputLabel>
                <Select
                  name="LocationID"
                  label="Locality"
                  value={formData.LocationID}
                  onChange={handleChange}
                >
                  {localities.map((locality) => (
                    <MenuItem
                      key={locality.LocationID}
                      value={locality.LocationID}
                    >
                      {locality.LocationName}
                    </MenuItem>
                  ))}
                </Select>
                {!!errors.LocationID && (
                  <Typography variant="caption" color="error">
                    {errors.LocationID}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Unit Type</InputLabel>
                <Select
                  label="Unit Type"
                  value={formData.UnittypeID}
                  onChange={(e) =>
                    setFormData({ ...formData, UnittypeID: e.target.value })
                  }
                >
                  {units.map((unit) => (
                    <MenuItem key={unit.UnittypeID} value={unit.UnittypeID}>
                      {unit.UnittypeName}
                    </MenuItem>
                  ))}
                </Select>
                {!!errors.UnittypeID && (
                  <Typography variant="caption" color="error">
                    {errors.UnittypeID}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Property Age</InputLabel>
                <Select
                  label="Property Age"
                  value={formData.PropertyAgeID}
                  onChange={(e) =>
                    setFormData({ ...formData, PropertyAgeID: e.target.value })
                  }
                >
                  {propertyAges.map((age) => (
                    <MenuItem key={age.PropertyAgeID} value={age.PropertyAgeID}>
                      {age.PropertyAgeName}
                    </MenuItem>
                  ))}
                </Select>
                {!!errors.PropertyAgeID && (
                  <Typography variant="caption" color="error">
                    {errors.PropertyAgeID}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Purpose</InputLabel>
                <Select
                  label="Purpose"
                  value={formData.PurposeID}
                  onChange={(e) =>
                    setFormData({ ...formData, PurposeID: e.target.value })
                  }
                >
                  {purposes.map((purpose) => (
                    <MenuItem key={purpose.PurposeID} value={purpose.PurposeID}>
                      {purpose.PurposeName}
                    </MenuItem>
                  ))}
                </Select>
                {!!errors.PurposeID && (
                  <Typography variant="caption" color="error">
                    {errors.PurposeID}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label={
                  <>
                    Schedule Date <RequiredIndicator />
                  </>
                }
                type="date"
                name="ScheduleDate"
                value={formData.ScheduleDate}
                onChange={(e) =>
                  setFormData({ ...formData, ScheduleDate: e.target.value })
                }
                InputLabelProps={{
                  shrink: true,
                }}
              
              />
               {!!errors.ScheduleDate && (
                  <Typography variant="caption" color="error">
                    {errors.ScheduleDate}
                  </Typography>
                )}
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Schedule Time"
                type="time"
                value={formData.ScheduleTime}
                onChange={(e) =>
                  setFormData({ ...formData, ScheduleTime: e.target.value })
                }
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
              />
               {!!errors.ScheduleTime && (
                  <Typography variant="caption" color="error">
                    {errors.ScheduleTime}
                  </Typography>
                )}
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Keyword"
                value={formData.KeywordID}
                onChange={(e) =>
                  setFormData({ ...formData, KeywordID: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Source</InputLabel>
                <Select
                  label="Source"
                  value={formData.SourceID}
                  onChange={handleSourceChange}
                >
                  {sources.map((source) => (
                    <MenuItem key={source.SourceID} value={source.SourceID}>
                      {source.SourceName}
                    </MenuItem>
                  ))}
                </Select>
                {!!errors.SourceID && (
                  <Typography variant="caption" color="error">
                    {errors.SourceID}
                  </Typography>
                )}
              </FormControl>
            </Grid>
           
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={formData.Description}
                onChange={(e) =>
                  setFormData({ ...formData, Description: e.target.value })
                }
              />

{!!errors.Description && (
                  <Typography variant="caption" color="error">
                    {errors.Description}
                  </Typography>
                )}
            </Grid>

            <Grid item xs={12}>
            <Button
      type="submit"
      variant="contained"
      color="primary"
      onClick={handleSubmit}
      disabled={loading}
    >
      {loading ? (
        <CircularProgress size={24} sx={{ color: "#fff" }} />
      ) : (
        editData ? "Update" : "Submit"
      )}
    </Button>
            </Grid>
          </Grid>
        </form>
        <Snackbar
          open={submitSuccess}
          autoHideDuration={6000}
          onClose={() => setSubmitSuccess(false)}
        >
          <MuiAlert
            onClose={() => setSubmitSuccess(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {editData ? "Data Updated Successfully" : "Data Added Successfully"}
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={submitError}
          autoHideDuration={6000}
          onClose={() => setSubmitError(false)}
        >
          <MuiAlert
            onClose={() => setSubmitError(false)}
            severity="error"
            sx={{ width: "100%" }}
          >
            Something went wrong!
          </MuiAlert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};
export default AddOpportunityDetails;
