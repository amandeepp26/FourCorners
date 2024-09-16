import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Box,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Typography,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  MenuItem,
  TextField,
  Modal,
  Avatar,
  Menu,
  FormControlLabel,
  Checkbox,
  InputAdornment,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import PaymentIcon from "@mui/icons-material/Payment";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { Info as InfoIcon } from "@mui/icons-material";
import { useCookies } from "react-cookie";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import TemplatePayment from "../TemplatePayment/TemplatePayment";
import Reciept from "../Reciept/Reciept";
import EditBookingform from "../EditBookingform/EditBookingform";
import { FlaskEmpty } from "mdi-material-ui";

const NoDataIcon = () => (
  <Avatar
    alt="No Data"
    sx={{ width: 500, height: "auto" }}
    src="/images/avatars/nodata.svg"
  />
);

const Listprojectbookng = ({ onChequeReceiptClick, item }) => {
  const router = useRouter();
  const initialMergedData = {
    proccess_null: [],
    proccess_one: [],
    totalCash: 0,
    totalCheque: 0,
    totalCost: 0,
  };

  const [cookies, setCookie, removeCookie] = useCookies(["amr"]);
  const [wings, setWings] = useState([]);
  const [selectedWing, setSelectedWing] = useState(null);
  const [wingDetails, setWingDetails] = useState([]);
  const [open, setOpen] = useState(false);
  const [openTemplate, setOpenTemplate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [openCheque, setOpenCheque] = useState(false);

  const [upcomingPayments, setUpcomingPayments] = React.useState([]);
  const [receivedPayments, setReceivedPayments] = React.useState([]);
  const [amountType, setAmountType] = useState("");
  const [page, setPage] = useState(0);
  const [bookingID, setBookingID] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowMenu, setSelectedRowMenu] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [dataAvailable, setDataAvailable] = useState(true);
  const [bankName, setBankName] = useState("");
  const [cheqNo, setCheqNo] = useState("");
  const [bookingRemarks, setBookingRemarks] = useState([]);
  const [amountTypes, setAmountTypes] = useState([
    // Example amount types
    { AmountTypeID: "1", AmountTypeName: "Type 1" },
    { AmountTypeID: "2", AmountTypeName: "Type 2" },
  ]);
  const [mergedData, setMergedData] = useState(initialMergedData);
  const [selectedBookingRemark, setSelectedBookingRemark] = useState("");
  const [bookingRemarkDetails, setBookingRemarkDetails] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const [showAmountType, setShowAmountType] = useState(false);

  const [selectedRow, setSelectedRow] = useState(null);
  const [cashPaid, setCashPaid] = useState("");
  const [chequePaid, setChequePaid] = useState("");
  const [chequePayments, setChequePayments] = useState([
    {
      chequePaid: "",
      Date:"",
      bankName: "",
      cheqNo: "",
      chequeDate: null,
      AmountTypeID: "",
    },
  ]);

  const [totalCost, setTotalCost] = useState("");
  const [formData, setFormData] = useState({ AmountGiven: new Date() });
  const [cashDate, setCashdate] = useState({ CashDate: new Date() });

  const [paymentTypes, setPaymentTypes] = useState([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  const [remarks, setRemarks] = useState([
    {
      Remarkamount: "",
      RemarkName: "",
      RemarkDate: new Date(),
      AmountTypeID: "",
      Loan: 0,
    },
  ]);
  const [paymentData, setPaymentData] = useState({
    proccess_null: [],
    proccess_one: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!item) return;
      try {
        const apiUrl = `https://apiforcorners.cubisysit.com/api/api-fetch-projectwings.php?ProjectID=${item.ProjectID}`;
        const response = await axios.get(apiUrl);
        if (response.data.status === "Success") {
          setWings(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching wings data:", error);
      }
    };
    fetchData();
  }, [item]);

  useEffect(() => {
    axios
      .get(
        "https://apiforcorners.cubisysit.com/api/api-dropdown-paymenttype.php"
      )
      .then((response) => {
        if (response.data.code === 200) {
          setPaymentTypes(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching payment types:", error);
      });
  }, []);


  // const handleCloseEditForm = () =>{
  //   setOpenEdit{false}
  // }

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

  const handleWingClick = async (wing) => {
    try {
      setLoading(true);
      const apiUrl = `https://apiforcorners.cubisysit.com/api/api-fetch-wing.php?WingID=${wing.WingID}&ProjectID=${item.ProjectID}`;
      const response = await axios.get(apiUrl);
      if (response.data.status === "Success") {
        console.log(response.data, "wing dataaaaaaa,<<<<<<<<<<<<>>>>>>>>>>>>>...");
        setWingDetails(response.data.data);
        setSelectedWing(wing);
        setDataAvailable(response.data.data.length > 0);
      } else {
        setDataAvailable(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching wing details:", error);
      setDataAvailable(false);
    }
  };
  

  const handleAddChequePayment = () => {
    setChequePayments([
      ...chequePayments,
      {
        AmountTypeID: "", // Initialize with a default value or empty
        chequePaid: "",
        bankName: "",
        cheqNo: "",
        chequeDate: null, // Initialize with null or default date
      },
    ]);
    setShowAmountType(true); // Show Amount Type dropdown when adding a new row
  };

  const handleChequePaymentChange = (index, field, value) => {
    const updatedChequePayments = [...chequePayments];
    updatedChequePayments[index][field] = value;
    setChequePayments(updatedChequePayments);
  };
  
  

  useEffect(() => {
    // Update booking remark details based on the selected remark
    const selectedRemark = bookingRemarks.find(
      (remark) => remark.BookingremarkID === selectedBookingRemark
    );
    setBookingRemarkDetails(selectedRemark || {});
  }, [selectedBookingRemark]);

  const handleAddPayment = async (bookingID) => {
    setSelectedRow(bookingID);
    setModalOpen(true);
    setCashPaid("");
    setChequePaid("");
    setTotalCost(0); // Assuming TotalCost needs to be reset
    try {
      const response = await axios.get(
        `https://apiforcorners.cubisysit.com/api/api-dropdown-bookingremark.php?BookingID=${bookingID}`
      );
      if (response.data.status === "Success") {
        console.log(response.data.data, "aagaya daata remakrs");
        const bookingRemarksData = response.data.data;
        setBookingRemarks(bookingRemarksData);

        // Assuming you want to fetch the details for the first booking remark in the list
        if (bookingRemarksData.length > 0) {
          const firstBookingRemarkID = bookingRemarksData[0].BookingremarkID;
          await fetchBookingRemarkDetails(firstBookingRemarkID);
        }
      }
    } catch (error) {
      console.error("Error fetching booking remarks:", error);
    }
  };

  const fetchBookingRemarkDetails = async (bookingRemarkID) => {
    try {
      const response = await axios.get(
        `https://apiforcorners.cubisysit.com/api/api-dropdown-bookingremarkdetails.php?BookingremarkID=${bookingRemarkID}`
      );
      if (response.data.status === "Success") {
        setBookingRemarkDetails(response.data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching booking remark details:", error);
    }
  };

  const handleBookingRemarkChange = async (e) => {
    const bookingRemarkID = e.target.value;
    setSelectedBookingRemark(bookingRemarkID);
    await fetchBookingRemarkDetails(bookingRemarkID);
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowMenu(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowMenu(null);
  };

  const handleReportClick = (row) => {
    setBookingID(row.BookingID); // Set the BookingID state
    setMergedData(initialMergedData); // Clear the mergedData state
    handleOpenPayment(selectedRowMenu); // Open the modal
    handleMenuClose();
  };

  const handleTemplateClick = (row) => {
    console.log(row, "Selected row data"); // Log the selected row data

    setBookingID(row.BookingID); // Set the selected BookingID
    setOpenTemplate(true); // Open the modal
    handleMenuClose(); // Close the menu if it's open

    // Optionally, you can set other states with the selected row data
    // setOtherState(row.someField);
  };

  const onCheque = (row) => {
    console.log(row, "Selected row data"); // Log the selected row data

    setBookingID(row.BookingID); // Set the selected BookingID
    setOpenCheque(true); // Open the modal
    handleMenuClose(); // Close the menu if it's open
  };
  const onEdit = (row) => {
    console.log(row, "Selected row data EDit"); // Log the selected row data

    setBookingID(row.BookingID); // Set the selected BookingID
    setOpenEdit(true); // Open the modal
    handleMenuClose(); // Close the menu if it's open
  };

  const SortableTableCell = ({ label, onClick }) => (
    <TableCell
      sx={{ fontWeight: "bold", fontSize: "1rem", cursor: "pointer" }}
      onClick={onClick}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {label}
        <span>&#8597;</span>
      </Box>
    </TableCell>
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (searchQuery) {
      setFilteredRows(
        wingDetails.filter(
          (row) =>
            row.FlatNo.toString()
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            row?.Partyname?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredRows(wingDetails);
    }
  }, [searchQuery, wingDetails]);

  useEffect(() => {
    if (!open) {
      setFormData({
        fromdate: null,
        todate: null,
      });
      setUpcomingPayments([]);
      setReceivedPayments([]);
    }
  }, [open]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleChangePayment = (event) => {
    setSelectedPaymentType(event.target.value);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedRow(null);
  };

  const handleRemoveChequePayment = (index) => {
    setChequePayments((prevPayments) =>
      prevPayments.filter((_, i) => i !== index)
    );
  };

  const handleDateChangeCash = (date) => {
    const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    setCashdate({ CashDate: adjustedDate });
  };
  

  const handleDateChange = (date, index, fieldName) => {
    const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    handleChequePaymentChange(index, fieldName, adjustedDate);
  };
  
  
  const handleDateChangePayment = (date, field) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: date,
    }));
  };

  const handleAddRemark = () => {
    setRemarks([
      ...remarks,
      { Remarkamount: "", RemarkName: "", RemarkDate: new Date(), Loan: 0 },
    ]);
  };

  const handleRemoveRemark = (index) => {
    const newRemarks = remarks.filter((_, i) => i !== index);
    setRemarks(newRemarks);
  };

  const handleChangeRemark = (e, index, field) => {
    const newRemarks = [...remarks];
    newRemarks[index][field] = e.target.value;
    setRemarks(newRemarks);
  };
  
  const handleDateRemarks = (date, index) => {
    const newRemarks = [...remarks];
    newRemarks[index].RemarkDate = date;
    setRemarks(newRemarks);
  };

  const handleChange = (event, index, field) => {
    const newRemarks = [...remarks];
    newRemarks[index][field] = event.target.value;
    setRemarks(newRemarks);
  };

  const handleLoanChange = (e, index) => {
    const newRemarks = [...remarks];
    newRemarks[index].Loan = e.target.checked ? 1 : 0;
    setRemarks(newRemarks);
  };

  const handleOpenPayment = () => setOpen(true);
  const handleOpenTemplate = () => setOpenTemplate(true);

  const handleClose = () => setModalOpen(false);

  const handleCloseTemplate = () => {
    setOpenTemplate(false); // Close the modal
    setBookingID(null); // Reset the booking ID (optional)
  };

  const handleCloseEditForm = () => {
    setOpenEdit(false); // Close the modal
    setBookingID(null); // Reset the booking ID (optional)
  };
  const handleCloseRecipt = () => {
    setOpenCheque(false); // Close the modal
    setBookingID(null); // Reset the booking ID (optional)
  };

  const handleCloseReport = () => setOpen(false);

  const handleDateSearch = async () => {
    try {
      const response = await axios.get(
        `https://ideacafe-backend.vercel.app/api/proxy/api-fetch-paymentreceived.php`,
        {
          params: {
            BookingID: bookingID,
            fromdate: formData.fromdate
              ? formData.fromdate.toISOString().split("T")[0]
              : undefined,
            todate: formData.todate
              ? formData.todate.toISOString().split("T")[0]
              : undefined,
          },
        }
      );

      if (response.data.status === "Success") {
        const bookingRemarks = response.data.data.bookingremark;
        const payments = response.data.data.payment;

        console.log(payments , 'agaaya dataa<<<<<>>>>>>>>');

        setUpcomingPayments([...bookingRemarks.cash, ...bookingRemarks.cheque]);
        setReceivedPayments([...payments.cash, ...payments.cheque]);
        setFormData({
          fromdate: null,
          todate: null,
        });
      } else {
        console.error("Failed to fetch data:", response.data.message);
        setUpcomingPayments([]);
        setReceivedPayments([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setUpcomingPayments([]);
      setReceivedPayments([]);
    }
  };

  const handleSubmit = async () => {
    // Construct the payload
    const payload = {
      BookingID: selectedRow,
      Proccess: 1,
      ModifyUID: 1,
      paymenttypeID: parseInt(selectedPaymentType) || "",
      Payments: chequePayments.map((payment) => ({
        BookingremarkID: selectedBookingRemark,
        PRemarkamount: remarks.reduce(
          (acc, remark) => acc + parseFloat(remark.Remarkamount || 0),
          0
        ),
        Cash: amountType === "1" ? parseFloat(cashPaid) || 0 : 0,
        ChequeAmount: amountType === "2" ? parseFloat(payment.chequePaid) || 0 : 0,
        BankName: payment.bankName || "",
        AmountTypeID: amountType || 1,
        ChequeNumber: payment.cheqNo || "",
        ChequeDate: payment.chequeDate
          ? payment.chequeDate.toISOString().split("T")[0]
          : cashDate?.CashDate?.toISOString().split("T")[0] || null,
        Date: amountType === "1"
          ? cashDate?.CashDate?.toISOString().split("T")[0] || null
          : payment.Date?.toISOString().split("T")[0] || null,
        PLoan: remarks.reduce(
          (acc, remark) => acc + (parseInt(remark.Loan) || 0),
          0
        ),
        paymenttypeID: parseInt(selectedPaymentType) || "",
        CreateUID: 1,
      })),
      remarks: remarks.map((remark) => ({
        Remarkamount: parseFloat(remark.Remarkamount) || 0,
        RemarkName: remark.RemarkName || "",
        RemarkDate: remark.RemarkDate
          ? formatDateForAPI(remark.RemarkDate)
          : "",
        Loan: parseInt(remark.Loan) || 0,
        Status: parseInt(remark.Status) || 1,
        AmountTypeID: amountType || 1,
      })),
    };
  
    console.log('Payload:', JSON.stringify(payload, null, 2));
  
    try {
      const response = await axios.post(
        "https://ideacafe-backend.vercel.app/api/proxy/api-insert-payment.php",
        payload
      );
      console.log('API Response:', response.data);
      if (response.data.status === "Success") {
        Swal.fire({
          icon: "success",
          title: "Data Updated Successfully",
          showConfirmButton: true,
          timer: 1000,
        });
        // Refresh wing details
        setCashPaid("");
        setChequePayments([]);
        setRemarks([]);
        setSelectedPaymentType("");
        setAmountType("1");
        setCashdate(null);
        setModalOpen(false)
        handleWingClick(selectedWing);
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to Submit",
          text: response.data.message || "Something went wrong!",
        });
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
    }
  };
  
  
  
  
  // Helper function to format date correctly for the API
  const formatDateForAPI = (date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60000);
    return adjustedDate.toISOString().split("T")[0];
  };
  
  
  useEffect(() => {
    if (!paymentData) return;

    const bookingInfo = paymentData.booking && paymentData.booking[0];

    if (!bookingInfo || !paymentData.bookingremark || !paymentData.payment)
      return;

    const processNull = paymentData.bookingremark
      .filter((remark) => remark.Proccess === null)
      .map((remark) => {
        const cash = paymentData.payment.cash.find(
          (cash) => cash.BookingremarkID === remark.BookingremarkID
        );
        const cheque = paymentData.payment.cheque.find(
          (cheque) => cheque.BookingremarkID === remark.BookingremarkID
        );

        return {
          Name: bookingInfo.Name,
          FlatNo: bookingInfo.FlatNo,
          Cash: cash ? cash.Cash : 0,
          ChequeAmount: cheque ? cheque.ChequeAmount : 0,
        };
      });

    const processOne = paymentData.bookingremark
      .filter((remark) => remark.Proccess === "one")
      .map((remark) => {
        const cash = paymentData.payment.cash.find(
          (cash) => cash.BookingremarkID === remark.BookingremarkID
        );
        const cheque = paymentData.payment.cheque.find(
          (cheque) => cheque.BookingremarkID === remark.BookingremarkID
        );

        return {
          Name: bookingInfo.Name,
          FlatNo: bookingInfo.FlatNo,
          Cash: cash ? cash.Cash : 0,
          ChequeAmount: cheque ? cheque.ChequeAmount : 0,
        };
      });

    setMergedData({ proccess_null: processNull, proccess_one: processOne });
  }, [paymentData]);

  return (
    <>
      <Grid
        container
        justifyContent="center"
        spacing={2}
        sx={{ marginBottom: 5 }}
      >
        {wings.map((wing) => (
          <Grid item key={wing.WingID}>
            <Button
              variant="contained"
              onClick={() => handleWingClick(wing)}
              sx={{
                color: "#333333",
                fontSize: "0.6rem",
                backgroundColor: "#f0f0f0",
                minWidth: "auto",
                minHeight: 20,
                "&:hover": {
                  backgroundColor: "#dcdcdc",
                },
              }}
            >
             Wing {wing.WingName}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ padding: 2, marginBottom: 2 }}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by Flat No or Name"
          style={{ width: "100%", padding: "8px" }}
        />
      </Box>

      {selectedWing && (
        <Card
          sx={{
            maxWidth: 1200,
            margin: "auto",
            padding: 2,
            height: 700,
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "2px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#cccccc", // Change the color as needed
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#cccccc", // Change the color on hover
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
          }}
        >
          <CardHeader title={`${selectedWing.WingName} Details`} />
          <CardContent>
            {loading ? (
              <CircularProgress />
              
            ) : dataAvailable ? (
         
              <>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 800 }} aria-label="wing details table">
                    <TableHead>
                      <TableRow>
                        <SortableTableCell label="Party Name" />
                        <SortableTableCell label="Project Name" />
                        <SortableTableCell label="Wing Name" />
                        <SortableTableCell label="Flat No" />
                        <TableCell
                          sx={{ fontWeight: "bold", fontSize: "1rem" }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(searchQuery ? filteredRows : wingDetails).map((row) => (
                        <TableRow key={row.RoomID}>
                          <TableCell>{row.Partyname}</TableCell>
                          <TableCell>{row.ProjectName}</TableCell>
                          <TableCell>{row.WingName}</TableCell>
                          <TableCell>{row.FlatNo}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={(event) => handleMenuOpen(event, row)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleMenuClose}
                            >
                              <MenuItem onClick={() => handleReportClick(row)}>
                                Report
                              </MenuItem>
                              <MenuItem
                                onClick={() => handleTemplateClick(row)}
                              >
                                Template
                              </MenuItem>

                              <MenuItem onClick={() => onCheque(row)}>
                                Cheque Receipt
                              </MenuItem>
                              <MenuItem onClick={() => onEdit(row)}>
                                Edit details
                              </MenuItem>
                            </Menu>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleAddPayment(row.BookingID)}
                              variant="outlined"
                              color="primary"
                            >
                              <PaymentIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <Box textAlign="center">
                <Typography variant="h6">No data available</Typography>
                <NoDataIcon />
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",

            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: 1300,
            mt: 5,
            mx: 2,
            maxHeight: "80vh", // Set maximum height relative to the viewport height
            overflow: "auto",
          }}
        >
          <Grid container spacing={2}>
            <IconButton
              aria-label="cancel"
              onClick={handleClose}
              sx={{ position: "absolute", top: 6, right: 10 }}
            >
              <CancelIcon sx={{ color: "red" }} />
            </IconButton>
            <Typography
              id="modal-modal-title"
              variant="h7"
              component="h3"
              gutterBottom
            >
              Add Payment
            </Typography>

            <Grid item xs={12}>
              <Typography
                variant="body2"
                sx={{ marginTop: 5, fontWeight: "bold", fontSize: 20 }}
              >
                Remarks
              </Typography>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  select
                  label="Select Booking Remark"
                  value={selectedBookingRemark}
                  onChange={(e) => setSelectedBookingRemark(e.target.value)}
                  fullWidth
                  margin="normal"
                >
                  {bookingRemarks.map((option) => (
                    <MenuItem
                      key={option.BookingremarkID}
                      value={option.BookingremarkID}
                    >
                      {option.RemarkName}   ({option.RemarkDate},{option.AmountTypeName})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {selectedBookingRemark && (
                <>
                  <Grid item xs={4}>
                    <TextField
                      label="Remark Amount"
                      value={bookingRemarkDetails.Remarkamount || ""}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Remark Name"
                      value={bookingRemarkDetails.RemarkName || ""}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
            <>
             
              <Grid item xs={4}>
  <TextField
    select
    label="Select Payment Type"
    value={selectedPaymentType}
    onChange={handleChangePayment}
    fullWidth
    margin="normal"
  >
    {paymentTypes.map((option) => (
      <MenuItem
        key={option.paymenttypeID}
        value={option.paymenttypeID} // Changed from paymenttypeName to paymenttypeID
      >
        {option.paymenttypeName}
      </MenuItem>
    ))}
  </TextField>
</Grid>


<Grid item xs={4} mt={3}>
      <FormControl fullWidth>
        <InputLabel>Amount will be given by</InputLabel>
        <Select
          value={amountType}
          onChange={(e) => setAmountType(e.target.value)}
          label="Amount will be given by"
        >
          {amountTypes.map((type) => (
            <MenuItem key={type.AmountTypeID} value={type.AmountTypeID}>
              {type.AmountTypeName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>

    {/* Handle amountType === 1 */}
    {amountType === "1" && (
      <>
        <Grid item xs={4} mt={3}>
          <FormControl fullWidth>
            <InputLabel>Amount Type</InputLabel>
            <Select
              value={amountType}
              onChange={(e) => setAmountType(e.target.value)}
              label="Amount Type"
            >
              {amountTypes.map((type) => (
                <MenuItem key={type.AmountTypeID} value={type.AmountTypeID}>
                  {type.AmountTypeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Current Paid"
            type="number"
            value={cashPaid}
            onChange={(e) => setCashPaid(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={3} mt={3.5}>
          <DatePicker
            selected={cashDate?.CashDate}
            onChange={handleDateChangeCash}
            dateFormat="yyyy-MM-dd"
            customInput={<TextField label="Current date" fullWidth />}
          />
        </Grid>
      </>
    )}

    {/* Handle amountType === 2 */}
    {amountType === "2" && (
      <>
        {chequePayments.map((payment, index) => (
          <React.Fragment key={index}>
            <Grid item xs={12} mt={3}>
              <Typography variant="h6">Payment {index + 1}</Typography>
            </Grid>

            {/* Common Amount Type Dropdown */}
            <Grid item xs={4} mt={3}>
              <FormControl fullWidth>
                <InputLabel>Amount Type</InputLabel>
                <Select
                  value={payment.AmountTypeID || ""}
                  onChange={(e) =>
                    handleChequePaymentChange(index, "AmountTypeID", e.target.value)
                  }
                  label="Amount Type"
                >
                  {amountTypes.map((type) => (
                    <MenuItem key={type.AmountTypeID} value={type.AmountTypeID}>
                      {type.AmountTypeName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="Cheque Paid"
                type="number"
                value={payment.chequePaid}
                onChange={(e) =>
                  handleChequePaymentChange(index, "chequePaid", e.target.value)
                }
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Bank Name"
                type="text"
                value={payment.bankName}
                onChange={(e) =>
                  handleChequePaymentChange(index, "bankName", e.target.value)
                }
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Cheque Number"
                type="number"
                value={payment.cheqNo}
                onChange={(e) =>
                  handleChequePaymentChange(index, "cheqNo", e.target.value)
                }
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={4} mt={3}>
              <DatePicker
                selected={payment.chequeDate}
                onChange={(date) =>
                  handleDateChange(date, index, "chequeDate")
                }
                dateFormat="yyyy-MM-dd"
                customInput={<TextField label="Cheque Date" fullWidth />}
              />
            </Grid>
            <Grid item xs={4} mt={3}>
              <DatePicker
                selected={payment.Date}
                onChange={(date) => handleDateChange(date, index, "Date")}
                dateFormat="yyyy-MM-dd"
                customInput={<TextField label="Date" fullWidth />}
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={handleAddChequePayment} color="primary">
                <AddIcon />
              </IconButton>
              <IconButton
                color="secondary"
                onClick={() => handleRemoveChequePayment(index)}
              >
                <DeleteIcon sx={{ color: "red" }} />
              </IconButton>
            </Grid>
          </React.Fragment>
        ))}
      </>
    )}
            </>

            {selectedPaymentType === 2 && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Remarks
                  </Typography>
                </Grid>
                {remarks.map((remark, index) => (
                  <Grid container spacing={2} key={index}>
                    <Grid item xs={3}>
                      <TextField
                        label="Amount"
                        type="number"
                        value={remark.Remarkamount}
                        onChange={(e) =>
                          handleChangeRemark(e, index, "Remarkamount")
                        }
                        fullWidth
                        margin="normal"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">₹</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        label="Remark"
                        value={remark.RemarkName}
                        onChange={(e) =>
                          handleChangeRemark(e, index, "RemarkName")
                        }
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={3} mt={3}>
                      <FormControl fullWidth>
                        <InputLabel>Amount Type</InputLabel>
                        <Select
                          value={remark.AmountTypeID || ""}
                          onChange={(e) =>
                            handleChange(e, index, "AmountTypeID")
                          }
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

                    <Grid item xs={3} mt={3}>
                      <DatePicker
                        selected={remark.RemarkDate}
                        onChange={(date) => handleDateRemarks(date, index)}
                        dateFormat="yyyy-MM-dd"
                        customInput={<TextField label="Date" fullWidth />}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={remark.Loan === 1}
                            onChange={(e) => handleLoanChange(e, index)}
                          />
                        }
                        label="Loan Process"
                      />
                    </Grid>
                    <Grid item xs={12} container justifyContent="flex-end">
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleRemoveRemark(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button
                    onClick={handleAddRemark}
                    variant="outlined"
                    startIcon={<AddIcon />}
                  >
                    Add Remark
                  </Button>
                </Grid>
              </>
            )}

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
        </Box>
      </Modal>

      <Modal open={openEdit} onClose={handleCloseEditForm}>
        <Card
          style={{
            maxWidth: "1400px",
            margin: "auto",
            marginTop: "50px",
            height: "90vh", // Set height relative to the viewport
            padding: "20px",
            overflowY: "auto", // Enable vertical scrolling if content overflows
          }}
        >
          <EditBookingform
            bookingID={bookingID}
            handleCloseEditForm={handleCloseEditForm}
            // handleCancel={handleCloseTemplate}
          />
        </Card>
      </Modal>

      <Modal open={openTemplate} onClose={handleCloseTemplate}>
        <Card
          style={{
            maxWidth: "800px",
            margin: "auto",
            marginTop: "50px",
            height: "90vh", // Set height relative to the viewport
            padding: "20px",
            overflowY: "auto", // Enable vertical scrolling if content overflows
          }}
        >
          <TemplatePayment
            bookingID={bookingID}
            handleCancel={handleCloseTemplate}
          />
        </Card>
      </Modal>

      <Modal open={openCheque} onClose={handleCloseTemplate}>
        <Card
          style={{
            maxWidth: "800px",
            margin: "auto",
            marginTop: "50px",
            height: "90vh", // Set height relative to the viewport
            padding: "20px",
            overflowY: "auto", // Enable vertical scrolling if content overflows
          }}
        >
          <IconButton
            aria-label="cancel"
            onClick={handleCloseRecipt}
            sx={{ position: "absolute", top: 6, right: 10 }}
          >
            <CancelIcon sx={{ color: "red" }} />
          </IconButton>

          <Reciept bookingID={bookingID} />
        </Card>
      </Modal>
      <Modal open={open} onClose={handleCloseReport}>
        <Card
          style={{
            maxWidth: "800px",
            margin: "auto",
            height: "90vh",
            marginTop: "50px",
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <CardContent>
            <IconButton
              aria-label="cancel"
              onClick={handleCloseReport}
              // sx={{ position: "absolute", top: 6, right: 10 }}
            >
              <CancelIcon sx={{ color: "red" }} />
            </IconButton>
            <Typography variant="h5" gutterBottom align="center">
              Payment Details
            </Typography>

            <Grid container spacing={4} mb={3}>
              <Grid item xs={12} sm={6} md={4}>
                <DatePicker
                  selected={formData.fromdate}
                  onChange={(date) => handleDateChangePayment(date, "fromdate")}
                  dateFormat="dd-MM-yyyy"
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
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <DatePicker
                  selected={formData.todate}
                  onChange={(date) => handleDateChangePayment(date, "todate")}
                  dateFormat="dd-MM-yyyy"
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
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={12}
                md={4}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  onClick={handleDateSearch}
                  style={{ width: "100%" }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
            

            <Grid container spacing={3}>
              {/* Upcoming Payments */}
              <Grid item xs={12}>
                <Typography variant="h6">Upcoming Payments</Typography>
                <TableContainer component={Paper} style={{ maxHeight: 400 }}>
                  <Table >
                    <TableHead>
                      <TableRow>
                        <TableCell>Remark</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Payment Type</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {upcomingPayments.length > 0 ? (
                        upcomingPayments.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.RemarkName}</TableCell>

                            <TableCell>{item.Remarkamount}</TableCell>
                            <TableCell>
                              {item.AmountTypeID === 1 ? "Current" : "Post"}
                            </TableCell>
                            <TableCell>
  {new Date(item.RemarkDate).toLocaleDateString("en-GB").replace(/\//g, "-")}
</TableCell>

                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            No Upcoming Payments
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              {/* Received Payments */}
              <Grid item xs={12}>
                <Typography variant="h6">Received Payments</Typography>
                <TableContainer component={Paper} style={{ maxHeight: 400 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                      <TableCell>RemarkName</TableCell>

                        <TableCell>Current </TableCell>
                        <TableCell>Post</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {receivedPayments.length > 0 ? (
                        receivedPayments.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.RemarkName}</TableCell>

                            <TableCell>{item.Cash}</TableCell>
                            <TableCell>{item.ChequeAmount}</TableCell>
                            <TableCell>  {new Date(item.Date).toLocaleDateString("en-GB").replace(/\//g, "-")}
</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            No Received Payments
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Modal>
    </>
  );
};

export default Listprojectbookng;
