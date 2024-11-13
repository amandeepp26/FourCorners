//verticle side bar
import CubeOutlineIcon from "mdi-material-ui/CubeOutline";
// ** Icon imports
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import HomeOutline from "mdi-material-ui/HomeOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PaymentsIcon from "@mui/icons-material/Payments";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
const SalesManagerNavigation = () => {
  return [
    {
      title: "Dashboard",
      icon: HomeOutline,
      path: "/SaleDashboard",
    },

    {
      title: "Project Manager",
      icon: AssignmentIcon,
      path: "/typography",
    },
    {
      title: "Project Details ",
      icon: AssignmentIcon,
      path: "/MainProjectDetails",
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
        {
          title: "Not Interested",
          icon: CubeOutlineIcon,
          path: "/opportunity/NotInterested",
        },
      ],
    },
    {
      title: "Availibilty List",
      icon: TrendingUpIcon,
      path: "/availableList",
     
    },
    {
      sectionTitle: "Transfered to Booking",
    },

    {
      title: "Transfer Booking",
      icon: ContactPhoneIcon,
      path: "/opportunity/BookingTransfer",
    },
    {
      sectionTitle: "All Booking Cancel",
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
      sectionTitle: "Post Sales",
    },

    {
      title: "Payment Reminder",
      icon: TrendingUpIcon,
      path: "/opportunity",
      children: [
       
        {
          title: "Open Payment",
          icon: CubeOutlineIcon,
          path: "/payment-reminder/Openpayment",
        },
        {
          title: "Todays payment",
          icon: CubeOutlineIcon,
          path: "/payment-reminder/TodaysFollowupPayment",
        },
        {
          title: "Backlog Payment",
          icon: CubeOutlineIcon,
          path: "/payment-reminder/BacklogPaymentReminder",
        },
      ],
    },


    {
      title: "Loan Reminder ",
      icon: TrendingUpIcon,
      // path: "/opportunity",
      children: [
        {
          title: "Todays payment ",
          icon: CubeOutlineIcon,
          path: "/LoanReminder/TodaysReminder",
        },
        {
          title: "Open Loan Payment ",
          icon: CubeOutlineIcon,
          path: "/LoanReminder/OpenReminder",
        },
        {
          title: "Backlog Loan Payment",
          icon: CubeOutlineIcon,
          path: "/LoanReminder/BacklogReminder",
        },
      ],
    },
  ];
};

export default SalesManagerNavigation;
