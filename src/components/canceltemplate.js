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
        <HeaderTitle>CANCELLATION DETAILS</HeaderTitle>
     
        <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
          <Table>
            <TableBody>
              <TableRow>
              <StyledTableCell colSpan={3} sx={{ padding: 0 }}>
                  <Typography
                    style={{
                      textAlign: "center",
                      fontSize: 20,
                      fontWeight: 700,
                    }}
                  >
                    RERA NO. {data.bookingDetails.reraregistration}
                  </Typography>
                  <Typography
                    style={{ float: "left", fontSize: 15, fontWeight: 200 }}
                  >
                   Date: {data.bookingDetails.bookingcancelBookingDate}
                  </Typography>
                  <Typography
                    style={{ float: "right", fontSize: 15, fontWeight: 200 }}
                  >
                    Booked By: {data.bookingDetails.UserName}
                  </Typography>
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell colSpan={2}>
                  <ListItemAvatar>
                    <Avatar
                      alt="User Avatar"
                      sx={{ width: 80, height: 80, margin: "auto" }}
                      src="/images/avatars/user-avatar1.png" // Placeholder for first avatar
                    />
                  </ListItemAvatar>
                  <Typography align="center">User Photo 1</Typography>
                </StyledTableCell>
              </TableRow>
         
              {[
                { label: "Name", value: data.bookingDetails.bookingcancelName },
                { label: "Address", value: data.bookingDetails.bookingcancelAddress },
                { label: "MOBILE No.", value: data.bookingDetails.bookingcancelMobile },
                { label: "PAN Card No.", value: data.bookingDetails.bookingcancelPancard },
                { label: "Aadhar No.", value: data.bookingDetails.bookingcancelAadhar },
                { label: "EMAIL ID.", value: data.bookingDetails.bookingcancelEmail },
              ].map(({ label, value }) => (
                <TableRow key={label}>
                  <StyledTableCell style={{ textAlign: "left" }}>{label}</StyledTableCell>
                  <StyledTableCell style={{ textAlign: "center" }}>{value}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
          <Table>
            <TableBody>
              <TableRow>
                <StyledTableCell>Project</StyledTableCell>
                <StyledTableCell>Wing</StyledTableCell>
                <StyledTableCell>Floor</StyledTableCell>
                <StyledTableCell>Flat No.</StyledTableCell>
                <StyledTableCell>Type</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>{data.bookingDetails.ProjectName}</StyledTableCell>
                <StyledTableCell>{data.bookingDetails.WingName}</StyledTableCell>
                <StyledTableCell>{data.bookingDetails.bookingcancelFloorNo}</StyledTableCell>
                <StyledTableCell>{data.bookingDetails.bookingcancelFlatNo}</StyledTableCell>
                <StyledTableCell>{data.bookingDetails.UnittypeName}</StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
          <Table>
            <TableBody>
              <TableRow>
                <StyledTableCell>Area in Building (in Sq.Ft)</StyledTableCell>
                <StyledTableCell>{data.bookingDetails.bookingcancelArea}</StyledTableCell>
                <StyledTableCell>Total Amount</StyledTableCell>
                <StyledTableCell>{data.bookingDetails.bookingcancelTotalCost}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>Booking Reference Code</StyledTableCell>
                <StyledTableCell>{data.bookingDetails.bookingcancelBookingRef}</StyledTableCell>
                <StyledTableCell>Cancellation Status</StyledTableCell>
                <StyledTableCell>
                  {data.bookingDetails.bookingcancelStatus === 1 ? "Cancelled" : "Active"}
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer component={Paper}>
  <Table>
    <TableBody>
      <TableRow>
        <TableCell colSpan={4}>
          <Typography style={{ fontWeight: 'bold' }}>Remarks</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ textAlign: "left", fontWeight: 'bold' }}>#</TableCell>
        <TableCell style={{ textAlign: "left", fontWeight: 'bold' }}>Amount</TableCell>
        <TableCell style={{ textAlign: "left", fontWeight: 'bold' }}>Date</TableCell>
        <TableCell style={{ textAlign: "left", fontWeight: 'bold' }}>Remark</TableCell>
      </TableRow>
      {data.remarks.length === 0 ? (
        <TableRow>
          <TableCell colSpan={4} style={{ textAlign: "center" }}>
            No remarks available
          </TableCell>
        </TableRow>
      ) : (
        data.remarks.map((remark, index) => (
          <TableRow key={index}>
            <TableCell style={{ textAlign: "left", padding: "8px 0" }}>
              {index + 1}  {/* Display index + 1 */}
            </TableCell>
            <TableCell style={{ textAlign: "left", padding: "8px 0" }}>
              {formatAmount(remark.bookingcancelremarksAmount)}
            </TableCell>
            <TableCell style={{ textAlign: "left", padding: "8px 0" }}>
              {formatDate(remark.bookingcancelremarksDate)}
            </TableCell>
            <TableCell style={{ textAlign: "left", padding: "8px 0" }}>
              {remark.bookingcancelremarksRemark || "No details provided"}
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  </Table>
</TableContainer>





      </InvoiceBox>
    </>
  );
};

export default TemplatePayment;
