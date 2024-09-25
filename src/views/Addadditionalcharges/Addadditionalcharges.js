import React, { useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Addadditionalcharges = ({ show }) => {
  const [formData, setFormData] = useState({
    projectname: "",
    subproject: "",
    startdate: null,
    enddate: null,
    vouchertype: "",
    particularsofadditionalcharges: "",
    includeinpaymentschedule: "",
    typeofadditionalcharges: "",
    salearea: "",
    rateperuom: "",
    unittype: "",
    unittypeamount: "",
    fixedamount: "",
    noofmonths: "",
    Status: 1,
  });

  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const validateFields = () => {
    const newErrors = {};
    if (!formData.projectname) newErrors.projectname = "Project Name is required";
    if (!formData.subproject) newErrors.subproject = "Sub Project is required";
    if (!formData.startdate) newErrors.startdate = "Start Date is required";
    if (!formData.enddate) newErrors.enddate = "End Date is required";
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const body = {
      ...formData,
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
        setSubmitSuccess(true);
        setSubmitError(false);
        show(false);
        // Clear form fields
        setFormData({
          projectname: "",
          subproject: "",
          startdate: null,
          enddate: null,
          vouchertype: "",
          particularsofadditionalcharges: "",
          includeinpaymentschedule: "",
          typeofadditionalcharges: "",
          salearea: "",
          rateperuom: "",
          unittype: "",
          unittypeamount: "",
          fixedamount: "",
          noofmonths: "",
          Status: 1,
        });
      } else {
        setSubmitSuccess(false);
        setSubmitError(true);
      }
    } catch (error) {
      console.error("There was an error!", error);
      setSubmitSuccess(false);
      setSubmitError(true);
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
                  Insert Additional Charges
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Project Name"
                placeholder="Project Name"
                value={formData.projectname}
                onChange={handleInputChange}
                name="projectname"
                error={!!errors.projectname}
                helperText={errors.projectname}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Sub Project"
                placeholder="Sub Project"
                value={formData.subproject}
                onChange={handleInputChange}
                name="subproject"
                error={!!errors.subproject}
                helperText={errors.subproject}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <DatePicker
                selected={formData.startdate}
                onChange={(date) => handleDateChange("startdate", date)}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                customInput={
                  <TextField
                    fullWidth
                    name="startdate"
                    label="Start Date"
                    InputProps={{
                      readOnly: true,
                      sx: { width: "100%" },
                    }}
                    error={!!errors.startdate}
                    helperText={errors.startdate}
                  />
                }
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <DatePicker
                selected={formData.enddate}
                onChange={(date) => handleDateChange("enddate", date)}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                customInput={
                  <TextField
                    fullWidth
                    name="enddate"
                    label="End Date"
                    InputProps={{
                      readOnly: true,
                      sx: { width: "100%" },
                    }}
                    error={!!errors.enddate}
                    helperText={errors.enddate}
                  />
                }
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Voucher Type"
                placeholder="Voucher Type"
                value={formData.vouchertype}
                onChange={handleInputChange}
                name="vouchertype"
                error={!!errors.vouchertype}
                helperText={errors.vouchertype}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Particulars of Additional Charges"
                placeholder="Particulars of Additional Charges"
                value={formData.particularsofadditionalcharges}
                onChange={handleInputChange}
                name="particularsofadditionalcharges"
                error={!!errors.particularsofadditionalcharges}
                helperText={errors.particularsofadditionalcharges}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Include in Payment Schedule"
                placeholder="Include in Payment Schedule"
                value={formData.includeinpaymentschedule}
                onChange={handleInputChange}
                name="includeinpaymentschedule"
                error={!!errors.includeinpaymentschedule}
                helperText={errors.includeinpaymentschedule}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Type of Additional Charges"
                placeholder="Type of Additional Charges"
                value={formData.typeofadditionalcharges}
                onChange={handleInputChange}
                name="typeofadditionalcharges"
                error={!!errors.typeofadditionalcharges}
                helperText={errors.typeofadditionalcharges}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Sale Area"
                placeholder="Sale Area"
                value={formData.salearea}
                onChange={handleInputChange}
                name="salearea"
                error={!!errors.salearea}
                helperText={errors.salearea}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Rate per UOM"
                placeholder="Rate per UOM"
                value={formData.rateperuom}
                onChange={handleInputChange}
                name="rateperuom"
                error={!!errors.rateperuom}
                helperText={errors.rateperuom}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Unit Type"
                placeholder="Unit Type"
                value={formData.unittype}
                onChange={handleInputChange}
                name="unittype"
                error={!!errors.unittype}
                helperText={errors.unittype}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Unit Type Amount"
                placeholder="Unit Type Amount"
                value={formData.unittypeamount}
                onChange={handleInputChange}
                name="unittypeamount"
                error={!!errors.unittypeamount}
                helperText={errors.unittypeamount}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Fixed Amount"
                placeholder="Fixed Amount"
                value={formData.fixedamount}
                onChange={handleInputChange}
                name="fixedamount"
                error={!!errors.fixedamount}
                helperText={errors.fixedamount}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Number of Months"
                placeholder="Number of Months"
                value={formData.noofmonths}
                onChange={handleInputChange}
                name="noofmonths"
                error={!!errors.noofmonths}
                helperText={errors.noofmonths}
              />
            </Grid>
{/* 
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Status"
                placeholder="Status"
                value={formData.Status}
                onChange={handleInputChange}
                name="Status"
                error={!!errors.Status}
                helperText={errors.Status}
              />
            </Grid> */}

            <Grid item xs={12}>
              <Button
                variant="contained"
                sx={{ marginRight: 3.5 }}
                onClick={handleSubmit}
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

export default Addadditionalcharges;
