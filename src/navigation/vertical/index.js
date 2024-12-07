import CubeOutlineIcon from "mdi-material-ui/CubeOutline";
import Login from "mdi-material-ui/Login";
import Table from "mdi-material-ui/Table";
import HomeOutline from "mdi-material-ui/HomeOutline";
import FormatLetterCase from "mdi-material-ui/FormatLetterCase";
import AccountCogOutline from "mdi-material-ui/AccountCogOutline";
import CreditCardOutline from "mdi-material-ui/CreditCardOutline";
import AccountPlusOutline from "mdi-material-ui/AccountPlusOutline";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import PhoneIcon from "@mui/icons-material/Phone";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PaymentsIcon from "@mui/icons-material/Payments";
import LanguageIcon from "@mui/icons-material/Language";
import AlertCircleOutline from "mdi-material-ui/AlertCircleOutline";
import GoogleCirclesExtended from "mdi-material-ui/GoogleCirclesExtended";
import GroupIcon from "mdi-material-ui/AccountGroup";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BusinessIcon from "@mui/icons-material/Business";
import SalesIcon from "mdi-material-ui/CurrencyUsd";

// Updated navigation with new icons
const navigation = () => {
  return [
    {
      title: "Dashboard",
      icon: HomeOutline,  // Replaced with HomeOutline
      path: "/",
    },

    {
      sectionTitle: "User Interface",
    },
    {
      title: "User Management",
      path: "/user-management",
      icon: SupervisorAccountIcon,  // Replaced with SupervisorAccountIcon
      children: [
        {
          title: "All User",
          path: "/user-management",
          icon: GroupIcon,  // Replaced with GroupIcon
        },
      ],
    },

    {
      sectionTitle: "Direct Login",
    },

    {
      title: "Login",
      icon: Login,  // Replaced with Login
      children: [
        {
          title: "Employees Login",
          icon: CubeOutlineIcon,  // Replaced with CubeOutlineIcon
          path: "/AdminLeadLogin",
        },
      ],
    },
   
    {
      sectionTitle: "Booking",
    },

    {
      title: "Booking Form",
      icon: Table,  // Replaced with Table
      children: [
        {
          title: "Add Payment",
          icon: CreditCardOutline,  // Replaced with CreditCardOutline
          path: "/BookingForm/Addpayment",
        },
        {
          title: "Modify History",
          icon: FormatLetterCase,  // Replaced with FormatLetterCase
          path: "/BookingForm/ModifyHistory",
        },
        {
          title: "Report",
          icon: TrendingUpIcon,  // Replaced with TrendingUpIcon
          path: "/BookingForm/Report",
        },
      ],
    },
    {
      icon: PaymentsIcon,  // Replaced with PaymentsIcon
      title: "Loan Report",
      path: "/loanreport",
    },
    {
      sectionTitle: "Companies",
    },
    {
      title: "Manage Company",
      icon: BusinessIcon,  // Replaced with BusinessIcon
      path: "/account-settings",
    },

    {
      sectionTitle: "Project",
    },
    {
      title: "Project Manager",
      icon: WorkOutlineIcon,  // Replaced with WorkOutlineIcon
      path: "/typography",
    },
    {
      title: "Project Info",
      icon: AssignmentIcon,  // Replaced with AssignmentIcon
      path: "/projectinfo",
    },
    {
      title: "Project Details",
      icon: PhoneIcon,  // Replaced with PhoneIcon
      children: [
        {
          title: "Add Project Details",
          icon: CubeOutlineIcon,  
          path: "/project-details",
        },
        {
          title: "List Project Details",
          icon: Table,  // Replaced with Table
          path: "/project-details/ListProjectDetails",
        },
      ],
    },
    {
      title: "Availability List",
      icon: TrendingUpIcon, 
      path: "/availableList",
    },

    {
      sectionTitle: "Cancel Booking",
    },
    {
      icon: PaymentsIcon,  
      title: "Cancel Bookings",
      path: "/bookingcancel",
    },
    {
      title: "Followup Booking Cancel",
      icon: TrendingUpIcon, 
      path: "/cancelfollowup",
      children: [
        {
          title: "All Followup",
          icon: CubeOutlineIcon,  
          path: "/cancelfollowup",
        },
        {
          title: "Today's Followup",
          icon: CubeOutlineIcon,
          path: "/cancelfollowup/Todaycancelfollowup",
        },
        {
          title: "Next Followup",
          icon: CubeOutlineIcon,  // Replaced with CubeOutlineIcon
          path: "/cancelfollowup/Nextcancelfollowup",
        },
        {
          title: "Backlog Followup",
          icon: CubeOutlineIcon,  // Replaced with CubeOutlineIcon
          path: "/cancelfollowup/Backlogcancelfollowup",
        },
      ],
    },

    {
      sectionTitle: "Template",
    },
    {
      icon: CubeOutlineIcon,  // Replaced with CubeOutlineIcon
      title: "Template",
      path: "/template",
    },

    {
      sectionTitle: "Campaign",
    },
    {
      title: "Campaign Manager",
      icon: LanguageIcon,  // Replaced with LanguageIcon
      path: "/campaign",
    },
  ];
};

export default navigation;
