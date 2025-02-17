import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { City } from "mdi-material-ui";

const AddEnquiryDetails = ({ show }) => {
  const [date, setDate] = useState(null);
  const [nextFollowupDate, setNextFollowupDate] = useState(null);
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [mobile, setMobile] = useState("");
  const [AlternateMobileNo, setalternateMobile] = useState("");

  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [city, setcity] = useState("");
  const [state, setstate] = useState("");


  const [leadStatus, setLeadStatus] = useState("");
  const [pincode, setPincode] = useState("");
  const [email, setEmail] = useState(""); 
  const [profession, setProfession] = useState("");
  const [projectName, setProjectName] = useState("");
  const [subProject, setSubProject] = useState("");
  const [flatType1, setFlatType1] = useState("");
  const [noOfFlatsRequired, setNoOfFlatsRequired] = useState("");
  const [desiredFloor, setDesiredFloor] = useState("");
  const [possessionPreference, setPossessionPreference] = useState("");
  const [estimatedBudget, setEstimatedBudget] = useState("");
  const [sourceOfFunds, setSourceOfFunds] = useState("");
  const [source, setSource] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [sourceDescription, setSourceDescription] = useState("");
  const [customerComments, setCustomerComments] = useState("");
  const [followupThrough, setFollowupThrough] = useState("");
  const [attendedBy, setAttendedBy] = useState("");

  const handleSubmitData = async (event) => {
    event.preventDefault();

    const body = {
      Date: date,
      Title: title,
      Name: name,
      CountryCode: countryCode,
      Mobile: mobile,
      AlternateMobileNo: AlternateMobileNo,
      Address: address,
      Location: location,
      City: City,
      State: state,
      Country: countryCode,
      LeadStatus: leadStatus,
      Pincode: pincode,
      Email: email,
      Profession: profession,
      ProjectName: projectName,
      SubProject: subProject,
      FlatType1: flatType1,
      NoOfFlatsRequired: noOfFlatsRequired,
      DesiredFloor: desiredFloor,
      PossessionPreference: possessionPreference,
      EstimatedBudget: estimatedBudget,
      SourceOfFunds: sourceOfFunds,
      Source: source,
      SourceName: sourceName,
      SourceDescription: sourceDescription,
      CustomerComments: customerComments,
      NextFollowupDate: nextFollowupDate,
      FollowupThrough: followupThrough,
      AttendedBy: attendedBy,
    };

    try {
      const response = await axios.post(
        "https://proxy-forcorners.vercel.app/api/proxy/api-insert-enquirydetails.php",
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
        setNextFollowupDate(null);
        setTitle("");
        setName("");
        setCountryCode("");
        setMobile("");
        setAddress("");
        setLocation("");
        setLeadStatus("");
        setPincode("");
        setEmail("");
        setProfession("");
        setProjectName("");
        setSubProject("");
        setFlatType1("");
        setNoOfFlatsRequired("");
        setDesiredFloor("");
        setPossessionPreference("");
        setEstimatedBudget("");
        setSourceOfFunds("");
        setSource("");
        setSourceName("");
        setSourceDescription("");
        setCustomerComments("");
        setFollowupThrough("");
        setAttendedBy("");
      } else {
        // Handle submit error
      }
    } catch (error) {
      console.error("There was an error!", error);
      // Handle submit error
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmitData}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                dateFormat="yyyy-MM-dd"
                customInput={
                  <TextField
                    fullWidth
                    label="Date"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Country Code"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="AlternateMobile"
                value={AlternateMobileNo}
                onChange={(e) => setalternateMobile(e.target.value)}
              />
            </Grid>
           
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Location"
                value={Location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                value={city}
                onChange={(e) => setcity(e.target.value)}
              />
              
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Lead Status"
                value={leadStatus}
                onChange={(e) => setLeadStatus(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                value={state}
                onChange={(e) => setstate(e.target.value)}
              />
            </Grid>
              
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Profession"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Project Name"
                value={projectName                 }
                onChange={(e) => setProjectName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Sub Project"
                value={subProject}
                onChange={(e) => setSubProject(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Flat Type 1"
                value={flatType1}
                onChange={(e) => setFlatType1(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="No. of Flats Required"
                value={noOfFlatsRequired}
                onChange={(e) => setNoOfFlatsRequired(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Desired Floor"
                value={desiredFloor}
                onChange={(e) => setDesiredFloor(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Possession Preference"
                value={possessionPreference}
                onChange={(e) => setPossessionPreference(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Estimated Budget"
                value={estimatedBudget}
                onChange={(e) => setEstimatedBudget(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Source of Funds"
                value={sourceOfFunds}
                onChange={(e) => setSourceOfFunds(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Source Name"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Source Description"
                value={sourceDescription}
                onChange={(e) => setSourceDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Customer Comments"
                value={customerComments}
                onChange={(e) => setCustomerComments(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DatePicker
                selected={nextFollowupDate}
                onChange={(date) => setNextFollowupDate(date)}
                dateFormat="yyyy-MM-dd"
                customInput={
                  <TextField
                    fullWidth
                    label="Next Follow-up Date"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Follow-up Through"
                value={followupThrough}
                onChange={(e) => setFollowupThrough(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Attended By"
                value={attendedBy}
                onChange={(e) => setAttendedBy(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddEnquiryDetails;