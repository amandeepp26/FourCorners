import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import { Grid } from 'mdi-material-ui';
import { Button } from '@mui/material';

const CustomerDetails = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://apiforcornershost.cubisysit.com/api/api-fetch-customermaster.php');
      console.log('API Response:', response.data);
      setRows(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error fetching data: {error.message}</Typography>;
  }

  return (
    <Card>
   

      <TableContainer>
    
   

        <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
          <TableHead>
            <TableRow>
              <TableCell>Customer ID</TableCell>
              <TableCell>Title ID</TableCell>
              <TableCell>Mobile No</TableCell>
              <TableCell>Party Name</TableCell>
              <TableCell>Member Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>CLocation</TableCell>
              
              {/* Add more table headers here */}
            </TableRow>
        
          </TableHead>
          
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ fontWeight: 500 }}>{row.CompanyID}</Typography>
                     
                    </Box>
                  </TableCell>
                  <TableCell>{row.CompanyID}</TableCell>
                  <TableCell>{row.TitleID}</TableCell>
                  <TableCell>{row.MobileNo}</TableCell>
                  <TableCell>{row.PartyName}</TableCell>
                  <TableCell>{row.MemberName}</TableCell>
                  <TableCell>{row.Email}</TableCell>
                  <TableCell>{row.CLocation}</TableCell>
                  {/* Render additional table cells for other data fields */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

    </Card>
    
  );
};

export default CustomerDetails
;