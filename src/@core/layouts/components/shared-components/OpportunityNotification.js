import React, { useState, Fragment, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Chip,
  Button,
  IconButton,
  Menu as MuiMenu,
  Avatar as MuiAvatar,
  MenuItem as MuiMenuItem,
  Badge,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useCookies } from "react-cookie";
import BellOutline from 'mdi-material-ui/BellOutline';
import PerfectScrollbarComponent from 'react-perfect-scrollbar';
import { useRouter } from 'next/router';
import CancelIcon from "@mui/icons-material/Cancel";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from 'src/firebase';

// Styled components
const Menu = styled(MuiMenu)(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}));

const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const styles = {
  maxHeight: 349,
  '& .MuiMenuItem-root:last-of-type': {
    border: 0
  }
};

const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  ...styles
});

const Avatar = styled(MuiAvatar)({
  width: '2.375rem',
  height: '2.375rem',
  fontSize: '1.125rem'
});

const MenuItemTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  flex: '1 1 100%',
  overflow: 'hidden',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginBottom: theme.spacing(0.75)
}));

const MenuItemSubtitle = styled(Typography)({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
});

const OpportunityNotification = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [cookies] = useCookies(["amr"]);
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'));
  const router = useRouter();


  // useEffect(() => {
  //   if (typeof window !== 'undefined' && messaging) {
  //     async function requestPermission() {
  //       try {
  //         const permission = await Notification.requestPermission();
  //         if (permission === 'granted') {
  //           const token = await getToken(messaging, { vapidKey: 'BAbIhsXFZd4XZZfjVTiwZQmX2fw_9coO2ab3yWaxX6mVisfua4ypPRDr_D8tJW56Jj29V2kJLUIi0CcQHld-3IE' });
  //           console.log('Generted Token: ??????????????', token);
  //         } else if (permission === 'denied') {
  //           alert('You denied the notification.');
  //         }
  //       } catch (error) {
  //         console.error('Error getting token:', error);
  //       }
  //     }

  //     requestPermission();

  //     onMessage(messaging, (payload) => {
  //       console.log('Message received:', payload);
  //       new Notification(payload.notification.title, {
  //         body: payload.notification.body,
  //       });
  //     });
  //   }
  // }, []);

  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.play();

  };




  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData(); // Fetch data every 60 seconds (60000 ms)
    }, 1000);
  
    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, []);
  

  const fetchData = async () => {
    const userid = cookies.amr?.UserID || 'Role';

    try {
      const response = await axios.get(
        `https://apiforcorners.cubisysit.com/api/api-fetch-convtooppo.php?UserID=${userid}`
      );
      console.log("Response:", response.data);

      if (Array.isArray(response.data.data)) {
        const newNotifications = response.data.data;

        if (newNotifications.length > notifications.length) {
          playNotificationSound();
        }

        setNotifications(newNotifications);
      } else {
        console.error("Expected an array of notifications");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };



  const handleOpportunity = () => {
    window.location.href = "/opportunity/";
  };

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDropdownClose = (notification) => {
    localStorage.setItem('selectedNotification', JSON.stringify(notification));
    localStorage.setItem('showAddDetails', 'true');
    router.push('/opportunity');
    handleClose();
  };

  const ScrollWrapper = ({ children }) => {
    if (hidden) {
      return <Box sx={{ ...styles, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>;
    } else {
      return (
        <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
      );
    }
  };

  return (
    <Fragment>
      <IconButton
        color='inherit'
        aria-haspopup='true'
        onClick={handleDropdownOpen}
        aria-controls='customized-menu'
      >
        <Badge
          badgeContent={notifications.length}
          color='error'
          overlap='circular'
        >
          <BellOutline />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem disableRipple>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ fontWeight: 600 }}>Notifications</Typography>
            <IconButton
              aria-label="cancel"
              onClick={handleClose}
              sx={{ position: "absolute", top: 6, right: 10 }}
            >
              <CancelIcon sx={{ color: "red" }} />
            </IconButton>
          </Box>
        </MenuItem>
        <ScrollWrapper>
          {notifications.map((notification, index) => (
            <MenuItem key={index} onClick={() => handleDropdownClose(notification)}>
              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <Avatar alt='notification' src='/images/avatars/3.png' />
                <Box
                  sx={{
                    mx: 4,
                    flex: '1 1',
                    display: 'flex',
                    overflow: 'hidden',
                    flexDirection: 'column',
                  }}
                >
                  <MenuItemTitle>
                    Name: {notification.TitleName} {notification.CName}
                  </MenuItemTitle>
                  <MenuItemSubtitle variant='body2'>
                    Date: {notification.CreateDate}
                  </MenuItemSubtitle>
                  <MenuItemSubtitle variant='body2'>
                    Converted By: {notification.Name}
                  </MenuItemSubtitle>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </ScrollWrapper>
        <MenuItem
          disableRipple
          sx={{ py: 3.5, borderBottom: 0, borderTop: theme => `1px solid ${theme.palette.divider}` }}
        >
          <Button fullWidth variant='contained' onClick={handleDropdownClose}>
            Read All Notifications
          </Button>
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default OpportunityNotification;
