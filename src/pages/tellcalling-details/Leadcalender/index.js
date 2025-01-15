import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress, Alert, Typography, Box, IconButton } from '@mui/material';
import axios from 'axios';
import AddTellecallingDetails from 'src/views/add-tellecallingDetails/AddTellecallingDetails';
import MyleadSidebar from 'src/views/TellecallingSidebar/Mylead/MyleadSidebar';
import Listmylead from 'src/views/list-tellecalling/Mylead/Listmylead';
import HistoryTelecalling from 'src/views/history-telecalling/HistoryTelecalling';
import PieChartIcon from '@mui/icons-material/PieChart';
import Card from '@mui/material/Card'
import TrendingUp from 'mdi-material-ui/TrendingUp'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import CellphoneLink from 'mdi-material-ui/CellphoneLink'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import CardContent from '@mui/material/CardContent'

import AddIcon from "@mui/icons-material/Add";
import CardHeader from '@mui/material/CardHeader'
import Avatar from '@mui/material/Avatar'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CancelIcon from '@mui/icons-material/Cancel';
import OpenLeadSidebar from 'src/views/TellecallingSidebar/OpenLead/OpenLeadSidebar';
import ListOpenLead from 'src/views/list-tellecalling/OpenLead/ListOpenLead';
import LeadCalnder from 'src/views/calender/LeadCalnder';


const salesData = [
    {
      stats: '245k',
      title: 'Sales',
      color: 'primary',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: '12.5k',
      title: 'Customers',
      color: 'success',
      icon: <AccountOutline sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: '1.54k',
      color: 'warning',
      title: 'Products',
      icon: <CellphoneLink sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: '$88k',
      color: 'info',
      title: 'Revenue',
      icon: <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
    }
  ]
  
  const pieData = [
    { name: 'Sales', value: 245000, color: '#3f51b5' },
    { name: 'Customers', value: 12500, color: '#4caf50' },
    { name: 'Products', value: 1540, color: '#ff9800' },
    { name: 'Revenue', value: 88000, color: '#00acc1' }
  ]
  
  
  const renderStats = () => {
    return salesData.map((item, index) => (
      <Grid item xs={12} sm={3} key={index}>
        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            variant='rounded'
            sx={{
              mr: 3,
              width: 44,
              height: 44,
              boxShadow: 3,
              color: 'common.white',
              backgroundColor: `${item.color}.main`
            }}
          >
            {item.icon}
          </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='caption'>{item.title}</Typography>
            <Typography variant='h6'>{item.stats}</Typography>
          </Box>
        </Box>
      </Grid>
    ))
  }

const StatisticsCard = () => {
    return (
      <Card>
        <CardHeader
          title='Statistics Card'
          action={
            <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
              <DotsVertical />
            </IconButton>
          }
         
          titleTypographyProps={{
            sx: {
              mb: 2.5,
              lineHeight: '2rem !important',
              letterSpacing: '0.15px !important'
            }
          }}
        />
        <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
          <Grid container spacing={[5, 0]}>
            {renderStats()}
          </Grid>
        </CardContent>
      </Card>
    )
  }


const OpenLead = () => {
    return (

        <>
        <Grid item xs={12}  >
        <StatisticsCard />
      </Grid>

    <Grid item xs={12} md={12} mt={20} >
    <LeadCalnder />
  </Grid>
  </>
  );
};

export default OpenLead;
