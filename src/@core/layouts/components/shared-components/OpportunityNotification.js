import React, { useState, Fragment, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  IconButton,
  Menu as MuiMenu,
  Avatar as MuiAvatar,
  MenuItem as MuiMenuItem,
  Badge,
  Typography
} from '@mui/material';
import Swal from 'sweetalert2';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useCookies } from "react-cookie";
import BellOutline from 'mdi-material-ui/BellOutline';
import TransferIcon from '@mui/icons-material/TransferWithinAStation';
import CancelIcon from "@mui/icons-material/Cancel";
import { useRouter } from 'next/router';

const Menu = styled(MuiMenu)(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4)
  }
}));

const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  padding: theme.spacing(2)
}));

const Avatar = styled(MuiAvatar)({
  width: '2.375rem',
  height: '2.375rem'
});

const OpportunityNotification = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [cookies] = useCookies(["amr"]);
  const [userSales, setUserSales] = useState([]);
  const [transferAnchorEl, setTransferAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'));
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchData = async () => {
    const userid = cookies.amr?.UserID || 'Role';
    try {
      const response = await axios.get(`https://apiforcornershost.cubisysit.com/api/api-fetch-convtooppo.php?UserID=${userid}`);
      if (Array.isArray(response.data.data)) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchUserSales = async () => {
    try {
      const response = await axios.get(`https://apiforcornershost.cubisysit.com/api/api-fetch-usersales.php`);
      setUserSales(response.data.data || []);
    } catch (error) {
      console.error("Error fetching user sales:", error);
    }
  };

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTransferClick = (event, notification) => {
    setSelectedNotification(notification);
    setTransferAnchorEl(event.currentTarget);
    fetchUserSales();
  };

  const handleTransferClose = () => {
    setTransferAnchorEl(null);
  };

  const handleSelectUserSale = async (sale) => {
    if (!selectedNotification?.ConvertID || !sale?.UserID) {
      console.error("Missing ConvertID or UserID");
      return;
    }
  
    try {
      await axios.post(
        'https://proxy-forcorners.vercel.app/api/proxy/api-update-convertopportunity.php',
        {
          ConvertID: selectedNotification.ConvertID,
          UserID: sale.UserID
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      // Show success message after successful update
      Swal.fire({
        icon: 'success',
        title: 'Opportunity Updated!',
        text: 'The opportunity has been successfully updated.',
        confirmButtonText: 'OK'
    }).then(() => {
      fetchData();
      window.location.reload(); // Call fetchData after success alert confirmation
    });
  
    } catch (error) {
      console.error("Error updating opportunity:", error);
    } finally {
      handleTransferClose();
    }
  };
  const handleDropdownClose = (notification) => {
    localStorage.setItem('selectedNotification', JSON.stringify(notification));
    localStorage.setItem('showAddDetails', 'true');
    router.push('/opportunity');
    handleClose();
  };
  return (
    <Fragment>
      <IconButton color='inherit' onClick={handleDropdownOpen}>
        <Badge badgeContent={notifications.length} color='error'>
          <BellOutline />
        </Badge>
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem>
          <Typography fontWeight={600}>Notifications</Typography>
          <IconButton onClick={handleClose} sx={{ position: "absolute", top: 6, right: 10 }}>
            <CancelIcon sx={{ color: "red" }} />
          </IconButton>
        </MenuItem>

        {notifications.map((notification, index) => (
          <MenuItem  key={index} onClick={() => handleDropdownClose(notification)}>
            <Avatar alt='notification' src='/images/avatars/3.png' />
            <Box sx={{ ml: 2, flex: 1 }}>
              <Typography fontWeight={600}>Name: {notification.TitleName} {notification.CName}</Typography>
              <Typography variant='body2'>Date: {notification.CreateDate}</Typography>
              <Typography variant='body2'>Converted By: {notification.Name}</Typography>
            </Box>
            <IconButton onClick={(event) => handleTransferClick(event, notification)}>
              <TransferIcon />
            </IconButton>
          </MenuItem>
        ))}
      </Menu>

      <Menu anchorEl={transferAnchorEl} open={Boolean(transferAnchorEl)} onClose={handleTransferClose}>
        {userSales.map((sale, index) => (
          <MenuItem key={index} onClick={() => handleSelectUserSale(sale)}>
            {sale.Name}
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  );
};

export default OpportunityNotification;
