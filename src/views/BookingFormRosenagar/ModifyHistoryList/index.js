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

const NoDataIcon = () => (
  <Avatar
    alt="No Data"
    sx={{ width: 500, height: "auto" }}
    src="/images/avatars/nodata.svg"
  />
);





const ModifyHistoryList = ({
  onChequeReceiptClick,
  item,
  handleTemplateClick,
  onEdit,
  onCheque
}) => {
  const router = useRouter();
  const initialMergedData = {
    proccess_null: [],
    proccess_one: [],
    totalCash: 0,
    totalCheque: 0,
    totalCost: 0
  };
  const [cookies, setCookie, removeCookie] = useCookies(["amr"]);
  const [wings, setWings] = useState([]);
  const [selectedWing, setSelectedWing] = useState(null);
  const [wingDetails, setWingDetails] = useState([]);
  const [open, setOpen] = useState(false);
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
  const [amountTypes, setAmountTypes] = useState([]);
  const [mergedData, setMergedData] = useState(initialMergedData);
  const [selectedBookingRemark, setSelectedBookingRemark] = useState("");
  const [bookingRemarkDetails, setBookingRemarkDetails] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [cashPaid, setCashPaid] = useState("");
  const [chequePaid, setChequePaid] = useState("");
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
        const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-fetch-projectwings.php?ProjectID=${item.ProjectID}`;
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
        "https://apiforcornershost.cubisysit.com/api/api-dropdown-paymenttype.php"
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

  useEffect(() => {
    // Fetch amount types from the API
    const fetchAmountTypes = async () => {
      try {
        const response = await axios.get(
          "https://apiforcornershost.cubisysit.com/api/api-dropdown-amountype.php"
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
      const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-fetch-modifylist.php?WingID=${wing.WingID}&ProjectID=${item.ProjectID}`;
      const response = await axios.get(apiUrl);
      if (response.data.status === "Success") {
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
        `https://apiforcornershost.cubisysit.com/api/api-dropdown-bookingremark.php?BookingID=${bookingID}`
      );
      if (response.data.status === "Success") {
        console.log(response.data.data , 'aagaya daata remakrs');
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
        `https://apiforcornershost.cubisysit.com/api/api-dropdown-bookingremarkdetails.php?BookingremarkID=${bookingRemarkID}`
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

  const handleReportClick = (id) => {
    setBookingID(id);  // Set the BookingID state
    setMergedData(initialMergedData);  // Clear the mergedData state
    handleOpenPayment(selectedRowMenu);  // Open the modal
    handleMenuClose();
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



  const handleDateChange = (date) => {
    setFormData({ ...formData, AmountGiven: date });
  };

  const handleDateChangeCash = (date) => {
    setCashdate({ ...cashDate, CashDate: date });
  };


  
  const handleDateChangePayment = (date, key) => {
    setFormData({ ...formData, [key]: date });
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
  const handleClose = () => setOpen(false);


 const handleDateSearch = async () => {
  console.log('press');
  try {
    const response = await axios.get(`https://proxy-forcorners.vercel.app/api/proxy/api-fetch-paymentreceived.php`, {
      params: {
        BookingID: bookingID,
        fromdate: formData.fromdate ? formData.fromdate.toISOString().split('T')[0] : undefined,
        todate: formData.todate ? formData.todate.toISOString().split('T')[0] : undefined
      }
    });

    if (response.data.status === "Success") {
      const data = response.data.data;
      console.log(data, 'dekh bahi');

      // Process data
      const proccess_null = [
        ...data.bookingremark.cash.filter(item => item.Proccess === null),
        ...data.bookingremark.cheque.filter(item => item.Proccess === null)
      ].map(item => ({
        Name: data.booking[0].Name,
        FlatNo: data.booking[0].FlatNo,
        Remarkamount: item.Remarkamount,
        PaymentType: item.AmountTypeID === 1 ? 'Cash' : 'Cheque',
        RemarkDate: item.RemarkDate
      }));

      const proccess_one = [
        ...data.payment.cash.filter(item => item.PLoan === 1),
        ...data.payment.cheque.filter(item => item.PLoan === 1)
      ].map(item => ({
        Name: data.booking[0].Name,
        FlatNo: data.booking[0].FlatNo,
        Cash: item.Cash,
        ChequeAmount: item.ChequeAmount,
        PaymentType: item.AmountTypeID === 1 ? 'Cash' : 'Cheque'
      }));

      const totalCash = data.payment.totalCash || 0;
      const totalCheque = data.payment.totalCheque || 0;
      const totalCost = data.payment.TotalCost || 0;

      setMergedData({
        proccess_null,
        proccess_one,
        totalCash,
        totalCheque,
        totalCost
      });
    } else {
      console.error('Failed to fetch data:', response.data.message);
      setMergedData(initialMergedData);  // Reset mergedData on failure
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    setMergedData(initialMergedData);  // Reset mergedData on error
  }
};

  
  
  
  
  
  
  
  
  
  
  
  
  
  
const handleSubmit = async () => {
  // Prepare the data for the API request
  const payload = {
    BookingID: selectedRow,
    Payment: {
      BookingremarkID: selectedBookingRemark,
      PRemarkamount: remarks.reduce(
        (acc, remark) => acc + parseFloat(remark.Remarkamount || 0),
        0
      ),
      Cash: cashPaid || "0",
      ChequeAmount: chequePaid || "0",
      BankName: bankName || "",
      AmountTypeID: amountType || "",
      ChequeNumber: cheqNo || "",
      ChequeDate: formData.AmountGiven.toISOString().split("T")[0],
      Date: cashDate.CashDate.toISOString().split("T")[0],
      PLoan: remarks.reduce(
        (acc, remark) => acc + (parseInt(remark.Loan) || 0),
        0
      ),
      paymenttypeID: 1,
      CreateUID: 1,
      CreateDate: new Date().toISOString().split("T")[0],
    },
    Remarks: remarks.map((remark) => ({
      Remarkamount: parseFloat(remark.Remarkamount) || 0,
      RemarkName: remark.RemarkName || "",
      RemarkDate:
        new Date(remark.RemarkDate).toISOString().split("T")[0] || "",
      Loan: parseInt(remark.Loan) || 0,
      Status: parseInt(remark.Status) || 1,
    })),
    Proccess: 1,
    ModifyUID: 1,
  };

  console.log(payload, "ye jaa raha");
  try {
    const response = await axios.post(
      "https://proxy-forcorners.vercel.app/api/proxy/api-insert-payment.php",
      payload
    );
    console.log("ye gaya data", response.data);
    if (response.data.status === "Success") {
      console.log("Payment successfully submitted:", response.data);
      setCashPaid("");
      setChequePaid("");
      setBankName("");
      setCheqNo("");
      setFormData({ AmountGiven: new Date() });
      setSelectedPaymentType("");
      setRemarks([
        { Remarkamount: "", RemarkName: "", RemarkDate: new Date(), Loan: 0 },
      ]);
      setSelectedBookingRemark("");
      setBookingRemarkDetails({});
      setSelectedRow(null);

      Swal.fire({
        icon: "success",
        title: "Data Submitted Successfully",
        showConfirmButton: false,
        timer: 1000,
      });

      handleModalClose();
    } else {
      // Handle unsuccessful response
      console.error("Failed to submit payment:", response.data.message);
      // Show an error message to the user if needed
    }
  } catch (error) {
    console.error("Error submitting payment:", error);
    // Show an error message to the user if needed
  }
};


  useEffect(() => {
    if (!paymentData) return;
    
    const bookingInfo = paymentData.booking && paymentData.booking[0];
  
    if (!bookingInfo || !paymentData.bookingremark || !paymentData.payment) return;
  
    const processNull = paymentData.bookingremark
      .filter(remark => remark.Proccess === null)
      .map(remark => {
        const cash = paymentData.payment.cash.find(cash => cash.BookingremarkID === remark.BookingremarkID);
        const cheque = paymentData.payment.cheque.find(cheque => cheque.BookingremarkID === remark.BookingremarkID);
  
        return {
          Name: bookingInfo.Name,
          FlatNo: bookingInfo.FlatNo,
          Cash: cash ? cash.Cash : 0,
          ChequeAmount: cheque ? cheque.ChequeAmount : 0
        };
      });
  
    const processOne = paymentData.bookingremark
      .filter(remark => remark.Proccess === 'one')
      .map(remark => {
        const cash = paymentData.payment.cash.find(cash => cash.BookingremarkID === remark.BookingremarkID);
        const cheque = paymentData.payment.cheque.find(cheque => cheque.BookingremarkID === remark.BookingremarkID);
  
        return {
          Name: bookingInfo.Name,
          FlatNo: bookingInfo.FlatNo,
          Cash: cash ? cash.Cash : 0,
          ChequeAmount: cheque ? cheque.ChequeAmount : 0
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
              {wing.WingName}
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
        <Card sx={{ maxWidth: 1200, margin: "auto", padding: 2 }}>
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
                      {(searchQuery ? filteredRows : wingDetails)
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => (
                          <TableRow key={row.RoomID}>
                            <TableCell>{row.Name}</TableCell>
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
                               
                                <MenuItem
                                  onClick={() =>
                                    handleTemplateClick(row.BookingID)
                                  }
                                >
                                  Template
                                </MenuItem>


                               
                             
                               
                              </Menu>
                            </TableCell>
                         
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={wingDetails.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
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
            padding: 15,
            backgroundColor: "white",
            margin: "auto",
            maxWidth: 900,
            maxHeight: "80vh",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="h6" gutterBottom>
                Add Payment
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
                      {option.RemarkName}
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

            <Grid item xs={3} mt={3}>
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

{amountType === '1' ? (
  <>
    <Grid item xs={4}>
      <TextField
        label="Cash Paid"
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
        selected={cashDate.CashDate}
        onChange={handleDateChangeCash}
        dateFormat="yyyy-MM-dd"
        customInput={<TextField label="Cash date" fullWidth />}
      />
    </Grid>
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
            value={option.paymenttypeName}
          >
            {option.paymenttypeName}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
  </>
) : (
  <>
    <Grid item xs={4}>
      <TextField
        label="Cheque Paid"
        type="number"
        value={chequePaid}
        onChange={(e) => setChequePaid(e.target.value)}
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
        value={bankName}
        onChange={(e) => setBankName(e.target.value)}
        fullWidth
        margin="normal"
      />
    </Grid>
    <Grid item xs={4}>
      <TextField
        label="Cheque Number"
        type="number"
        value={cheqNo}
        onChange={(e) => setCheqNo(e.target.value)}
        fullWidth
        margin="normal"
      />
    </Grid>
    <Grid item xs={3} mt={3.5}>
      <DatePicker
        selected={formData.AmountGiven}
        onChange={handleDateChange}
        dateFormat="yyyy-MM-dd"
        customInput={<TextField label="Date" fullWidth />}
      />
    </Grid>
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
            value={option.paymenttypeName}
          >
            {option.paymenttypeName}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
  </>
)}

            {selectedPaymentType === "Partial payment" && (
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
            <Grid item xs={12} container justifyContent="flex-end">
              <Button
                onClick={handleModalClose}
                variant="contained"
                color="primary"
              >
                Close
              </Button>
            </Grid>
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

      <Modal open={open} onClose={handleClose}>
  <Card
    style={{
      maxWidth: "800px",
      margin: "auto",
      marginTop: "50px",
      padding: "20px",
    }}
  >
    <CardContent>
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
            showMonthDropdown
            showYearDropdown
            yearDropdownItemNumber={15} // Number of years to show in dropdown
            scrollableYearDropdown
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
            showMonthDropdown
            showYearDropdown
            yearDropdownItemNumber={15} // Number of years to show in dropdown
            scrollableYearDropdown
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
        <Grid item xs={12}>
          <Typography variant="h6">Upcoming Payments</Typography>
          <TableContainer component={Paper} style={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Flat Number</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Payment Type</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mergedData.proccess_null?.length > 0 ? (
                  mergedData.proccess_null.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.Name}</TableCell>
                      <TableCell>{item.FlatNo}</TableCell>
                      <TableCell>{item.Remarkamount}</TableCell>
                      <TableCell>{item.PaymentType}</TableCell>
                      <TableCell>{new Date(item.RemarkDate).toLocaleDateString()}</TableCell>
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

        <Grid item xs={12}>
          <Typography variant="h6">Received Payments</Typography>
          <TableContainer component={Paper} style={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Flat Number</TableCell>
                  <TableCell>Cash (A)</TableCell>
                  <TableCell>Cheque (B)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mergedData.proccess_one?.length > 0 ? (
                  mergedData.proccess_one.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.Name}</TableCell>
                      <TableCell>{item.FlatNo}</TableCell>
                      <TableCell>{item.PaymentType === 'Cash' ? item.Cash : '-'}</TableCell>
                      <TableCell>{item.PaymentType === 'Cheque' ? item.ChequeAmount : '-'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No Received Payments
                    </TableCell>
                  </TableRow>
                )}

                {/* Totals Row */}
                {mergedData.proccess_one?.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={2} align="right"><strong>Total</strong></TableCell>
                    <TableCell><strong>{mergedData.totalCash}</strong></TableCell>
                    <TableCell><strong>{mergedData.totalCheque}</strong></TableCell>
                  </TableRow>
                )}

                {/* Total Cost Row */}
                {mergedData.proccess_one?.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={2} align="right"><strong>Total Cost</strong></TableCell>
                    <TableCell colSpan={2}><strong>{mergedData.totalCost}</strong></TableCell>
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

export default ModifyHistoryList;
