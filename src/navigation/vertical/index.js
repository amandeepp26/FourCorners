//verticle side bar 
import CubeOutlineIcon from "mdi-material-ui/CubeOutline";
// ** Icon imports
import Login from "mdi-material-ui/Login";
import Table from "mdi-material-ui/Table";
import CubeOutline from "mdi-material-ui/CubeOutline";
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
const navigation = () => {
  return [
    {
      title: "Dashboard",
      icon: HomeOutline,
      path: "/",
    },

    {
      sectionTitle: "User Interface",
    },
    {
      title: "User Management",
      path: "/user-management",
      icon: SupervisorAccountIcon,
      children: [
        {
          title: "All User",
          path: "/user-management",
          icon: GroupIcon,
        },
      ],
    },

    {
      sectionTitle: "Direct Login",
    },

    {
      title: " Login",
      icon: PhoneIcon,
      // path: "/tellcalling-details",
      children: [
        {
          title: "Employees Login",
          icon: CubeOutlineIcon,
          path: "/AdminLeadLogin",
        },

      ],
    },
   
   
    {
      sectionTitle: "Booking",
    },
    // {
    //   title: "Booking form",
    //   icon: BusinessIcon,
    //   path: "/BookingForm",
    // },


    {
      title: "Booking Form",
      icon: PhoneIcon,
      // path: "/tellcalling-details",
      children: [
        {
          title: "Add Booking Details",
          icon: CubeOutlineIcon,
          path: "/BookingForm",
        },
      
        {
          title: "Add payment",
          icon: CubeOutlineIcon,
          path: "/BookingForm/Addpayment",
        },


        {
          title: "Modify History",
          icon: CubeOutlineIcon,
          path: "/BookingForm/ModifyHistory",
        },

        {
          title: "Report",
          icon: CubeOutlineIcon,
          path: "/BookingForm/Report",
        },
   
      ],
    },
    {
      sectionTitle: "Companies",
    },
    {
      title: "Manage Company",
      icon: BusinessIcon,
      path: "/account-settings",
    },
    {
      sectionTitle: "Project",
    },
    {
      title: "Project Manager",
      icon: AssignmentIcon,
      path: "/typography",
    },

    {
      title: "Project Details",
      icon: PhoneIcon,
      // path: "/tellcalling-details",
      children: [
        {
          title: "Add project Details",
          icon: CubeOutlineIcon,
          path: "/project-details",
        },
        {
          title: "List Project Details",
          icon: CubeOutlineIcon,
          path: "/project-details/ListProjectDetails",
        },
   
     
      ],
    },
    {
      title: "Availibilty List",
      icon: TrendingUpIcon,
      path: "/availableList",
     
    },
    // {
    //   title: "Project Details",
    //   icon: AssignmentIcon,
    //   path: "/project-details",
    // },
    {
      sectionTitle: "Data Management",
    },

    {
      title: "Contacts",
      icon: ContactPhoneIcon,
      path: "/contact",
    },

    {
      title: "Lead",
      icon: PhoneIcon,
      path: "/tellcalling-details",
      children: [
        {
          title: "All Lead",
          icon: CubeOutlineIcon,
          path: "/tellcalling-details",
        },
        {
          title: "Todays Followup",
          icon: CubeOutlineIcon,
          path: "/tellcalling-details/Mylead",
        },
        {
          title: "Open Lead",
          icon: CubeOutlineIcon,
          path: "/tellcalling-details/OpenLead",
        },
        {
          title: "Backlog Pending",
          icon: CubeOutlineIcon,
          path: "/tellcalling-details/Backlog",
        },
        // {
        //   title: "Person Wise Search",
        //   icon: CubeOutlineIcon,
        //   path: "/AdminLeadLogin",
        // },
        {
          title: "Calendar",
          icon: CubeOutlineIcon,
          path: "/tellcalling-details/Leadcalender",
        },
        {
          title: "Not Interested",
          icon: CubeOutlineIcon,
          path: "/tellcalling-details/NotInterested",
        },
      ],
    },

    {
      title: "Opportunity",
      icon: TrendingUpIcon,
      path: "/opportunity",
      children: [
        {
          title: "All Opportunity",
          icon: CubeOutlineIcon,
          path: "/opportunity",
        },
        {
          title: "Todays Followup",
          icon: CubeOutlineIcon,
          path: "/opportunity/MyOpportunity",
        },
        {
          title: "Backlog Pending",
          icon: CubeOutlineIcon,
          path: "/opportunity/BacklogOpportunity",
        },
        {
          title: "Open Opportunity",
          icon: CubeOutlineIcon,
          path: "/opportunity/OpenOpportunity",
        },
        {
          title: "Calendar",
          icon: CubeOutlineIcon,
          path: "/opportunity/OpportunityCalender",
        },
        // {
        //   title: "Person Wise Search",
        //   icon: CubeOutlineIcon,
        //   path: "/AdminLeadLogin",
        // },
        {
          title: "Not Interested",
          icon: CubeOutlineIcon,
          path: "/opportunity/NotInterested",
        },
      ],
    },

    {
      sectionTitle: "All Booking Cancel",
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
          title: "Todays Followup",
          icon: CubeOutlineIcon,
          path: "/cancelfollowup/Todaycancelfollowup",
        },  {
          title: "Next Followup",
          icon: CubeOutlineIcon,
          path: "/cancelfollowup/Nextcancelfollowup",
        },  {
          title: "Backlog Followup",
          icon: CubeOutlineIcon,
          path: "/cancelfollowup/Backlogcancelfollowup",
        },
      ],
    },
    {
      sectionTitle: "Enquiries",
    },
    {
      icon: CubeOutlineIcon,
      title: "Template",
      path: "/template",
    },
    {
      title: "Enquiry Source",
      icon: LanguageIcon,
      path: "/enquiry-source",
    },
    {
      sectionTitle: "Campaign",
    },
    {
      title: "Campaign Manager",
      icon: LanguageIcon,
      path: "/campaign",
    },
    {
      sectionTitle: "Sales",
    },
    {
      icon: PaymentsIcon,
      title: "Installment",
      path: "/installment",
    },
    {
      icon: CubeOutlineIcon,
      title: "Project Finance Approval",
      path: "/project-finance",
    },
    {
      icon: CubeOutlineIcon,
      title: "Stamp Duty Master",
      path: "/stamp-duty",
    },
    {
      icon: CubeOutlineIcon,
      title: "Additional Charges",
      path: "/additional-charges",
    },
    {
      icon: CubeOutlineIcon,
      title: "Channel Partner",
      path: "/channel-partner",
    },
    {
      icon: CubeOutlineIcon,
      title: "Car Parking",
      path: "/car-parking",
    },
    {
      icon: CubeOutlineIcon,
      title: "Unit Allocation",
      path: "/unitallocation",
    },
    {
      icon: CubeOutlineIcon,
      title: "Receipt",
      path: "/receipt",
    },
  ];
};

export default navigation;
