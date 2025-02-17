import React, { useState } from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import PhoneIcon from '@mui/icons-material/Phone';
import ContactsIcon from '@mui/icons-material/Contacts';
import EventIcon from '@mui/icons-material/Event';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useCookies } from "react-cookie";

const BuyNowButton = () => {
  const [open, setOpen] = useState(false);
  const [cookies] = useCookies(["amr"]);


  const handleOpportunity = () => {
    window.location.href = "/opportunity/";
  };

  const handleTelecalling = () => {
    window.location.href = "/tellcalling-details/";
  };

  const handleContact = () => {
    window.location.href = "/contact/";
  };
  const userName = cookies.amr?.FullName || 'User';
  const roleName = cookies.amr?.RoleName || 'Admin';
  const userid = cookies.amr?.UserID || 'USERID';
  console.log(userid, 'ye dekh roleide');
  // Define actions based on userid condition
  const actions = userid == 1 ? [
    { icon: <ContactsIcon />, name: 'Contact', onClick: handleContact },
    { icon: <PhoneIcon />, name: 'Leads', onClick: handleTelecalling },
    { icon: <TrendingUpIcon />, name: 'Opportunity', onClick: handleOpportunity },
    { icon: <EventIcon />, name: 'Booking' },
  ] : [
    { icon: <ContactsIcon />, name: 'Contact', onClick: handleContact },
    { icon: <PhoneIcon />, name: 'Leads', onClick: handleTelecalling },
  ];

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  
  return (
    <Box
      className='upgrade-to-pro-button mui-fixed'
      sx={{ right: theme => theme.spacing(20), bottom: theme => theme.spacing(10), zIndex: 11, position: 'fixed' }}
    >
      {/* <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial> */}
    </Box>
  );
};

export default BuyNowButton;
