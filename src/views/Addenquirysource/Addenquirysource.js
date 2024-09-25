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

const Addenquirysource = ({ show, rowData }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [projectMaster, setProjectMaster] = useState([]);
  const [formData, setFormData] = useState({
    ProjectID: "",
    WingID: "", // Corrected: Changed WingData to WingID for selection
    Status: 1,
    CreateUID: 1,
  });

  const [wingData, setWingData] = useState([]);

  useEffect(() => {
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-dropdown-projectinfo.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setProjectMaster(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching project master data:", error);
      });
  }, []);

  useEffect(() => {
    if (formData.ProjectID) {
      axios
        .get(`https://apiforcornershost.cubisysit.com/api/api-fetch-projectwings.php?ProjectID=${formData.ProjectID}`)
        .then((response) => {
          if (response.data.status === "Success") {
            setWingData(response.data.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching wing data:", error);
        });
    }
  }, [formData.ProjectID]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set file state
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmitFile = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please select a file.");
      return;
    }

    // Create a FormData object
    const formDataFile = new FormData();
    formDataFile.append("file", file);
    formDataFile.append("ProjectID", formData.ProjectID);
    formDataFile.append("WingID", formData.WingID);
    formDataFile.append("Status", formData.Status);
    formDataFile.append("CreateUID", formData.CreateUID);

    console.log(formDataFile, "dekh bhaiiiiiii");

    try {
      setLoading(true);
      const response = await axios.post(
        "http://3.108.228.197:3000/proxy_u",
        formDataFile,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "Success") {
        console.log("Hogaya submit");

        Swal.fire({
          icon: "success",
          title: "File uploaded successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        show(false); // Optional: Close modal or handle other UI updates
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to upload file.",
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to upload file.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: 20 }}>
              Upload Excel File to Insert Data
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Project Name</InputLabel>
              <Select
                value={formData.ProjectID}
                onChange={handleInputChange}
                name="ProjectID"
                label="Project Name"
              >
                {projectMaster.map((project) => (
                  <MenuItem key={project.ProjectID} value={project.ProjectID}>
                    {project.ProjectName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Wings</InputLabel>
              <Select
                value={formData.WingID} // Corrected: Changed WingData to WingID
                onChange={handleInputChange}
                name="WingID" // Corrected: Changed WingData to WingID
                label="Wings"
              >
                {wingData.map((wing) => (
                  <MenuItem key={wing.WingID} value={wing.WingID}>
                    {wing.WingName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileChange}
              style={{ marginBottom: "10px" }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleSubmitFile}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload File"}
            </Button>
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

export default Addenquirysource;
