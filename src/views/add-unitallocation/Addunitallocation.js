import { useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

const AddUnitAllocation = () => {
  const [formData, setFormData] = useState({
    MemberCode: "",
    BookingDate: "",
    ProjectStartDate: "",
    Title: "",
    PartyName: "",
    MemberName: "",
    Address: "",
    Location: "",
    City: "",
    State: "",
    Country: "",
    Pincode: "",
    EmailID: "",
    MobileNo: "",
    Telephone: "",
    CommunicationAddress: "",
    MobileNoToSendSMS: "",
    CLocation: "",
    CCity: "",
    CState: "",
    CCountry: "",
    CPincode: "",
    DateOfBirthDate: "",
    DateOfBirthMonth: "",
    DateOfBirthYear: "",
    MarriageDateDate: "",
    MarriageDateMonth: "",
    MarriageDateYear: "",
    PANNo: "",
    PANNoOfDirector: "",
    FundsArrangement: "",
    NoOfExtraCarParkingRequired: "",
    Source: "",
    SourceName: "",
    SourceDescription: "",
    BrokerName: "",
    BrokeragePercentage: "",
    BrokerageDueAfterCustomerPymtRecdPerc: "",
    Others: "",
    FriendName: "",
    NameOfPerson: "",
    WellWisherName: "",
    ProjectName: "",
    SubProject: "",
    UnitCode: "",
    ProjectAddress: "",
    Floors: "",
    UnitNo: "",
    UnitType: "",
    CarpetArea: "",
    SaleAreaInUoM: "",
    RatePerUoM: "",
    SaleValue: "",
    MarketValue: "",
    DifferenceAmount: "",
    IncomeTaxRate: "",
    TotalTDSAmount: "",
    OtherChargesAmount: "",
    TotalAmount: "",
    BookingForm: "",
    InitialPay: "",
    ChequeNo: "",
    ChequeDate: "",
    BankName: "",
    AgreementValue: "",
    CarparkingNo: "",
    PossessionOfferDate: "",
    PossessionDate: "",
    SocietyHandoverDate: "",
    AgreementDate: "",
    OC_IssuingAuthorityFirmName: "",
    LastInstallmentDueParticulars: "",
    LastInstallmentDueDate: "",
    InstallmentDate: "",
    InstallmentType: "",
    TotalPercentage: "",
    TotalScheduleAmount: "",
    TotalDueAmt: "",
    InstallmentReceived: "",
    CarParkingDue: "",
    ExtraWorkDue: "",
    ClubMembershipDue: "",
    ServiceTaxDue: "",
    RefundPrincipalAmount: "",
    RefundServiceTaxAmount: "",
    AnnexureApprovedStatus: "",
    AnnexureMemberApprovedStatus: "",
    AttendedBy: "",
    Remarks: "",
    RelationCount: "",
    Astatus: "",
    NameOfCompany: "",
    CompanyAddress: "",
    CompanyAdd: "",
    CorpusForSociety: "",
    TotalPercentView: "",
    PaymentScheduleSlabWise: "",
    Id: "",
    SrNo: "",
    Particulars: "",
    Date: "",
    DueDate: "",
    Percent: "",
    Amt: "",
    DueAmt: "",
    PercentDecrease: "",
    PercentIncrease: "",
    AnnexureDetailEntries: "",
    AnnexureVoucherType: "",
    ParticularsType: "",
    DueFromInstallmentLetter: "",
    IncludeInPaymentSchedule: "",
    ServiceTaxApplicable: "",
    RatePerSqft: "",
    NoOfMonths: "",
    UnusedUnitType: "",
    Tostate: "",
  });
  const handleNavigation = () => {
    show('list');
  };
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://proxy-forcorners.vercel.app/api/proxy/api-insert-unitallocation.php",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "Success") {
        setSubmitSuccess(true);
      } else {
        setSubmitError(true);
      }
    } catch (error) {
      console.error("There was an error!", error);
      setSubmitError(true);
    }
  };

  const handleAlertClose = () => {
    setSubmitSuccess(false);
    setSubmitError(false);
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
          <Grid item xs={12}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          variant="body2"
          sx={{ fontWeight: 'bold', fontSize: 20 }}
        >
          Add Unit Allocation
        </Typography>
        <Button
          variant="contained"
          onClick={handleNavigation}
          style={{ marginTop: 0 }}
        >
          List
        </Button>
      </Box>
    </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Member Code"
                name="MemberCode"
                value={formData.MemberCode}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Booking Date"
                name="BookingDate"
                type="date"
                value={formData.BookingDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Project Start Date"
                name="ProjectStartDate"
                type="date"
                value={formData.ProjectStartDate}
                onChange={handleChange}
              />
            </Grid>
            {/* Add more fields similarly */}
            {/* Party Details */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Title"
                name="Title"
                value={formData.Title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Party Name"
                name="PartyName"
                value={formData.PartyName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Member Name"
                name="MemberName"
                value={formData.MemberName}
                onChange={handleChange}
              />
            </Grid>
            {/* Address Details */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Address"
                name="Address"
                value={formData.Address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Location"
                name="Location"
                value={formData.Location}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                name="City"
                value={formData.City}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                name="State"
                value={formData.State}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Country"
                name="Country"
                value={formData.Country}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Pincode"
                name="Pincode"
                value={formData.Pincode}
                onChange={handleChange}
              />
            </Grid>
            {/* Contact Details */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Email ID"
                name="EmailID"
                value={formData.EmailID}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Mobile Number"
                name="MobileNo"
                value={formData.MobileNo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Telephone"
                name="Telephone"
                value={formData.Telephone}
                onChange={handleChange}
              />
            </Grid>
            {/* Additional Details */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Communication Address"
                name="CommunicationAddress"
                value={formData.CommunicationAddress}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="MobileNo To SendSMS"
                name="MobileNoToSendSMS"
                value={formData.MobileNoToSendSMS}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="CLocation"
                name="CLocation"
                value={formData.CLocation}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="CCity"
                name="CCity"
                value={formData.CCity}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="CState"
                name="CState"
                value={formData.CState}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="CCountry"
                name="CCountry"
                value={formData.CCountry}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="CPincode"
                name="CPincode"
                value={formData.CPincode}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Date of Birth (Date)"
                name="DateOfBirthDate"
                value={formData.DateOfBirthDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Date of Birth (Month)"
                name="DateOfBirthMonth"
                value={formData.DateOfBirthMonth}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Date of Birth (Year)"
                name="DateOfBirthYear"
                value={formData.DateOfBirthYear}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Marriage Date (Date)"
                name="MarriageDateDate"
                value={formData.MarriageDateDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Marriage Date (Month)"
                name="MarriageDateMonth"
                value={formData.MarriageDateMonth}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Marriage Date (Year)"
                name="MarriageDateYear"
                value={formData.MarriageDateYear}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="PAN No"
                name="PANNo"
                value={formData.PANNo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="PAN No of Director"
                name="PANNoOfDirector"
                value={formData.PANNoOfDirector}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Funds Arrangement"
                name="FundsArrangement"
                value={formData.FundsArrangement}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="No. of Extra Car Parking Required"
                name="NoOfExtraCarParkingRequired"
                value={formData.NoOfExtraCarParkingRequired}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Source"
                name="Source"
                value={formData.Source}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Source Name"
                name="SourceName"
                value={formData.SourceName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Source Description"
                name="SourceDescription"
                value={formData.SourceDescription}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Broker Name"
                name="BrokerName"
                value={formData.BrokerName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Brokerage Percentage"
                name="BrokeragePercentage"
                value={formData.BrokeragePercentage}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Brokerage Due After Customer Payment Received Percentage"
                name="BrokerageDueAfterCustomerPymtRecdPerc"
                value={formData.BrokerageDueAfterCustomerPymtRecdPerc}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Others"
                name="Others"
                value={formData.Others}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Friend Name"
                name="FriendName"
                value={formData.FriendName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Name of Person"
                name="NameOfPerson"
                value={formData.NameOfPerson}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Well Wisher Name"
                name="WellWisherName"
                value={formData.WellWisherName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Project Name"
                name="ProjectName"
                value={formData.ProjectName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Sub Project"
                name="SubProject"
                value={formData.SubProject}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Unit Code"
                name="UnitCode"
                value={formData.UnitCode}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Project Address"
                name="ProjectAddress"
                value={formData.ProjectAddress}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Floors"
                name="Floors"
                value={formData.Floors}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Unit No"
                name="UnitNo"
                value={formData.UnitNo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Unit Type"
                name="UnitType"
                value={formData.UnitType}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Carpet Area"
                name="CarpetArea"
                value={formData.CarpetArea}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Sale Area in UoM"
                name="SaleAreaInUoM"
                value={formData.SaleAreaInUoM}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Rate Per UoM"
                name="RatePerUoM"
                value={formData.RatePerUoM}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Sale Value"
                name="SaleValue"
                value={formData.SaleValue}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Market Value"
                name="MarketValue"
                value={formData.MarketValue}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Difference Amount"
                name="DifferenceAmount"
                value={formData.DifferenceAmount}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Income Tax Rate"
                name="IncomeTaxRate"
                value={formData.IncomeTaxRate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Total TDS Amount"
                name="TotalTDSAmount"
                value={formData.TotalTDSAmount}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Other Charges Amount"
                name="OtherChargesAmount"
                value={formData.OtherChargesAmount}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Total Amount"
                name="TotalAmount"
                value={formData.TotalAmount}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Booking Form"
                name="BookingForm"
                value={formData.BookingForm}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Initial Pay"
                name="InitialPay"
                value={formData.InitialPay}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Cheque No"
                name="ChequeNo"
                value={formData.ChequeNo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Cheque Date"
                name="ChequeDate"
                type="date"
                value={formData.ChequeDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Bank Name"
                name="BankName"
                value={formData.BankName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Agreement Value"
                name="AgreementValue"
                value={formData.AgreementValue}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Car Parking No"
                name="CarparkingNo"
                value={formData.CarparkingNo}
                onChange={handleChange}
              />
            </Grid>

            {/* Possession Details */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Possession Offer Date"
                name="PossessionOfferDate"
                type="date"
                value={formData.PossessionOfferDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Possession Date"
                name="PossessionDate"
                type="date"
                value={formData.PossessionDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Society Handover Date"
                name="SocietyHandoverDate"
                type="date"
                value={formData.SocietyHandoverDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Agreement Date"
                name="AgreementDate"
                type="date"
                value={formData.AgreementDate}
                onChange={handleChange}
              />
            </Grid>

            {/* Installment Details */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="OC Issuing Authority Firm Name"
                name="OC_IssuingAuthorityFirmName"
                value={formData.OC_IssuingAuthorityFirmName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Last Installment Due Particulars"
                name="LastInstallmentDueParticulars"
                value={formData.LastInstallmentDueParticulars}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Last Installment Due Date"
                name="LastInstallmentDueDate"
                type="date"
                value={formData.LastInstallmentDueDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Installment Date"
                name="InstallmentDate"
                type="date"
                value={formData.InstallmentDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Installment Type"
                name="InstallmentType"
                value={formData.InstallmentType}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Total Percentage"
                name="TotalPercentage"
                value={formData.TotalPercentage}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Total Schedule Amount"
                name="TotalScheduleAmount"
                value={formData.TotalScheduleAmount}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Total Due Amount"
                name="TotalDueAmt"
                value={formData.TotalDueAmt}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Installment Received"
                name="InstallmentReceived"
                value={formData.InstallmentReceived}
                onChange={handleChange}
              />
            </Grid>

            {/* Dues Details */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Car Parking Due"
                name="CarParkingDue"
                value={formData.CarParkingDue}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Extra Work Due"
                name="ExtraWorkDue"
                value={formData.ExtraWorkDue}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Club Membership Due"
                name="ClubMembershipDue"
                value={formData.ClubMembershipDue}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Service Tax Due"
                name="ServiceTaxDue"
                value={formData.ServiceTaxDue}
                onChange={handleChange}
              />
            </Grid>

            {/* Refund Details */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Refund Principal Amount"
                name="RefundPrincipalAmount"
                value={formData.RefundPrincipalAmount}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Refund Service Tax Amount"
                name="RefundServiceTaxAmount"
                value={formData.RefundServiceTaxAmount}
                onChange={handleChange}
              />
            </Grid>

            {/* Approval Details */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Annexure Approved Status"
                name="AnnexureApprovedStatus"
                value={formData.AnnexureApprovedStatus}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Annexure Member Approved Status"
                name="AnnexureMemberApprovedStatus"
                value={formData.AnnexureMemberApprovedStatus}
                onChange={handleChange}
              />
            </Grid>

            {/* Additional Details */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Attended By"
                name="AttendedBy"
                value={formData.AttendedBy}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Remarks"
                name="Remarks"
                value={formData.Remarks}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Relation Count"
                name="RelationCount"
                value={formData.RelationCount}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Status"
                name="Astatus"
                value={formData.Astatus}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Name of Company"
                name="NameOfCompany"
                value={formData.NameOfCompany}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Company Address"
                name="CompanyAddress"
                value={formData.CompanyAddress}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Company Add"
                name="CompanyAdd"
                value={formData.CompanyAdd}
                onChange={handleChange}
              />
            </Grid>

            {/* Financial Details */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Corpus For Society"
                name="CorpusForSociety"
                value={formData.CorpusForSociety}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Total Percent View"
                name="TotalPercentView"
                value={formData.TotalPercentView}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Payment Schedule Slab Wise"
                name="PaymentScheduleSlabWise"
                value={formData.PaymentScheduleSlabWise}
                onChange={handleChange}
              />
            </Grid>

            {/* Other Details */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Id"
                name="Id"
                value={formData.Id}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Sr No"
                name="SrNo"
                value={formData.SrNo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Particulars"
                name="Particulars"
                value={formData.Particulars}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Date"
                name="Date"
                type="date"
                value={formData.Date}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Due Date"
                name="DueDate"
                type="date"
                value={formData.DueDate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Percent"
                name="Percent"
                value={formData.Percent}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Amount"
                name="Amt"
                value={formData.Amt}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Due Amount"
                name="DueAmt"
                value={formData.DueAmt}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Percent Decrease"
                name="PercentDecrease"
                value={formData.PercentDecrease}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Percent Increase"
                name="PercentIncrease"
                value={formData.PercentIncrease}
                onChange={handleChange}
              />
            </Grid>

            {/* Annexure Details */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Annexure Detail Entries"
                name="AnnexureDetailEntries"
                value={formData.AnnexureDetailEntries}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Annexure Voucher Type"
                name="AnnexureVoucherType"
                value={formData.AnnexureVoucherType}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Particulars Type"
                name="ParticularsType"
                value={formData.ParticularsType}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Due From Installment Letter"
                name="DueFromInstallmentLetter"
                value={formData.DueFromInstallmentLetter}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Include In Payment Schedule"
                name="IncludeInPaymentSchedule"
                value={formData.IncludeInPaymentSchedule}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Service Tax Applicable"
                name="ServiceTaxApplicable"
                value={formData.ServiceTaxApplicable}
                onChange={handleChange}
              />
            </Grid>

            {/* Pricing Details */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Rate Per Sqft"
                name="RatePerSqft"
                value={formData.RatePerSqft}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Number Of Months"
                name="NoOfMonths"
                value={formData.NoOfMonths}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Unused Unit Type"
                name="UnusedUnitType"
                value={formData.UnusedUnitType}
                onChange={handleChange}
              />
            </Grid>

            {/* State Details */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="To State"
                name="Tostate"
                value={formData.Tostate}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
  
       
        <Snackbar
          open={submitSuccess}
          autoHideDuration={6000}
          onClose={handleAlertClose}
        >
          <MuiAlert
            onClose={handleAlertClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Data added successfully!
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={submitError}
          autoHideDuration={6000}
          onClose={handleAlertClose}
        >
          <MuiAlert
            onClose={handleAlertClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            Error adding data. Please try again later.
          </MuiAlert>
        </Snackbar>
      </CardContent>
    </Card>
  );
  
};

export default AddUnitAllocation;
