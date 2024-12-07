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
import Opportunitycalender from 'src/views/OpportunityCalender/Opportunitycalender';
import StatisticsCardsales from "src/views/dashboard/StatisticsCardsales";


const OpenOpportunity = () => {
    return (

        <>
        <Grid item xs={12}>
          <StatisticsCardsales />
        </Grid>

    <Grid item xs={12} md={12} mt={20} >
    <Opportunitycalender />
  </Grid>
  </>
  );
};

export default OpenOpportunity;
