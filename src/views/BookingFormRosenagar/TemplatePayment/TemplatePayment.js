import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  FormControl,
  InputLabel,
  Select,
  Grid,
  MenuItem,
  IconButton,
  Button,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Avatar,
  ListItemAvatar,
} from "@mui/material";
import { createGlobalStyle } from "styled-components";
import styled from "styled-components";
import ErrorIcon from '@mui/icons-material/Error';
import { useRouter } from "next/router";
import CancelIcon from "@mui/icons-material/Cancel";
import { useReactToPrint } from "react-to-print";

const TemplatePayment = ({ bookingID, handleCancel }) => {
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterOption, setFilterOption] = useState("remarksWithCreateDate");
  const [payments, setPayments] = useState([]);

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (selectedFilter) => {
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-projectbooking.php?BookingID=${bookingID}&filter=${selectedFilter}`
      );

      setData(response.data.data);
      setPayments(response.data.data.payments);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };
  const printRef = useRef();
  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
  };
  const handlePrint = () => {
    if (printRef.current) {
      window.print();
    }
  };
  const StyledTableCell = styled(TableCell)({
    textAlign: "center",
    borderBottom: "none",
    border: "2px solid black",
    padding: "8px",
  });

  const InvoiceBox = styled(Box)({
    maxWidth: "890px",
    margin: "auto",
    padding: "16px",
    border: "1px solid #eee",
    display: "block",
    backgroundColor: "#f9f9f9",
    fontSize: "14px",
    lineHeight: "1.5",
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    pageBreakAfter: "always",
    breakAfter: "page", // For modern browsers
  });
  
  const filteredRemarks =
    filterOption === "remarksWithCreateDate"
      ? data?.remarksWithCreateDate
      : data?.otherRemarks;

  const totalCash = payments.reduce(
    (sum, payment) => sum + (payment.Cash || 0),
    0
  );
  const totalCheque = payments.reduce(
    (sum, payment) => sum + (payment.ChequeAmount || 0),
    0
  );
  const totalAPlusB = totalCash + totalCheque;

  let balance = data?.TotalCost;

  finalRows = finalRows?.map((row, index) => {
    const currentAPlusB = row.Cash + row.ChequeAmount;
    const currentBalance = balance - currentAPlusB;

    const updatedRow = {
      ...row,
      TotalAPlusB: currentAPlusB,
      Balance: currentBalance,
    };

    // Update balance for the next row
    balance = currentBalance;

    return updatedRow;
  });

  let runningBalance = data?.TotalCost || 0;

  const rows = payments.map((payment) => {
    const cash = payment.Cash || 0;
    const chequeAmount = payment.ChequeAmount || 0;
    const totalAPlusB = cash + chequeAmount;

    // Conditionally set the Date value based on the presence of ChequeAmount
    const displayDate = payment.Date;

    // Calculate the current balance by subtracting the current TotalAPlusB from the running balance
    const currentBalance = runningBalance - totalAPlusB;

    // Prepare the row data with the current balance
    const row = {
      Date: displayDate,
      Cash: cash,
      ChequeAmount: chequeAmount,
      TotalAPlusB: totalAPlusB,
      Balance: currentBalance,
      Wing: data?.WingName || "",
      Floor: data?.FloorNo || "",
      FlatNo: data?.FlatNumber || "",
      Type: data?.Type || "",
    };

    // Update the running balance to the current balance for the next iteration
    runningBalance = currentBalance;

    return row;
  });

  // Ensure there are always 15 rows displayed
  const totalRows = 28;
  const defaultRowsCount = Math.max(totalRows - rows.length, 0);
  const defaultRows = new Array(defaultRowsCount).fill({
    Date: "",
    Cash: "",
    ChequeAmount: "",
    TotalAPlusB: "",
    Balance: "",
    Wing: "",
    Floor: "",
    FlatNo: "",
    Type: "",
  });

  const finalRows = [...rows, ...defaultRows];

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="body1" color="textSecondary" display="flex" alignItems="center">
    <ErrorIcon style={{ marginRight: 8 }} />
    No Record found
  </Typography>;
  }

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginBottom={2}
      >
        <Grid>
          <Button
            variant="contained"
            color="primary"
            // onClick={() => handlePrint()}
            onClick={() => reactToPrintFn()}
            sx={{ width: "100%" }}
          >
            Print
          </Button>
        </Grid>
        <Grid>
          <FormControl style={{ minWidth: 150, marginRight: 20 }}>
            <InputLabel id="filter-label">Filter</InputLabel>
            <Select
              labelId="filter-label"
              id="filter-select"
              label="Filter"
              value={filterOption}
              onChange={handleFilterChange}
            >
              <MenuItem value="remarksWithCreateDate">Original Remark</MenuItem>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="otherRemarks">Updated Remark</MenuItem>
            </Select>
          </FormControl>

          <IconButton onClick={handleCancel}>
            <CancelIcon style={{ color: "red" }} />
          </IconButton>
        </Grid>
      </Box>
      <Grid className="printableArea" ref={contentRef}>
        <InvoiceBox >
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow sx={{ height: "10px", padding: 0 }}>
                  <StyledTableCell
                    colSpan={3}
                    sx={{ height: "10px", padding: 0 }}
                  >
                    <Typography
                      style={{
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: 900,
                      }}
                    >
                      QUOTATION
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
                      RERA NO. {data.reraregistration}
                    </Typography>
                    <Typography
                      style={{ float: "left", fontSize: 15, fontWeight: 200 }}
                    >
                      Date: {data.BookingDate}
                    </Typography>
                    <Typography
                      style={{ float: "right", fontSize: 15, fontWeight: 200 }}
                    >
                      Booked By: {data.UserName}
                    </Typography>
                  </StyledTableCell>
                </TableRow>
                <TableRow sx={{ padding: 0, display: "flex", alignItems: "center" }}>
  <StyledTableCell style={{ textAlign: "center", padding: 1, width: "355px", height: "160px" }}>
    <img
      src={`https://apiforcornershost.cubisysit.com/projectimage/${data.images || "rosenagar.png"}`}
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
      border: "2px solid #000",
      height: "160px",
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
                    <Typography>Name Of Purchase</Typography>
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "80%", padding: 0 }}
                    colSpan={10}
                  >
                    {data.BookingName}
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
                    {data.Address}
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
                    {data.Mobile}
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
                    {data.Pancard}
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
                    {data.Aadhar}
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
                    {data.Email}
                  </StyledTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
            <Table style={{ border: "1px solid black" }}>
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
                    {data.ProjectName}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "15%", padding: 0 }}
                    colSpan={10}
                  >
                    {data.WingName}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "15%", padding: 0 }}
                    colSpan={10}
                  >
                    {data.FloorNo}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "15%", padding: 0 }}
                    colSpan={10}
                  >
                    {data.FlatNo}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "15%", padding: 0 }}
                    colSpan={10}
                  >
                    {data.UnittypeName}
                  </StyledTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
            <Table className="info-border">
              <TableBody>
                <TableRow sx={{ padding: 0 }}>
                  <StyledTableCell
                    style={{ width: "30%", padding: 0, textAlign: "left" }}
                    colSpan={4}
                  >
                    Type of Booking
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "20%", padding: 0 }}
                    colSpan={1}
                  >
                    {data.BookingTypeName}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "30%", padding: 0, textAlign: "left" }}
                    colSpan={4}
                  >
                    GST* (As per Govt.Notification)
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "20%", padding: 0 }}
                    colSpan={1}
                  >
                    {data.Gst}
                  </StyledTableCell>
                </TableRow>
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
                    {data.Area}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "30%", padding: 0, textAlign: "left" }}
                    colSpan={4}
                  >
                    Stamp Duty* (As per Govt.Notification)
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "20%", padding: 0 }}
                    colSpan={1}
                  >
                    {data.StampDuty}
                  </StyledTableCell>
                </TableRow>
                <TableRow sx={{ padding: 0 }}>
                  <StyledTableCell
                    style={{ width: "30%", padding: 0, textAlign: "left" }}
                    colSpan={4}
                  >
                    Rate Sq.Ft
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "20%", padding: 0 }}
                    colSpan={1}
                  >
                    {data.Ratesqft}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "30%", padding: 0, textAlign: "left" }}
                    colSpan={4}
                  >
                    Registration* (As per Govt.Notification)
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "20%", padding: 0 }}
                    colSpan={1}
                  >
                    {data.Registration}
                  </StyledTableCell>
                </TableRow>
                <TableRow sx={{ padding: 0 }}>
                  <StyledTableCell
                    style={{ width: "30%", padding: 0, textAlign: "left" }}
                    colSpan={4}
                  >
                    TTL Amount As Per Builtup
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "20%", padding: 0 }}
                    colSpan={1}
                  >
                    {data.TtlAmount}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "30%", padding: 0, textAlign: "left" }}
                    colSpan={4}
                  >
                    Advocate* (At time of registration)
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "20%", padding: 0 }}
                    colSpan={1}
                  >
                    {data.Advocate}
                  </StyledTableCell>
                </TableRow>
                <TableRow sx={{ padding: 0 }}>
                  <StyledTableCell
                    style={{ width: "30%", padding: 0, textAlign: "left" }}
                    colSpan={4}
                  >
                    Development Charges
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "20%", padding: 0 }}
                    colSpan={1}
                  >
                    {data.Charges}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "30%", padding: 0, textAlign: "left" }}
                    colSpan={4}
                  >
                    Extra Cost (B)
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "20%", padding: 0 }}
                    colSpan={1}
                  >
                    {data.ExtraCost}
                  </StyledTableCell>
                </TableRow>
                <TableRow sx={{ padding: 0 }}>
                  <StyledTableCell style={{ width: '30%', padding: 0, textAlign: "left" }} colSpan={4}>Parking Facility  | {data.ParkingAvilability} </StyledTableCell>
                  <StyledTableCell style={{ width: '20%', padding: 0 }} colSpan={1}>{data.ParkingFacility}</StyledTableCell>
                  <StyledTableCell
                    style={{ width: "30%", padding: 0, textAlign: "left" }}
                    colSpan={4}
                  >
                    Total (A + B)
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "20%", padding: 0 }}
                    colSpan={1}
                  >
                    {data.TotalCost}
                  </StyledTableCell>
                </TableRow>
                <TableRow sx={{ padding: 0 }}>
                  <StyledTableCell
                    style={{ width: "30%", padding: 0, textAlign: "left" }}
                    colSpan={4}
                  >
                    Gross Flat Cost (A)
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "20%", padding: 0 }}
                    colSpan={1}
                  >
                    {data.FlatCost}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "30%", padding: 0, textAlign: "left" }}
                    colSpan={4}
                  >
                    Booking Ref.Code (T & C)
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "20%", padding: 0 }}
                    colSpan={1}
                  >
                    {data.BookingRef}
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
                    style={{ textAlign: "left", padding: 0 }}
                    colSpan={10}
                  >
                    Rupees in words : {data.FlatCostInWords}
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
                    style={{ width: "30%", padding: 0 }}
                    colSpan={4}
                  >
                    Usable Area in Sq.Ft
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "20%", padding: 0 }}
                    colSpan={1}
                  >
                    {data.UsableArea}
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "30%", padding: 0 }}
                    colSpan={4}
                  >
                    Agreement Carpet (RERA) in Sq.Ft
                  </StyledTableCell>
                  <StyledTableCell
                    style={{ width: "20%", padding: 0 }}
                    colSpan={1}
                  >
                    {data.AgreementCarpet}
                  </StyledTableCell>
                </TableRow>

                {filterOption === "remarksWithCreateDate" && (
                  <>
                    <TableRow sx={{ padding: 0 }}>
                      <StyledTableCell
                        style={{
                          textAlign: "left",
                          fontSize: 15,
                          fontWeight: "bolder",
                          padding: 0,
                        }}
                        colSpan={10}
                      >
                        Original Remarks:
                      </StyledTableCell>
                    </TableRow>
                    {filteredRemarks &&
                      filteredRemarks.map((remark, index) => (
                        <TableRow
                          key={`remarksWithCreateDate-${index}`}
                          sx={{ padding: 0 }}
                        >
                          <StyledTableCell
                            style={{ textAlign: "left", padding: 0 }}
                            colSpan={10}
                          >
                            {index + 1}. Rs. {remark.Remarkamount}{" "}
                            {remark.RemarkName} {remark.RemarkDate}
                          </StyledTableCell>
                        </TableRow>
                      ))}
                  </>
                )}

                {filterOption === "otherRemarks" && (
                  <>
                    <TableRow sx={{ padding: 0 }}>
                      <StyledTableCell
                        style={{
                          textAlign: "left",
                          fontSize: 15,
                          fontWeight: "bolder",
                          padding: 0,
                        }}
                        colSpan={10}
                      >
                        Updated Remarks:
                      </StyledTableCell>
                    </TableRow>
                    {filteredRemarks &&
                      filteredRemarks.map((remark, index) => (
                        <TableRow
                          key={`otherRemarks-${index}`}
                          sx={{ padding: 0 }}
                        >
                          <StyledTableCell
                            style={{ textAlign: "left", padding: 0 }}
                            colSpan={10}
                          >
                            {index + 1}. Rs. {remark.Remarkamount}{" "}
                            {remark.RemarkName} {remark.RemarkDate}
                          </StyledTableCell>
                        </TableRow>
                      ))}
                  </>
                )}

                {filterOption === "all" && (
                  <>
                    <TableRow sx={{ padding: 0 }}>
                      <StyledTableCell
                        style={{
                          textAlign: "left",
                          fontSize: 15,
                          fontWeight: "bolder",
                          padding: 0,
                        }}
                        colSpan={10}
                      >
                        Original Remarks:
                      </StyledTableCell>
                    </TableRow>
                    {data?.remarksWithCreateDate &&
                      data?.remarksWithCreateDate.map((remark, index) => (
                        <TableRow
                          key={`remarksWithCreateDate-${index}`}
                          sx={{ padding: 0 }}
                        >
                          <StyledTableCell
                            style={{ textAlign: "left", padding: 0 }}
                            colSpan={10}
                          >
                            {index + 1}. Rs. {remark.Remarkamount}{" "}
                            {remark.RemarkName} {remark.RemarkDate}
                          </StyledTableCell>
                        </TableRow>
                      ))}

                    <TableRow sx={{ padding: 0 }}>
                      <StyledTableCell
                        style={{
                          textAlign: "left",
                          fontSize: 15,
                          fontWeight: "bolder",
                          padding: 0,
                        }}
                        colSpan={10}
                      >
                        UPDATED REMARKS:
                      </StyledTableCell>
                    </TableRow>
                    {data?.otherRemarks &&
                      data?.otherRemarks.map((remark, index) => (
                        <TableRow
                          key={`otherRemarks-${index}`}
                          sx={{ padding: 0 }}
                        >
                          <StyledTableCell
                            style={{ textAlign: "left", padding: 0 }}
                            colSpan={10}
                          >
                            {index + 1}. {remark.Remarkamount} {remark.RemarkName}{" "}
                            {remark.RemarkDate}
                          </StyledTableCell>
                        </TableRow>
                      ))}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TableContainer component={Paper}>
            <Table className="info-border">
              <TableBody>
                <TableRow style={{ border: "1px solid black", padding: 0 }}>
                  <StyledTableCell colSpan={4} style={{ padding: 0 }}>
                    Verified By
                  </StyledTableCell>
                  <StyledTableCell colSpan={4} style={{ padding: 0 }}>
                    Maked By
                  </StyledTableCell>
                  <StyledTableCell colSpan={4} style={{ padding: 0 }}>
                    Purchaser Signature & Date
                  </StyledTableCell>
                </TableRow>
                {/* Add rows for signatures */}
                <TableRow style={{ padding: 0 }}>
                  <StyledTableCell
                    colSpan={4}
                    style={{ height: "60px", padding: 0 }}
                  ></StyledTableCell>
                  <StyledTableCell
                    colSpan={4}
                    style={{ height: "60px", padding: 0 }}
                  ></StyledTableCell>
                  <StyledTableCell
                    colSpan={4}
                    style={{ height: "60px", padding: 0 }}
                  ></StyledTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </InvoiceBox>

        <InvoiceBox >
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
                    <Typography style={{ fontSize: 20, fontWeight: 700 }}>
                      {data.ProjectName}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell style={{ textAlign: "center" }}>
                    <Typography variant="body1">WING</Typography>
                    <Typography variant="body2">{data?.WingName}</Typography>
                  </StyledTableCell>

                  <StyledTableCell style={{ textAlign: "center" }}>
                    <Typography variant="body1">FLOOR</Typography>
                    <Typography variant="body2">{data?.FloorNo}</Typography>
                  </StyledTableCell>
                  <StyledTableCell style={{ textAlign: "center" }}>
                    <Typography variant="body1">FLAT NO</Typography>
                    <Typography variant="body2">{data?.FlatNo}</Typography>
                  </StyledTableCell>
                  <StyledTableCell style={{ textAlign: "center" }}>
                    <Typography variant="body1">TYPE</Typography>
                    <Typography variant="body2">{data?.UnittypeName}</Typography>
                  </StyledTableCell>
                </TableRow>

                <TableRow>
              <StyledTableCell style={{ textAlign: "center" }}>
                 Sr No.
                </StyledTableCell>
                <StyledTableCell style={{ textAlign: "center" }}>
                 Date
                </StyledTableCell>
         
                <StyledTableCell colSpan={4} style={{ textAlign: "center" }}>
                  Amount
                </StyledTableCell>
               
                <StyledTableCell style={{ textAlign: "center" }}>
                  Balance
                </StyledTableCell>
                <StyledTableCell colSpan={2} style={{ textAlign: "center" }}>
                  Sign.
                </StyledTableCell>
              </TableRow>

              {/* Render Rows */}
              {finalRows?.map((row, index) => (
                <TableRow key={index}>
                   <StyledTableCell style={{ textAlign: "center" }}>
                    {index+1}
                  </StyledTableCell>
                  <StyledTableCell style={{ textAlign: "center" }}>
                    {row.Date}
                  </StyledTableCell>
            
                  <StyledTableCell colSpan={4} style={{ textAlign: "center" }}>
                    {row.ChequeAmount}
                  </StyledTableCell>
                  <StyledTableCell style={{ textAlign: "center" }}>
                    {row.Balance}
                  </StyledTableCell>
                  <StyledTableCell colSpan={2} style={{ textAlign: "center" }}>
                    {" "}
                
                  </StyledTableCell>
                </TableRow>
              ))}

              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: 20 }}>
            Note: All payments are subject to receipt and realization.
          </Typography>
        </InvoiceBox>

        <InvoiceBox >
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
             
                <TableRow>
                  <StyledTableCell
                    colSpan={5}
                    style={{
                      textAlign: "center",
                    
                    }}
                  >
                    <Typography style={{ fontSize: 20, fontWeight: 700 }}>
                      PROJECT
                    </Typography>
                    <Typography style={{ fontSize: 20, fontWeight: 700 }}>
                      {data.ProjectName}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell
                    style={{
                      textAlign: "center",
                      
                    }}
                  >
                    <Typography variant="body1">WING</Typography>
                    <Typography variant="body2">{data?.WingName}</Typography>
                  </StyledTableCell>
                  <StyledTableCell
                    style={{
                      textAlign: "center",
                     
                    }}
                  >
                    <Typography variant="body1">FLOOR</Typography>
                    <Typography variant="body2">{data?.FloorNo}</Typography>
                  </StyledTableCell>
                  <StyledTableCell
                    style={{
                      textAlign: "center",
                    
                    }}
                  >
                    <Typography variant="body1">FLAT NO</Typography>
                    <Typography variant="body2">{data?.FlatNo}</Typography>
                  </StyledTableCell>
                  <StyledTableCell
                    style={{
                      textAlign: "center",
                    
                    }}
                  >
                    <Typography variant="body1">TYPE</Typography>
                    <Typography variant="body2">{data?.UnittypeName}</Typography>
                  </StyledTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, p: 2, border: "2px solid #000"}}>
            <Typography variant="body2" sx={{ fontSize: 13, lineHeight: 1.5 }}>
              (1) I/We understand that this is merely an application for booking
              and the right of allotment rests exclusively with you and in the
              event of my application not being accepted to refund the booking
              amount without interest within one month from the date of this
              application. I/We also understand that 25% of the booking amount
              will be deducted while refunding in case the booking is cancelled by
              me/us. On allotment, I/We agree to accept the terms and conditions
              of quotation and pay the balance amount as per the payment schedule
              mentioned in the quotation letter. I agree that in the event of my
              failure to meet the payment schedule, Builder is free to cancel the
              allotment or charge interest on such delay or re-allot at a revised
              price as may be decided by Builder.
            </Typography>

            <Typography
              variant="body2"
              sx={{ fontSize: 13, lineHeight: 1.5, mt: 2 }}
            >
              (2) The Applicant cannot claim any right or interest in the Unit
              merely by subscribing to the application for allotment. The
              Allotment of the Unit is entirely at the discretion of Companies
              (Company). In case of non-allotment, Booking Amount paid will be
              refunded without interest.
            </Typography>

            <Typography
              variant="body2"
              sx={{ fontSize: 13, lineHeight: 1.5, mt: 2 }}
            >
              (3) This Schedule is a list of payment/construction slabs and is not
              in any particular sequence. Construction activities like block work,
              etc., may be carried out in tandem with earlier slabs than stated,
              and hence, the demand may be generated earlier than above.
            </Typography>

            <Typography
              variant="body2"
              sx={{ fontSize: 13, lineHeight: 1.5, mt: 2 }}
            >
              (4) Statutory expenses like stamp duty & registration charges for
              agreements and registering the property, additional stamp duty, if
              demanded by the Special Dy. Commissioner, undervaluation of stamps
              will have to be borne by the Allottee. GST as applicable, increase
              in existing tax levies, and any fresh Governmental levies,
              applicable during the contract period shall be met by the Purchaser.
            </Typography>

            <Typography
              variant="body2"
              sx={{ fontSize: 13, lineHeight: 1.5, mt: 2 }}
            >
              (5) Alterations to the Building Plan: The Applicant has seen and
              accepted the plans, design, and specifications and the Applicant
              authorizes the Company to effect suitable and necessary
              alterations/modifications in the layout plan/building plans,
              designs, and specifications as the Company may deem fit or as may be
              directed by any competent authority/authorities.
            </Typography>

            <Typography
              variant="body2"
              sx={{ fontSize: 13, lineHeight: 1.5, mt: 2 }}
            >
              (6) Make all payments to the company name of{" "}
              <strong>{data.CompanyName}</strong> from their bank account only and
              not from and through the bank accounts of any third parties.
            </Typography>

            <Typography
              variant="body2"
              sx={{ fontSize: 13, lineHeight: 1.5, mt: 2 }}
            >
              (7) Agrees and undertakes to be bound by and perform all the
              obligations and the terms & conditions including timely payment of
              amounts stated hereunder.
            </Typography>

            <Typography
              variant="body2"
              sx={{ fontSize: 13, lineHeight: 1.5, mt: 2 }}
            >
              (8) All overdue payments shall attract interest at 18% p.a.,
              quarterly compounded, from the dates they fall due till realization.
            </Typography>

            <Typography
              variant="body2"
              sx={{ fontSize: 13, lineHeight: 1.5, mt: 2 }}
            >
              (9) The Applicant cannot claim shifting of the booking within the
              project/any other project of the Company, unless the Company
              specifically agrees to the same, and subject to such charges as may
              be levied in this regard.
            </Typography>

            <Typography
              variant="body2"
              sx={{ fontSize: 13, lineHeight: 1.5, mt: 2 }}
            >
              (10) If you cancel your booking, then your flat/shop amount will be
              refunded (without interest) after your flat/shop is sold to another
              customer.
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: 13, lineHeight: 1.5, mt: 2 }}
            >
              (11) RERA Carpet area of the Flat/Shops shall be mentioned in the
              agreement & all Other Documents.
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: 13, lineHeight: 1.5, mt: 2 }}
            >
              (12) The area (Builtup) of the flat / shops which is written in the
              above quotation is only for better understanding of you.
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: 13, lineHeight: 1.5, mt: 2 }}
            >
              (13) Stamp Duty, Registration & GST will be increase or decrease as
              per Government Notification.
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: 13, lineHeight: 1.5, mt: 2 }}
            >
              (14) All payments are subject to the receipt and realization
            </Typography>
          </Box>

          <Box sx={{ mt: 3, p: 2, border: "2px solid #ccc" }}>
            <TableContainer component={Paper}>
              <Table className="info-border">
                <TableBody>
                  <TableRow style={{ border: "1px solid black", padding: 0 }}>
                    <StyledTableCell colSpan={4} style={{ padding: 0 }}>
                      Verified By
                    </StyledTableCell>
                    <StyledTableCell colSpan={4} style={{ padding: 0 }}>
                      Maked By
                    </StyledTableCell>
                    <StyledTableCell colSpan={4} style={{ padding: 0 }}>
                      Purchaser Signature & Date
                    </StyledTableCell>
                  </TableRow>
                  {/* Add rows for signatures */}
                  <TableRow style={{ padding: 0 }}>
                    <StyledTableCell
                      colSpan={4}
                      style={{ height: "90px", padding: 0 }}
                    ></StyledTableCell>
                    <StyledTableCell
                      colSpan={4}
                      style={{ height: "90px", padding: 0 }}
                    ></StyledTableCell>
                    <StyledTableCell
                      colSpan={4}
                      style={{ height: "90px", padding: 0 }}
                    ></StyledTableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </InvoiceBox>

        <InvoiceBox  >
          <TableContainer component={Paper} sx={{ padding: 2, marginBottom: 4 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2} style={{ border: "none", paddingBottom: 16 }}>
                    <Typography variant="h6" align="right">
                      Date : {data.BookingDate}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ border: "none" }}>
                    <Typography variant="body1" gutterBottom>
                      TO,
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>{data.BookingName}</strong>
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ marginBottom: 10 }}>
                      {data.Address}
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ marginBottom: 8 }}>
                      Dear Sir/Madam,
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      "On behalf of the entire <strong>{data.CompanyName}</strong> staff, I'd like to take this opportunity to welcome you as a new customer. We are thrilled to have you with us."
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      You’re booking details as follows:
                    </Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={2} style={{ border: "none", paddingTop: 8 }}>
                    <TableContainer
                      component={Paper}
                      sx={{
                        maxWidth: 400,
                        margin: "auto",
                        marginTop: 2,
                        marginBottom: 2,
                      }}
                    >
                      <Table sx={{ border: "2px solid black" }}>
                        <TableBody>
                          <TableRow>
                            <TableCell align="center" sx={{ fontWeight: "bold", border: "2px solid black" }}>
                              PROJECT NAME
                            </TableCell>
                            <TableCell align="center" sx={{ border: "2px solid black" }}>
                              {data.ProjectName}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center" sx={{ fontWeight: "bold", border: "2px solid black" }}>
                              TYPE
                            </TableCell>
                            <TableCell align="center" sx={{ border: "2px solid black" }}>
                              {data.UnittypeName}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center" sx={{ fontWeight: "bold", border: "2px solid black" }}>
                              WING
                            </TableCell>
                            <TableCell align="center" sx={{ border: "2px solid black" }}>
                              {data.WingName}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center" sx={{ fontWeight: "bold", border: "2px solid black" }}>
                              FLOOR
                            </TableCell>
                            <TableCell align="center" sx={{ border: "2px solid black" }}>
                              {data.FloorNo}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center" sx={{ fontWeight: "bold", border: "2px solid black" }}>
                              FLAT NO.
                            </TableCell>
                            <TableCell align="center" sx={{ border: "2px solid black" }}>
                              {data.FlatNo}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell style={{ border: "none" }}>
                    <Typography variant="body1" gutterBottom sx={{ marginBottom: 10 }}>
                      "At <strong>{data.CompanyName}</strong>, we pride ourselves on offering our customers responsive, competent, and excellent service. Our customers are the most important part of our business, and we work tirelessly to ensure your complete satisfaction, now and for as long as you are a customer."
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      "I am also happy to inform you that I will be your primary point of contact at the company, and I encourage you to contact me at any time with your questions, comments, and feedback."
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} style={{ border: "none", paddingTop: 16 }}>
                    <TableCell style={{ textAlign: "right", border: "none" }}>
                      <Typography variant="body1" gutterBottom sx={{ marginLeft: 65 }}>
                        <strong>{data.CompanyName}</strong>
                        <br />
                        Contact No. 99309 60449 / 90044 75240
                        <br />
                        Email: {data.companyemail}
                        <br />
                        Website: {data.Website}
                      </Typography>
                    </TableCell>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </InvoiceBox>
      </Grid>
    </>
  );
};

export default TemplatePayment;
