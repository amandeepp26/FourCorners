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
} from "@mui/material";
import { createGlobalStyle } from "styled-components";
import styled from "styled-components";

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
  console.log(bookingID, "recipettttttt id aaya");
  const printRef = useRef();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Reload the page to reset the original contents
  };

  useEffect(() => {
    fetchData();
  }, [bookingID]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-chequereceipt.php?BookingID=${bookingID}`
      );
      console.log("data aaya dekh", response.data);
      setData(response.data.data[0]);
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
      <Button
        variant="contained"
        color="primary"
        onClick={handlePrint}
        style={{ marginBottom: "10px" }}
      >
        Print
      </Button>

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
                        ALMANTASHA REALTY
                      </Typography>
                      <Typography
                        style={{
                          textAlign: "center",
                          fontSize: 30,
                          fontWeight: "bold",
                        }}
                      >
                        Builders & Developers
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
                    Head Office: Plot No.102, Near Kalsekar Hospital & College
                    Main Gate, Kausa, Mumbra 400612. Contact No. 72082 77770.
                    GST No. 27AIVPK6218R1Z8 Website: www.almantasharealty.com,
                    Email: info@almantasharealty.com Site Address: Survey No.
                    121/1B/1, 121/1B/2, 121/1/E, 121/1/F, 123/1, 86/G &
                    123/3/1/B, Opp. Khan Compound, Shil, Thane 400612. MahaRera
                    No. P51700020942
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
                              <Typography>{data.paymentID}</Typography>
                            </StyledTableCell>
                          </TableRow>
                          <TableRow sx={{ padding: 0 }}>
                            <StyledTableCell
                              style={{ width: "20%", padding: 0 }}
                              colSpan={10}
                            >
                              <Typography>Date</Typography>
                            </StyledTableCell>
                            <StyledTableCell
                              style={{ width: "30%", padding: 0 }}
                              colSpan={10}
                            >
                              <Typography>{data}</Typography>
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
            <Typography style={{ fontSize: 26 }}>{data.Name}</Typography>
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
              TYPE : {data.BookingType}
            </Typography>
          </div>
          <div
            style={{ marginLeft: 20, alignItems: "center", display: "flex" }}
          >
            <Typography style={{ fontSize: 17 }}>
              Payment Against Flat No. {data.FlatNo} On {data.FloorNo}th Floor Of the Building Known as
              "THE HEAVEN'S PALACE", Building No.01
            </Typography>
          </div>
        </div>

        <TableContainer component={Paper}>
          <Table style={{ border: "1px solid black" }}>
            <TableBody>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ width: "25%", padding: 0 }}
                  colSpan={10}
                >
                  <Typography>Date</Typography>
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "25%", padding: 0 }}
                  colSpan={10}
                >
                  <Typography>Bank</Typography>
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "25%", padding: 0 }}
                  colSpan={10}
                >
                  <Typography>Chq. No.</Typography>
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "25%", padding: 0 }}
                  colSpan={10}
                >
                  <Typography>Amount</Typography>
                </StyledTableCell>
              </TableRow>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ width: "25%", padding: 0 }}
                  colSpan={10}
                >
                  <Typography>{data.Date.split(" ")[0]}</Typography>
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "25%", padding: 0 }}
                  colSpan={10}
                >
                  <Typography>{data.Bank}</Typography>
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "25%", padding: 0 }}
                  colSpan={10}
                >
                  <Typography>{data.ChequeNo}</Typography>
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "25%", padding: 0 }}
                  colSpan={10}
                >
                  <Typography>{data.Amount}</Typography>
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer component={Paper}>
          <Table style={{ border: "1px solid black" }}>
            <TableBody>
              <TableRow sx={{ padding: 0 }}>
                <StyledTableCell
                  style={{ width: "50%", padding: 0 }}
                  colSpan={10}
                >
                  <Typography>Amount In Words :</Typography>
                </StyledTableCell>
                <StyledTableCell
                  style={{ width: "50%", padding: 0 }}
                  colSpan={10}
                >
                  <Typography>{data.AmountInWords}</Typography>
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container spacing={2}>
          <Grid item xs={8}>
            <div style={{ border: "1px solid black", padding: 20 }}>
              <Typography style={{ fontWeight: "bold" }}>
                Payment Schedule
              </Typography>
              <ul>
                <li>Booking Amount - Rs. 100,000.00</li>
                <li>
                  20% within 20 days of Booking - Rs. 347,300.00
                </li>
                <li>
                  5% on plinth completion - Rs. 88,175.00
                </li>
                <li>
                  7% on stilt slab completion - Rs. 123,445.00
                </li>
                <li>
                  7% on 1st slab completion - Rs. 123,445.00
                </li>
                <li>
                  7% on 2nd slab completion - Rs. 123,445.00
                </li>
                <li>
                  7% on 3rd slab completion - Rs. 123,445.00
                </li>
                <li>
                  7% on 4th slab completion - Rs. 123,445.00
                </li>
                <li>
                  7% on 5th slab completion - Rs. 123,445.00
                </li>
                <li>
                  7% on 6th slab completion - Rs. 123,445.00
                </li>
                <li>
                  7% on 7th slab completion - Rs. 123,445.00
                </li>
                <li>
                  7% on 8th slab completion - Rs. 123,445.00
                </li>
                <li>
                  3% on brickwork completion - Rs. 88,175.00
                </li>
                <li>
                  3% on internal plaster - Rs. 88,175.00
                </li>
                <li>
                  3% on external plaster - Rs. 88,175.00
                </li>
                <li>
                  3% on painting - Rs. 88,175.00
                </li>
                <li>
                  3% on possession - Rs. 88,175.00
                </li>
              </ul>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div style={{ border: "1px solid black", padding: 20 }}>
              <Typography style={{ fontWeight: "bold" }}>
                For Office Use Only
              </Typography>
              <ul>
                <li>Received by:</li>
                <li>Date:</li>
                <li>Signature:</li>
              </ul>
            </div>
          </Grid>
        </Grid>
      </InvoiceBox>
    </>
  );
};

export default Reciept;
