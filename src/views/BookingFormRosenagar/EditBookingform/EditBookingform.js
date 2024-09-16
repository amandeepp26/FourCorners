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
import CancelIcon from "@mui/icons-material/Cancel";

import MuiAlert from "@mui/material/Alert";
import { useCookies } from "react-cookie";
import { toWords } from "number-to-words";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useRouter } from "next/router";
import { format } from "date-fns";

const EditBookingform = ({ show, bookingID, goBack , handleCloseEditForm}) => {
  const router = useRouter();
  const initialRemark = {
    BookingremarkID: "",
    RemarkName: "",
    RemarkDate: null, 
    AmountTypeID: "",
    Remarkamount: "",
    Loan: 0,
    Register: 0,
  };
  const initialFormData = {
    BookingDate: null,
    BookingID: "",
    Mobile: "",
    BookingRef: "",
    Name: "",
    Address: "",
    BookedByID: "",
    Pancard: "",
    Email: "",
    BookingType: "",
    ParkingAvilability: "",
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
    // CreateUID: 1,
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
  const [wingData, setWingData] = useState([]);
  const [parking, setParking] = useState([]);
  const [error, setError] = useState(null);
  const [bookedByOptions, setBookedByOptions] = useState([]);
  const [bhkOptions, setBhkOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [cookies, setCookie] = useCookies(["amr"]);

  useEffect(() => {
    if (bookingID) {
      console.log(
        bookingID,
        "Edit data aaya dekhooooo"
      );
      fetchData();
    } else {
      console.error("bookingID is undefined");
    }
  }, [bookingID]);

  const fetchData = async () => {
    if (!bookingID) {
      console.error("bookingID is undefined when fetchData is called");
      return;
    }

    try {
      const response = await axios.get(
        `https://apiforcorners.cubisysit.com/api/api-edit-projectbooking.php?BookingID=${bookingID}`
      );
      console.log("Data received:<<<<<>>>>>>>>", response.data);
      const res = response.data.data;

      setFormData({
        ...formData,
        BookingremarkID: res.BookingremarkID || "",
        BookingID: res.BookingID || "",
        Name: res.BookingName || "",
        SourceName: res.SourceName || "",
        Address: res.Address || "",
        Pancard: res.Pancard || "",
        Aadhar: res.Aadhar || "",
        Mobile: res.Mobile || "",
        Email: res.Email || "",
        BookingType: res.BookingType || "",
        ProjectID: res.ProjectID || "",
        WingID: res.WingID || "",
        FloorNo: res.FloorNo || "",
        FlatNo: res.FlatNo || "",
        UnittypeID: res.UnittypeID || "",
        ParkingAvilability: res.ParkingAvilability || "",
        Area: res.Area || "",
        Ratesqft: res.Ratesqft || "",
        BookingRef: res.BookingRef || "",
        TtlAmount: res.TtlAmount || "",
        AmountTypeID: res.AmountTypeID || "",
        Charges: res.Charges || "",
        ParkingFacility: res.ParkingFacility || "",
        Advocate: res.Advocate || "",
        FlatCost: res.FlatCost || "",
        Gst: res.Gst || "",
        StampDuty: res.StampDuty || "",
        Registration: res.Registration || "",
        ExtraCost: res.ExtraCost || "",
        TotalCost: res.TotalCost || "",
        FlatCostInWords: res.FlatCostInWords || "",
        BookingDate: res.BookingDate || "",
        BookedByID: res.BookedByID || "",
        UsableArea: res.UsableArea || "",
        AgreementCarpet: res.AgreementCarpet || "",
      });

      setRemarks(res.remarksWithCreateDate || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };

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
    const { name, type, checked, value } = event.target; // Extract `name`
  
    if (index !== undefined && field !== undefined) {
      // Handle remarks update
      const newRemarks = [...remarks];
      newRemarks[index][field] = type === "checkbox" ? (checked ? 1 : 0) : value;
      setRemarks(newRemarks);
    } else {
      // Clear error for the field being changed
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined,
      }));
  
      // Handle specific fields like 'Mobile', 'TotalCost', etc.
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
        const newTtlAmount = (parseFloat(newArea) || 0) * (parseFloat(newRatesqft) || 0);
  
        setFormData((prevFormData) => ({
          ...prevFormData,
          Area: newArea,
          Ratesqft: newRatesqft,
          TtlAmount: newTtlAmount.toFixed(2),
        }));
      } else {
        // Default update for other fields
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value, // Correctly update the field based on `name`
        }));
      }
  
      // Additional calculation for FlatCost
      const { TtlAmount, Charges, ParkingFacility, Advocate } = {
        ...formData,
        [name]: value,
      };
  
      if (["TtlAmount", "Charges", "ParkingFacility", "Advocate"].includes(name)) {
        const newFlatCost = 
          (parseFloat(TtlAmount) || 0) + 
          (parseFloat(Charges) || 0) + 
          (parseFloat(ParkingFacility) || 0) + 
          (parseFloat(Advocate) || 0);
  
        const FlatCostInWords = numberToWordsIndian(parseInt(newFlatCost || 0));
  
        setFormData((prevFormData) => ({
          ...prevFormData,
          FlatCost: newFlatCost.toFixed(2),
          FlatCostInWords: FlatCostInWords.charAt(0).toUpperCase() + FlatCostInWords.slice(1),
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
      TtlAmount: formData.Area * formData.Ratesqft,
    }));
  }, [formData.Ratesqft, formData.Area]);

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
          setBookedByOptions(response.data.data);
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
            console.log(Area, "see this area in builtupp");
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
  
    // URL for the API request
    const url = `https://ideacafe-backend.vercel.app/api/proxy/api-update-projectbooking.php`;
  
    // Format remarks to match the API format and include BookingRemarkID
    const formattedRemarks = remarks.map((remark) => ({
      BookingremarkID: remark.BookingremarkID || "", // Include BookingRemarkID
      Remarkamount: remark.Remarkamount ? parseFloat(remark.Remarkamount) : 0, // Convert to number or fallback to 0
      RemarkName: remark.RemarkName || "",
      RemarkDate: remark.RemarkDate
        ? format(new Date(remark.RemarkDate), "yyyy-MM-dd")
        : null,
      AmountTypeID: remark.AmountTypeID || "",
      Loan: remark.Loan || 0,
      Proccess: remark.Proccess || "",
      Status: 1,
      ModifyUID: cookies?.amr?.UserID || 1,
    }));
  
    // Structure the data as per the API requirement
    const dataToSend = {
      ...formData, // All other form data like BookingDate, Mobile, etc.
      BookingID: bookingID, // Ensure this is included
      BookingremarkData: formattedRemarks, // Add the formatted remarks with BookingRemarkID
    };
  
    console.log(dataToSend, "Data to Send<<<<>>>>>>>>>>>>><<<<<<<<");
  
    try {
      const response = await axios.post(url, dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.data.status === "Success") {
        console.log(response.data, "Submission successful<>>>>>>>>>>>>>>>");
  
        setFormData(initialFormData); // Reset form data
        setRemarks([initialRemark]); // Reset remarks
  
        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Data Updated Successfully",
          showConfirmButton: false,
          timer: 1000,
        });
  
        // Close the modal after success
        handleCloseEditForm();  // Call the function to close the modal
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    } catch (error) {
      // Handle error case
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
      {/* <IconButton
              aria-label="cancel"
              // onClick={handleClose}
              sx={{ position: "absolute", top: 6, right: 10 }}
            >
              <CancelIcon sx={{ color: "red" }} />
            </IconButton> */}
      <Card sx={{ height: "auto" }}>
        <CardContent>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box>
              <Typography
                variant="body2"
                sx={{ marginTop: 5, fontWeight: "bold", fontSize: 20 }}
              >
                {bookingID ? "Edit Booking Details" : "Edit Booking Details"}
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
    name="Pancard" // Make sure the `name` corresponds to the field in `formData`
    placeholder="Pan Card Number"
    value={formData.Pancard} // Ensure the value is correctly bound from `formData`
    onChange={handleChange} // Correctly pass the `handleChange` function
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
      value={formData.FloorNo || ''} // Ensure default value if undefined
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
      value={formData.FlatNo || ''} // Ensure default value if undefined
      onChange={handleChange}
      name="FlatNo"
      label="Flat Number"
    >
      {flatNoData.length > 0 ? (
        flatNoData.map((wing, index) => (
          <MenuItem
            key={`${wing.FlatNo}-${index}`}
            value={wing.FlatNo}
          >
            {wing.FlatNo}
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled>No flats available</MenuItem>
      )}
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
                  value={formData.TtlAmount} // Ensure this is set correctly in `setFormData`
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
                  <Grid item xs={4}>
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
                  <Grid item xs={4}>
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
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      selected={
                        remark.RemarkDate && remark.RemarkDate !== "0000-00-00"
                          ? new Date(remark.RemarkDate)
                          : null
                      }
                      onChange={(date) => handleDateRemarks(date, index)}
                      dateFormat="yyyy-MM-dd"
                      customInput={<TextField label="Remark Date" fullWidth />}
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
                  <Grid item xs={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={remark.Registraion === 1} // Note the typo here, make sure it's consistent
                          onChange={(e) =>
                            handleChange(e, index, "Registraion")
                          } // Use "Registraion" to match the API response
                        />
                      }
                      label="Register" // This is the label text; it can be "Register" or anything you want
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
              {bookingID
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

export default EditBookingform;
