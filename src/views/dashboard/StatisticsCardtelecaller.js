import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import TrendingUp from 'mdi-material-ui/TrendingUp';
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd';
import DotsVertical from 'mdi-material-ui/DotsVertical';
import CellphoneLink from 'mdi-material-ui/CellphoneLink';
import AccountOutline from 'mdi-material-ui/AccountOutline';
import { CircularProgress } from '@mui/material';
import { useCookies } from "react-cookie";

const StatisticsCardtelecaller = () => {
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies(["amr"]); // Define cookies and setCookie function

  
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
  const userid = cookies.amr?.UserID || 'Role';

    const fetchApiData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://apiforcornershost.cubisysit.com/api/api-graph-lead.php?UserID=${userid}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setApiData(data);
      } catch (error) {
        console.error('Error fetching API data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApiData();
  }, []);

  const renderStats = () => {
    if (loading) {
      return (
        <Grid item xs={12} sm={3}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        </Grid>
      );
    }

    const counts = apiData?.counts || {};
    console.log(counts , 'SEE THE COUNT OF TELE<<<<<<<>>>>>>>>>>>');

    return (
      <Grid container spacing={[5, 0]}>
        <Grid item xs={12} sm={2}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              variant='rounded'
              sx={{
                mr: 3,
                width: 44,
                height: 44,
                boxShadow: 3,
                color: 'common.white',
                backgroundColor: 'primary.main',
              }}
            >
              <TrendingUp sx={{ fontSize: '1.75rem' }} />
            </Avatar>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption'>Today's Follow Up</Typography>
              <Typography variant='h6'>{counts.todayFollowup ?? '--'}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              variant='rounded'
              sx={{
                mr: 3,
                width: 44,
                height: 44,
                boxShadow: 3,
                color: 'common.white',
                backgroundColor: 'success.main',
              }}
            >
              <AccountOutline sx={{ fontSize: '1.75rem' }} />
            </Avatar>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption'>Backlog Lead</Typography>
              <Typography variant='h6'>{counts.backlogFollowup ?? '--'}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              variant='rounded'
              sx={{
                mr: 3,
                width: 44,
                height: 44,
                boxShadow: 3,
                color: 'common.white',
                backgroundColor: 'warning.main',
              }}
            >
              <CellphoneLink sx={{ fontSize: '1.75rem' }} />
            </Avatar>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption'>Next Follow Up</Typography>
              <Typography variant='h6'>{counts.nextFollowup ?? '--'}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              variant='rounded'
              sx={{
                mr: 3,
                width: 44,
                height: 44,
                boxShadow: 3,
                color: 'common.white',
                backgroundColor: 'info.main',
              }}
            >
              <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
            </Avatar>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption'>Transfer To Sales</Typography>
              <Typography variant='h6'>{counts.transfertooppo ?? '--'}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              variant='rounded'
              sx={{
                mr: 3,
                width: 44,
                height: 44,
                boxShadow: 3,
                color: 'common.white',
                backgroundColor: 'error.main',
              }}
            >
              <AccountOutline sx={{ fontSize: '1.75rem' }} />
            </Avatar>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption'>Not Interested</Typography>
              <Typography variant='h6'>{counts.notInterested ?? '--'}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              variant='rounded'
              sx={{
                mr: 3,
                width: 44,
                height: 44,
                boxShadow: 3,
                color: 'common.white',
                backgroundColor: 'info.main',
              }}
            >
              <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
            </Avatar>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='caption'>Total Follow Ups</Typography>
              <Typography variant='h6'>{counts.totalFollowup ?? '--'}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    );
  };

  return (
    <Card>
      <CardHeader
        title='Statistics Card'
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              Total {apiData ? apiData?.counts.totalFollowup : '--'} follow ups
            </Box>{' '}
            😎 this month
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important',
          },
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        {renderStats()}
      </CardContent>
    </Card>
  );
};

export default StatisticsCardtelecaller;
