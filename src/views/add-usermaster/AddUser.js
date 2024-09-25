import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Card, CardContent, Typography, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useCookies } from 'react-cookie';

const AddUser = ({ show, editData, fetchDataUser }) => {
   const [cookies, setCookie, removeCookie] = useCookies(["amr"]);
  const [formState, setFormState] = useState({
    UserRoleID: "",
    Name: "",
    MobileNo: "",
    email: "",
    username: "",
    password: "",
    CreateUID: cookies.amr?.UserID || 1,
    UserID: "",
    ModifyUID: 1,
  });

  const [designation, setDesignation] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    if (editData && Object.keys(editData).length !== 0) {
      setFormState({
        UserRoleID: editData.UserRoleID || "",
        Name: editData.Name || "",
        MobileNo: editData.MobileNo || "",
        email: editData.email || "",
        username: editData.username || "",
        password: editData.password || "",
        CreateUID: cookies.amr?.UserID || 1,
        UserID: editData.UserID || "",
        ModifyUID: 1,
      });
    } else {
      setFormState({
        UserRoleID: "",
        Name: "",
        MobileNo: "",
        email: "",
        username: "",
        password: "",
        CreateUID: cookies.amr?.UserID || 1,
        UserID: "",
        ModifyUID: 1,
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  useEffect(() => {
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-dropdown-userrolemaster.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setDesignation(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = editData
      ? "https://proxy-forcorners.vercel.app/api/proxy/api-update-usermaster.php"
      : "https://proxy-forcorners.vercel.app/api/proxy/api-insert-usermaster.php";


      console.log(formState , 'see this');
    try {
      const response = await axios.post(url, formState, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(formState , 'see this');


      if (response.data.status === "Success") {
        setFormState({
          UserRoleID: "",
          Name: "",
          MobileNo: "",
          email: "",
          username: "",
          password: "",
          CreateUID: cookies.amr?.UserID || 1,
          UserID: "",
          ModifyUID: 1,
        });
        fetchDataUser(); // Fetch updated user data
        show(false); // Navigate back to the list view or close the form

        // Show success alert using SweetAlert2
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

        setSubmitSuccess(true);
        setSubmitError(false);
      } else {
        setSubmitSuccess(false);
        setSubmitError(true);
        
        // Show error alert using SweetAlert2
        Swal.fire({
          title: 'Error!',
          text: 'There was an error submitting the form.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error("There was an error!", error);
      setSubmitSuccess(false);
      setSubmitError(true);
      
      // Show error alert using SweetAlert2
      Swal.fire({
        title: 'Error!',
        text: 'There was an error submitting the form.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleUserRoleChange = (event) => {
    setFormState({
      ...formState,
      UserRoleID: event.target.value,
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {editData ? 'Update User' : 'Add User'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="Name"
                value={formState.Name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile Number"
                name="MobileNo"
                value={formState.MobileNo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formState.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formState.username}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                value={formState.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>User Role</InputLabel>
                <Select
                  value={formState.UserRoleID}
                  name="UserRoleID"
                  onChange={handleUserRoleChange}
                  label="UserRoleID"
                >
                  {designation?.map((role) => (
                    <MenuItem key={role.UserRoleID} value={role.UserRoleID}>
                      {role.UserRole}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                {editData ? 'Update' : 'Add'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddUser;
