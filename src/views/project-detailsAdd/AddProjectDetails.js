/** @format */

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
import Card from "@mui/material/Card";
import axios from "axios";
import { Snackbar, Checkbox, ListItemText } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";

const AddProjectDetails = ({ show, setShowUploadExcel, editData }) => {
  const [cookies] = useCookies(["amr"]);
  const initialFormData = {
    reraregistration: "",
    CompanyID: "",
    ProjectID: "",
    address: "",
    WingName: [],
    images: null, // Single image field
    Status: 1,
    CreateUID: cookies.amr?.UserID || 1,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [companyTypeData, setCompanyTypeData] = useState([]);
  const [projectTypeData, setProjectTypeData] = useState([]);
  const [selectedWings, setSelectedWings] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const RequiredIndicator = () => {
    return <span style={{ color: "red", marginLeft: "5px" }}>*</span>;
  };

  useEffect(() => {
    fetchCompany();
    fetchProject();
  }, []);

  const wingsData = Array.from({ length: 15 }, (_, i) => ({
    WingID: i + 1,
    WingName: i + 1,
  }));

  const handleFormDataChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchCompany = () => {
    axios
      .get("https://apiforcorners.cubisysit.com/api/api-fetch-companymaster.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setCompanyTypeData(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching company data:", error);
      });
  };

  const fetchProject = () => {
    axios
      .get("https://apiforcorners.cubisysit.com/api/api-fetch-projectmaster.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setProjectTypeData(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching project data:", error);
      });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
debugger;
    // FormData to send as a POST request
    const formDataToSubmit = new FormData();

    // Validate required fields before submitting the form
    if (
        !formData.CompanyID ||
        !formData.ProjectID ||
        !formData.reraregistration ||
        !formData.address ||
        !formData.Status ||
        !formData.CreateUID ||
        !formData.WingName.length ||
        !formData.images
    ) {
        setSubmitError(true);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill in all required fields including uploading an image and selecting wings.',
        });
        return;
    }
debugger;
    // Append fields to FormData
    Object.keys(formData).forEach((key) => {
        if (key === "images" && formData.images) {
            // For image field, append the image file
            formDataToSubmit.append("images", formData.images);
        } else if (key === "WingName") {
            // WingName should be a JSON array, so we stringify it before appending
            formDataToSubmit.append(key, JSON.stringify(formData[key]));
        } else if (Array.isArray(formData[key])) {
            // If it's an array (like WingName[]), append each item
            formData[key].forEach((item) => {
                formDataToSubmit.append(`${key}[]`, item);
            });
        } else {
            // For other fields, append as key-value pairs
            formDataToSubmit.append(key, formData[key]);
        }
    });

    const url = editData
        ? "https://proxy-forcorners.vercel.app/api/proxy/api-update-projectinfo.php"
        : "https://apiforcornershost.cubisysit.com/api/api-insert-projectinfo.php";

    try {
        const response = await axios.post(url, formDataToSubmit, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        // Log the response data for debugging
        console.log(response.data);
        console.log(formDataToSubmit);
        if (response.data.status === "Success") {
            setFormData(initialFormData);

            Swal.fire({
                icon: "success",
                title: editData ? "Data Updated Successfully" : "Data Added Successfully",
                showConfirmButton: false,
                timer: 1000,
            }).then(() => {
                localStorage.setItem('showUploadExcel', 'true');
                window.location.reload();
            });
            setErrors({});
            setShowUploadExcel(true);
        } else {
            setSubmitSuccess(false);
            setSubmitError(true);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: response.data.message || 'Something went wrong, please try again.',
            });
        }
    } catch (error) {
        console.error("There was an error!", error);
        setSubmitSuccess(false);
        setSubmitError(true);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.message || 'An error occurred while submitting the form. Please try again.',
        });
    }
};

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSubmitSuccess(false);
    setSubmitError(false);
  };
  return (
    <>
      <Card sx={{ height: "auto" }}>
        <CardContent>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box>
              <Typography
                variant="body2"
                sx={{ marginTop: 5, fontWeight: "bold", fontSize: 20 }}
              >
                {editData ? "Edit Project Details" : "Add Project Details"}
              </Typography>
            </Box>
          </Grid>

          <form style={{ marginTop: "50px" }} onSubmit={handleSubmit}>
            <Grid container spacing={7}>
              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>
                    Select Company
                    <RequiredIndicator />
                  </InputLabel>
                  <Select
                    value={formData.CompanyID}
                    name="CompanyID"
                    onChange={handleFormDataChange}
                    label={<>Select Company</>}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {companyTypeData.map((company) => (
                      <MenuItem
                        key={company.CompanyID}
                        value={company.CompanyID}
                      >
                        {company.CompanyName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.CompanyID && (
                    <Typography variant="caption" color="error">
                      {errors.CompanyID}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>
                    Select Project
                    <RequiredIndicator />
                  </InputLabel>
                  <Select
                    value={formData.ProjectID}
                    name="ProjectID"
                    onChange={handleFormDataChange}
                    label={<>Select Project</>}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {projectTypeData.map((project) => (
                      <MenuItem
                        key={project.ProjectID}
                        value={project.ProjectID}
                      >
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
              <Grid item xs={8} sm={4}>
                <Typography>
                  Upload Image <RequiredIndicator />
                </Typography>
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  onChange={(e) => {
                    setFormData({ ...formData, images: e.target.files[0] }); 
                  }}
                />
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label={<>RERA Registration</>}
                  type="text"
                  name="reraregistration"
                  value={formData.reraregistration}
                  onChange={handleFormDataChange}
                />
                {errors.reraregistration && (
                  <Typography variant="caption" color="error">
                    {errors.reraregistration}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label={<>Address</>}
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleFormDataChange}
                />
                {errors.address && (
                  <Typography variant="caption" color="error">
                    {errors.address}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>
                    Select Wings
                    <RequiredIndicator />
                  </InputLabel>
                  <Select
                    multiple
                    value={formData.WingName}
                    name="WingName"
                    onChange={handleFormDataChange}
                    renderValue={(selected) => selected.join(", ")}
                  >
                    {wingsData.map((wing) => (
                      <MenuItem key={wing.WingID} value={wing.WingName}>
                        <Checkbox
                          checked={formData.WingName.includes(wing.WingName)}
                        />
                        <ListItemText primary={wing.WingName} />
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.WingName && (
                    <Typography variant="caption" color="error">
                      {errors.WingName}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={4}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ marginTop: 2 }}
                >
                  {editData ? "Update" : "Submit"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AddProjectDetails;
