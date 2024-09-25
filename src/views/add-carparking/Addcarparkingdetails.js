// ** React Imports
import { useEffect, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import AlertTitle from "@mui/material/AlertTitle";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const Addcarparkingdetails = ({ show }) => {
  const [date, setDate] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [nameOfCompany, setNameOfCompany] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [subProject, setSubProject] = useState("");
  const [carParkingType, setCarParkingType] = useState("");
  const [manualParkingNumber, setManualParkingNumber] = useState("");
  const [parkingLevel, setParkingLevel] = useState("");
  const [comments, setComments] = useState("");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://apiforcornershost.cubisysit.com/api/api-fetchsubprojectdetails.php"
      );
      console.log("API Response:", response.data);
      setRows(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };

  const handleSubmitData = async (event) => {
    event.preventDefault();

    const body = {
      date: date,
      projectname: projectName,
      nameofcompany: nameOfCompany,
      projectcode: projectCode,
      subproject: subProject,
      carparkingtype: carParkingType,
      manualparkingnumber: manualParkingNumber,
      parkinglevel: parkingLevel,
      comments: comments,
    };

    try {
      const response = await axios.post(
        "https://apiforcornershost.cubisysit.com/api/api-insert-carparkingdetails.php",
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "Success") {
        setSubmitSuccess(true);
        setSubmitError(false);
        show(false);
        // Clear form fields
        setDate(null);
        setProjectName("");
        setNameOfCompany("");
        setProjectCode("");
        setSubProject("");
        setCarParkingType("");
        setManualParkingNumber("");
        setParkingLevel("");
        setComments("");
      } else {
        setSubmitSuccess(false);
        setSubmitError(true);
      }
    } catch (error) {
      console.error("There was an error!", error);
      setSubmitSuccess(false);
      setSubmitError(true);
    }
  };

  return (

    <Card>
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box>
              <Typography
                variant="body2"
                sx={{ marginTop: 5, fontWeight: "bold", fontSize: 20 }}
              >
                Manage Car Parking Details
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={8} sm={4}>
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              customInput={
                <TextField
                  fullWidth
                  label="Date"
                  InputProps={{
                    readOnly: true,
                    sx: { width: "100%" },
                  }}
                />
              }
            />
          </Grid>

          <Grid item xs={8} sm={4}>
            <TextField
              fullWidth
              label="Project Name"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </Grid>

          <Grid item xs={8} sm={4}>
            <TextField
              fullWidth
              label="Name of Company"
              placeholder="Name of Company"
              value={nameOfCompany}
              onChange={(e) => setNameOfCompany(e.target.value)}
            />
          </Grid>

          <Grid item xs={8} sm={4}>
            <TextField
              fullWidth
              label="Project Code"
              placeholder="Project Code"
              value={projectCode}
              onChange={(e) => setProjectCode(e.target.value)}
            />
          </Grid>

          <Grid item xs={8} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Sub Project</InputLabel>
              <Select
                value={subProject}
                onChange={(e) => setSubProject(e.target.value)}
                label="Sub Project"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {rows.map((project) => (
                  <MenuItem key={project.ProjectID} value={project.ProjectID}>
                    {project.ProjectName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={8} sm={4}>
            <TextField
              fullWidth
              label="Car Parking Type"
              placeholder="Car Parking Type"
              value={carParkingType}
              onChange={(e) => setCarParkingType(e.target.value)}
            />
          </Grid>

          <Grid item xs={8} sm={4}>
            <TextField
              fullWidth
              label="Manual Parking Number"
              placeholder="Manual Parking Number"
              value={manualParkingNumber}
              onChange={(e) => setManualParkingNumber(e.target.value)}
            />
          </Grid>

          <Grid item xs={8} sm={4}>
            <TextField
              fullWidth
              label="Parking Level"
              placeholder="Parking Level"
              value={parkingLevel}
              onChange={(e) => setParkingLevel(e.target.value)}
            />
          </Grid>

          <Grid item xs={8} sm={4}>
            <TextField
              fullWidth
              label="Comments"
              placeholder="Comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              sx={{ marginRight: 3.5 }}
              onClick={handleSubmitData}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
    </Card>
  );
};

export default Addcarparkingdetails;