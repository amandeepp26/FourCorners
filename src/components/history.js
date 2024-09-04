import { styled } from '@mui/system';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, TextField, IconButton, Grid, Menu, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import Swal from 'sweetalert2';
import { useCookies } from 'react-cookie';

// Styled component for Paper
const CustomPaper = styled(Paper)({
    padding: '6px 16px',
    maxWidth: '600px',
    margin: '0 auto',   // Center the cards
});

// Custom styling for the Timeline
const CustomTimeline = styled(Timeline)({
    width: '100%',
    margin: '0 auto',
});

// SVG Image URL or import
const NoDataSVG = 'https://path-to-your-svg-image.svg'; // Replace with your SVG URL or import



const HistoryComponent = ({ item }) => {

    const [cookies, setCookie, removeCookie] = useCookies(["amr"]);
    const intialName = {
        Tid: "",
        CurrentUpdateID: "",
        NextFollowUpDate: "",
        NextFollowUpTime: "",
        Interest: "",
        Note: "",
        CreateUID: cookies.amr?.UserID || 1,
    }

    const [rowData, setRowDataToUpdate] = useState([]);
    const [formData, setFormData] = useState(intialName);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(false);


    useEffect(() => {
       
        const fetchData = async () => {
            
            if (!item) return;
            try {
                const apiUrl = `https://apiforcorners.cubisysit.com/api/api-fetch-nextfollowup.php?Tid=${item}`;
                const response = await axios.get(apiUrl);
                if (response.data.status === 'Success') {
                   
                    console.log(response.data.data, 'Single telecalling data fetched Lol');
                    setRowDataToUpdate(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching single telecalling data:', error);
            }
        };
        fetchData();
    }, [item]);

    return (
        <Box>
            <Box  >
                <CustomTimeline align="alternate" >
                    {rowData.length > 0 ? rowData.map((data, index) => (
                        <TimelineItem key={index} sx={{display:'flex',justifyContent:'center'}}>
                            <TimelineOppositeContent>
                                <Typography variant="body2" color="textSecondary">
                                    {data.NextFollowUpDate}
                                </Typography>
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot style={{ backgroundColor: 'green' }}>
                                    <CheckCircleIcon style={{ color: 'white' }} />
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                                <CustomPaper elevation={3}>
                                    <Typography variant="h6" component="h1" style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ display: 'flex', alignItems: 'center' }}>
                                            <PersonIcon style={{ marginRight: 8 }} />
                                            <span style={{ fontWeight: 'bold' }}>
                                                {data.UserRole}
                                            </span>
                                        </span>
                                        <Typography variant="body2" color="textSecondary" style={{ marginLeft: '16px' }}>
                                            Time: {data.NextFollowUpTime}
                                        </Typography>
                                    </Typography>  
                                    <Typography variant="body2">Note:  {data.Note} </Typography>
                                </CustomPaper>
                            </TimelineContent>
                        </TimelineItem>
                    )) : (
                        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="50vh">
                            <Typography variant="h6" color="textSecondary" style={{ marginTop: '16px' }}>
                                No data available
                            </Typography>
                        </Box>
                    )}
                </CustomTimeline>
              
            </Box>
        </Box>
    );
};


export default HistoryComponent;
