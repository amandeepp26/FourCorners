import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  Grid,
  TableHead,
  CardContent,
  TextField,
  IconButton,
} from "@mui/material";
import { createGlobalStyle } from "styled-components";
import styled from "styled-components";
import { Card } from "mdi-material-ui";
import { DatePicker } from "@mui/lab";
import { Call } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import { format } from 'date-fns';
const StyledTableCell = styled(TableCell)({
  border: "2px solid black",
  padding: "0px", // Removed padding
  textAlign: "center",
});

const InvoiceBox = styled(Box)({
  maxWidth: "890px",
  margin: "auto",
  padding: "10px",
  border: "1px solid #eee",
  fontSize: "11px",
  lineHeight: "18px",
  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
});

const Reciept = ({ bookingID }) => {
  console.log(bookingID, "id bookinggg<<>>>> ayaa UJJAWALLLLLL");
  const printRef = useRef();
  const [data, setData] = useState([]);
  const [totalChequeAmount, setTotalChequeAmount] = useState(0);
  const [totalamountinwords, setTotalamountinwords] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fromdate: new Date(), // Default to current date
    toDate: new Date(), // Default to current date
    Status: 1,
  });

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Reload the page to reset the original contents
  };

  useEffect(() => {
    if (bookingID) {
      fetchData(bookingID);
    }
  }, [bookingID]);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Formats to YYYY-MM-DD
  };
  const fetchData = async (bookingID) => {
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-chequereceipt.php?BookingID=${bookingID}`
      );
      console.log("Data fetched successfully", response.data);
      const responseData = response.data.data;

      // Check if responseData is valid and contains expected properties
      if (responseData && Array.isArray(responseData.records)) {
        setData(responseData.records); // Set the records array to your state
        setTotalChequeAmount(responseData.totalChequeAmount); // Set the totalChequeAmount to your state
        setTotalamountinwords(responseData.totalChequeAmountWords);
      } else {
        console.error(
          "Expected an array for records but received:",
          responseData
        );
        setData([]); // Set an empty array if the records array is not available
        setTotalChequeAmount(0); // Reset totalChequeAmount if not available
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (bookingID) {
      fetchData(bookingID);
    }
  };
  const handleDateChange = (date, field) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: date,
    }));
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error loading data</Typography>;
  }

  return (
    <>
      <Box container spacing={3}>
        <Box item>
          <DatePicker
            selected={formData.fromdate}
            onChange={(date) => handleDateChange(date, "fromdate")}
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

          <DatePicker
            selected={formData.todate}
            onChange={(date) => handleDateChange(date, "todate")}
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

          {/* <Button variant="contained" onClick={handleSearch}>
            Search
          </Button> */}
        </Box>
      </Box>

      <InvoiceBox className="printableArea" ref={printRef}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow sx={{ height: "10px", padding: 0 }}>
                <StyledTableCell
                  colSpan={3}
                  sx={{ height: "10px", padding: 0 }}
                >
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-around"
                    spacing={1}
                  >
                    <Grid item>
                      <img
                        src="https://i.postimg.cc/PJfmZCRv/Untitled-design-2024-04-12-T161558-455.png"
                        alt="200 * 200"
                        width="80"
                        height="80"
                      />
                    </Grid>
                    <Grid item>
                      <Typography
                        style={{
                          textAlign: "center",
                          fontSize: 50,
                          fontWeight: 900,
                          color: "#ffbf15",
                        }}
                      >
                       {data[0]?.CompanyName || ""}
                      </Typography>
                      <Typography
                        style={{
                          textAlign: "center",
                          fontSize: 30,
                          fontWeight: "bold",
                        }}
                      >
                    Builders & Developer
                      </Typography>
                    </Grid>
                  </Grid>
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <div>
          <StyledTableCell colSpan={12}>
            <Grid container spacing={0} sx={{ width: "100%" }}>
              <Grid item xs={9}>
                <StyledTableCell
                  sx={{ textAlign: "center", padding: 0, border: 0 }}
                >
                  <Typography style={{ fontSize: 14, padding: 5 }}>
                    Corporate Office: {data[0]?.CompanyAddress || "N/A"}.  GST No: {data[0]?.CompanyGst || "N/A"}    <br></br>
                      Website: {data[0]?.CompanyWebsite || "N/A"} <br></br> Email: {data[0]?.CompanyEmail || "N/A"}  <br></br>  Site Address: {data[0]?.ProjectAddress || "N/A"} MahaRera
                    No. {data[0]?.reraregistration || "N/A"} <br></br> Mobile No. 9930960449/9004475240
                  </Typography>
                  
                </StyledTableCell>
                
              </Grid>
              <Grid item xs={3}>
                <div style={{ minWidth: "100%", borderWidth: 1 }}>
                  <div>
                    <h4 style={{}}>Receipt</h4>
                    <TableContainer component={Paper}>
                      <Table style={{ border: "1px solid black" }}>
                        <TableBody>
                          <TableRow sx={{ padding: 0 }}>
                            <StyledTableCell
                              style={{ width: "20%", padding: 0 }}
                              colSpan={10}
                            >
                              <Typography>R.No.:</Typography>
                            </StyledTableCell>
                            <StyledTableCell
                              style={{ width: "30%", padding: 0 }}
                              colSpan={10}
                            >
                              <Typography>
                                {data[0]?.paymentID || ""}
                              </Typography>
                            </StyledTableCell>
                          </TableRow>
                          <TableRow sx={{ padding: 0 }}>
                            <StyledTableCell
                              style={{ width: "20%", padding: 0 }}
                              colSpan={10}
                            >
                              <Typography>Date:</Typography>
                            </StyledTableCell>
                            <StyledTableCell
                              style={{ width: "30%", padding: 0 }}
                              colSpan={10}
                            >
                              <Typography>
                                {data[0]?.BookingDate || ""}
                              </Typography>
                            </StyledTableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
              </Grid>
            </Grid>
          </StyledTableCell>
        </div>
        <div
          style={{
            width: "100%",
            borderWidth: 1,
            borderStyle: "solid",
            paddingLeft: 10,
            display: "flex",
          }}
        >
          <div>
            <Typography style={{ fontWeight: "bold" }}>Received</Typography>
            <Typography>With Thanks from:</Typography>
          </div>
          <div
            style={{ marginLeft: 20, alignItems: "center", display: "flex" }}
          >
            <Typography style={{ fontSize: 26 }}>
              Mr {data[0]?.Name || ""}
            </Typography>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            borderWidth: 1,
            borderStyle: "solid",
            paddingLeft: 10,
            display: "flex",
          }}
        >
          <div style={{ width: "20%" }}>
            <Typography>Part</Typography>
            <Typography style={{ fontWeight: "bold" }}>
              TYPE : {data[0]?.UnittypeName}
            </Typography>
          </div>
          <div
            style={{ marginLeft: 20, alignItems: "center", display: "flex" }}
          >
            <Typography style={{ fontSize: 17 }}>
              Payment Against Flat No. {data[0]?.FlatNo || ""} On{" "}
              {data[0]?.FloorNo || ""} Floor Of the Building Known as
              {data[0]?.ProjectName}
            </Typography>
          </div>
        </div>

        <TableContainer component={Paper}>
          <Table style={{ border: "1px solid black" }}>
            <TableHead>
              <TableRow>
              <TableCell sx={{ textAlign: 'center'}}>Date</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>Bank Name</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>Cheque Number</TableCell>
            <TableCell sx={{ textAlign: 'center' }}>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((payment) => (
                <TableRow key={payment.paymentID}>
                  <StyledTableCell>{format(new Date(payment.Date), 'yyyy-MM-dd')}</StyledTableCell>
                  <StyledTableCell>{payment.BankName}</StyledTableCell>
                  <StyledTableCell>{payment.ChequeNumber}</StyledTableCell>
                  <StyledTableCell>{payment.ChequeAmount}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer component={Paper}>
          <Table style={{ border: "1px solid black" }}>
            <TableBody>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ width: "75%", padding: 0 }}
                  colSpan={10}
                >
                  <Typography style={{ textAlign: "left", marginLeft: 10 }}>
                    Total
                  </Typography>
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "25%", padding: 0 }}
                  colSpan={10}
                >
                  <Typography> ₹ {totalChequeAmount}</Typography>{" "}
                  {/* Use the state variable here */}
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer component={Paper}>
          <Table className="info-border">
            <TableBody>
              <TableRow style={{ border: "1px solid black", padding: 0 }}>
                <StyledTableCell
                  style={{
                    textAlign: "left",
                    padding: 0,
                    paddingLeft: 10,
                    fontSize: 22,
                  }}
                  colSpan={10}
                >
                  In Words :{totalamountinwords}
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              paddingTop: 10,
              width: "50%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <StyledTableCell
              style={{
                marginTop: 10,
                textAlign: "center",
                color: "#000",
                fontSize: 25,
                fontWeight: 500,
                padding: 0,
                width: "100%",
                paddingTop: 5,
                paddingBottom: 5,
                marginBottom: 10,
              }}
              colSpan={10}
            >
              ₹ {totalChequeAmount} /-
            </StyledTableCell>
            <StyledTableCell
              style={{
                textAlign: "center",
                color: "#000",
                fontSize: 16,
                fontWeight: 500,
                padding: 0,
                width: "100%",
                marginBottom: 10,
                paddingTop: 5,
                paddingBottom: 5,
              }}
              colSpan={10}
            >
              T&C: Subject to Realisation of Cheque*
            </StyledTableCell>
          </div>
          <div
            style={{
              marginLeft: 10,
              minWidth: "25%",
            }}
          >
            <StyledTableCell
              style={{
                marginTop: 10,
                textAlign: "center",
                color: "#000",
                fontSize: 25,
                fontWeight: 500,
                padding: 0,
                width: "25%",
                minWidth: "25%",
                marginBottom: 10,
              }}
              colSpan={10}
            >
              <img
                src="https://i.postimg.cc/PJfmZCRv/Untitled-design-2024-04-12-T161558-455.png"
                alt="200 * 200"
                width="80"
                height="100%"
              />
            </StyledTableCell>
          </div>
          <div
            style={{
              marginLeft: 10,
              minWidth: "25%",
            }}
          >
            <StyledTableCell
              style={{
                marginTop: 10,
                textAlign: "center",
                color: "#000",
                fontSize: 25,
                fontWeight: 500,
                padding: 0,
                width: "25%",
                minWidth: "50%",
                marginBottom: 10,
              }}
              colSpan={10}
            >
              <img
                src="https://i.postimg.cc/PJfmZCRv/Untitled-design-2024-04-12-T161558-455.png"
                alt="200 * 200"
                width="80"
                height="100%"
              />
            </StyledTableCell>
          </div>
        </div>

        <TableContainer component={Paper}>
          <Table className="info-border">
            <TableBody>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{
                    textAlign: "center",
                    color: "#000",
                    fontSize: 25,
                    fontWeight: 500,
                    padding: 0,
                  }}
                  colSpan={10}
                >
                  Thank You
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </InvoiceBox>
    </>
  );
};

export default Reciept;
