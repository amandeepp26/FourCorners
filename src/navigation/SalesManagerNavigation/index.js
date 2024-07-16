//verticle side bar
import CubeOutlineIcon from "mdi-material-ui/CubeOutline";
// ** Icon imports
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import HomeOutline from "mdi-material-ui/HomeOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import AssignmentIcon from "@mui/icons-material/Assignment";
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
      title: "Project Details",
      icon: AssignmentIcon,
      path: "/sales-project-details",
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
      path: "/opportunity",
      children: [
        {
          title: "Heaven Palace",
          icon: CubeOutlineIcon,
          path: "/opportunity",
        },
        {
          title: "Heaven Palace II",
          icon: CubeOutlineIcon,
          path: "/opportunity",
        },
      ],
    },

    {
      title: "Post Sales",
      icon: TrendingUpIcon,
      path: "/opportunity",
      children: [
        {
          title: "Todays payment ",
          icon: CubeOutlineIcon,
          path: "/opportunity",
        },
        {
          title: "Open Payment",
          icon: CubeOutlineIcon,
          path: "/opportunity",
        },
        {
          title: "Backlog Payment ",
          icon: CubeOutlineIcon,
          path: "/opportunity",
        },
      ],
    },
  ];
};

export default SalesManagerNavigation;
