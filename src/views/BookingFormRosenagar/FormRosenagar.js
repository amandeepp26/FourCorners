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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Card from "@mui/material/Card";
import Swal from "sweetalert2";
import moment from "moment";
import {
  Snackbar,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  Autocomplete,
  InputAdornment,
  IconButton,
  Checkbox,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useCookies } from "react-cookie";
import { toWords } from "number-to-words";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useRouter } from "next/router";
import { format } from "date-fns";

const FormRosenagar = ({ onFormSubmitSuccess, show, editData }) => {
  const router = useRouter();

  console.log(editData, "Edit data aaya");
  const initialRemark = {
    RemarkName: "",
    RemarkDate: null, // or new Date() if you want a default date
    AmountTypeID: "",
    Remarkamount: "",
    Loan: 0,
  };

  const initialFormData = {
    BookingDate: null,
    BookedByID: "",
    Mobile: "",
    BookingRef: "",
    Name: "",
    Address: "",
    Pancard: "",
    Email: "",
    BookingType: "",
    area: "",
    TtlAmount: "",
    Charges: "",
    Aadhar: "",
    ParkingFacility: "",
    ParkingID: "",
    FlatCost: "",
    FlatCostInWords: "",
    Gst: "",
    StampDuty: "",
    Registration: "",
    Ratesqft: "",
    UnittypeID: "",
    Advocate: "",
    ExtraCost: "",
    TotalCost: "",
    UsableArea: "",
    AgreementCarpet: "",
    Area: "",
    ProjectID: "",
    SourceName: "",
    WingID: "",
    FlatNo: "",
    FloorNo: "",
    Status: 1,
    CreateUID: 1,
  };

  const [remarks, setRemarks] = useState([initialRemark]);
  const [formData, setFormData] = useState(initialFormData);
  const [projectMaster, setProjectMaster] = useState([]);
  const [floor, setFloor] = useState([]);
  const [flatNoData, setFlatNoData] = useState([]);
  const [areainbuiltup, setAreainbuiltup] = useState([]);
  const [bookingTypes, setBookingTypes] = useState([]);
  const [unitTypeData, setUnitTypeData] = useState([]);
  const [amountTypes, setAmountTypes] = useState([]);
  const [cNames, setCNames] = useState([]);
  const [selectedCid, setSelectedCid] = useState("");
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [wingData, setWingData] = useState([]);
  const [parking, setParking] = useState([]);

  const [bookedByOptions, setBookedByOptions] = useState([]);
  const [bhkOptions, setBhkOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [cookies, setCookie] = useCookies(["amr"]);

  useEffect(() => {
    const storedNotification = localStorage.getItem("selectedNotification");

    if (storedNotification) {
      const notificationData = JSON.parse(storedNotification);
      console.log("Fetched Notification Data:", notificationData); // Log the data

      setFormData({
        ...formData,
        Cid: notificationData.Cid || "",
        Name: notificationData.CName || "",
        SourceName: notificationData.SourceName || "",
        Address: notificationData.Address || "",
        Pancard: notificationData.Pancard || "",
        Aadhar: notificationData.Aadhar || "",
        Mobile: notificationData.Mobile || "",
        Email: notificationData.Email || "",
        BookingType: notificationData.BookingType || "",
        ProjectID: notificationData.ProjectID || "",
        WingID: notificationData.WingID || "",
        FloorNo: notificationData.FloorNo || "",
        FlatNo: notificationData.FlatNo || "",
        UnittypeID: notificationData.UnittypeID || "",
        Area: notificationData.Area || "",
        Ratesqft: notificationData.Ratesqft || "",
        TtlAmount: notificationData.TtlAmount || "",
        Charges: notificationData.Charges || "",
        ParkingFacility: notificationData.ParkingFacility || "",
        Advocate: notificationData.Advocate || "",
        FlatCost: notificationData.FlatCost || "",
        Gst: notificationData.Gst || "",
        StampDuty: notificationData.StampDuty || "",
        Registration: notificationData.Registration || "",
        ExtraCost: notificationData.ExtraCost || "",
        TotalCost: notificationData.TotalCost || "",
        FlatCostInWords: notificationData.FlatCostInWords || "",
        BookingDate: notificationData.BookingDate || "",
        BookedByID: notificationData.BookedByID || "",
        UsableArea: notificationData.UsableArea || "",
        AgreementCarpet: notificationData.AgreementCarpet || "",
        remarks: notificationData.remarks || [],
      });

      localStorage.removeItem("selectedNotification");
    }
  }, []);

  const numberToWordsIndian = (num) => {
    const singleDigits = [
      "",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
    ];
    const twoDigits = [
      "",
      "",
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ];
    const tenToNineteen = [
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
    ];

    const convertTwoDigits = (n) => {
      if (n < 10) return singleDigits[n];
      if (n < 20) return tenToNineteen[n - 10];
      return (
        twoDigits[Math.floor(n / 10)] +
        (n % 10 ? " " + singleDigits[n % 10] : "")
      );
    };

    const convertThreeDigits = (n) => {
      return (
        (n >= 100 ? singleDigits[Math.floor(n / 100)] + " hundred " : "") +
        convertTwoDigits(n % 100)
      );
    };

    if (num === 0) return "zero";

    let result = "";
    let crore = Math.floor(num / 10000000);
    let lakh = Math.floor((num % 10000000) / 100000);
    let thousand = Math.floor((num % 100000) / 1000);
    let hundred = num % 1000;

    if (crore > 0) result += convertTwoDigits(crore) + " crore ";
    if (lakh > 0) result += convertTwoDigits(lakh) + " lakh ";
    if (thousand > 0) result += convertTwoDigits(thousand) + " thousand ";
    if (hundred > 0) result += convertThreeDigits(hundred);

    return result.trim();
  };

  useEffect(() => {
    const numericValue = parseInt(formData?.TotalCost?.replace(/,/g, "") || 0);
    const FlatCostInWords = numberToWordsIndian(numericValue);
    setFormData((prevFormData) => ({
      ...prevFormData,
      FlatCostInWords:
        FlatCostInWords.charAt(0).toUpperCase() + FlatCostInWords.slice(1),
    }));
  }, [formData.TotalCost]);

  const handleChange = (event, index, field) => {
    const { type, checked, value } = event.target;
    const name = event.target.name;

    if (index !== undefined && field !== undefined) {
      const newRemarks = [...remarks];

      if (type === "checkbox") {
        newRemarks[index][field] = checked ? 1 : 0;
      } else {
        newRemarks[index][field] = value;
      }

      setRemarks(newRemarks);
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined,
      }));

      if (name === "Mobile" || name === "AlternateMobileNo") {
        const numericValue = value.replace(/\D/g, "");
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: numericValue,
        }));
      } else if (name === "TotalCost") {
        const numericValue = value.replace(/,/g, "");
        const formattedValue = formatNumber(numericValue);

        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: formattedValue,
        }));
      } else if (name === "Area" || name === "Ratesqft") {
        const newArea = name === "Area" ? value : formData.Area;
        const newRatesqft = name === "Ratesqft" ? value : formData.Ratesqft;
        const newTtlAmount =
          (parseFloat(newArea) || 0) * (parseFloat(newRatesqft) || 0);

        setFormData((prevFormData) => ({
          ...prevFormData,
          Area: name === "Area" ? value : prevFormData.Area,
          Ratesqft: name === "Ratesqft" ? value : prevFormData.Ratesqft,
          TtlAmount: newTtlAmount.toFixed(2),
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      }

      const { TtlAmount, Charges, ParkingFacility, Advocate } = formData;
      if (
        name === "TtlAmount" ||
        name === "Charges" ||
        name === "ParkingFacility" ||
        name === "Advocate"
      ) {
        const newFlatCost =
          (parseFloat(TtlAmount) || 0) +
          (parseFloat(Charges) || 0) +
          (parseFloat(ParkingFacility) || 0) +
          (parseFloat(Advocate) || 0);

        const FlatCostInWords = numberToWordsIndian(parseInt(newFlatCost || 0));

        setFormData((prevFormData) => ({
          ...prevFormData,
          FlatCost: newFlatCost.toFixed(2),
          FlatCostInWords:
            FlatCostInWords.charAt(0).toUpperCase() + FlatCostInWords.slice(1),
        }));
      }
    }
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    const {
      TtlAmount,
      Charges,
      ParkingFacility,
      Advocate,
      Gst,
      StampDuty,
      Registration,
      ExtraCost,
    } = formData;
    const newFlatCost =
      (parseFloat(TtlAmount) || 0) +
      (parseFloat(Charges) || 0) +
      (parseFloat(ParkingFacility) || 0) +
      (parseFloat(Advocate) || 0);
    const newTotalCost =
      newFlatCost +
      (parseFloat(Gst) || 0) +
      (parseFloat(StampDuty) || 0) +
      (parseFloat(Registration) || 0) +
      (parseFloat(ExtraCost) || 0);
    setFormData((prevFormData) => ({
      ...prevFormData,
      FlatCost: newFlatCost.toFixed(2),
      TotalCost: newTotalCost.toFixed(2),
    }));
  }, [
    formData.TtlAmount,
    formData.Charges,
    formData.ParkingFacility,
    formData.Advocate,
    formData.Gst,
    formData.StampDuty,
    formData.Registration,
    formData.ExtraCost,
  ]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      TtlAmount: formData.area * areainbuiltup,
    }));
  }, [areainbuiltup, formData.area]);

  useEffect(() => {
    if (formData.WingID) {
      axios
        .get(
          `https://apiforcorners.cubisysit.com/api/api-booking-floor.php?WingID=${formData.WingID}`
        )
        .then((response) => {
          if (response.data.status === "Success") {
            setFloor(response.data.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching wing data:", error);
        });
    }
  }, [formData.WingID]);

  useEffect(() => {
    // Fetch amount types from the API
    const fetchAmountTypes = async () => {
      try {
        const response = await axios.get(
          "https://apiforcorners.cubisysit.com/api/api-dropdown-amountype.php"
        );
        setAmountTypes(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching amount types:", error);
        setLoading(false);
      }
    };

    fetchAmountTypes();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://apiforcorners.cubisysit.com/api/api-fetch-usersales.php"
        );
        if (response.data && response.data.data) {
          setBookedByOptions(response.data.data); // Use response.data.data to set the options
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    axios
      .get("https://apiforcorners.cubisysit.com/api/api-fetch-bookingtype.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setBookingTypes(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching booking types:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        "https://apiforcorners.cubisysit.com/api/api-dropdown-projectinfo.php"
      )
      .then((response) => {
        if (response.data.status === "Success") {
          setProjectMaster(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching project master data:", error);
      });
  }, []);

  useEffect(() => {
    if (formData.ProjectID) {
      axios
        .get(
          `https://apiforcorners.cubisysit.com/api/api-fetch-projectwings.php?ProjectID=${formData.ProjectID}`
        )
        .then((response) => {
          if (response.data.status === "Success") {
            setWingData(response.data.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching wing data:", error);
        });
    }
  }, [formData.ProjectID]);

  useEffect(() => {
    if (formData.ProjectID) {
      axios
        .get(
          `https://apiforcorners.cubisysit.com/api/api-fetch-parking.php?ProjectID=${formData.ProjectID}`
        )
        .then((response) => {
          if (response.data.status === "Success") {
            console.log(response.data.data, "checkkk it<<<<<<<<");
            setParking(response.data.data || []); // Ensure data is set as an array
          }
        })
        .catch((error) => {
          console.error("Error fetching parking data:", error);
        });
    }
  }, [formData.ProjectID]);

  useEffect(() => {
    if (formData.WingID && formData.ProjectID && formData.FloorNo) {
      axios
        .get(
          `https://apiforcorners.cubisysit.com/api/api-booking-flat.php?WingID=${formData.WingID}&ProjectID=${formData.ProjectID}&FloorNo=${formData.FloorNo}`
        )
        .then((response) => {
          if (response.data.status === "Success") {
            console.log("Flat No Data:", response.data.data); // Log the fetched data
            setFlatNoData(response.data.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching flat number data:", error);
        });
    }
  }, [formData.WingID, formData.ProjectID, formData.FloorNo]);

  useEffect(() => {
    if (
      formData.WingID &&
      formData.ProjectID &&
      formData.FloorNo &&
      formData.FlatNo &&
      formData.UnittypeID
    ) {
      axios
        .get(
          `https://apiforcorners.cubisysit.com/api/api-booking-area.php?ProjectID=${formData.ProjectID}&WingID=${formData.WingID}&FloorNo=${formData.FloorNo}&FlatNo=${formData.FlatNo}&UnittypeID=${formData.UnittypeID}`
        )
        .then((response) => {
          if (response.data.status === "Success") {
            console.log("Flat No Data:", response.data.data); // Log the fetched data
            const { Area, UsableArea, AgreementCarpet } = response.data.data[0];
            setAreainbuiltup(Area); // Set the Area value
            setFormData((prevFormData) => ({
              ...prevFormData,
              Area,
              UsableArea,
              AgreementCarpet,
            })); // Update formData with Area, UsableArea, and AgreementCarpet values
          }
        })
        .catch((error) => {
          console.error("Error fetching flat number data:", error);
        });
    }
  }, [
    formData.WingID,
    formData.ProjectID,
    formData.FloorNo,
    formData.FlatNo,
    formData.UnittypeID,
  ]); // Use separate dependencies

  useEffect(() => {
    const fetchUnitTypeData = async () => {
      try {
        const response = await axios.get(
          `https://apiforcorners.cubisysit.com/api/api-booking-type.php`,

          {
            params: {
              WingID: formData.WingID,
              ProjectID: formData.ProjectID,
              FloorNo: formData.FloorNo,
              FlatNo: formData.FlatNo,
            },
          }
        );

        if (response.data.status === "Success") {
          console.log("Unit Type Data:", response.data.data);
          setUnitTypeData(response.data.data);
        } else {
          console.error(
            "API request failed with status:",
            response.data.status
          );
        }
      } catch (error) {
        console.error("Error fetching unit type data:", error);
      }
    };

    if (formData.FlatNo) {
      fetchUnitTypeData();
    }
  }, [formData.FlatNo, formData.WingID, formData.ProjectID, formData.FloorNo]);

  useEffect(() => {
    const userid = cookies.amr?.UserID || "Role";

    axios
      .get(
        `https://apiforcorners.cubisysit.com/api/api-fetch-convertbooking.php?UserID=${userid}`
      )
      .then((response) => {
        if (response.data.status === "Success") {
          setCNames(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleAddRemark = () => {
    setRemarks([...remarks, { ...initialRemark }]);
  };

  const handleRemoveRemark = (index) => {
    const updatedRemarks = [...remarks];
    updatedRemarks.splice(index, 1);
    setRemarks(updatedRemarks);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = editData
      ? "https://ideacafe-backend.vercel.app/api/proxy/api-update-telecalling.php"
      : "https://ideacafe-backend.vercel.app/api/proxy/api-insert-projectbooking.php";

    const formattedRemarks = remarks.map((remark, index) => ({
      ...remark,
      RemarkDate: remark.RemarkDate
        ? format(new Date(remark.RemarkDate), "yyyy-MM-dd")
        : null,
      RemarkUpdateID: index + 1,
      Status: 1,
      CreateUID: 1,
    }));
    console.log(formattedRemarks, "Formatted Remarks");

    const dataToSend = {
      ...formData,

      Remarks: formattedRemarks,
    };

    console.log(dataToSend, "Data to Send");

    try {
      const response = await axios.post(url, dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "Success") {
        console.log(response.data.data, "Submission successful");
        const { BookingID } = response.data;
        onFormSubmitSuccess(BookingID);
        setFormData(initialFormData);
        setRemarks([{ ...initialRemark }]);

        Swal.fire({
          icon: "success",
          title: "Data Added Successfully",
          showConfirmButton: false,
          timer: 1000,
        });

        // Navigate to the desired page with BookingID
        // window.location.href = `/TemplateRosenagar?BookingID=${BookingID}`;
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    } catch (error) {
      console.error("There was an error!", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
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

  const handleDateChange = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    setFormData({ ...formData, BookingDate: formattedDate });
  };

  const handleDateRemarks = (date, index) => {
    const updatedRemarks = [...remarks];
    updatedRemarks[index] = { ...updatedRemarks[index], RemarkDate: date };
    setRemarks(updatedRemarks);
  };

  const handleSelectChange = async (event) => {
    const selectedCid = event.target.value;
    setSelectedCid(selectedCid);

    try {
      const apiUrl = `https://apiforcorners.cubisysit.com/api/api-singel-convertbooking.php?Cid=${selectedCid}`;
      const response = await axios.get(apiUrl);

      if (response.data.status === "Success") {
        console.log("data dekh ", response.data.data);
        const data = response.data.data;

        // Assuming you want to set the first item from the array
        if (data.length > 0) {
          const fetchedData = data[0];

          setFormData({
            Cid: fetchedData.Cid || "",
            Name: fetchedData.CName || "",
            Mobile: fetchedData.Mobile || "",
            Email: fetchedData.Email || "",
            SourceName: fetchedData.SourceName || "",
            Status: 1,
            CreateUID: 1,
            BookingDate: null,
          });
        } else {
          console.warn("No data available for the selected Cid.");
        }
      } else {
        console.error("API response status not success:", response.data);
      }
    } catch (error) {
      console.error("Error fetching single telecalling data:", error);
    }
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
                {editData ? "Edit Booking Details" : "Add Booking Details"}
              </Typography>
            </Box>
          </Grid>
          <form style={{ marginTop: "50px" }}>
            <Grid container spacing={7}>
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="Name of the Purchaser"
                  name="Name"
                  placeholder="Name of the Purchaser"
                  value={formData.Name}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="Source Name"
                  name="SourceName"
                  value={formData.SourceName || ""}
                  onChange={handleChange}
                  inputProps={{
                    pattern: "[0-9]*",
                    maxLength: 10,
                  }}
                />
                {/* Add error handling for Mobile if needed */}
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label={<>Address</>}
                  name="Address"
                  placeholder="Address"
                  value={formData.Address}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label={<>Pan Card Number</>}
                  name="Pancard"
                  placeholder="Pan Card Number"
                  value={formData.Pancard}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label={<>Aadhar Card Numberr</>}
                  name="Aadhar"
                  placeholder="Aadhar Card Number"
                  value={formData.Aadhar}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="Mobile"
                  name="Mobile"
                  value={formData.Mobile || ""}
                  onChange={handleChange}
                  inputProps={{
                    pattern: "[0-9]*",
                    maxLength: 10,
                  }}
                />
                {/* Add error handling for Mobile if needed */}
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="Email"
                  name="Email"
                  value={formData.Email || ""}
                  onChange={handleChange}
                />
                {/* Add error handling for Email if needed */}
              </Grid>

              {/* Other form fields */}
              <Grid item xs={8} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Type of Booking</InputLabel>
                  <Select
                    label="Type of Booking"
                    name="BookingType"
                    value={formData.BookingType || ""}
                    onChange={handleChange}
                  >
                    {bookingTypes.map((type) => (
                      <MenuItem key={type.BookingType} value={type.BookingType}>
                        {type.BookingTypeName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Other form fields */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Project Name</InputLabel>
                  <Select
                    value={formData.ProjectID}
                    onChange={handleChange}
                    name="ProjectID"
                    label="Project Name"
                  >
                    {projectMaster.map((project, index) => (
                      <MenuItem
                        key={`${project.ProjectID}-${index}`}
                        value={project.ProjectID}
                      >
                        {project.ProjectName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Wings</InputLabel>
                  <Select
                    value={formData.WingID}
                    onChange={handleChange}
                    name="WingID"
                    label="Wings"
                  >
                    {wingData.map((wing, index) => (
                      <MenuItem
                        key={`${wing.WingID}-${index}`}
                        value={wing.WingID}
                      >
                        {wing.WingName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Floor</InputLabel>
                  <Select
                    value={formData.FloorNo}
                    onChange={handleChange}
                    name="FloorNo"
                    label="Floor"
                  >
                    {floor.map((wing, index) => (
                      <MenuItem
                        key={`${wing.FloorNo}-${index}`}
                        value={wing.FloorNo}
                      >
                        {wing.FloorNo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Flat Number</InputLabel>
                  <Select
                    value={formData.FlatNo}
                    onChange={handleChange}
                    name="FlatNo"
                    label="Flat Number"
                  >
                    {flatNoData.map((flat, index) => (
                      <MenuItem
                        key={`${flat.FlatNo}-${index}`}
                        value={flat.FlatNo}
                      >
                        {flat.FlatNo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Unit Type</InputLabel>
                  <Select
                    value={formData.UnittypeID}
                    onChange={handleChange}
                    name="UnittypeID"
                    label="Unit Type"
                  >
                    {unitTypeData.map((unit) => (
                      <MenuItem key={unit.UnittypeID} value={unit.UnittypeID}>
                        {unit.UnittypeName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="Area in Builtup"
                  name="Area"
                  placeholder="Area in Builtup"
                  value={formData.Area}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="Usable Area in Sqft"
                  name="UsableArea"
                  placeholder="Usable Area in sqft"
                  value={formData.UsableArea}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="Agreement Carpet (RERA) in Sqft"
                  name="AgreementCarpet"
                  placeholder="Agreement Carpet"
                  value={formData.AgreementCarpet}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="Rate per Sqft"
                  name="Ratesqft"
                  placeholder="Rate per Sqft"
                  value={formData.Ratesqft}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="TTL Amount As Per Builtup"
                  name="TtlAmount"
                  placeholder="TTL Amount as per Builtup"
                  value={formData.TtlAmount}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="Development Charges"
                  name="Charges"
                  placeholder="Development Charges"
                  value={formData.Charges}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="Parking Facility"
                  name="ParkingFacility"
                  placeholder="Parking Facility"
                  value={formData.ParkingFacility}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Parking</InputLabel>
                  <Select
                    value={formData.ParkingID}
                    onChange={handleChange}
                    name="ParkingID"
                    label="Parking"
                  >
                    {parking.map((flat) => (
                      <MenuItem key={flat.ParkingID} value={flat.ParkingID}>
                        {flat.ParkingAvilability}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="Advocate Fees"
                  name="Advocate"
                  placeholder="Advocate"
                  value={formData.Advocate}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="Gross Flat Cost"
                  name="FlatCost"
                  placeholder="Flat Cost"
                  value={formData.FlatCost}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                    inputProps: { style: { textAlign: "left" } },
                  }}
                  type="text"
                />
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="GST"
                  name="Gst"
                  placeholder="GST As per Govt. Notification"
                  value={formData.Gst}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="Stamp Duty Fee"
                  name="StampDuty"
                  placeholder="Stamp Duty As per Govt. Notification"
                  value={formData.StampDuty}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="Registration Fee"
                  name="Registration"
                  placeholder="Registration As per Govt. Notification"
                  value={formData.Registration}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="Extra Cost"
                  name="ExtraCost"
                  placeholder="Extra Cost"
                  value={formData.ExtraCost}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                    inputProps: { style: { textAlign: "left" } },
                  }}
                  type="text"
                />
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="Total Cost"
                  name="TotalCost"
                  placeholder="Total Cost"
                  value={formData.TotalCost}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                    inputProps: { style: { textAlign: "left" } },
                  }}
                  type="text"
                />
              </Grid>
              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="Amount in Words"
                  name="FlatCostInWords"
                  value={formData.FlatCostInWords}
                  InputProps={{
                    readOnly: true,
                  }}
                  type="text"
                />
              </Grid>

              <Grid item xs={8} sm={4}>
                <TextField
                  fullWidth
                  label="Booking Ref"
                  name="BookingRef"
                  placeholder="Booking Ref"
                  value={formData.BookingRef}
                  onChange={handleChange}
                  type="text"
                />
              </Grid>

              <Grid item xs={8} sm={4}>
                <DatePicker
                  selected={
                    formData.BookingDate ? new Date(formData.BookingDate) : null
                  }
                  onChange={handleDateChange}
                  dateFormat="dd-MM-yyyy"
                  className="form-control"
                  customInput={
                    <TextField
                      fullWidth
                      label={<>Booking Date</>}
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
                  <InputLabel>Booked By</InputLabel>
                  <Select
                    name="BookedByID"
                    value={formData.BookedByID}
                    onChange={handleChange}
                    label="Booked By"
                  >
                    {bookedByOptions?.map((option) => (
                      <MenuItem key={option.UserID} value={option.UserID}>
                        {option.Name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* <Grid item xs={12} sm={4}>
                <input
                  accept="image/*"
                  id="contained-button-file"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <label htmlFor="contained-button-file">
                  <Typography variant="body1" component="span">
                    Choose Image File
                  </Typography>
                </label>
                {formData.imageFile && (
                  <Typography variant="body1">
                    {formData.imageFile.name}
                  </Typography>
                )}
              </Grid> */}

              {remarks.map((remark, index) => (
                <Grid container item spacing={2} key={index}>
                  {/* Amount Field */}
                  <Grid item xs={2}>
                    <TextField
                      fullWidth
                      label={`Amount ${index + 1}`}
                      value={remark.Remarkamount}
                      onChange={(e) => handleChange(e, index, "Remarkamount")}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                        inputProps: { style: { textAlign: "left" } },
                      }}
                      type="text"
                    />
                  </Grid>

                  {/* Amount Type Dropdown */}
                  <Grid item xs={2}>
                    <FormControl fullWidth>
                      <InputLabel>Amount Type</InputLabel>
                      <Select
                        value={remark.AmountTypeID || ""}
                        onChange={(e) => handleChange(e, index, "AmountTypeID")}
                        label="Amount Type"
                      >
                        {amountTypes.map((type) => (
                          <MenuItem
                            key={type.AmountTypeID}
                            value={type.AmountTypeID}
                          >
                            {type.AmountTypeName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Remark Field */}
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label={`Remark ${index + 1}`}
                      value={remark.RemarkName}
                      onChange={(e) => handleChange(e, index, "RemarkName")}
                    />
                  </Grid>

                  {/* Date Field */}
                  <Grid item xs={4}>
                    <DatePicker
                      selected={remark.RemarkDate}
                      onChange={(date) => handleDateRemarks(date, index)}
                      dateFormat="dd-MM-yyyy"
                      customInput={
                        <TextField fullWidth label="Expected Date" />
                      }
                    />
                  </Grid>

                  {/* Loan Process Checkbox */}
                  <Grid item xs={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={remark.Loan === 1}
                          onChange={(e) => handleChange(e, index, "Loan")}
                        />
                      }
                      label="Loan Process"
                    />
                  </Grid>

                  {/* Add and Delete Buttons */}
                  {index === remarks.length - 1 && (
                    <Grid item xs={2}>
                      <IconButton
                        color="primary"
                        sx={{ color: "#1976d2" }}
                        onClick={handleAddRemark}
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        sx={{ color: "#f44336", ml: 1 }}
                        onClick={() => handleRemoveRemark(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              ))}

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

export default FormRosenagar;
