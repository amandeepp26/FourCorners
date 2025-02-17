import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  CircularProgress,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TablePagination,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/router";
import MenuItem from "@mui/material/MenuItem";
import PersonIcon from '@mui/icons-material/Person';

import { styled } from '@mui/system';
import HistoryIcon from "@mui/icons-material/History";
import CloseIcon from "@mui/icons-material/Close";

import { useCookies } from "react-cookie";
import Select from "@mui/material/Select";

import Avatar from "@mui/material/Avatar";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios"; // Import Axios for API requests
import ApexChartWrapper from "src/@core/styles/libs/react-apexcharts";
import StatisticsCard from "src/views/dashboard/StatisticsCard";
import Trophy from "src/views/dashboard/Trophy";
import WeeklyOverview from "src/views/dashboard/WeeklyOverview";
import TotalEarning from "src/views/dashboard/TotalEarning";
import CardStatisticsVerticalComponent from "src/@core/components/card-statistics/card-stats-vertical";
import SalesByCountries from "src/views/dashboard/SalesByCountries";
import DepositWithdraw from "src/views/dashboard/DepositWithdraw";
import HistoryComponent from "src/components/history";
import {
  HelpCircleOutline,
  BriefcaseVariantOutline,
  Timeline,
} from "mdi-material-ui";
import { Call, Contacts } from "@mui/icons-material";
import PhoneIcon from "@mui/icons-material/Phone";
import TemplatePayment from "src/views/BookingFormRosenagar/TemplatePayment/TemplatePayment";
import ShareIcon from "@mui/icons-material/Share";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

import { Modal } from "@mui/base";
import {
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineContent,
  TimelineSeparator,
  CustomPaper,
  CheckCircleIcon,
  TimelineConnector,
} from "@mui/lab";
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ onHistoryClick }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    FromDate: null,
    ToDate: null,
    SourceID: "",
    UserID: "",
    Status: 1,
  });
  const [cookies] = useCookies(["amr"]);
  const [isLoading, setIsLoading] = useState(false);
  const [telecallingData, setTelecallingData] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [source, setSource] = useState([]);
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenHistory, setOpenHistory] = useState(false);
  const [modalOpenHistoryOppo, setOpenHistoryOppo] = useState(false);
  const [modalOpenContact, setModalOpenContact] = useState(false);
  const [modalOpenBooking, setModalOpenBooking] = useState(false);

  const [modalOpenOpportunity, setModalOpenOpportunity] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [selectedTelecaller, setSelectedTelecaller] = useState(null);
  const userName = cookies.amr?.FullName || "User";
  useEffect(() => {
    if (!cookies || !cookies.amr || !cookies.amr.UserID) {
      router.push("/pages/login");
    }
  }, []);

  const handleDateChange = (date, field) => {
    setFormData({ ...formData, [field]: date });
  };

  const formatCreateDate = (createDate) => {
    if (!createDate) return "";
    const parts = createDate.split(" ");
    const dateParts = parts[0].split("-");
    const time = parts[1];
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]} ${time}`;
    return formattedDate;
  };
  const handleDownload = (type) => {
    debugger;
    setIsLoading(true); // Show loader
    // new code
    console.log("telecallingData:", telecallingData?.data?.bookingRecords?.records, "**************************");
    // if (type === "telecalling") {
    //   setSelectedData(telecallingData?.data?.telecallingRecords?.records || []);
    //   setSelectedType("telecalling");
    // } else if (type == "contacts") {
    //   setSelectedData(telecallingData?.data?.contactsRecords?.records || []);
    //   setSelectedType("contacts");
    // } else if (type == "booking") {
    //   setSelectedData(telecallingData?.data?.bookingRecords?.records || []);
    //   setSelectedType("booking");
    // } else if (type == "opportunity") {
    //   setSelectedData(telecallingData?.data?.opportunityRecords?.records || []);
    //   setSelectedType("opportunity");
    // } else if (type == "todaysLoan") {
    //   setSelectedData(telecallingData?.data?.bookingRemarkWithLoan?.records || []);
    //   setSelectedType("todaysLoan");
    // } else if (type == "todaysOppo") {
    //   setSelectedData(telecallingData?.data?.opportunityFollowup?.records || []);
    //   setSelectedType("todaysOppo");
    // } else if (type == "todayLeads") {
    //   setSelectedData(telecallingData?.data?.nextFollowup?.records || []);
    //   setSelectedType("todayLeads");
    // } else if (type == "todaysPayment") {
    //   setSelectedData(telecallingData?.data?.bookingRemarkWithoutLoan?.records || []);
    //   setSelectedType("todaysPayment");
    // }

    // new code

    if (type == "telecalling" && !telecallingData?.data?.telecallingRecords?.records && telecallingData?.data?.telecallingRecords?.records.length <= 0) {
      alert(`No data available for ${type} download.`);
      setIsLoading(false); // Hide loader
      return;
    }
    else if (type == "contacts" && !telecallingData?.data?.contactsRecords?.records && telecallingData?.data?.contactsRecords?.records.length <= 0) {
      alert(`No data available for ${type} download.`);
      setIsLoading(false); // Hide loader
      return;
    }
    else if (type == "booking" && !telecallingData?.data?.bookingRecords?.records && telecallingData?.data?.bookingRecords?.records.length <= 0) {
      alert(`No data available for ${type} download.`);
      setIsLoading(false); // Hide loader
      return;
    }
    else if (type == "opportunity" && !telecallingData?.data?.opportunityRecords?.records && telecallingData?.data?.opportunityRecords?.records.length <= 0) {
      alert(`No data available for ${type} download.`);
      setIsLoading(false); // Hide loader
      return;
    }

    let headers = [];
    let csvData = [];

    if (type === "telecalling") {
      headers = [
        { label: "Name", key: "CName" },
        { label: "Mobile", key: "Mobile" },
        { label: "Alternate Number", key: "OtherNumbers" },
        { label: "Source", key: "SourceName" },
        { label: "Location", key: "Location" },
        { label: "City", key: "CityName" },
        { label: "Email", key: "Email" },
        { label: "Project Name", key: "ProjectName" },
        { label: "Unit Name", key: "UnittypeName" },
        { label: "Estimated budget", key: "EstimatedbudgetName" },
        { label: "lead status", key: "leadstatusName" },
        { label: "Next FollowUp Date", key: "NextFollowUpDate" },
        { label: "Next FollowUp Time", key: "NextFollowUpTime" },
        { label: "Interest", key: "Interest" },
        { label: "Note", key: "Note" },
        { label: "Attended By", key: "TelecallAttendedByName" },
        { label: "Created Date", key: "CreateDate" },
      ];

      csvData = telecallingData?.data?.telecallingRecords?.records.map((row) => ({
        CName: row.CName,
        Mobile: row.Mobile,
        OtherNumbers: row.OtherNumbers,
        SourceName: row.SourceName,
        Location: row.Location,
        CityName: row.CityName,
        Email: row.Email,
        ProjectName: row.ProjectName,
        UnittypeName: row.UnittypeName,
        EstimatedbudgetName: row.EstimatedbudgetName,
        leadstatusName: row.leadstatusName,
        NextFollowUpDate: row.NextFollowUpDate,
        NextFollowUpTime: row.NextFollowUpTime,
        Interest: `"${(row.Interest || "").replace(/"/g, '""')}"`,
        Note: `"${(row.Note || "").replace(/"/g, '""')}"`,
        TelecallAttendedByName: row.TelecallAttendedByName,
        CreateDate: row.CreateDate
      }));

    } else if (type === "contacts") {
      headers = [
        { label: "Name", key: "CName" },
        { label: "Mobile", key: "Mobile" },
        { label: "Email", key: "Email" },
        { label: "Alternate Number", key: "OtherNumbers" },
        { label: "Source", key: "Source" },
        { label: "City Name", key: "CityName" },
        { label: "Location Name", key: "LocationName" },
        { label: "Customer Type", key: "CustomerType" },
        { label: "Created Date", key: "CreateDate" },
        { label: "Attend By", key: "UserName" },
      ];

      csvData = telecallingData?.data?.contactsRecords?.records.map((row) => ({
        CName: row.CName,
        Mobile: row.Mobile,
        Email: row.Email,
        OtherNumbers: row.OtherNumbers,
        Source: row.SourceName,
        CityName: row.CityName,
        LocationName: row.LocationName,
        CustomerType: row.CustomerTypeName,
        CreateDate: row.CreateDate,
        UserName: row.UserName,
      }));
    } else if (type === "booking") {
      headers = [
        { label: "Name", key: "Name" },
        { label: "Mobile", key: "Mobile" },
        { label: "SourceName", key: "SourceName" },
        { label: "Created Date", key: "CreateDate" },
        { label: "Booking Date", key: "BookingDate" },
        { label: "Address", key: "Address" },
        { label: "Aadhar", key: "Aadhar" },
        { label: "Pancard", key: "Pancard" },
        { label: "Email", key: "Email" },
        { label: "FloorNo", key: "FloorNo" },
        { label: "FlatNo", key: "FlatNo" },
        { label: "Area", key: "Area" },
        { label: "Ratesqft", key: "Ratesqft" },
        { label: "TtlAmount", key: "TtlAmount" },
        { label: "Charges", key: "Charges" },
        { label: "Parking Facility", key: "ParkingFacility" },
        { label: "Flat Cost", key: "FlatCost" },
        { label: "Gst", key: "Gst" },
        { label: "StampDuty", key: "StampDuty" },
        { label: "Registration", key: "Registration" },
        { label: "Advocate", key: "Advocate" },
        { label: "Extra Cost", key: "ExtraCost" },
        { label: "Total Value", key: "TotalValue" },
        { label: "Usable Area", key: "UsableArea" },
        { label: "Agreement Carpet", key: "AgreementCarpet" },
        { label: "BookingRef", key: "BookingRef" },
        { label: "Aggrement Amount", key: "AggrementAmount" },
        { label: "Project Name", key: "ProjectName" },
        { label: "Wing Name", key: "WingName" },
        { label: "Unit Type", key: "UnittypeName" },
        { label: "Booking Type", key: "BookingTypeName" },
        { label: "Booked By", key: "UserName" },
        { label: "reraregistration", key: "reraregistration" },
        { label: "ParkingAvilability", key: "ParkingAvilability" },

      ];

      csvData = telecallingData?.data?.bookingRecords?.records.map((row) => ({

        Name: row.Name,
        Mobile: row.Mobile,
        SourceName: row.SourceName,
        CreateDate: row.CreateDate,
        BookingDate: row.BookingDate,
        Address: `"${row.Address.replace(/"/g, '""')}"`,
        Aadhar: row.Aadhar,
        Pancard: row.Pancard,
        Email: row.Email,
        FloorNo: row.FloorNo,
        FlatNo: row.FlatNo,
        Area: row.Area,
        Ratesqft: row.Ratesqft,
        TtlAmount: row.TtlAmount,
        Charges: row.Charges,
        ParkingFacility: row.ParkingFacility,
        FlatCost: row.FlatCost,
        Gst: row.Gst,
        StampDuty: row.StampDuty,
        Registration: row.Registration,
        Advocate: row.Advocate,
        ExtraCost: row.ExtraCost,
        TotalValue: row.TotalValue,
        UsableArea: row.UsableArea,
        AgreementCarpet: row.AgreementCarpet,
        BookingRef: row.BookingRef,
        AggrementAmount: row.AggrementAmount,
        ProjectName: row.ProjectName,
        WingName: row.WingName,
        UnittypeName: row.UnittypeName,
        BookingTypeName: row.BookingTypeName,
        UserMasterUserID: row.UserMasterUserID,
        UserRoleID: row.UserRoleID,
        UserName: row.UserName,
        reraregistration: row.reraregistration,
        ParkingAvilability: row.ParkingAvilability,

      }));

    }
    else if (type === "opportunity") {
      headers = [
        { label: "Customer Name", key: "CName" },
        { label: "Mobile", key: "Mobile" },
        { label: "Alternate Number", key: "OtherNumbers" },
        { label: "Email", key: "Email" },
        { label: "CityName", key: "CityName" },
        { label: "Source", key: "SourceName" },
        { label: "Estimated Budget", key: "Estimatedbudget" },
        { label: "Property Age", key: "PropertyAgeName" },
        { label: "Looking For", key: "LookingTypeName" },
        { label: "AreaFrom", key: "AreaFrom" },
        { label: "AreaTo", key: "AreaTo" },
        { label: "ScaleName", key: "ScaleName" },
        { label: "NextFollowUpDate", key: "NextFollowUpDate" },
        { label: "NextFollowUpTime", key: "NextFollowUpTime" },
        { label: "Interest", key: "Interest" },
        { label: "Note", key: "Note" },
        { label: "Created Date", key: "CreateDate" },
        { label: "Attend By", key: "Name" },
      ];

      csvData = telecallingData?.data?.opportunityRecords?.records.map((row) => ({
        CName: row.CName,
        Mobile: row.Mobile,
        OtherNumbers: row.OtherNumbers,
        Email: row.Email,
        CityName: row.CityName,
        SourceName: row.SourceName,
        Estimatedbudget: row.EstimatedbudgetName,
        PropertyAgeName: row.PropertyAgeName,
        LookingTypeName: row.LookingTypeName,
        AreaFrom: row.AreaFrom,
        AreaTo: row.AreaTo,
        ScaleName: row.ScaleName,
        NextFollowUpDate: row.NextFollowUpDate,
        NextFollowUpTime: row.NextFollowUpTime,
        Interest: `"${(row.Interest || "").replace(/"/g, '""')}"`,  // Safe fallback for null/undefined
        Note: `"${(row.Note || "").replace(/"/g, '""')}"`,
        CreateDate: row.CreateDate,
        Name: row.Name,
      }));

    };
    const csvString = [
      headers.map((header) => header.label).join(","),
      ...csvData.map((row) =>
        headers.map((header) => row[header.key] || "").join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${type}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsLoading(false);
  };


  const handleCardClick = (type) => {
    debugger;
    setIsLoading(true); // Start loading state
    if (type === "telecalling") {
      setSelectedData(telecallingData?.data?.telecallingRecords?.records || []);
      setSelectedType("telecalling");
    } else if (type == "contacts") {
      setSelectedData(telecallingData?.data?.contactsRecords?.records || []);
      setSelectedType("contacts");
    } else if (type == "booking") {
      setSelectedData(telecallingData?.data?.bookingRecords?.records || []);
      setSelectedType("booking");
    } else if (type == "opportunity") {
      setSelectedData(telecallingData?.data?.opportunityRecords?.records || []);
      setSelectedType("opportunity");
    } else if (type == "todaysLoan") {
      setSelectedData(telecallingData?.data?.bookingRemarkWithLoan?.records || []);
      setSelectedType("todaysLoan");
    } else if (type == "todaysOppo") {
      setSelectedData(telecallingData?.data?.opportunityFollowup?.records || []);
      setSelectedType("todaysOppo");
    } else if (type == "todayLeads") {
      setSelectedData(telecallingData?.data?.nextFollowup?.records || []);
      setSelectedType("todayLeads");
    } else if (type == "todaysPayment") {
      setSelectedData(telecallingData?.data?.bookingRemarkWithoutLoan?.records || []);
      setSelectedType("todaysPayment");
    }

    // After setting data, stop loading (this simulates the "data loading" process)
    setTimeout(() => setIsLoading(false), 500);  // Simulate a delay for data fetching
  };
  const whatsappText = encodeURIComponent(
    `Hello, I wanted to discuss the following details:\n\nSource Name: ${selectedTelecaller?.SourceName}\nLocation: ${selectedTelecaller?.Location}\nAttended By: ${selectedTelecaller?.TelecallAttendedByName}`
  );
  const CustomTimeline = styled(Timeline)({
    width: '100%',
    margin: '0 auto',
  });
  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        UserID: formData.UserID,
        FromDate: formData?.FromDate?.toISOString(),
        ToDate: formData?.ToDate?.toISOString(),
        SourceID: formData.SourceID,
      });

      const response = await fetch(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-admindashboard.php?${params}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }
      const data = await response.json();
      setTelecallingData(data);
    } catch (error) {
      console.error("Error fetching telecalling data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch the data from the API
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-fetch-telesales.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setUsers(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching the users:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-fetch-source.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setSource(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const fetchDataForModal = async (Tid) => {
    try {
      const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-singel-telecalling.php?Tid=${Tid}`;
      const response = await axios.get(apiUrl);

      if (response.data.status === "Success") {
        console.log(response.data.data[0], "Single telecalling data fetched");
        setSelectedTelecaller(response.data.data[0]);
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching single telecalling data:", error);
    }
  };
  const handleSource = (event) => {
    setFormData({
      ...formData,
      SourceID: event.target.value,
    });
  };


  const handleUser = (event) => {
    setFormData({
      ...formData,
      UserID: event.target.value,
    });
  };

  const fetchDataForModalContact = async (Cid) => {
    console.log("CID AAYA", Cid);
    console.log("press");
    try {
      const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-singel-contacts.php?Cid=${Cid}`;
      const response = await axios.get(apiUrl);

      if (response.data.status === "Success") {
        console.log(
          response.data.data,
          "Single telecalling data fetched for cotact"
        );
        setSelectedContact(response.data.data);
        setModalOpenContact(true);
      }
    } catch (error) {
      console.error("Error fetching single telecalling data:", error);
    }
  };

  const fetchDataForModalPayment = async (BookingID) => {

    console.log("BookingID AAYA", BookingID);
    console.log("press");

    try {
      const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-fetch-projectbooking.php?BookingID=${BookingID}`;
      const response = await axios.get(apiUrl);

      if (response.data.status === "Success") {
        console.log(
          response.data.data,
          "Single telecalling data fetched for cotact"
        );
        setSelectedBooking(response.data.data);
        setModalOpenBooking(true);
      }
    } catch (error) {
      console.error("Error fetching single telecalling data:", error);
    }
  };

  const fetchDataForModalOpportunity = async (Oid) => {
    console.log("Oid AAYA", Oid);
    console.log("press");
    try {
      const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-singel-opportunity.php?Oid=${Oid}`;
      const response = await axios.get(apiUrl);

      if (response.data.status === "Success") {
        console.log(
          response.data.data[0],
          "Single telecalling data fetched for Opportunity"
        );
        setSelectedOpportunity(response.data.data[0]);
        setModalOpenOpportunity(true);
      }
    } catch (error) {
      console.error("Error fetching single telecalling data:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleHistoryClick = async () => {

    const fetchData = async () => {
      try {
        const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-singel-opportunityfollowup.php?Oid=${selectedOpportunity?.Oid}`;
        const response = await axios.get(apiUrl);
        if (response.data.status === "Success") {
          console.log(response.data, "aagaayaa oid dataaaa<<<<<>>>>>>>>>>>");
          setRowData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching single opportunity data:", error);
      }
    };

    await fetchData();
  };


  const handleHistoryClickLead = async () => {
    try {

      const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-fetch-nextfollowup.php?Tid=${selectedTelecaller?.Tid}`;
      const response = await axios.get(apiUrl);
      if (response.data.status === "Success") {
        console.log(response.data, "TID dataaaa<<<<<>>>>>>>>>>>");
        setRowData(response.data.data); // Use response.data.data to set the rowData
        setOpenHistory(true);
      } else {
        console.error("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCloseHistory = () => {
    setOpenHistory(false);
  };


  const handleHistoryClickOppo = async () => {
    try {

      const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-singel-opportunityfollowup.php?Oid=${selectedOpportunity?.Oid}`;
      const response = await axios.get(apiUrl);
      if (response.data.status === "Success") {
        console.log(response.data, "OID OID OID ODI  OID dataaaa<<<<<>>>>>>>>>>>");
        setRowData(response.data.data);
        setOpenHistoryOppo(true);
      } else {
        console.error("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCloseHistoryOppo = () => {
    setOpenHistoryOppo(false);
  };
  const handlesetbookingclose = () => {
    setModalOpenBooking(false);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const pieData = {
    labels: [
      "Telecalling",
      "Contacts",
      "Opportunity",
      "Booking",
      "Todays Lead FollowUp",
      "Todays Payment Followup",
      "Todays Loan FollowUp",
    ],
    datasets: [
      {
        data: [
          telecallingData?.data?.telecallingRecords?.count || 0,
          telecallingData?.data?.contactsRecords?.count || 0,
          telecallingData?.data?.opportunityRecords?.count || 0,
          telecallingData?.data?.bookingRecords?.count || 0,
          telecallingData?.data?.nextFollowup?.count || 0,
          telecallingData?.data?.opportunityFollowup?.count || 0,
          telecallingData?.data?.bookingRemarkWithoutLoan?.count || 0,
        ],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FFCD56",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FFCD56",
        ],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <StatisticsCard />
        </Grid>

        <Grid item xs={12}>
          <Card>
            <Grid
              item
              xs={12}
              sx={{ marginTop: 4.8, marginBottom: 3, marginLeft: 8 }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{ marginTop: 5, fontWeight: "bold", fontSize: 20 }}
                >
                  Search Date-Wise
                </Typography>
              </Box>
            </Grid>
            <CardContent>
              <Card>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={6} sm={3}>
                      <FormControl fullWidth>
                        <InputLabel>User</InputLabel>
                        <Select
                          value={formData.UserID}
                          onChange={handleUser}
                          label="User"
                        >
                          <MenuItem value={0}>All</MenuItem>
                          {users.map((user) => (
                            <MenuItem key={user.UserID} value={user.UserID}>
                              {user.Name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6} sm={3}>
                      <FormControl fullWidth>
                        <InputLabel>Source</InputLabel>
                        <Select
                          value={formData.SourceID}
                          onChange={handleSource}
                          label="Source"
                        >
                          <MenuItem value={0}>All</MenuItem>
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

                    <Grid item xs={12} sm={3}>
                      <DatePicker
                        selected={formData.FromDate}
                        onChange={(date) => handleDateChange(date, "FromDate")}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                        customInput={
                          <TextField
                            fullWidth
                            label="From When"
                            InputProps={{
                              readOnly: true,
                              sx: { width: "100%" },
                            }}
                          />
                        }
                        showMonthDropdown
                        showYearDropdown
                        yearDropdownItemNumber={15} // Number of years to show in dropdown
                        scrollableYearDropdown
                      />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <DatePicker
                        selected={formData.ToDate}
                        onChange={(date) => handleDateChange(date, "ToDate")}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                        customInput={
                          <TextField
                            fullWidth
                            label="Till When"
                            InputProps={{
                              readOnly: true,
                              sx: { width: "100%" },
                            }}
                          />
                        }
                        showMonthDropdown
                        showYearDropdown
                        yearDropdownItemNumber={15} // Number of years to show in dropdown
                        scrollableYearDropdown
                      />
                    </Grid>

                    <Grid
                      item
                      xs={10}
                      mb={5}
                      sm={3}
                      sx={{ display: "flex", alignItems: "flex-end" }}
                    >
                      <Button variant="contained" onClick={handleSearch}>
                        Search
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Grid
                container
                spacing={3}
                sx={{ display: "flex", justifyContent: "center", mt: 3 }}
              >
                <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                  <Grid
                    container
                    spacing={3}
                    sx={{ maxWidth: "1200px", width: "100%" }}
                  >
                    <Grid item xs={12} sm={4}>
                      <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Call fontSize="large" color="primary" />
                          <Typography variant="h6" gutterBottom>
                            Telecalling
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Total Counts: {telecallingData?.data?.telecallingRecords?.count || 0}
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleCardClick("telecalling")}  // Change type accordingly
                            sx={{ mt: 2 }}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleDownload("telecalling")}  // Change type accordingly
                            sx={{ mt: 2 }}
                          >
                            Download Telecalling CSV
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Contacts fontSize="large" color="primary" />
                          <Typography variant="h6" gutterBottom>
                            Contacts
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Total Contacts: {telecallingData?.data?.contactsRecords?.count || 0}
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleCardClick("contacts")}
                            sx={{ mt: 2 }}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleDownload("contacts")}
                            sx={{ mt: 2 }}
                          >
                            Download Contacts CSV
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Contacts fontSize="large" color="primary" />
                          <Typography variant="h6" gutterBottom>
                            Opportunity
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Total Opportunities: {telecallingData?.data?.opportunityRecords?.count || 0}
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleCardClick("opportunity")}
                            sx={{ mt: 2 }}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleDownload("opportunity")}
                            sx={{ mt: 2 }}
                          >
                            Download Opportunity CSV
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>


                    <Grid item xs={12} sm={4}>
                      <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Contacts fontSize="large" color="primary" />
                          <Typography variant="h6" gutterBottom>
                            Booking
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Total Counts:{" "}
                            {telecallingData?.data?.bookingRecords?.count || 0}{" "}
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleCardClick("booking")}
                            sx={{ mt: 2, mb: 2 }}>
                            View Details
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleDownload("booking")}
                            sx={{ mt: 2, mb: 2 }}>
                            Download CSV
                          </Button>

                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Contacts fontSize="large" color="primary" />
                          <Typography variant="h6" gutterBottom>
                            Lead FollowUp
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Total Counts:{" "}
                            {telecallingData?.data?.nextFollowup?.count || 0}{" "}
                            {/* Adjust this key as needed */}
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleCardClick("todayLeads")}
                            sx={{ mt: 2, mb: 2 }}>
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Contacts fontSize="large" color="primary" />
                          <Typography variant="h6" gutterBottom>
                            Opportunity FollowUp
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Total Counts:{" "}
                            {telecallingData?.data?.opportunityFollowup.count || 0}{" "}
                            {/* Adjust this key as needed */}
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleCardClick("todaysOppo")}
                            sx={{ mt: 2, mb: 2 }}>
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Contacts fontSize="large" color="primary" />
                          <Typography variant="h6" gutterBottom>
                            Loan Reminder
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Total Counts:{" "}
                            {telecallingData?.data.bookingRemarkWithLoan.count || 0}{" "}
                            {/* Adjust this key as needed */}
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleCardClick("todaysLoan")}
                            sx={{ mt: 2, mb: 2 }}>
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                          <Contacts fontSize="large" color="primary" />
                          <Typography variant="h6" gutterBottom>
                            Payment FollowUp
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Total Counts:{" "}
                            {telecallingData?.data?.bookingRemarkWithoutLoan
                              ?.count || 0}

                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleCardClick("todaysPayment")}
                            sx={{ mt: 2, mb: 2 }}>
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Data Distribution
                      </Typography>
                      <div style={{ height: "300px" }}>
                        <Pie data={pieData} options={pieOptions} />
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>


        {selectedType && (
          <Grid item xs={12} sx={{ display: "flex", mt: 3 }}>
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <Grid
                  item
                  xs={12}
                  sx={{ marginTop: 4.8, marginBottom: 3, marginLeft: 8 }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ marginTop: 5, fontWeight: "bold", fontSize: 20 }}
                    >
                      {selectedType === "telecalling"
                        ? `${userName} Telecalling Data`
                        : selectedType === "contacts"
                          ? `${userName} Contact Data`
                          : selectedType === "booking"
                            ? `${userName} Booking`
                            : ""}

                    </Typography>
                  </Box>
                </Grid>
                {selectedData && (
                  <Grid item xs={12} sx={{ mt: 3 }}>
                    <TableContainer component={Box} sx={{ maxHeight: 400 }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Mobile</TableCell>
                            {selectedType === "telecalling" ? (
                              <TableCell>Next Follow Up</TableCell>
                            ) : (
                              <TableCell>Created Date</TableCell>
                            )}
                            {["todayLeads", "todaysOppo", "todaysPayment", "todaysLoan"].includes(selectedType) && (
                              <TableCell>Attend By</TableCell>
                            )}
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedData?.map((row, index) => {
                            const renderFollowUp = selectedType === "telecalling" ? row.NextFollowUpDate : row.CreateDate;
                            const renderAttendBy = ["todayLeads", "todaysOppo", "todaysPayment", "todaysLoan"].includes(selectedType) ? row.Name : null;

                            const handleClick = () => {
                              switch (selectedType) {
                                case "telecalling":
                                  fetchDataForModal(row.Tid);
                                  break;
                                case "contacts":
                                  fetchDataForModalContact(row.Cid);
                                  break;
                                case "opportunity":
                                  fetchDataForModalOpportunity(row.Oid);
                                  break;
                                case "todayLeads":
                                  fetchDataForModal(row.Tid);
                                  break;
                                case "todaysOppo":
                                  fetchDataForModalOpportunity(row.Oid);
                                  break;
                                case "todaysPayment":
                                case "todaysLoan":
                                case "booking":
                                  fetchDataForModalPayment(row.BookingID);
                                  break;
                                default:
                                  break;
                              }
                            };

                            return (
                              <TableRow key={index}>
                                <TableCell>{selectedType === "booking" ? row.Name : row.CName}</TableCell>
                                <TableCell>{row.Mobile}</TableCell>
                                <TableCell>{renderFollowUp}</TableCell>
                                {["todayLeads", "todaysOppo", "todaysPayment", "todaysLoan"].includes(selectedType) && (
                                  <TableCell>{renderAttendBy}</TableCell>
                                )}
                                <TableCell>
                                  <Button onClick={handleClick}>
                                    {`View ${selectedType === "telecalling" ? "Lead" : "Profile"}`}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

                )}

              </CardContent>
            </Card>
          </Grid>
        )}

        <Dialog
          open={modalOpenOpportunity}
          onClose={() => setModalOpenOpportunity(false)}
          sx={{ height: "80%", width: "100%" }}
        >
          {selectedOpportunity ? (
            <>
              <DialogTitle>Opportunity Profile</DialogTitle>
              <DialogContent>
                <Paper sx={{ padding: 5 }}>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      padding: 5,
                    }}
                  >
                    <Avatar
                      alt="John Doe"
                      sx={{ width: 60, height: 60, mr: 6 }}
                      src="/images/avatars/1.png"
                    />
                    <Box sx={{ flex: "1 1" }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 500, fontSize: "1.0rem" }}
                      >
                        {selectedOpportunity?.CName}
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem" }}>
                        {selectedOpportunity?.Mobile} /    {selectedOpportunity?.Email}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",

                    }}
                  >
                    <Box sx={{ display: "flex", mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#333333",
                          fontSize: "0.7rem",
                          minWidth: "auto",
                          padding: "5px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: 2,
                          minHeight: 20,
                          marginLeft: 2,
                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                        }}
                      >
                        Alternate Number: {selectedOpportunity?.OtherNumbers}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#333333",
                          fontSize: "0.7rem",
                          minWidth: "auto",
                          padding: "5px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: 2,
                          minHeight: 20,
                          marginLeft: 2,

                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                        }}
                      >
                        Location: {selectedOpportunity?.CityName} / {selectedOpportunity?.LocationName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#333333",
                          fontSize: "0.7rem",
                          padding: "5px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: 2,
                          minHeight: 20,
                          marginLeft: 2,
                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                        }}
                      >
                        Follow Up Date: {selectedOpportunity?.NextFollowUpDate} {selectedOpportunity?.NextFollowUpTime}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", mt: 7, justifyContent: "center" }}>

                      <a>
                        <IconButton
                          aria-label="share"
                          size="small"
                          sx={{
                            color: "blue",
                            backgroundColor: "#e3f2fd",
                            borderRadius: "50%",
                            padding: "10px",

                            "&:hover": {
                              backgroundColor: "#bbdefb",
                            },
                          }}
                          onClick={handleHistoryClickOppo}
                        >
                          <HistoryIcon />
                        </IconButton>
                      </a>

                    </Box>
                  </Box>

                  <Box
                    sx={{
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mt: 10
                    }}
                  >
                    <Grid container spacing={3}>
                      {/* Email */}
                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Estimated Budget
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedOpportunity?.EstimatedbudgetName}
                          </Typography>
                        </Card>
                      </Grid>


                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Purpose
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedOpportunity?.PurposeName}
                          </Typography>
                        </Card>
                      </Grid>


                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Time period
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedOpportunity?.PropertyAgeName}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box
                    sx={{
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      mt: 12,
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,

                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Source Name
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedOpportunity?.SourceName}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,

                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Looking For
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedOpportunity?.LookingTypeName}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{
                            borderRadius: 1,

                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Area from
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedOpportunity?.AreaTo}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Source Description, Telecall Attended By, Alternate Mobile Number */}
                  <Box
                    sx={{
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      mt: 10,
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,

                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Area to
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedOpportunity?.AreaFrom}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,

                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Scale
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedOpportunity?.ScaleName}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{
                            borderRadius: 1,
                            width: "100%",
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Attend By
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedOpportunity?.Name}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={12}>
                        <Card
                          variant="outlined"
                          sx={{
                            borderRadius: 1,
                            width: "100%",
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Description
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedOpportunity?.Description}
                          </Typography>
                        </Card>
                      </Grid>

                    </Grid>
                  </Box>
                </Paper>
              </DialogContent>

            </>
          ) : (
            <DialogContent>
              <DialogTitle>Opportunity Profile</DialogTitle>
              <DialogContent>
                <Typography>No data available for selected Name.</Typography>
              </DialogContent>
            </DialogContent>
          )}
        </Dialog>
        <Dialog open={modalOpenHistoryOppo} onClose={handleCloseHistoryOppo} sx={{ width: '100%' }}>
          <DialogTitle>
            Opportunity Follow-Up Data
            <IconButton edge="end" color="inherit" onClick={handleCloseHistoryOppo} aria-label="close" style={{ position: 'absolute', right: 8, top: 8 }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent >
            <Box >
              <HistoryComponent itemss={selectedOpportunity?.Oid}></HistoryComponent>
            </Box>
          </DialogContent>
        </Dialog>
        <Dialog
          open={modalOpenContact}
          onClose={() => setModalOpenContact(false)}
          sx={{ maxWidth: "90vw", width: "auto" }}
        >
          {selectedContact ? (
            <>
              <DialogTitle>Contact Profile</DialogTitle>
              <DialogContent>
                <Paper sx={{ padding: 5 }}>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      padding: 5,
                    }}
                  >
                    <Avatar
                      alt="John Doe"
                      sx={{ width: 60, height: 60, mr: 6 }}
                      src="/images/avatars/1.png"
                    />
                    <Box sx={{ flex: "1 1" }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 500, fontSize: "1.0rem" }}
                      >
                        {selectedContact?.CName}
                      </Typography>
                      <Typography sx={{ fontSize: "0.9rem" }}>
                        {selectedContact?.Mobile} 
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ mr: 5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          backgroundColor: "#f0f0f0",
                          color: "#333333",
                          fontSize: "0.7rem",
                          minWidth: "auto",
                          padding: "5px",
                          borderRadius: 2,
                          minHeight: 20,
                          marginLeft: 2,
                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                        }}
                      >
                        Source: {selectedContact?.SourceName}
                      </Typography>
                    </div>
                    <div style={{ marginRight: 5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          backgroundColor: "#f0f0f0",
                          color: "#333333",
                          fontSize: "0.7rem",
                          minWidth: "auto",
                          padding: "5px",
                          borderRadius: 2,
                          minHeight: 20,
                          marginLeft: 2,
                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                        }}
                      >
                        City: {selectedContact?.CityName}/{selectedContact?.LocationName}
                      </Typography>
                    </div>
                    <div style={{ marginRight: 5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          backgroundColor: "#f0f0f0",
                          color: "#333333",
                          fontSize: "0.7rem",
                          minWidth: "auto",
                          padding: "5px",
                          borderRadius: 2,
                          minHeight: 20,
                          marginLeft: 2,

                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                        }}
                      >
                        Alternate Number: {selectedContact?.OtherNumbers}
                      </Typography>
                    </div>
                  </Box>
                  <Box sx={{ width: "100%", display: "flex", flexDirection: "column", mt: 7 }}>
                    <Box
                      sx={{
                        display: "flex",
                      }}
                    >
                      <Grid container spacing={3}>
                        <Grid item xs={4}>
                          <Card
                            variant="outlined"
                            sx={{
                              borderRadius: 1,
                              padding: "10px",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                                fontSize: "0.9rem",
                                textAlign: "center",
                              }}
                            >
                              Email
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "0.8rem",
                                wordWrap: "break-word", // Allow text to wrap within the container
                                overflowWrap: "break-word", // Handle long unbreakable words
                                whiteSpace: "normal", // Ensure text wraps naturally
                              }}
                            >
                              {selectedContact?.Email}
                            </Typography>
                          </Card>
                        </Grid>

                        <Grid item xs={4}>
                          <Card
                            variant="outlined"
                            sx={{ borderRadius: 1, padding: "10px" }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "0.9rem", fontWeight: 500 }}
                            >
                              Customer Type
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "0.8rem" }}
                            >
                              {selectedContact?.CustomerTypeName}
                            </Typography>
                          </Card>
                        </Grid>
                        <Grid item xs={4}>
                          <Card
                            variant="outlined"
                            sx={{ borderRadius: 1, padding: "10px" }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "0.9rem", fontWeight: 500 }}
                            >
                              Contact Type
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "0.8rem" }}
                            >
                              {selectedContact?.ContactName}
                            </Typography>
                          </Card>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      mt: 10,
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{ borderRadius: 1, padding: "10px" }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, fontSize: "0.9rem" }}
                          >
                            Create Date
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.8rem" }}
                          >
                            {selectedContact?.CreateDate}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{ borderRadius: 1, padding: "10px" }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.9rem", fontWeight: 500 }}
                          >
                            Country Code
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.8rem" }}
                          >
                            {selectedContact?.CountryName}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{ borderRadius: 1, padding: "10px" }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.9rem", fontWeight: 500 }}
                          >
                            City Name
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.8rem" }}
                          >
                            {selectedContact?.CityName}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",

                      mt: 12,
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{ borderRadius: 1, padding: "10px" }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, fontSize: "0.9rem" }}
                          >
                            Source
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.8rem" }}
                          >
                            {selectedContact?.SourceName}
                          </Typography>
                        </Card>
                      </Grid>

                      <Grid item xs={4}>
                        <Card
                          variant="outlined"
                          sx={{ borderRadius: 1, padding: "10px" }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, fontSize: "0.9rem" }}
                          >
                            Attended By
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.8rem" }}
                          >
                            {selectedContact?.Name}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </DialogContent>
            </>
          ) : (
            <DialogContent>
              <DialogTitle>Contact Profile</DialogTitle>
              <DialogContent>
                <Typography>No data available for selected contact.</Typography>
              </DialogContent>
            </DialogContent>
          )}
        </Dialog>

        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          sx={{ maxWidth: "90vw", width: "auto" }}
        >
          {selectedTelecaller ? (
            <>
              <DialogTitle>Telecaller Profile</DialogTitle>
              <DialogContent>
                <Paper sx={{ padding: 2 }}>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      padding: 5,
                    }}
                  >
                    <Avatar
                      alt="John Doe"
                      sx={{ width: 60, height: 60, mr: 6 }}
                      src="/images/avatars/1.png"
                    />
                    <Box sx={{ flex: "1 1" }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 500, fontSize: "1.0rem" }}
                      >
                        {selectedTelecaller?.CName}
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem" }}>
                        {selectedTelecaller?.Mobile}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ width: "100%", display: "flex", mt: 7, flexDirection: "column", }}>
                    <Box sx={{ display: "flex" }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#333333",
                          fontSize: "0.7rem",
                          minWidth: "auto",
                          padding: "5px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: 2,
                          minHeight: 20,
                          // marginLeft: 20,
                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                        }}
                      >
                        Source Name: {selectedTelecaller?.SourceName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#333333",
                          fontSize: "0.7rem",
                          minWidth: "auto",
                          padding: "5px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: 2,
                          minHeight: 20,
                          marginLeft: 2,
                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                          // Add margin-right to separate the items
                        }}
                      >
                        Location: {selectedTelecaller?.CityName}  / {selectedTelecaller?.Location}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#333333",
                          fontSize: "0.7rem",
                          minWidth: "auto",
                          padding: "5px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: 2,
                          minHeight: 20,
                          marginLeft: 2,
                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                        }}
                      >
                        Alternate Number:{" "}
                        {selectedTelecaller?.OtherNumbers}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", mt: 7, justifyContent: "center" }}>

                      <a>
                        <IconButton
                          aria-label="share"
                          size="small"
                          sx={{
                            color: "blue",
                            backgroundColor: "#e3f2fd",
                            borderRadius: "50%",
                            padding: "10px",

                            "&:hover": {
                              backgroundColor: "#bbdefb",
                            },
                          }}
                          onClick={handleHistoryClickLead}
                        >
                          <HistoryIcon />
                        </IconButton>
                      </a>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      mt: 10,
                    }}
                  >
                    <Grid container spacing={3}>
                      {/* Email */}
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Email
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.8rem",
                              wordWrap: "break-word", // Allow text to wrap within the container
                              overflowWrap: "break-word", // Handle long unbreakable words
                              whiteSpace: "normal", }}
                          >
                            {selectedTelecaller?.Email}
                          </Typography>
                        </Card>
                      </Grid>

                      {/* Project Name */}
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Project Name
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.ProjectName}
                          </Typography>
                        </Card>
                      </Grid>

                      {/* Unit Type */}
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Unit Type
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.UnittypeName}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box
                    sx={{
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      mt: 10,
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Estimated Budget
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.EstimatedbudgetName}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Lead Status
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.leadstatusName}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Follow-Up Date
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.NextDate}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Source Description, Telecall Attended By, Alternate Mobile Number */}
                  <Box
                    sx={{
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      mt: 10
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Created At
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.CreateDate}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Attended By
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.TelecallAttendedByName}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Comments
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.Note}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>


                </Paper>
              </DialogContent>
              <Dialog open={modalOpenHistory} onClose={handleCloseHistory} sx={{ width: '100%' }}>
                <DialogTitle>
                  Follow-Up Data
                  <IconButton edge="end" color="inherit" onClick={handleCloseHistory} aria-label="close" style={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent >
                  <Box >
                    <HistoryComponent item={selectedTelecaller?.Tid}></HistoryComponent>
                  </Box>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <>
              <DialogTitle>Contact Profile</DialogTitle>
              <DialogContent>
                <Paper sx={{ padding: 2 }}>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      padding: 5,
                    }}
                  >
                    <Avatar
                      alt="John Doe"
                      sx={{ width: 60, height: 60, mr: 6 }}
                      src="/images/avatars/1.png"
                    />
                    <Box sx={{ flex: "1 1" }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 500, fontSize: "1.0rem" }}
                      >
                        {selectedTelecaller?.CName}
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem" }}>
                        {selectedTelecaller?.Mobile}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ width: "100%", ml: 20 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mr: 10 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#333333",
                          fontSize: "0.7rem",
                          minWidth: "auto",
                          padding: "5px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: 2,
                          minHeight: 20,
                          // marginLeft: 20,
                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                        }}
                      >
                        Source Name: {selectedTelecaller?.SourceName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#333333",
                          fontSize: "0.7rem",
                          minWidth: "auto",
                          padding: "5px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: 2,
                          minHeight: 20,
                          marginLeft: 2,
                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                          mr: 2, // Add margin-right to separate the items
                        }}
                      >
                        Location: {selectedTelecaller?.Location}/{selectedTelecaller?.CityName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#333333",
                          fontSize: "0.7rem",
                          minWidth: "auto",
                          padding: "5px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: 2,
                          minHeight: 20,
                          marginLeft: 2,
                          "&:hover": {
                            backgroundColor: "#dcdcdc",
                          },
                        }}
                      >
                        Attended By:{" "}
                        {selectedTelecaller?.TelecallAttendedByName}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", mt: 10, ml: 20 }}>
                      <a
                        href={`tel:${selectedTelecaller?.Mobile}`}
                        style={{ marginRight: 40 }}
                      >
                        <IconButton
                          aria-label="phone"
                          size="small"
                          sx={{
                            color: "green",
                            backgroundColor: "#e0f7fa",
                            borderRadius: "50%",
                            padding: "10px",
                            "&:hover": {
                              backgroundColor: "#b2ebf2",
                            },
                          }}
                        >
                          <PhoneIcon />
                        </IconButton>
                      </a>
                      <a style={{ marginRight: 10 }}>
                        <IconButton
                          aria-label="share"
                          size="small"
                          sx={{
                            color: "blue",
                            backgroundColor: "#e3f2fd",
                            borderRadius: "50%",
                            padding: "10px",
                            marginRight: 15,
                            "&:hover": {
                              backgroundColor: "#bbdefb",
                            },
                          }}
                        >
                          <ShareIcon />
                        </IconButton>
                      </a>

                      <a
                        href={`mailto:${selectedTelecaller?.Email}`}
                        style={{ marginRight: 35 }}
                      >
                        <IconButton
                          aria-label="email"
                          size="small"
                          sx={{
                            color: "red",
                            backgroundColor: "#ffebee",
                            borderRadius: "50%",
                            padding: "10px",
                            "&:hover": {
                              backgroundColor: "#ffcdd2",
                            },
                          }}
                        >
                          <EmailIcon />
                        </IconButton>
                      </a>
                      <a
                        href={`https://wa.me/${selectedTelecaller?.Mobile}?text=${whatsappText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconButton
                          aria-label="whatsapp"
                          size="small"
                          sx={{
                            color: "green",
                            backgroundColor: "#e8f5e9",
                            borderRadius: "50%",
                            padding: "10px",
                            "&:hover": {
                              backgroundColor: "#c8e6c9",
                            },
                          }}
                        >
                          <WhatsAppIcon />
                        </IconButton>
                      </a>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ml: 12,
                      mt: 15,
                    }}
                  >
                    <Grid container spacing={3}>
                      {/* Email */}
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Email
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.Email}
                          </Typography>
                        </Card>
                      </Grid>

                      {/* Project Name */}
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Project Name
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.ProjectName}
                          </Typography>
                        </Card>
                      </Grid>

                      {/* Unit Type */}
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Unit Type
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.UnittypeName}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box
                    sx={{
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      ml: 12,
                      mt: 12,
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Estimated Budget
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.EstimatedbudgetName}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Lead Status
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.leadstatusName}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Follow-Up Date
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.NextFollowUpDate}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Source Description, Telecall Attended By, Alternate Mobile Number */}
                  <Box
                    sx={{
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      ml: 12,
                      mt: 12,
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Created At
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.TelecallingCreateDate}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Attended By
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.TelecallAttendedByName}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Alternate Number
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.OtherNumbers}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Comments */}
                  <Box
                    sx={{
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      ml: 12,
                      mt: 12,
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Card
                          variant="outlined" // Use outlined variant for a border without shadow
                          sx={{
                            borderRadius: 1,
                            padding: "10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            Comments
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            {selectedTelecaller?.Comments}
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </DialogContent>
            </>
          )}
        </Dialog>
        <Dialog open={modalOpenBooking} onClose={handlesetbookingclose}>
          {selectedBooking ? (
            <Card
              style={{
                maxWidth: "inherit",
                margin: "auto",
                height: "90vh",
                padding: "20px",
                overflowY: "auto",
              }}
            >
              <TemplatePayment
                bookingID={selectedBooking?.BookingID}
                handleCancel={handlesetbookingclose}
              />
            </Card>
          ) : (
            <Typography>No data available for selected Payment.</Typography>
          )}
        </Dialog>







      </Grid>
    </ApexChartWrapper>
  );
};

export default Dashboard;
