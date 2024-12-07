import { useState, useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Swal from "sweetalert2";
import Box from "@mui/material/Box";
import { useCookies } from "react-cookie";
import CircularProgress from "@mui/material/CircularProgress";

const UploadExcel = ({ show, rowData }) => {
  const [file, setFile] = useState(null);
  const [parkingFile, setParkingFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [error, setError] = useState(null);
  const [cookies] = useCookies(["amr"]);

  const [projectMaster, setProjectMaster] = useState([]);
  const [wingData, setWingData] = useState([]);
  const [formData, setFormData] = useState({
    ProjectID: "",
    WingID: "",
    Status: 1,
    CreateUID: 1,
  });

  // Fetch project data on component mount
  useEffect(() => {
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-dropdown-projectinfo.php")
      .then(response => {
        if (response.data.status === "Success") {
          setProjectMaster(response.data.data);
        }
      })
      .catch(error => console.error("Error fetching project master data:", error));
  }, []);

  // Fetch wing data when ProjectID changes
  useEffect(() => {
    if (formData.ProjectID) {
      axios
        .get(`https://apiforcornershost.cubisysit.com/api/api-fetch-projectwings.php?ProjectID=${formData.ProjectID}`)
        .then(response => {
          if (response.data.status === "Success") {
            setWingData(response.data.data);
          }
        })
        .catch(error => console.error("Error fetching wing data:", error));
    }
  }, [formData.ProjectID]);

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleParkingFileChange = (e) => setParkingFile(e.target.files[0]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (url, data, setLoadingFn) => {
    try {
      setLoadingFn(true);
      const response = await axios.post(url, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.status === "Success") {
        Swal.fire({
          icon: "success",
          title: "Operation successful!",
          showConfirmButton: false,
          timer: 1500,
        });
        show(false);
      } else {
        showError("Failed to process the file.");
      }
    } catch (error) {
      showError("Error during file processing.");
    } finally {
      setLoadingFn(false);
    }
  };

  const showError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: message,
    });
    setError(message);
  };

  const handleSubmitFile = (event) => {
    event.preventDefault();
    if (!file) {
      showError("Please select a project file.");
      return;
    }
    const formDataFile = new FormData();
    formDataFile.append("file", file);
    formDataFile.append("ParkingAvilability", parkingFile);
    Object.keys(formData).forEach(key => formDataFile.append(key, formData[key]));
    
    handleFormSubmit(
      "https://apiforcornershost.cubisysit.com/api/api-excel-parking.php",
      formDataFile,
      setLoading
    );
  };

  const handleEdit = (event) => {
    event.preventDefault();
    if (!file && !parkingFile) {
      showError("Please select a file to update.");
      return;
    }
    const formDataFile = new FormData();
    formDataFile.append("file", file);
    formDataFile.append("ModifyUID", cookies.amr?.UserID || 1);
    Object.keys(formData).forEach(key => formDataFile.append(key, formData[key]));

    handleFormSubmit(
      "https://apiforcornershost.cubisysit.com/api/api-update-projectroomexcel.php",
      formDataFile,
      setLoadingEdit
    );
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold">
              Add Project Details
            </Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Project Name</InputLabel>
              <Select
                value={formData.ProjectID}
                onChange={handleInputChange}
                name="ProjectID"
                label="Project Name"
              >
                {projectMaster.map(project => (
                  <MenuItem key={project.ProjectID} value={project.ProjectID}>
                    {project.ProjectName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Wings</InputLabel>
              <Select
                value={formData.WingID}
                onChange={handleInputChange}
                name="WingID"
                label="Wings"
              >
                {wingData.map(wing => (
                  <MenuItem key={wing.WingID} value={wing.WingID}>
                    {wing.WingName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3} mt={4}>
            <Box display="flex" gap={2}>
              <input
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
                style={{ marginRight: "10px" }}
              />
              <input
                type="file"
                accept=".xls,.xlsx"
                onChange={handleParkingFileChange}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6} mt={3}>
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                onClick={handleSubmitFile}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Upload File"}
              </Button>
              <Button
                variant="contained"
                onClick={handleEdit}
                disabled={loadingEdit}
              >
                {loadingEdit ? <CircularProgress size={24} /> : "Edit File"}
              </Button>
            </Box>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Typography color="error">{error}</Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UploadExcel;
