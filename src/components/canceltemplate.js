import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  IconButton,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Avatar,
  ListItemAvatar,
  Button,
} from "@mui/material";
import { createGlobalStyle } from "styled-components";
import styled from "styled-components";
import CancelIcon from "@mui/icons-material/Cancel";
import PrintIcon from "@mui/icons-material/Print";

const GlobalStyle = createGlobalStyle`
  @media print {
    body {
      margin: 0;
      padding: 0;
      color: #000;
      font-size: 12px;
    }

    @page {
      size: auto;
      margin: 10mm;
    }

    * {
      visibility: hidden;
    }

    .printableArea, .printableArea * {
      visibility: visible;
    }

    .printableArea {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      page-break-inside: avoid;
    }

    table {
      page-break-inside: avoid;
      border-collapse: collapse;
    }
  }
`;

const formatAmount = (amount) => {
  if (!amount) return "0";

  const numAmount = parseFloat(amount);
  if (numAmount >= 10000000) return `${(numAmount / 10000000).toFixed(2)} CR`;
  if (numAmount >= 100000) return `${(numAmount / 100000).toFixed(2)} L`;
  if (numAmount >= 1000) return `${(numAmount / 1000).toFixed(2)} K`;
  return `${numAmount.toFixed(2)} H`;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options).replace(/ /g, ' ');
};

const StyledTableCell = styled(TableCell)({
  textAlign: "center",
  borderBottom: "none",
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "8px",
});

const InvoiceBox = styled(Box)({
  maxWidth: "890px",
  margin: "auto",
  padding: "16px",
  border: "1px solid #eee",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  fontSize: "14px",
  lineHeight: "1.5",
  fontFamily: "Arial, sans-serif",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
});

const HeaderTitle = styled(Typography)({
  textAlign: "center",
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "16px",
});

const TemplatePayment = ({ bookingcancelID, handleCancel }) => {
  const printRef = useRef();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      debugger;

      try {
        const response = await axios.get(
          `https://apiforcornershost.cubisysit.com/api/api-fetch-cancelprojectbooking.php?bookingcancelID=${bookingcancelID}`
        );
        setData(response.data.data);
     
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [bookingcancelID]);

  useEffect(() => {
    const fetchData = async () => {
     // Ensure valid BookingID before making the API call.
debugger;
      setLoading(true); // Start loading.
      setError(null); // Reset any previous error.

      try {
        const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-singel-bookingremark.php?BookingID=${bookingcancelID}`;
        const response = await axios.get(apiUrl);

        if (response.data.status === "Success") {
          setPayments(response.data.data.payments || []); // Handle cases where payments might be null.
        
        } else {
          setError("Failed to fetch data");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Error fetching data");
      } finally {
        setLoading(false); // Stop loading in all cases.
      }
    };
    fetchData();
  }, [bookingcancelID]); // Watch specifically for changes to BookingID.




  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Reload to restore the original content
  };
  let runningBalance = data?.bookingDetails.bookingcancelTotalCost || 0;
  const totalCash = payments.reduce((sum, payment) => sum + (payment.Cash || 0), 0);
  const totalCheque = payments.reduce((sum, payment) => sum + (payment.ChequeAmount || 0), 0);
  const totalAPlusB = totalCash + totalCheque;



const rows = payments.map((payment) => {
  const cash = payment.Cash || 0;
  const chequeAmount = payment.ChequeAmount || 0;
  const totalAPlusB = cash + chequeAmount;
  
  runningBalance -= totalAPlusB; // Correctly update bala
  return {
    Date: payment.Date,
    Cash: cash,
    ChequeAmount: chequeAmount,
    TotalAPlusB: totalAPlusB,
    Balance: runningBalance, // Store updated balance
    Wing: data?.WingName || "",
    Floor: data?.FloorNo || "",
    FlatNo: data?.FlatNumber || "",
    Type: data?.Type || "",
  };
});

  
  const totalRows = 23;
  const defaultRowsCount = Math.max(totalRows - rows.length, 0);
  const defaultRows = Array.from({ length: defaultRowsCount }, () => ({
    Date: "",
    Cash: "",
    ChequeAmount: "",
    TotalAPlusB: "",
    Balance: "",
    Wing: "",
    Floor: "",
    FlatNo: "",
    Type: "",
  }));

  const finalRows = [...rows, ...defaultRows];

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading data</Typography>;

  return (
    <>
      <GlobalStyle />
      <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom={2}>
        <IconButton onClick={handleCancel}>
          <CancelIcon style={{ color: "red" }} />
        </IconButton>
        <Button variant="contained" color="primary" onClick={handlePrint} startIcon={<PrintIcon />}>
          Print
        </Button>
      </Box>
      <InvoiceBox className="printableArea" ref={printRef}>
  <TableContainer component={Paper}>
    <Table>
      <TableBody>
        <TableRow sx={{ height: '10px', padding: 0 }}>
          <StyledTableCell colSpan={3} sx={{ height: '10px', padding: 0 }}>
            <Typography style={{ textAlign: 'center', fontSize: 20, fontWeight: 900 }}>QUOTATION</Typography>
          </StyledTableCell>
        </TableRow>
        <TableRow sx={{ padding: 0 }}>
          <StyledTableCell colSpan={3} sx={{ padding: 0 }}>
            <Typography style={{ textAlign: 'center', fontSize: 20, fontWeight: 700 }}>
              RERA NO. {data.bookingDetails.reraregistration}
            </Typography>
            <Typography style={{ float: 'left', fontSize: 15, fontWeight: 200 }}>
              Date: {data.bookingDetails.bookingcancelBookingDate}
            </Typography>
            <Typography style={{ float: 'right', fontSize: 15, fontWeight: 200 }}>
              Booked By: {data.bookingDetails.UserName}
            </Typography>
          </StyledTableCell>
        </TableRow>
        {/* <TableRow sx={{ padding: 0 }}>
          <StyledTableCell style={{ textAlign: 'center', padding: 0 }}>
            <img src="{images}" alt="Logo" width="70" height="100" />
          </StyledTableCell>
          <StyledTableCell style={{ textAlign: "center", padding: 1 }}>
                  <ListItemAvatar>
                    <Avatar
                      alt="Project Image"  // Alt text for accessibility
                      sx={{
                        width: '100%',
                        height: 160,
                        margin: 2,
                        borderRadius: 1,
                      }}
                      // Dynamically set the image source using the API URL and data.images
                      src={`https://apiforcornershost.cubisysit.com/projectimage/${data.bookingDetails.images || "rosenagar.png"}`}
                    />
                  </ListItemAvatar>
                </StyledTableCell>
        </TableRow> */}
        <TableRow
                  sx={{ padding: 0, display: "flex", alignItems: "center" }}
                >
                  <StyledTableCell style={{ textAlign: "center", padding: 1, width: "355px" ,height:"160px" }}>

                   <img
      src={`https://apiforcornershost.cubisysit.com/projectimage/${data.bookingDetails.images|| ""}`}
      alt="Logo"
      width={350}
      height={150}
    /> 
                  </StyledTableCell>
               
                  <Box
                    sx={{
                     
                      flexGrow: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid #ddd",
                    height:"160px",
                
                    }}
                  >
                     
                    <Typography variant="h6" align="center">
                      Photo
                    </Typography>
                  
                  </Box>
                 
                </TableRow>
      </TableBody>
    </Table>
  </TableContainer>

  <TableContainer component={Paper}>
    <Table>
      <TableBody>
        <TableRow sx={{ padding: 0 }}>
          <StyledTableCell style={{ textAlign: 'left', width: '20%', padding: 0 }} colSpan={2}>
            <Typography>Name Of Purchase</Typography>
          </StyledTableCell>
          <StyledTableCell style={{ width: '80%', padding: 0 }} colSpan={10}>
            {data.bookingDetails.TitleName} {data.bookingDetails.bookingcancelName}
          </StyledTableCell>
        </TableRow>
        <TableRow sx={{ padding: 0 }}>
          <StyledTableCell style={{ textAlign: 'left', padding: 0 }} colSpan={2}>
            <Typography>Address</Typography>
          </StyledTableCell>
          <StyledTableCell colSpan={10} style={{ textAlign: 'center', padding: 0 }}>
            {data.bookingDetails.bookingcancelAddress}
          </StyledTableCell>
        </TableRow>
        <TableRow sx={{ padding: 0 }}>
          <StyledTableCell style={{ textAlign: 'left', padding: 0 }} colSpan={2}>
            <Typography>MOBILE No.</Typography>
          </StyledTableCell>
          <StyledTableCell colSpan={10} style={{ textAlign: 'center', padding: 0 }}>
            {data.bookingDetails.bookingcancelMobile}
          </StyledTableCell>
        </TableRow>
        <TableRow sx={{ padding: 0 }}>
          <StyledTableCell style={{ textAlign: 'left', padding: 0 }} colSpan={2}>
            <Typography>PAN Card No.</Typography>
          </StyledTableCell>
          <StyledTableCell colSpan={10} style={{ textAlign: 'center', padding: 0 }}>
            {data.bookingDetails.bookingcancelPancard}
          </StyledTableCell>
        </TableRow>
        <TableRow sx={{ padding: 0 }}>
          <StyledTableCell colSpan={2} style={{ textAlign: 'left', padding: 0 }}>
            <Typography>Aadhar No.</Typography>
          </StyledTableCell>
          <StyledTableCell colSpan={10} style={{ textAlign: 'center', padding: 0 }}>
            {data.bookingDetails.bookingcancelAadhar}
          </StyledTableCell>
        </TableRow>
        <TableRow sx={{ padding: 0 }}>
          <StyledTableCell style={{ textAlign: 'left', padding: 0 }} colSpan={2}>
            <Typography>Email Id.</Typography>
          </StyledTableCell>
          <StyledTableCell colSpan={10} style={{ textAlign: 'center', padding: 0 }}>
            {data.bookingDetails.bookingcancelEmail}
          </StyledTableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>

  <TableContainer component={Paper}>
    <Table style={{ border: '1px solid black' }}>
      <TableBody>
        <TableRow sx={{ padding: 0 }}>
          <StyledTableCell style={{ width: '40%', padding: 0 }} colSpan={10}>
            <Typography>Project</Typography>
          </StyledTableCell>
          <StyledTableCell style={{ width: '15%', padding: 0 }} colSpan={10}>
            <Typography>Wing</Typography>
          </StyledTableCell>
          <StyledTableCell style={{ width: '15%', padding: 0 }} colSpan={10}>
            <Typography>Floor</Typography>
          </StyledTableCell>
          <StyledTableCell style={{ width: '15%', padding: 0 }} colSpan={10}>
            <Typography>Flat No.</Typography>
          </StyledTableCell>
          <StyledTableCell style={{ width: '15%', padding: 0 }} colSpan={10}>
            <Typography>Type</Typography>
          </StyledTableCell>
        </TableRow>
        <TableRow sx={{ padding: 0 }}>
          <StyledTableCell style={{ width: '40%', padding: 0 }} colSpan={10}>
            {data.bookingDetails.ProjectName}
          </StyledTableCell>
          <StyledTableCell style={{ width: '15%', padding: 0 }} colSpan={10}>
            {data.bookingDetails.WingName}
          </StyledTableCell>
          <StyledTableCell style={{ width: '15%', padding: 0 }} colSpan={10}>
            {data.bookingDetails.bookingcancelFloorNo}
          </StyledTableCell>
          <StyledTableCell style={{ width: '15%', padding: 0 }} colSpan={10}>
            {data.bookingDetails.bookingcancelFlatNo}
          </StyledTableCell>
          <StyledTableCell style={{ width: '15%', padding: 0 }} colSpan={10}>
            {data.bookingDetails.UnittypeName}
          </StyledTableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>

  <TableContainer component={Paper}>
    <Table className="info-border">
      <TableBody>
        <TableRow sx={{ padding: 0 }}>
          <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>
            Type of Booking
          </StyledTableCell>
          <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>
            {data.bookingDetails.BookingTypeName}
          </StyledTableCell>
          <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>
            GST* (As per Govt.Notification)
          </StyledTableCell>
          <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>
            {data.bookingDetails.bookingcancelGst}
          </StyledTableCell>
        </TableRow>
        <TableRow sx={{ padding: 0 }}>
          <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>
            Area in Building (in Sq.Ft)
          </StyledTableCell>
          <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>
            {data.bookingDetails.bookingcancelArea}
          </StyledTableCell>
          <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>
            Stamp Duty* (As per Govt.Notification)
          </StyledTableCell>
          <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>
            {data.bookingDetails.bookingcancelStampDuty}
          </StyledTableCell>
        </TableRow>
        <TableRow sx={{ padding: 0 }}>
          <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>
            Rate Sq.Ft
          </StyledTableCell>
          <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>
            {data.bookingDetails.bookingcancelRatesqft}
          </StyledTableCell>
          <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>
            Registration* (As per Govt.Notification)
          </StyledTableCell>
          <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>
            {data.bookingDetails.bookingcancelRegistration}
          </StyledTableCell>
        </TableRow>
        <TableRow sx={{ padding: 0 }}>
        <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>
        TTL Amount As Per Builtup
          </StyledTableCell>
          <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>
            {data.bookingDetails.bookingcancelTtlAmount}
          </StyledTableCell>
          <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>
            Advocate
          </StyledTableCell>
          <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>
            {data.bookingDetails.bookingcancelAdvocate}
          </StyledTableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>

  <TableContainer component={Paper}>
    <Table className="info-border">
      <TableBody>
        <TableRow sx={{ padding: 0 }}>
          <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>
            Development Charges
          </StyledTableCell>
          <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>
            {data.bookingDetails.bookingcancelCharges}
          </StyledTableCell>
          <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>
            Extra Cost (B)
          </StyledTableCell>
          <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>
            {data.bookingDetails.bookingcancelExtraCost}
          </StyledTableCell>
        </TableRow>
        <TableRow sx={{ padding: 0 }}>
          <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>
            Parking Facility
          </StyledTableCell>
          <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>
            {data.bookingDetails.bookingcancelParkingFacility}
          </StyledTableCell>
          <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>
            Total (A + B)
          </StyledTableCell>
          <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>
            {data.bookingDetails.bookingcancelTotalCost}
          </StyledTableCell>
        </TableRow>
        <TableRow sx={{ padding: 0 }}>
          <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>
            Gross Flat Cost (A)
          </StyledTableCell>
          <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>
            {data.bookingDetails.bookingcancelFlatCost}
          </StyledTableCell>
          <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>
            Booking Ref.Code (T & C)
          </StyledTableCell>
          <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>
            {data.bookingDetails.bookingcancelBookingRef}
          </StyledTableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>

  <TableContainer component={Paper}>
    <Table className="info-border">
      <TableBody>
        <TableRow style={{ border: '1px solid black', padding: 0 }}>
          <StyledTableCell style={{ textAlign: 'left', padding: 0 }} colSpan={10}>
            Rupees in words: {data.bookingDetails.bookingcancelFlatCostInWords}
          </StyledTableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>

  <TableContainer component={Paper}>
    <Table className="info-border">
      <TableBody>
        <TableRow sx={{ padding: 0 }}>
          <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>
            Usable Area in Sq.Ft
          </StyledTableCell>
          <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>
            {data.bookingDetails.bookingcancelUsableArea}
          </StyledTableCell>
          <StyledTableCell style={{ width: '30%', padding: 0 }} colSpan={4}>
            Agreement Carpet (RERA) in Sq.Ft
          </StyledTableCell>
          <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>
            {data.bookingDetails.bookingcancelAgreementCarpet}
          </StyledTableCell>
        </TableRow>
        <TableRow sx={{ padding: 0 }}>
          <StyledTableCell style={{ textAlign: 'left', fontSize: 15, fontWeight: 500, padding: 0 }} colSpan={10}>
            REMARKS:
          </StyledTableCell>
        </TableRow>

        {data.remarks?.map((remark, index) => (
          <TableRow key={remark.BookingRemarkID} sx={{ padding: 0 }}>
            <StyledTableCell style={{ textAlign: 'left', padding: 0 }} colSpan={10}>
              {index + 1}. Rs. {remark.bookingcancelremarksAmount} {remark.bookingcancelremarksRemark} {remark.bookingcancelremarksDate}
            </StyledTableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>

  <TableContainer>
    <Table>
      <TableBody>
      <TableRow sx={{ padding: 0 }}>
          <StyledTableCell style={{ textAlign: 'left', fontSize: 15, fontWeight: 500, padding: 0 }} colSpan={10}>
          UPDATED  REMARKS:
          </StyledTableCell>
        </TableRow>

        {data.updateRemarks?.map((updateremarks, index) => (
          <TableRow key={updateremarks.BookingRemarkID} sx={{ padding: 0 }}>
            <StyledTableCell style={{ textAlign: 'left', padding: 0 }} colSpan={10}>
              {index + 1}. Rs. {updateremarks.bookingcancelremarksAmount} {updateremarks.bookingcancelremarksRemark} {updateremarks.bookingcancelremarksDate}
            </StyledTableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  <TableContainer>
    <Table>
      <TableBody>
      <TableRow sx={{ padding: 0 }}>
          <StyledTableCell style={{ textAlign: 'left', fontSize: 15, fontWeight: 500, padding: 0 }} colSpan={10}>
          COMPLETE  REMARKS:
          </StyledTableCell>
        </TableRow>

        {data.completePaymentRemarks?.map((completeremarks, index) => (
          <TableRow key={completeremarks.BookingRemarkID} sx={{ padding: 0 }}>
            <StyledTableCell style={{ textAlign: 'left', padding: 0 }} colSpan={10}>
              {index + 1}. Rs. {completeremarks.bookingcancelremarksAmount} {completeremarks.bookingcancelremarksRemark} {completeremarks.bookingcancelremarksDate}
            </StyledTableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  <TableContainer component={Paper}>
    <Table className="info-border">
      <TableBody>
        <TableRow style={{ border: '1px solid black', padding: 0 }}>
          <StyledTableCell colSpan={4} style={{ padding: 0 }}>
            Verified By
          </StyledTableCell>
          <StyledTableCell colSpan={4} style={{ padding: 0 }}>
            Made By
          </StyledTableCell>
          <StyledTableCell colSpan={4} style={{ padding: 0 }}>
            Purchaser Signature & Date
          </StyledTableCell>
        </TableRow>
        <TableRow style={{ padding: 0 }}>
          <StyledTableCell colSpan={4} style={{ height: '90px', padding: 0 }}></StyledTableCell>
          <StyledTableCell colSpan={4} style={{ height: '90px', padding: 0 }}></StyledTableCell>
          <StyledTableCell colSpan={4} style={{ height: '90px', padding: 0 }}></StyledTableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
</InvoiceBox>
   <InvoiceBox className="printableArea" ref={printRef}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>

              <TableRow>
                <StyledTableCell
                  colSpan={5}
                  style={{ textAlign: "center", borderBottom: "none" }}
                >
                  <Typography style={{ fontSize: 20, fontWeight: 700 }}>
                    PROJECT
                  </Typography>
                  <Typography variant="body2">
                  {data.bookingDetails.ProjectName}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell style={{ textAlign: "center" }}>
                  <Typography variant="body1">WING</Typography>
                  <Typography variant="body2">  {data.bookingDetails.WingName}</Typography>
                </StyledTableCell>

                <StyledTableCell style={{ textAlign: "center" }}>
                  <Typography variant="body1">FLOOR</Typography>
                  <Typography variant="body2"> {data.bookingDetails.bookingcancelFloorNo}</Typography>
                </StyledTableCell>
                <StyledTableCell style={{ textAlign: "center" }}>
                  <Typography variant="body1">FLAT NO</Typography>
                  <Typography variant="body2">  {data.bookingDetails.bookingcancelFlatNo}</Typography>
                </StyledTableCell>
                <StyledTableCell style={{ textAlign: "center" }}>
                  <Typography variant="body1">TYPE</Typography>
                  <Typography variant="body2">  {data.bookingDetails.UnittypeName}</Typography>
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell style={{ textAlign: "center" }}>
                  DATE
                </StyledTableCell>
                <StyledTableCell style={{ textAlign: "center" }}>
                  A
                </StyledTableCell>
                <StyledTableCell colSpan={4} style={{ textAlign: "center" }}>
                  B
                </StyledTableCell>
                <StyledTableCell style={{ textAlign: "center" }}>
                  A + B
                </StyledTableCell>
                <StyledTableCell style={{ textAlign: "center" }}>
                  Balance
                </StyledTableCell>
                <StyledTableCell style={{ textAlign: "center" }}>
                  Sign.
                </StyledTableCell>
              </TableRow>

              {/* Render Rows */}
              {finalRows?.map((row, index) => (
                <TableRow key={index}>
                  <StyledTableCell style={{ textAlign: "center" }}>
                    {row.Date}
                  </StyledTableCell>
                  <StyledTableCell style={{ textAlign: "center" }}>
                    {row.Cash}
                  </StyledTableCell>
                  <StyledTableCell colSpan={4} style={{ textAlign: "center" }}>
                    {row.ChequeAmount}
                  </StyledTableCell>
                  <StyledTableCell style={{ textAlign: "center" }}>
                    {row.TotalAPlusB}
                  </StyledTableCell>
                  <StyledTableCell style={{ textAlign: "center" }}>
                    {row.Balance}
                  </StyledTableCell>
                  <StyledTableCell style={{ textAlign: "center" }}>
                    {" "}
                    {/* Signature here */}{" "}
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </InvoiceBox>
    </>
  );
};

export default TemplatePayment;
