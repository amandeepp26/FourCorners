import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import Card from "@mui/material/Card";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import dynamic from "next/dynamic"; 
import "react-quill/dist/quill.snow.css"; 

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false }); 

const AddContact = ({ show, editData }) => {
  const [cookies] = useCookies(["amr"]);
  
  const initialFormData = {
    TName: editData ? editData.TName : "",
    templatetypeID: editData ? editData.templatetypeID : "",
    file: null,
    ProjectID: editData ? editData.ProjectID : "",
    content: editData ? editData.content : "",
    CreateUID: cookies.amr?.UserID || 1,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [templateTypes, setTemplateTypes] = useState([]);
  const [projectTypeData, setProjectTypeData] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchTemplateTypes();
    fetchProject();
  }, []);

  const fetchTemplateTypes = async () => {
    try {
      const response = await axios.get("https://apiforcornershost.cubisysit.com/api/api-fetch-templatetype.php");
      if (response.data.status === "Success") {
        setTemplateTypes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching template types:", error);
    }
  };

  const fetchProject = async () => {
    try {
      const response = await axios.get("https://apiforcornershost.cubisysit.com/api/api-fetch-projectmaster.php");
      if (response.data.status === "Success") {
        setProjectTypeData(response.data.data);
      } else {
        console.error("Failed to fetch projects:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData({
      ...formData,
      file: file,
    });
  };

  const handleEditorChange = (value) => {
    setFormData({
      ...formData,
      content: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    const url = editData
      ? "https://proxy-forcorners.vercel.app/api/proxy/api-update-contacts.php"
      : "https://proxy-forcorners.vercel.app/api/proxy/api-insert-template.php";
  
    const dataToSend = {
      TName: formData.TName,
      templatetypeID: formData.templatetypeID,
      ProjectID: formData.ProjectID,
      content: formData.content,
      CreateUID: formData.CreateUID,
    };
  
    try {
      // First, upload the file and get the file path
      if (formData.filePath) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", formData.file);
        
        const uploadResponse = await axios.post("https://apiforcornershost.cubisysit.com/api/template", formDataUpload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
  
        if (uploadResponse.data.status === "Success") {
          dataToSend.filePath = uploadResponse.data.filePath; // Add the file path to the data
        } else {
          setSubmitError(true);
          console.error("Image upload failed:", uploadResponse.data.message);
          return;
        }
      }
  
      // Now send the main data as JSON
      const response = await axios.post(url, dataToSend, {
        headers: {
          "Content-Type": "application/json", // Send data as JSON
        },
      });
  
      if (response.data.status === "Success") {
        setFormData(initialFormData);
        setErrors({});
        setSubmitSuccess(true);
        setSubmitError(false);
        show(false);
  
        Swal.fire({
          icon: "success",
          title: editData ? "Data Updated Successfully" : "Data Added Successfully",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          window.location.reload();
        });
      } else {
        setSubmitError(true);
        console.error("Submission failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(true);
    }
  };
  

  const validateForm = (formData) => {
    let errors = {};

    if (!formData.TName) {
      errors.TName = "Template Name is required";
    }
    if (!formData.templatetypeID) {
      errors.templatetypeID = "Template Type is required";
    }
    if (!formData.ProjectID) {
      errors.ProjectID = "Project is required";
    }

    return errors;
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box>
              <Typography variant="body2" sx={{ marginTop: 5, fontWeight: "bold", fontSize: 20 }}>
                {editData ? "Edit Template Details" : "Add Template Details"}
              </Typography>
            </Box>
          </Grid>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="TName"
                  label="Template Name"
                  value={formData.TName}
                  onChange={handleChange}
                  error={!!errors.TName}
                  helperText={errors.TName}
                />
              </Grid>
              <Grid item xs={8} sm={6}>
                <FormControl fullWidth error={!!errors.ProjectID}>
                  <InputLabel>
                    Select Project
                    <span style={{ color: "red", marginLeft: "5px" }}>*</span>
                  </InputLabel>
                  <Select
                    value={formData.ProjectID}
                    name="ProjectID"
                    onChange={handleChange}
                    label="Select Project"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {projectTypeData.map((project) => (
                      <MenuItem key={project.ProjectID} value={project.ProjectID}>
                        {project.ProjectName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.ProjectID && (
                    <Typography variant="caption" color="error">
                      {errors.ProjectID}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.templatetypeID}>
                  <InputLabel>Template Type</InputLabel>
                  <Select
                    name="templatetypeID"
                    value={formData.templatetypeID}
                    onChange={handleChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {templateTypes.map((type) => (
                      <MenuItem key={type.templatetypeID} value={type.templatetypeID}>
                        {type.templatetypeName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.templatetypeID && (
                    <MuiAlert severity="error">{errors.templatetypeID}</MuiAlert>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    border: "1px dashed #ccc",
                    borderRadius: "4px",
                    padding: "16px",
                    textAlign: "center",
                  }}
                >
                  <input
                    type="file"
                    name="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outlined" component="span">
                      Choose Image
                    </Button>
                  </label>
                  {formData.file && (
                    <Typography variant="body2" sx={{ marginTop: 1 }}>
                      {formData.file.name}
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <ReactQuill
                  value={formData.content}
                  onChange={handleEditorChange}
                  placeholder="Write content here..."
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-start" sx={{ mt: 3 }}>
              <Grid item>
                <Button type="submit" variant="contained" color="primary">
                  {editData ? "Update Template" : "Add Template"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={submitSuccess}
        autoHideDuration={6000}
        onClose={() => setSubmitSuccess(false)}
      >
        <MuiAlert elevation={6} variant="filled" onClose={() => setSubmitSuccess(false)} severity="success">
          {editData ? "Template updated successfully!" : "Template added successfully!"}
        </MuiAlert>
      </Snackbar>

      <Snackbar
        open={submitError}
        autoHideDuration={6000}
        onClose={() => setSubmitError(false)}
      >
        <MuiAlert elevation={6} variant="filled" onClose={() => setSubmitError(false)} severity="error">
          Failed to {editData ? "update template" : "add template"}. Please try again later.
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default AddContact;
