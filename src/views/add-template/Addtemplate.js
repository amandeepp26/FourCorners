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
import Swal from 'sweetalert2';
import Card from "@mui/material/Card";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import { useCookies } from "react-cookie";
import {
  Snackbar,
} from "@mui/material";

const AddContact = ({ show, editData }) => {
  const initialFormData = {
    TName: "",
    templatetypeID: "",
    para: "",
    file: null, // For storing the file object
    url: ""
  };

  const [cookies, setCookie] = useCookies(["amr"]);
  const [formData, setFormData] = useState(initialFormData);
  const [templateTypes, setTemplateTypes] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    fetchTemplateTypes();
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData({
      ...formData,
      file: file,
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
      : "https://proxy-forcorners.vercel.app/api/proxy/api-insert-contacts.php";

    // Prepare form data to send
    const formDataToSend = new FormData();
    formDataToSend.append("TName", formData.TName);
    formDataToSend.append("templatetypeID", formData.templatetypeID);
    formDataToSend.append("para", formData.para);
    formDataToSend.append("file", formData.file); 
    formDataToSend.append("url", formData.url);

    try {
      const response = await axios.post(url, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data", 
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
        setSubmitSuccess(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(true);
      setSubmitSuccess(false);
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

    return errors;
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box>
              <Typography
                variant="body2"
                sx={{ marginTop: 5, fontWeight: "bold", fontSize: 20 }}
              >
                {editData
                  ? "Edit Template Details"
                  : "Add Template Details"}
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
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.templatetypeID}>
                  <InputLabel>Template Type</InputLabel>
                  <Select
                    name="templatetypeID"
                    value={formData.templatetypeID}
                    onChange={handleChange}
                  >
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
                <TextField
                  fullWidth
                  name="para"
                  label="Paragraph"
                  value={formData.para}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {/* Input for file upload */}
                <input
                  type="file"
                  name="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                  onChange={handleFileChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="url"
                  label="URL"
                  value={formData.url}
                  onChange={handleChange}
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
        onClose={() => setSubmitError(false)} >
        <MuiAlert elevation={6} variant="filled" onClose={() => setSubmitError(false)} severity="error">
          Failed to {editData ? "update template" : "add template"}. Please try again later.
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default AddContact;
