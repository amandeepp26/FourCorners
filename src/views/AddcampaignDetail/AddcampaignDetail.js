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
import EditIcon from "@mui/icons-material/Edit";
import GetAppIcon from "@mui/icons-material/GetApp";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Card from "@mui/material/Card";
import Swal from "sweetalert2";
import {
  Snackbar,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  Autocomplete,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const AddcampaignDetails = ({ show, editData }) => {
  console.log(editData, "Edit data aaya");
  const initialFormData = {
    name: "",
    campaigntypeID: "",
    templateID: "",
    CustomerTypeID: "",
    ContactTypeID: "",
    UserID: "",
    SubmittedID: "",
    FromDate: "",
    ToDate: "",
    CityID: "",
    LocationID: "",
    SourceID: "",
    SourceTypeID: "",
    ScheduleID: "",
    CreateUID: "",

    titleprefixID: "",
    Cid: "",
    CName: "",
    Mobile: "",
    AlternateMobileNo: "",
    TelephoneNo: null,
    AlternateTelephoneNo: null,
    Email: "",
    ProjectID: "",
    EstimatedbudgetID: "",
    leadstatusID: "",
    Comments: "",
    Location: "",
    FollowupThrough: "",
    NextFollowUpDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
    NextFollowUpTime: getCurrentTime(),
    SourceID: "",
    SourceName: "",
    SourceDescription: "",
    TelecallAttendedByID: "",
    SmsNotification: 0,
    EmailNotification: 0,
    ModifyUID: 1,
    Tid: "",
    UnittypeID: "",
    Countrycode: "",
    Status: 1,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [compaignTypeData, setCampaignTypedata] = useState([]);
  const [campaignUpdateApi, setCampaignUpdateApi] = useState([]);
  const [campaignDataApi, setCampaignDataApi] = useState([]);
  const [campaignInsertApi, setCampaignInsertApi] = useState([]);
  const [templateData, setTemplatedata] = useState([]);
  const [customerTypeData, setCustomerTypeData] = useState([]);
  const [contactTypeData, setContactTypeData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [submittedData, setSubmittedData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [sourceTypeData, setSourceTypeData] = useState([]);
  const [scheduleType, setScheduleType] = useState([]);

  const [titles, setTitles] = useState([]);
  const [errors, setErrors] = useState({});
  const [projectTypes, setProjectTypes] = useState([]);
  const [source, setSource] = useState([]);
  const [cNames, setCNames] = useState([]);
  const [selectedCid, setSelectedCid] = useState("");
  const [estimatedBudget, setEstimatedBudget] = useState([]);
  const [leadStatus, setLeadStatus] = useState([]);
  const [userMaster, setUserMaster] = useState([]);
  const [tellecallingID, setTellecallingID] = useState([]);
  const [bhkOptions, setBhkOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [item, setItem] = useState(null);
  const [rowDataToUpdate, setRowDataToUpdate] = useState(null);

  useEffect(() => {
    fetchData();
    fetchDataBhk();
    fetchDataTellecalling();
    fetchDataTitle();
    campaignUpdate();
    campaignData();
    campaignInsert();
  }, []);

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        NextFollowUpDate: editData.NextFollowUpDate
          ? new Date(editData.NextFollowUpDate)
          : null,
        NextFollowUpTime: editData.NextFollowUpTime || "",
      });
    }
  }, [editData]);

  // Fetch source, estimated budget, lead status, and user master data (similar to your existing useEffects)

  useEffect(() => {
    axios
      .get("https://apiforcorners.cubisysit.com/api/api-fetch-source.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setSource(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://apiforcorners.cubisysit.com/api/api-fetch-campaign.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setCampaignDataApi(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://apiforcorners.cubisysit.com/api/api-update-campaign.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setSource(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://apiforcorners.cubisysit.com/api/api-fetch-cid.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setCNames(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://apiforcorners.cubisysit.com/api/api-dropdown-estimatedbudget.php"
      )
      .then((response) => {
        if (response.data.status === "Success") {
          setEstimatedBudget(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://apiforcorners.cubisysit.com/api/api-fetch-leadstatus.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setLeadStatus(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://apiforcorners.cubisysit.com/api/api-fetch-usermaster.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setUserMaster(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://apiforcorners.cubisysit.com/api/api-update-campaign.php ")
      .then((response) => {
        if (response.data.status === "Success") {
          setCampaignUpdateApi(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://apiforcorners.cubisysit.com/api/api-insert-campaign.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setCampaignInsertApi(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://apiforcorners.cubisysit.com/api/api-fetch-citymaster.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setCityData(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const fetchDataBhk = async () => {
    try {
      const response = await axios.get(
        "https://apiforcorners.cubisysit.com/api/api-fetch-unittype.php"
      );
      setBhkOptions(response.data.data || []);
    } catch (error) {
      console.error("Error fetching Bhk data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://apiforcorners.cubisysit.com/api/api-dropdown-projectmaster.php"
      );
      setProjectTypes(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataTellecalling = async () => {
    try {
      const response = await axios.get(
        "https://apiforcorners.cubisysit.com/api/api-fetch-telecalling.php"
      );
      setTellecallingID(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataTitle = async () => {
    try {
      const response = await axios.get(
        "https://apiforcorners.cubisysit.com/api/api-fetch-titleprefix.php"
      );
      setTitles(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const campaignUpdate = async () => {
    try {
      const response = await axios.get(
        "https://apiforcorners.cubisysit.com/api/api-update-campaign.php "
      );
      setCampaignUpdateApi(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const campaignData = async () => {
    try {
      const response = await axios.get(
        "https://apiforcorners.cubisysit.com/api/api-fetch-campaign.php"
      );
      setCampaignDataApi(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const campaignInsert = async () => {
    try {
      const response = await axios.get(
        "https://apiforcorners.cubisysit.com/api/api-insert-campaign.php"
      );
      setCampaignInsertApi(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSelectChange = async (event) => {
    const selectedCid = event.target.value;
    setSelectedCid(selectedCid);

    try {
      const apiUrl = `https://apiforcorners.cubisysit.com/api/api-singel-contacts.php?Cid=${selectedCid}`;
      const response = await axios.get(apiUrl);

      if (response.data.status === "Success") {
        console.log(
          "Single telecalling data fetched for telecalling:",
          response.data
        );
        const fetchedData = response.data.data;
        console.log(fetchedData, "see this cc");

        // Update formData state with all fetched data
        setFormData({
          titleprefixID: fetchedData.TitleID || "",
          Cid: fetchedData.Cid || "",
          CName: fetchedData.CName || "",
          Mobile: fetchedData.Mobile || "",
          AlternateMobileNo: fetchedData.OtherNumbers || "",
          TelephoneNo: null, // Set as null if not available in fetched data
          AlternateTelephoneNo: null, // Set as null if not available in fetched data
          Email: fetchedData.Email || "",
          ProjectID: "", // Assuming ProjectID is not available in fetched data
          EstimatedbudgetID: "", // Assuming EstimatedbudgetID is not available in fetched data
          leadstatusID: "", // Assuming leadstatusID is not available in fetched data
          Comments: "", // Assuming Comments are not available in fetched data
          Location: fetchedData.LocationID || "",
          FollowupThrough: "", // Assuming FollowupThrough is not available in fetched data
          NextFollowUpDate: new Date(
            new Date().getTime() + 2 * 24 * 60 * 60 * 1000
          ),
          NextFollowUpTime: getCurrentTime(),
          SourceID: fetchedData.SourceID || "",
          SourceName: fetchedData.SourceName || "",
          SourceDescription: "", // Assuming SourceDescription is not available in fetched data
          TelecallAttendedByID: fetchedData.UserID || "",
          SmsNotification: 0, // Assuming SmsNotification default value
          EmailNotification: 0, // Assuming EmailNotification default value
          ModifyUID: 1, // Assuming ModifyUID is constant
          Tid: "", // Assuming Tid is not available in fetched data
          UnittypeID: "", // Assuming UnittypeID is not available in fetched data
          Countrycode: fetchedData.CountryCode || "",
          Status: 1, // Assuming Status default value
        });
      } else {
        console.error("API response status not success:", response.data);
      }
    } catch (error) {
      console.error("Error fetching single telecalling data:", error);
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!item) return; // Exit if no item is provided
  //     try {
  //       const apiUrl = `https://apiforcorners.cubisysit.com/api/api-singel-contacts.php?Cid=${item.Cid}`;
  //       const response = await axios.get(apiUrl);

  //       console.log("seee this", response.data); // Log the API response to debug

  //       if (response.data.status === "Success") {
  //         console.log(
  //           response.data,
  //           "Single telecalling data fetched for telecalling"
  //         );
  //         // Update item state with fetched data
  //         setRowDataToUpdate(response.data);
  //       } else {
  //         console.error("API response status not success:", response.data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching single telecalling data:", error);
  //     }
  //   };
  //   fetchData();
  // }, [item]);

  const handleNotificationChange = (event) => {
    const value = event.target.value === "sms" ? 1 : 0;
    setFormData({
      ...formData,
      SmsNotification: value,
      EmailNotification: value === 1 ? 0 : 1,
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Clear error for the field when it's being edited
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));

    // Update formData state based on the field name
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Handle specific formatting or validation logic if needed
    if (name === "Mobile" || name === "AlternateMobileNo") {
      const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: numericValue,
      }));
    }
  };

  const RequiredIndicator = () => {
    return <span style={{ color: "red", marginLeft: "5px" }}>*</span>;
  };

  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  useEffect(() => {
    // Set the default value to current time when the component mounts
    setFormData((prev) => ({
      ...prev,
      NextFollowUpTime: getCurrentTime(),
    }));
  }, []);

  useEffect(() => {
    fetchCompaignType();
    fetchTemplate();
    fetchCustomers();
    fetchSchedule();
    fetchSource();
    fetchSourceType();
    fetchCity();
    fetchLocation();
    fetchSubmittedBy();
  }, []);

  const fetchCompaignType = () => {
    axios
      .get("https://apiforcorners.cubisysit.com/api/api-fetch-campaigntype.php")
      .then((response) => {
        console.warn("response of campaign type---->", response);
        if (response.data.status === "Success") {
          setCampaignTypedata(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchTemplate = () => {
    axios
      .get("https://apiforcorners.cubisysit.com/api/api-dropdown-template.php")
      .then((response) => {
        console.warn("response of template type---->", response);
        if (response.data.status === "Success") {
          setTemplatedata(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchCustomers = () => {
    axios
      .get("https://apiforcorners.cubisysit.com/api/api-fetch-customertype.php")
      .then((response) => {
        console.warn("response of customers type---->", response);
        if (response.data.status === "Success") {
          setCustomerTypeData(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchSchedule = () => {
    axios
      .get("https://apiforcorners.cubisysit.com/api/api-dropdown-schedule.php")
      .then((response) => {
        console.warn("response of customers type---->", response);
        if (response.data.status === "Success") {
          setScheduleType(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchContactType = (e) => {
    axios
      .get(
        `https://apiforcorners.cubisysit.com/api/api-fetch-contacttype.php?CustomerTypeID=${e}`
      )
      .then((response) => {
        console.warn("response of customers type---->", response);
        if (response.data.status === "Success") {
          setContactTypeData(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchSource = () => {
    axios
      .get("https://apiforcorners.cubisysit.com/api/api-fetch-source.php")
      .then((response) => {
        console.warn("response of customers type---->", response);
        if (response.data.status === "Success") {
          setSourceData(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchSourceType = (e) => {
    axios
      .get(
        `https://apiforcorners.cubisysit.com/api/api-fetch-sourcetype.php?SourceID=${e}`
      )
      .then((response) => {
        console.warn("response of customers type---->", response);
        if (response.data.status === "Success") {
          setSourceTypeData(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchCity = () => {
    axios
      .get("https://apiforcorners.cubisysit.com/api/api-fetch-citymaster.php")
      .then((response) => {
        console.warn("response of customers type---->", response);
        if (response.data.status === "Success") {
          setCityData(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchLocation = () => {
    axios
      .get(
        "https://apiforcorners.cubisysit.com/api/api-fetch-locationmaster.php"
      )
      .then((response) => {
        console.warn("response of customers type---->", response);
        if (response.data.status === "Success") {
          setLocationData(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchSubmittedBy = () => {
    axios
      .get("https://apiforcorners.cubisysit.com/api/api-fetch-usermaster.php")
      .then((response) => {
        console.warn("response of customers type---->", response);
        if (response.data.status === "Success") {
          setSubmittedData(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleTemplateChange = (event) => {
    console.warn(event.target);
    setFormData({
      ...formData,
      templateID: event.target.value,
    });
  };

  const handleEstimatedBudget = (event) => {
    setFormData({
      ...formData,
      EstimatedbudgetID: event.target.value,
    });
  };

  const handleTelecaller = (event) => {
    const { value } = event.target;

    setErrors((prevErrors) => ({
      ...prevErrors,
      TelecallAttendedByID: undefined,
    }));

    setFormData({
      ...formData,
      TelecallAttendedByID: value,
    });
  };

  const handleSource = (event) => {
    const { value } = event.target;

    setErrors((prevErrors) => ({
      ...prevErrors,
      SourceID: undefined,
    }));

    setFormData({
      ...formData,
      SourceID: value,
    });
  };

  const handleLeadStatus = (event) => {
    const { value } = event.target;

    setErrors((prevErrors) => ({
      ...prevErrors,
      leadstatusID: undefined,
    }));

    setFormData({
      ...formData,
      leadstatusID: value,
    });
  };

  const handleTitleChange = (event) => {
    const { value } = event.target;

    // Update form data with the new value
    setFormData({
      ...formData,
      titleprefixID: value,
    });

    // Clear error message for titseprefixID
    setErrors((prevErrors) => ({
      ...prevErrors,
      titleprefixID: undefined,
    }));
  };

  useEffect(() => {
    if (tellecallingID.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        Tid: parseInt(tellecallingID[0].Tid) || "",
      }));
    }
  }, [tellecallingID]);

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "titleprefixID",
      "PartyName",
      "Mobile",
      "Countrycode",
      "Email",
      "ProjectID",
      "UnittypeID",
      "leadstatusID",
      "Location",
      "SourceID",
      "TelecallAttendedByID",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form
    // const isValid = validateForm();

    // if (isValid) {
    const url = editData
      ? "https://ideacafe-backend.vercel.app/api/proxy/api-update-telecalling.php"
      : "https://ideacafe-backend.vercel.app/api/proxy/api-insert-telecalling.php";

    console.log(formData, "ALL the data of telecalling");
    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response, "ye res h ");
      if (response.data.status === "Success") {
        setFormData(initialFormData);

        setSubmitSuccess(true);
        setSubmitError(false);
        show(false);

        setErrors({});

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
      } else {
        setSubmitSuccess(false);
        setSubmitError(true);

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    } catch (error) {
      console.error("There was an error!", error);
      setSubmitSuccess(false);
      setSubmitError(true);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
    // } else {
    //   // Handle validation errors if any
    //   console.log("Form validation failed");
    // }
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSubmitSuccess(false);
    setSubmitError(false);
  };
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      NextFollowUpDate: new Date(
        new Date().getTime() + 2 * 24 * 60 * 60 * 1000
      ), // 2 days ahead
    }));
  }, []);

  const handleDateChange = (date) => {
    setFormData({ ...formData, NextFollowUpDate: date });
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
                {editData ? "Edit Campaign Details" : "Add Campaign Details"}
              </Typography>
            </Box>
          </Grid>
          <form style={{ marginTop: "50px" }}>
            <Grid container spacing={7}>
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label={<>Name</>}
                  type="text"
                  name="Name"
                  value={formData.name}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      name: event.target.value,
                    })
                  }
                  inputProps={{
                    pattern: "[0-9]*",
                  }}
                />
                {errors.Name && (
                  <Typography variant="caption" color="error">
                    {errors.Name}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>
                    Campaign Type <RequiredIndicator />
                  </InputLabel>
                  <Select
                    value={formData.campaigntypeID}
                    name="campaigntypeID"
                    onChange={handleChange}
                    label={<>Campaign Type</>}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {projectTypes.map((project) => (
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
                <FormControl fullWidth>
                  <InputLabel>
                    Template <RequiredIndicator />
                  </InputLabel>
                  <Select
                    value={formData.templateID}
                    onChange={handleTemplateChange}
                    label={
                      <>
                        Template ID
                        <RequiredIndicator />
                      </>
                    }
                  >
                    {templateData.map((key) => (
                      <MenuItem key={key.templateID} value={key.templateID}>
                        {key.TName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.UnittypeID && (
                    <Typography variant="caption" color="error">
                      {errors.ProjectID}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Customer Type</InputLabel>
                  <Select
                    value={formData.CustomerTypeID}
                    onChange={(event) => {
                      setFormData({
                        ...formData,
                        CustomerTypeID: event.target.value,
                      });
                      fetchContactType(event.target.value);
                    }}
                    label={
                      <>
                        Customer Type <RequiredIndicator />
                      </>
                    }
                  >
                    {customerTypeData.map((key) => (
                      <MenuItem
                        key={key.CustomerTypeID}
                        value={key.CustomerTypeID}
                      >
                        {key?.CustomerTypeName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.EstimatedbudgetID && (
                    <Typography variant="caption" color="error">
                      {errors.EstimatedbudgetID}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>
                    Contact Type <RequiredIndicator />
                  </InputLabel>
                  <Select
                    value={formData.ContactTypeID}
                    onChange={handleLeadStatus}
                    label={
                      <>
                        Contact Type <RequiredIndicator />
                      </>
                    }
                  >
                    {contactTypeData.map((project) => (
                      <MenuItem
                        key={project.ContactTypeID}
                        value={project.ContactTypeID}
                      >
                        {project.ContactName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.leadstatusID && (
                    <Typography variant="caption" color="error">
                      {errors.leadstatusID}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>
                    User<RequiredIndicator />
                  </InputLabel>
                  <Select
                    value={formData.UserID}
                    onChange={handleLeadStatus}
                    label={
                      <>
                        User<RequiredIndicator />
                      </>
                    }
                  >
                    {submittedData.map((user) => (
                      <MenuItem key={user.UserID} value={user.UserID}>
                        {user.Name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.leadstatusID && (
                    <Typography variant="caption" color="error">
                      {errors.leadstatusID}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>
                    Submitted ID <RequiredIndicator />
                  </InputLabel>
                  <Select
                    value={formData.SubmittedID}
                    onChange={handleSource}
                    label="Submitted To"
                  >
                    {source.map((bhk) => (
                      <MenuItem key={bhk.SourceID} value={bhk.SourceID}>
                        {bhk.SourceName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.SourceID && (
                    <Typography variant="caption" color="error">
                      {errors.SourceID}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={4}>
                <DatePicker
                  selected={formData.FromDate}
                  onChange={handleDateChange}
                  dateFormat="dd-MM-yyyy"
                  className="form-control"
                  customInput={
                    <TextField
                      fullWidth
                      label={
                        <>
                          From Date <RequiredIndicator />
                        </>
                      }
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
                  selected={formData.ToDate}
                  onChange={handleDateChange}
                  dateFormat="dd-MM-yyyy"
                  className="form-control"
                  customInput={
                    <TextField
                      fullWidth
                      label={
                        <>
                          To Date <RequiredIndicator />
                        </>
                      }
                      InputProps={{
                        readOnly: true,
                        sx: { width: "100%" },
                      }}
                    />
                  }
                />
              </Grid>

              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>
                    City ID <RequiredIndicator />
                  </InputLabel>
                  <Select
                    value={formData.CityID}
                    onChange={handleSource}
                    label="City"
                  >
                    {source.map((bhk) => (
                      <MenuItem key={bhk.SourceID} value={bhk.SourceID}>
                        {bhk.SourceName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.SourceID && (
                    <Typography variant="caption" color="error">
                      {errors.SourceID}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>
                    Location ID <RequiredIndicator />
                  </InputLabel>
                  <Select
                    value={formData.LocationID}
                    onChange={handleSource}
                    label="Location"
                  >
                    {source.map((bhk) => (
                      <MenuItem key={bhk.SourceID} value={bhk.SourceID}>
                        {bhk.SourceName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.SourceID && (
                    <Typography variant="caption" color="error">
                      {errors.SourceID}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>
                    Source ID <RequiredIndicator />
                  </InputLabel>
                  <Select
                    value={formData.SourceID}
                    onChange={handleChange}
                    label="Source"
                  >
                    {source.map((bhk) => (
                      <MenuItem key={bhk.Source} value={bhk.Source}>
                        {bhk.SourceName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.SourceID && (
                    <Typography variant="caption" color="error">
                      {errors.SourceID}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>
                    Source Type ID <RequiredIndicator />
                  </InputLabel>
                  <Select
                    value={formData.SourceTypeID}
                    onChange={handleSource}
                    label="Source Type"
                  >
                    {source.map((bhk) => (
                      <MenuItem key={bhk.SourceID} value={bhk.SourceID}>
                        {bhk.SourceName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.SourceID && (
                    <Typography variant="caption" color="error">
                      {errors.SourceID}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>
                    Schedule ID <RequiredIndicator />
                  </InputLabel>
                  <Select
                    value={formData.ScheduleID}
                    onChange={handleSource}
                    label="Schedule"
                  >
                    {source.map((bhk) => (
                      <MenuItem key={bhk.SourceID} value={bhk.SourceID}>
                        {bhk.SourceName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.SourceID && (
                    <Typography variant="caption" color="error">
                      {errors.SourceID}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              {/* <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label={
                    <>
                      Create UID <RequiredIndicator />
                    </>
                  }
                  name="Create UID"
                  placeholder="Create UID"
                  value={formData.CreateUID}
                  onChange={handleChange}
                />
              </Grid> */}

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  sx={{
                    marginRight: 3.5,
                    marginTop: 5,
                    backgroundColor: "#9155FD",
                    color: "#FFFFFF",
                  }}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>

          <Snackbar
            open={submitSuccess}
            autoHideDuration={6000}
            onClose={handleAlertClose}
          >
            <MuiAlert
              onClose={handleAlertClose}
              severity="success"
              sx={{
                width: "100%",
                backgroundColor: "green",
                color: "#ffffff",
              }}
            >
              {editData
                ? "Data Updated Successfully"
                : submitSuccess
                ? "Data Added Successfully"
                : ""}
            </MuiAlert>
          </Snackbar>

          <Snackbar
            open={submitError}
            autoHideDuration={6000}
            onClose={handleAlertClose}
          >
            <MuiAlert
              onClose={handleAlertClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              {submitError.message}
            </MuiAlert>
          </Snackbar>
        </CardContent>
      </Card>
    </>
  );
};

export default AddcampaignDetails;
