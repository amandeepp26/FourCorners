// ** React Imports
import { useEffect, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const AddStampDuty = ({ show }) => {
  const [date, setDate] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [governmentLoadingPercent, setGovernmentLoadingPercent] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [registrationPercent, setRegistrationPercent] = useState("");
  const [unitFloor, setUnitFloor] = useState("");
  const [floor, setFloor] = useState("");

  const [endDateGovernment, setEndDateGovernment] = useState(null);
  const [stampDutyPercent, setStampDutyPercent] = useState("");
  const [rate, setRate] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://apiforcornershost.cubisysit.com/api/api-fetch-subprojectdetails.php"
      );
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmitData = async (event) => {
    event.preventDefault();

    const body = {
      Date: date,
      ProjectName: projectName,
      EndDate: endDateGovernment,
      UnitType: unitFloor,
      Floors:floor,
      GovernmentRate: rate,
      GovernmentLoadingPercent: governmentLoadingPercent,
      StampDutyPercent: stampDutyPercent,
      RegistrationPercent: registrationPercent,
      StartDate: startDate,



    };

    try {
      const response = await axios.post(
        "https://proxy-forcorners.vercel.app/api/proxy/api-insert-stampdutymaster.php",
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "Success") {
        show(false);
        // Clear form fields
        setDate(null);
        setProjectName("");
        setUnitFloor("");
        setStartDate(null);
        setEndDateGovernment(null);
        setRate("");
        setGovernmentLoadingPercent("");
        setStampDutyPercent("");
        setRegistrationPercent("");
      } else {
        console.error("Submit failed:", response.data.message);
      }
    } catch (error) {
      console.error("There was an error!", error);
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
                  Add Stamp Duty Detail
                </Typography>
              </Box>
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
                label="Unit Type "
                placeholder="Unit Type "
                value={unitFloor}
                onChange={(e) => setUnitFloor(e.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Floors "
                placeholder="Floors "
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
              />
            </Grid>

      

        

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label=" Goverment Rate (Per Sq.Mtr)"
                placeholder="Goverment Rate (Per Sq.Mtr)"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </Grid>

           
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Government Loading Percent"
                placeholder="Government Loading Percent"
                value={governmentLoadingPercent}
                onChange={(e) => setGovernmentLoadingPercent(e.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Stamp Duty Percent"
                placeholder="Stamp Duty Percent"
                value={stampDutyPercent}
                onChange={(e) => setStampDutyPercent(e.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Registration Percent"
                placeholder="Registration Percent"
                value={registrationPercent}
                onChange={(e) => setRegistrationPercent(e.target.value)}
              />
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
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                customInput={
                  <TextField
                    fullWidth
                    label="Start Date"
                    InputProps={{
                      readOnly: true,
                      sx: { width: "100%" },
                    }}
                  />
                }
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <DatePicker
                selected={endDateGovernment}
                onChange={(date) => setEndDateGovernment(date)}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                customInput={
                  <TextField
                    fullWidth
                    label="End Date Government"
                    InputProps={{
                      readOnly: true,
                      sx: { width: "100%" },
                    }}
                  />
                }
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

export default AddStampDuty;
