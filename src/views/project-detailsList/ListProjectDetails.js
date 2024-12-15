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
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ListProjectDetails = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://apiforcornershost.cubisysit.com/api/api-fetch-projectdetails.php');
      console.log('API Response:', response.data);
      setRows(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
      setLoading(false);
    }
  };

  const handleDelete = (projectId) => {
    console.log(`Deleting project with ID ${projectId}`);
  };

  const handleEdit = (rowData) => {
    console.log(`Editing project with ID ${rowData.ProjectID}`);
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
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', padding: '12px' }}>ProjectID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', padding: '12px' }}>UOM</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', padding: '12px' }}>BrochureLink</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', padding: '12px' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ padding: '12px', fontSize: '0.875rem' }}>{row.ProjectID}</TableCell>
                  <TableCell sx={{ padding: '12px', fontSize: '0.875rem' }}>{row.UOM}</TableCell>
                  <TableCell sx={{ padding: '12px', fontSize: '0.875rem' }}>{row.BrochureLink}</TableCell>
                  <TableCell sx={{ padding: '12px' }}>
                    <IconButton onClick={() => handleEdit(row)} aria-label="edit" sx={{ color: 'blue' }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(row.ProjectID)} aria-label="delete" sx={{ color: 'red' }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ padding: '12px' }}>
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

export default ListProjectDetails;
