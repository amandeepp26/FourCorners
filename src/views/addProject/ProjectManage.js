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
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";

const ProjectManage = ({ show, editData }) => {
  const [formData, setFormData] = useState({
    ProjectName: "",
    CompanyID: "",
  });

  const [userMaster, setUserMaster] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const [cookies] = useCookies(["amr"]);

  useEffect(() => {
    if (editData) {
      const { ProjectID, ProjectName, CompanyID, ModifyUID } = editData;

      setFormData({
        ProjectID: ProjectID || "",
        ProjectName: ProjectName || "",
        CompanyID: CompanyID || "",
        ModifyUID: cookies.amr?.UserID || 1, // Set ModifyUID based on cookies
      });
    }
  }, [editData, cookies.amr]);

  useEffect(() => {
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-fetch-companymaster.php")
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmitData = (event) => {
    event.preventDefault();

    const newErrors = validateFields(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const body = {
      ...formData,
      Status: 1,
      CreateUID: cookies.amr?.UserID || 1, // Set CreateUID based on cookies
    };

    const url = editData
      ? "https://proxy-forcorners.vercel.app/api/proxy/api-update-projectmaster.php"
      : "https://proxy-forcorners.vercel.app/api/proxy/api-insert-projectmaster.php";

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
            // Optional: Reload data or perform any necessary actions
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

  const validateFields = (formData) => {
    const newErrors = {};
    if (!formData.ProjectName) {
      newErrors.ProjectName = "Project Name is required";
    }
    return newErrors;
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
                <FormControl fullWidth>
                  <InputLabel>Company Name</InputLabel>
                  <Select
                    value={formData.CompanyID}
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
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Project Name"
                  name="ProjectName"
                  value={formData.ProjectName}
                  onChange={handleInputChange}
                  error={!!errors.ProjectName}
                  helperText={errors.ProjectName}
                />
              </Grid>

              <Grid item xs={12} md={4}>
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

export default ProjectManage;
