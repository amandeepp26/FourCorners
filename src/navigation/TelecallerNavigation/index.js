//verticle side bar
import CubeOutlineIcon from "mdi-material-ui/CubeOutline";
// ** Icon imports
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import HomeOutline from "mdi-material-ui/HomeOutline";
import PhoneIcon from "@mui/icons-material/Phone";
const TelecallerNavigation = () => {
  return [
    {
      title: "Dashboard",
      icon: HomeOutline,
      path: "/Telecalling",
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
      sectionTitle: "Transfered to opportunity",
    },

    {
      title: "Transfer Opportunity",
      icon: ContactPhoneIcon,
      path: "/tellcalling-details/opportunitytransfer",
    },


   
  ];
};

export default TelecallerNavigation;
