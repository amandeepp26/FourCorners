import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import axios from "axios";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";

const TabAccount = ({ show, editData }) => {
  console.log(editData, "edit data of companyyyyyyy");
  
  const [formValues, setFormValues] = useState({
    companyName: "",
    gst: "",
    website: "",
    email: "",
    address: "" // Add Address field here
  });

  const [errors, setErrors] = useState({});
  const [cookies] = useCookies(["amr"]);

  useEffect(() => {
    if (editData) {
      setFormValues({
        companyName: editData.CompanyName || "",
        gst: editData.Gst || "",
        website: editData.Website || "",
        email: editData.Email || "",
        address: editData.Address || "" // Set Address field when editing
      });
    } else {
      setFormValues({
        companyName: "",
        gst: "",
        website: "",
        email: "",
        address: "" // Reset Address field for new entry
      });
    }
  }, [editData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = validateFields();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      const formData = {
        CreateUID: cookies.amr?.UserID || 1,
        CompanyName: formValues.companyName,
        Gst: formValues.gst,
        Website: formValues.website,
        Email: formValues.email,
        Address: formValues.address, // Include Address field in the form data
        Status: 1,
      };

      const apiUrl = editData
        ? "https://proxy-forcorners.vercel.app/api/proxy/api-update-companymaster.php"
        : "https://proxy-forcorners.vercel.app/api/proxy/api-insert-companymaster.php";

      axios
        .post(apiUrl, { ...formData, CompanyID: editData?.CompanyID }, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data.status === "Success") {
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: editData ? "Company details updated successfully" : "Company details added successfully",
            }).then(() => {
              window.location.reload();
            });
            setFormValues({ companyName: "", gst: "", website: "", email: "", address: "" });
            show(); // Assuming this function handles hiding the form or navigating away
          } else {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: editData ? "Failed to update company details" : "Failed to add company details",
            });
          }
        })
        .catch((error) => {
          console.error("There was an error!", error);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "An error occurred while submitting the form",
          });
        });
    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (!formValues.companyName) {
      newErrors.companyName = "Company Name is required";
    }
    if (!formValues.gst) {
      newErrors.gst = "GST is required";
    }
    if (!formValues.website) {
      newErrors.website = "Website is required";
    }
    if (!formValues.email) {
      newErrors.email = "Email is required";
    }
    if (!formValues.address) {
      newErrors.address = "Address is required"; // Validate Address field
    }
    return newErrors;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: 20 }}>
                  {editData ? "Update Company Details" : "Add Company Details"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                placeholder="Company Name"
                value={formValues.companyName}
                onChange={handleInputChange}
                name="companyName"
                error={!!errors.companyName}
                helperText={errors.companyName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="GST"
                placeholder="GST"
                value={formValues.gst}
                onChange={handleInputChange}
                name="gst"
                error={!!errors.gst}
                helperText={errors.gst}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website"
                placeholder="Website"
                value={formValues.website}
                onChange={handleInputChange}
                name="website"
                error={!!errors.website}
                helperText={errors.website}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                placeholder="Email"
                value={formValues.email}
                onChange={handleInputChange}
                name="email"
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                placeholder="Address"
                value={formValues.address}
                onChange={handleInputChange}
                name="address"
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" type="submit">
                {editData ? "Update" : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default TabAccount;
