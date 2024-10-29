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
  Button,
  Avatar,
  ListItemAvatar,
} from "@mui/material";
import { createGlobalStyle } from "styled-components";
import styled from "styled-components";
import { useRouter } from "next/router";
import CancelIcon from "@mui/icons-material/Cancel";
const GlobalStyle = createGlobalStyle`
  @media print {
    body * {
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
    }
  }
`;

const StyledTableCell = styled(TableCell)({
  textAlign: "center",
  borderBottom: "none",
  border: "1px solid #ccc",
  borderRadius: "8px 0 0 8px",
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

const TemplatePayment = ({ bookingID, handleCancel }) => {
  const router = useRouter();
  console.log(bookingID, "row data aaayaa<<<<>>>>>>>>>>> ");
  const printRef = useRef();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOption, setFilterOption] = useState("remarksWithCreateDate");
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (selectedFilter) => {
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-cancelprojectbooking.php?bookingcancelID=${bookingID}`
      );
      console.log("data aaya dekh<<<<<>>>>>>>>>>>>>", response.data);
      setData(response.data.data);
      setPayments(response.data.data.payments); // Assuming you need to set payments here
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };
  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error loading data</Typography>;
  }
  return (
    <>
      <GlobalStyle />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginBottom={2}
      >
        <IconButton onClick={handleCancel}>
          <CancelIcon style={{ color: "red" }} />
        </IconButton>
      </Box>
      <InvoiceBox className="printableArea" ref={printRef}>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow sx={{ height: "10px", padding: 0 }}>
                <StyledTableCell colSpan={3} sx={{ height: "10px", padding: 0 }}>
                  <Typography
                    style={{
                      textAlign: "center",
                      fontSize: 20,
                      fontWeight: 900,
                    }}
                  >
                    CANCELLATION DETAILS
                  </Typography>
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
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
                    Booked By: {data.bookingDetails.bookingcancelName}
                  </Typography>
                </StyledTableCell>
              </TableRow>
              <TableRow
                sx={{ padding: 0, display: "flex", alignItems: "center" }}
              >
                <StyledTableCell style={{ textAlign: "center", padding: 1 }}>
                  <ListItemAvatar>
                    <Avatar
                      alt="User Avatar"
                      sx={{
                        width: 'auto',
                        height: 160,
                        margin: 2,
                        borderRadius: 1,
                      }}
                      src="/images/avatars/user-avatar.png"
                    />
                  </ListItemAvatar>
                </StyledTableCell>
                <Box
                  sx={{
                    marginLeft: 2,
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
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
  
        <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
          <Table>
            <TableBody>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ textAlign: "left", width: "20%", padding: 0 }}
                  colSpan={2}
                >
                  <Typography>Name</Typography>
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "80%", padding: 0 }}
                  colSpan={10}
                >
                  {data.bookingDetails.bookingcancelName}
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ textAlign: "left", padding: 0 }}
                  colSpan={2}
                >
                  <Typography>Address</Typography>
                </StyledTableCell>
                <StyledTableCell
                  colSpan={10}
                  style={{ textAlign: "center", padding: 0 }}
                >
                  {data.bookingDetails.bookingcancelAddress}
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ textAlign: "left", padding: 0 }}
                  colSpan={2}
                >
                  <Typography>MOBILE No.</Typography>
                </StyledTableCell>
                <StyledTableCell
                  colSpan={10}
                  style={{ textAlign: "center", padding: 0 }}
                >
                  {data.bookingDetails.bookingcancelMobile}
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ textAlign: "left", padding: 0 }}
                  colSpan={2}
                >
                  <Typography>PAN Card No.</Typography>
                </StyledTableCell>
                <StyledTableCell
                  colSpan={10}
                  style={{ textAlign: "center", padding: 0 }}
                >
                  {data.bookingDetails.bookingcancelPancard}
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  colSpan={2}
                  style={{ textAlign: "left", padding: 0 }}
                >
                  <Typography>Aadhar No.</Typography>
                </StyledTableCell>
                <StyledTableCell
                  colSpan={10}
                  style={{ textAlign: "center", padding: 0 }}
                >
                  {data.bookingDetails.bookingcancelAadhar}
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ textAlign: "left", padding: 0 }}
                  colSpan={2}
                >
                  <Typography>EMAIL ID.</Typography>
                </StyledTableCell>
                <StyledTableCell
                  colSpan={10}
                  style={{ textAlign: "center", padding: 0 }}
                >
                  {data.bookingDetails.bookingcancelEmail}
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
  
        <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
          <Table>
            <TableBody>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ width: "40%", padding: 0 }}
                  colSpan={10}
                >
                  <Typography>Project</Typography>
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "15%", padding: 0 }}
                  colSpan={10}
                >
                  <Typography>Wing</Typography>
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "15%", padding: 0 }}
                  colSpan={10}
                >
                  <Typography>Floor</Typography>
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "15%", padding: 0 }}
                  colSpan={10}
                >
                  <Typography>Flat No.</Typography>
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "15%", padding: 0 }}
                  colSpan={10}
                >
                  <Typography>Type</Typography>
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ width: "40%", padding: 0 }}
                  colSpan={10}
                >
                  {data.bookingDetails.ProjectName}
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "15%", padding: 0 }}
                  colSpan={10}
                >
                  {data.bookingDetails.WingName}
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "15%", padding: 0 }}
                  colSpan={10}
                >
                  {data.bookingDetails.bookingcancelFloorNo}
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "15%", padding: 0 }}
                  colSpan={10}
                >
                  {data.bookingDetails.bookingcancelFlatNo}
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "15%", padding: 0 }}
                  colSpan={10}
                >
                  {data.bookingDetails.UnittypeName}
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
  
        <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
          <Table>
            <TableBody>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ width: "30%", padding: 0, textAlign: "left" }}
                  colSpan={4}
                >
                  Area in Building (in Sq.Ft)
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "20%", padding: 0 }}
                  colSpan={1}
                >
                  {data.bookingDetails.bookingcancelArea}
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "30%", padding: 0, textAlign: "left" }}
                  colSpan={4}
                >
                  Total Amount
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "20%", padding: 0 }}
                  colSpan={1}
                >
                  {data.bookingDetails.bookingcancelTotalCost}
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ width: "30%", padding: 0, textAlign: "left" }}
                  colSpan={4}
                >
                  Booking Reference Code
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "20%", padding: 0 }}
                  colSpan={1}
                >
                  {data.bookingDetails.bookingcancelBookingRef}
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "30%", padding: 0, textAlign: "left" }}
                  colSpan={4}
                >
                  Cancellation Status
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "20%", padding: 0 }}
                  colSpan={1}
                >
                  {data.bookingDetails.bookingcancelStatus === 1 ? "Cancelled" : "Active"}
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
  
        <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
          <Table>
            <TableBody>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ padding: 0, textAlign: "left" }}
                  colSpan={3}
                >
                  <Typography>Remarks</Typography>
                </StyledTableCell>
              </TableRow>
              {data.remarks.length === 0 ? (
                <TableRow>
                  <StyledTableCell colSpan={3} style={{ textAlign: "center" }}>
                    No remarks available
                  </StyledTableCell>
                </TableRow>
              ) : (
                data.remarks.map((remark, index) => (
                  <TableRow key={index} sx={{ padding: 0 }}>
                    <StyledTableCell
                      style={{ textAlign: "left", padding: 0 }}
                      colSpan={3}
                    >
                      {remark.bookingcancelremarksRemark || "No details provided"}
                    </StyledTableCell>
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
