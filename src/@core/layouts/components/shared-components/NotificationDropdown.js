import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Menu as MuiMenu,
  Avatar as MuiAvatar,
  MenuItem as MuiMenuItem,
  Typography ,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PerfectScrollbarComponent from 'react-perfect-scrollbar';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/router';
import { useCookies } from "react-cookie";

// ** Styled components
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

const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  maxHeight: 349,
  '& .MuiMenuItem-root:last-of-type': {
    border: 0
  }
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

const NotificationDropdown = ({
  anchorEl,
  handleDropdownClose,
  anchorBooking,
  handleDropdownBookingClose,
  handleConvertBooking,
  notifications,
  notificationsBooking,
  setNotifications,
  setNotificationsBooking
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();



  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData();
    fetchDataBooking();
    }, 1000);
  
    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, []);



  const [cookies, setCookie] = useCookies(["amr"]);
  const userid = cookies.amr?.UserID || 'Role';

  const fetchDataBooking = async () => {
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-convertbooking.php?UserID=${userid}`
      );
      if (Array.isArray(response.data.data)) {
        const newNotificationsBooking = response.data.data;
        if (newNotificationsBooking.length > notificationsBooking.length) {
          setNotificationsBooking(newNotificationsBooking);
        }
      } 
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-notification.php`
      );
      if (Array.isArray(response.data.data)) {
        const newNotifications = response.data.data;
        if (newNotifications.length > notifications.length) {
          setNotifications(newNotifications);
        }
      } else {
        console.error("Expected an array of notifications");
      }
      setLoading(false);
    } catch (error) {
      // console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };

  const handleReadAllNotifications = () => {
    router.push('/notification');
    handleDropdownClose();
  };

  const handleBookingReadAllNotifications = (notification) => {
    // Store the notification data in local storage
    localStorage.setItem('selectedNotification', JSON.stringify(notification));
    // Redirect to the BookingForm page
    router.push('/BookingForm');
    handleDropdownBookingClose();
  };
  const handleCancelNotification = async (notificationId) => {
    try {
      // Send cancellation request to the server
      await axios.post(
        `https://proxy-forcorners.vercel.app/api/proxy/api-update-notification.php`,
        { notificationId }
      );
  
      // Remove the notification from the state optimistically (if you want)
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.notificationId !== notificationId)
      );
  
      // Re-fetch notifications to get the updated list
      await fetchData(); // Call this to get updated notifications from the server
  
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };
  
  return (
    <Fragment>
    <Menu
      id='notification-menu'
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleDropdownClose}
    >
      <Box sx={{ padding: 2 }}>
        <Typography variant='h6'>Notifications</Typography>
      </Box>
      <PerfectScrollbar>
      {loading ? (
        <Box sx={{ padding: 2 }}>
          <Typography>Loading...</Typography>
        </Box>
      ) : (
        notifications.map((notification, index) => (
          <MenuItem key={index} sx={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: 1, marginBottom:2}}>
            <Avatar src='/images/avatars/1.png' alt='Avatar' />
            <Box sx={{ marginLeft: 2, flex: 1 }}>
              <MenuItemTitle sx={{ fontSize: 12, wordWrap: 'break-word', whiteSpace: 'normal' }}>
                Contact: {notification.Details?.CName}
              </MenuItemTitle>
              <MenuItemSubtitle sx={{ fontSize: 10 }}>
                Created By: {notification.Name}
              </MenuItemSubtitle>
              <MenuItemSubtitle sx={{ fontSize: 10 }}>
                Created IN: {notification.TableName}
              </MenuItemSubtitle>
              <MenuItemSubtitle sx={{ fontSize: 10 }}>
                Created Date: {notification.CreatedDate}
              </MenuItemSubtitle>
            </Box>
            <IconButton onClick={() => handleCancelNotification(notification.notificationId)} size='small'>
              <CloseIcon fontSize='small' sx={{ color: 'red' }} />
            </IconButton>
          </MenuItem>
        ))
      )}
      {error && (
        <Box sx={{ padding: 2 }}>
          <Typography color='error'>Error fetching notifications</Typography>
        </Box>
      )}
     
      </PerfectScrollbar>
       <MenuItem onClick={handleReadAllNotifications}>
        <Button variant='outlined' fullWidth>
          View All Notifications
        </Button>
      </MenuItem>
    </Menu>
 

      <Menu
        id='booking-menu'
        anchorEl={anchorBooking}
        open={Boolean(anchorBooking)}
        onClose={handleDropdownBookingClose}
      >
        <PerfectScrollbar>
          <Box sx={{ padding: 2 }}>
            <Typography variant='h6'>Booking Notifications</Typography>
          </Box>
          {loading ? (
            <Box sx={{ padding: 2 }}>
              <Typography>Loading...</Typography>
            </Box>
          ) : (
            notificationsBooking.map((notification, index) => (
              <MenuItem key={index} sx={{marginBottom:2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',borderRadius: 1}}>
                <Avatar src='/images/avatars/1.png' alt='Avatar' />
                <Box sx={{ marginLeft: 2, flex: 1  }} onClick={() => handleBookingReadAllNotifications(notification)}>

                  <MenuItemTitle sx={{ fontSize:16 }} >Booking Name : {notification?.TitleName}{notification?.CName}</MenuItemTitle>
                  <MenuItemSubtitle sx={{ fontSize:12 }}>Transfer By : {notification?.UserName} </MenuItemSubtitle>
                  <MenuItemSubtitle sx={{ fontSize:12 }}>Transfer Date: {notification?.CreateDate} </MenuItemSubtitle>

                </Box>
              </MenuItem>
            ))
          )}
          {error && (
            <Box sx={{ padding: 2 }}>
              <Typography color='error'>Error fetching booking notifications</Typography>
            </Box>
          )}
        </PerfectScrollbar>
       
      </Menu>
    </Fragment>
  );
};

export default NotificationDropdown;
