// ** React Imports
import { useEffect, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useCookies } from "react-cookie";

const AddAdditionalCharges = ({ show }) => {
  const [date, setDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [voucherTypeName, setVoucherTypeName] = useState("");
  const [nameOfCompany, setNameOfCompany] = useState("");
  const [
    ParticularsofAdditionalChargesname,
    setParticularsofAdditionalChargesname,
  ] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [subProject, setSubProject] = useState("");
  const [carParkingType, setCarParkingType] = useState("");
  const [manualParkingNumber, setManualParkingNumber] = useState("");
  const [parkingLevel, setParkingLevel] = useState("");
  const [comments, setComments] = useState("");

  const [includeInPaymentScheduleName, setIncludeInPaymentScheduleName] =
    useState("");
  const [typeOfAdditionalChargesName, setTypeOfAdditionalChargesName] =
    useState("");
  const [ratePerUoMName, setRatePerUoMName] = useState("");
  const [unitTypeName, setUnitTypeName] = useState("");
  const [unitTypeAmountName, setUnitTypeAmountName] = useState("");
  const [fixedAmountName, setFixedAmountName] = useState("");
  const [saleAreaName, setSaleAreaName] = useState("");
  const [noOfMonthsName, setNoOfMonthsName] = useState("");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://apiforcornershost.cubisysit.com/api/api-fetch-subprojectdetails.php"
      );
      console.log("API Response:", response.data);
      setRows(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };
  const [cookies, setCookie, removeCookie] = useCookies(["amr"]);
  const handleSubmitData = async (event) => {
    event.preventDefault();

    const body = {
      startdate: date,
      enddate: endDate,
      projectname: projectName,
      vouchertype: voucherTypeName,
      subproject: subProject,
      particularsofadditionalcharges: ParticularsofAdditionalChargesname,
      includeinpaymentschedule: includeInPaymentScheduleName,
      typeofadditionalcharges: typeOfAdditionalChargesName,
      rateperuom: ratePerUoMName,
      unittype: unitTypeName,
      unittypeamount: unitTypeAmountName,
      fixedamount: fixedAmountName,
      salearea: saleAreaName,
      noofmonths: noOfMonthsName,
      CreateUID: cookies.amr?.UserID || 1,
      Status: 1,
    };

    try {
      const response = await axios.post(
        "https://proxy-forcorners.vercel.app/api/proxy/api-insert-additionalcharges.php",
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "Success") {
        // setSubmitSuccess(true);
        // setSubmitError(false);
        show(false);
        // Clear form fields
        setDate(null);
        setEndDate(null);
        setProjectName("");
        setVoucherTypeName("");
        setNameOfCompany("");
        setProjectCode("");
        setSubProject("");
        setCarParkingType("");
        setManualParkingNumber("");
        setParkingLevel("");
        setComments("");
        setParticularsOfAdditionalChargesName("");
        setIncludeInPaymentScheduleName("");
        setTypeOfAdditionalChargesName("");
        setRatePerUoMName("");
        setUnitTypeName("");
        setUnitTypeAmountName("");
        setFixedAmountName("");
        setSaleAreaName("");
        setNoOfMonthsName("");
      } else {
        // setSubmitSuccess(false);
        // setSubmitError(true);
      }
    } catch (error) {
      console.error("There was an error!", error);
      // setSubmitSuccess(false);
      // setSubmitError(true);
    }
  };

  return (
    <Card>
      <CardContent>
        <form>
          <Grid container spacing={7}>
            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ marginTop: 5, fontWeight: "bold", fontSize: 20 }}
                >
                  Add Additional Charges Details
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Include In Payment Schedule"
                placeholder="Include In Payment Schedule"
                value={includeInPaymentScheduleName}
                onChange={(a) =>
                  setIncludeInPaymentScheduleName(a.target.value)
                }
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="No. of Months"
                placeholder="No. of Months"
                value={noOfMonthsName}
                onChange={(a) => setNoOfMonthsName(a.target.value)}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Particulars of Additional Charges"
                placeholder="Particulars of Additional Charges"
                value={ParticularsofAdditionalChargesname}
                onChange={(a) =>
                  setParticularsofAdditionalChargesname(a.target.value)
                }
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Type of Additional Charges"
                placeholder="Type of Additional Charges"
                value={typeOfAdditionalChargesName}
                onChange={(a) => setTypeOfAdditionalChargesName(a.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Fixed Amount"
                placeholder="Fixed Amount"
                value={fixedAmountName}
                onChange={(a) => setFixedAmountName(a.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Unit Type Amount"
                placeholder="Unit Type Amount"
                value={unitTypeAmountName}
                onChange={(a) => setUnitTypeAmountName(a.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Rate Per UoM"
                placeholder="Rate Per UoM"
                value={ratePerUoMName}
                onChange={(a) => setRatePerUoMName(a.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Unit Type"
                placeholder="Unit Type"
                value={unitTypeName}
                onChange={(a) => setUnitTypeName(a.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Sale Area"
                placeholder="Sale Area"
                value={saleAreaName}
                onChange={(a) => setSaleAreaName(a.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Voucher Type"
                placeholder="Voucher Type"
                value={voucherTypeName}
                onChange={(e) => setVoucherTypeName(e.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Project Name"
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Sub Project Name"
                placeholder="Sub Project Name"
                value={subProject}
                onChange={(e) => setSubProject(e.target.value)}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                customInput={
                  <TextField
                    fullWidth
                    label="Start Date"
                    InputProps={{
                      readOnly: true,
                      sx: { width: "100%" },
                    }}
                  />
                }
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                customInput={
                  <TextField
                    fullWidth
                    label="End Date"
                    InputProps={{
                      readOnly: true,
                      sx: { width: "100%" },
                    }}
                  />
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                sx={{ marginRight: 3.5 }}
                onClick={handleSubmitData}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddAdditionalCharges;
