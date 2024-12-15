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
      font-size: 12px; /* Adjust font size for print */
    }

    @page {
      size: auto; /* auto is the initial value */
      margin: 10mm; /* Add margin for print */
    }

    /* Hide unwanted elements */
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
      page-break-inside: avoid; /* Prevent page breaks inside this area */
    }

    /* Prevent breaking inside tables */
    table {
      page-break-inside: avoid;
      border-collapse: collapse; /* For better control over breaks */
    }
  }
`;
const formatAmount = (amount) => {
  if (!amount) return "0";

  const numAmount = parseFloat(amount);
  
  // Format for Crores
  if (numAmount >= 10000000) return `${(numAmount / 10000000).toFixed(2)} CR`; 
  // Format for Lakhs
  if (numAmount >= 100000) return `${(numAmount / 100000).toFixed(2)} L`; 
  // Format for Thousands
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

  useEffect(() => {
    const fetchData = async () => {
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

  const handlePrint = () => {
    window.print();
  };

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

                    <img src={`https://apiforcornershost.cubisysit.com/projectimage/${data.bookingDetails.images || "rosenagar.png"}`} alt="Logo" width={350} height={150} />

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

    </>
  );
};

export default TemplatePayment;
