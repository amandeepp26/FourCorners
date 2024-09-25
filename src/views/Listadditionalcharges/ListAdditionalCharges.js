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
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { format, parseISO } from 'date-fns';

const ListAdditionalCharges = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://apiforcornershost.cubisysit.com/api/api-fetch-additionalcharges.php');
      console.log('API Response:', response.data);
      setRows(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'yyyy-MM-dd');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const handleDelete = (additionalchargesID) => {
    console.log(`Deleting Additional charges with ID ${additionalchargesID}`);
  };

  const handleEdit = (rowData) => {
    setShowTabAccount(rowData); // Pass selected row data to the parent component
    console.log(`Editing Additional charges with ID ${rowData.AdditionalchargesID}`);
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
              <TableCell sx={{ fontWeight: 'bold', fontSize: '2rem' }}>Project Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '2rem' }}>Sub Project </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '2rem' }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '2rem' }}>Particulars of Additional Charges</TableCell>

              <TableCell sx={{ fontWeight: 'bold', fontSize: '2rem' }}>Type of Additional Charges</TableCell>
           
              <TableCell sx={{ fontWeight: 'bold', fontSize: '2rem' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ padding: '8px', fontSize: '0.75rem' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ padding: '8px', fontSize: '0.75rem' }}>{row.projectname}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ padding: '15px', fontSize: '0.75rem' }}>{row.subproject}</TableCell>
                  <TableCell sx={{ padding: '15px', fontSize: '0.75rem' }}>{row.startdate}</TableCell>
                  <TableCell sx={{ padding: '15px', fontSize: '0.75rem' }}>{row.particularsofadditionalcharges}</TableCell>
                  <TableCell sx={{ padding: '15px', fontSize: '0.75rem' }}>{row.typeofadditionalcharges}</TableCell>
               
                  <TableCell sx={{ padding: '15px' }}>
                    <IconButton onClick={() => handleEdit(row)} aria-label="edit" sx={{ color: 'blue' }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(row.AdditionalchargesID)} aria-label="delete" sx={{ color: 'red' }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
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

export default ListAdditionalCharges;
