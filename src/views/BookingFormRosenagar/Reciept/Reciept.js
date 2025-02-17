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
import ErrorIcon from '@mui/icons-material/Error';
import { Call, Grid3x3TwoTone } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import { format } from 'date-fns';
const StyledTableCell = styled(TableCell)({
  border: "2px solid black",
  padding: "0px", // Removed padding
  textAlign: "center",
  padding:0,
  paddingRight:0,
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

const Reciept = ({ bookingID  }) => {
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
  const rowsPerPage = 6; // You can adjust this number to fit the content on A4 size
  const rowsRemaining = rowsPerPage - data.length; // Calculate the remaining rows to fill

  const emptyRows = Array.from({ length: rowsRemaining }, (_, index) => ({})); // Create empty rows

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return  <Typography variant="body1" color="textSecondary" display="flex" alignItems="center">
        <ErrorIcon style={{ marginRight: 8 }} />
        No Record found
      </Typography>;
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

        </Box>
        <Box item>
          <Button variant="contained" onClick={handlePrint}>Print Receipt</Button>
        </Box>
      </Box>
      <StyledTableCell>
      <TableContainer component={Paper} sx={{ border:"25px" }}>
      <InvoiceBox className="printableArea" ref={printRef}  sx={{border:"5px"}}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
            <TableRow sx={{ height: "10px", padding: 0 }}>
              
  <StyledTableCell
    colSpan={3} style={{padding:0}}
    sx={{ height: "10px", padding: "0px" ,margin:0}}
  >
    <Grid
      container
      alignItems="center"
      justifyContent="space-around"
      spacing={1}
    >
      <img
       src={`https://apiforcornershost.cubisysit.com/companyimage/${data[0]?.companyimageName || 'image.png'}`}
       alt="Company Logo"
        style={{  width: "150px",height:"110px",padding:0 }}
      />
    </Grid>
  </StyledTableCell>
  <StyledTableCell
    colSpan={7}
    sx={{ height: "10px", padding: 0 }}
  >
    <Grid
      container
      alignItems="center"
      justifyContent="space-around"
      spacing={1}
    >
      <Grid item>
        <Typography
          style={{
            textAlign: "center",
            fontSize: 35,
            fontWeight: 900,
            color: "orange",
            textTransform:"uppercase",
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
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow sx={{ height: "10px", padding: 0 }}>
          <StyledTableCell colSpan={7} >
          <Typography style={{ fontSize: 14, padding: 5 }}>
                    Corporate Office: {data[0]?.CompanyAddress || "N/A"}.<br></br>  GST No: {data[0]?.CompanyGst || "N/A"}    <br></br>
                    Website: {data[0]?.CompanyWebsite || "N/A"} {"  "} Email: {data[0]?.CompanyEmail || "N/A"}  <br></br>  Site Address: {data[0]?.ProjectAddress || "N/A"}  <br></br>
                     Mobile No. 9930960449/9004475240<br></br> MahaRera 
                    No. {data[0]?.reraregistration || "N/A"} 
                  </Typography>
          </StyledTableCell>
          <StyledTableCell colSpan={3} style={{padding:0 }} >
          <TableContainer sx={{ paddingRight: 0 , marginBottom:0}}>
  <Typography>Receipt</Typography>
  <Table style={{ border: "1px solid black" }}>
  <TableBody>
              <TableRow>
                <StyledTableCell  sx={{ textAlign: 'center' }} style={{padding:0 }}>R No.</StyledTableCell>
                <StyledTableCell sx={{ textAlign: 'center' }} style={{padding:0 }}>Date</StyledTableCell>
              
              </TableRow>
              </TableBody>
            <TableBody>
            
                <TableRow>
                  <StyledTableCell style={{padding:0 }}>{data[0]?.paymentID || ""}</StyledTableCell>
                  <StyledTableCell style={{padding:0 }}>{data[0]?.BookingDate || ""}</StyledTableCell>
              
                </TableRow>    
            </TableBody>
          </Table>
</TableContainer>
</StyledTableCell>

          </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
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
              {data[0]?.FloorNo || ""} Floor Of the Building Known as {" "} {data[0]?.ProjectName}
            </Typography>
          </div>
        </div>

        <TableContainer component={Paper}>
          <Table style={{ border: "1px solid black" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: 'center' }}>Date</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Bank Name</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Cheque Number</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Render Payment Data */}
              {data?.map((payment) => (
                <TableRow key={payment.paymentID}>
                  <StyledTableCell>{payment.Date}</StyledTableCell>
                  <StyledTableCell>{payment.BankName}</StyledTableCell>
                  <StyledTableCell>{payment.ChequeNumber}</StyledTableCell>
                  <StyledTableCell>{payment.ChequeAmount}</StyledTableCell>
                </TableRow>
              ))}

          
              {data?.length < 6 && [...Array(6 - data.length)].map((_, index) => (
                <TableRow key={`empty-${index}`}>
                  <StyledTableCell>&nbsp;</StyledTableCell>
                  <StyledTableCell>&nbsp;</StyledTableCell>
                  <StyledTableCell>&nbsp;</StyledTableCell>
                  <StyledTableCell>&nbsp;</StyledTableCell>
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
        <TableContainer component={Paper}>
  <Table className="info-border">
    <TableBody>
     

      <TableRow style={{ border: "1px solid black", padding: 0 }}>
       
        <StyledTableCell
          style={{
            textAlign: "center",
            color: "#000",
            fontSize: 10,
            fontWeight: 500,
            padding: 0,
            marginBottom: 10,
            paddingTop: 5,
            paddingBottom: 5,
         // Adjust width as necessary
          }}
          colSpan={3}
        >  <Typography>₹ {totalChequeAmount}</Typography>
          T&C: Subject to Realisation of Cheque*
        </StyledTableCell>

        {/* <StyledTableCell
          style={{
            textAlign: "center",
            color: "#000",
            fontSize: 15,
            padding: 0,
    
            width: 200,
            paddingTop: 5,
            paddingBottom: 5,
          }}
          colSpan={3}
        >
       <img
       src={`https://apiforcornershost.cubisysit.com/companyimage/${data[0]?.companyimageName || 'image.png'}`}
       alt="Company Logo"
        style={{  width: "150px",height:"100px" }}
      />
        </StyledTableCell> */}

        <StyledTableCell
  style={{
    textAlign: "center",  // Center align the content horizontally
    color: "#000",
    fontSize: 15,
    textTransform: "uppercase", // Make the text uppercase
    padding: 0,
    height: "100%",  // Ensure the cell height stretches
    display: "flex",  // Use flexbox for vertical alignment
    flexDirection: "column",  // Stack elements vertically
    justifyContent: "space-between",
    padding: 0,
            marginBottom:0,
            paddingTop: 5,
            paddingBottom: 5,
            height:80,
    // Space out the elements to push one to the top and one to the bottom
  }}
  colSpan={4}
>
  {/* Company Name at the top */}
  <Typography
    style={{
      textAlign: "center",
      color: "#000",
      fontSize: 10,
      verticalAlign: "top",  // Align content to the top (though flexbox is handling it)
      padding: 0,
    }}
  >
    {data[0]?.CompanyName || ""}
  </Typography>

  {/* Authorized Signatory at the bottom */}
  <Typography
    style={{
      textAlign: "center",
      color: "#000",
      fontSize: 10,
      verticalAlign: "bottom",  // Align content to the bottom (flexbox is handling this)
      padding: 0,
    }}
  >
    Authorized Signatory
  </Typography>
</StyledTableCell>


      </TableRow>
    </TableBody>
  </Table>
</TableContainer>
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
      </TableContainer>
      </StyledTableCell>
    </>
  );
};

export default Reciept;
