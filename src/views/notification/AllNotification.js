import React, { useState, useEffect, Fragment } from 'react';
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
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';
import  Grid  from '@mui/material/Grid';
import MoreVertIcon from "@mui/icons-material/MoreVert";


const AllNotifications = ({ onEdit }) => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [deleteId, setDeleteId] = useState(null);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

  useEffect(() => {
    const filteredData = rows.filter((row) =>
      String(row.TableName).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(row.ActionType).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(row.CreatedDate).toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRows(filteredData);
  }, [searchQuery, rows]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-notification.php`
      );
      console.log("RESPONSE:", response.data);
  
      // Ensure the data is an array before setting rows
      if (Array.isArray(response.data.data)) {
        const newNotifications = response.data.data;
        console.log(newNotifications , 'dekh bhaii noti<<<<<<<<<>>>>>>>>>>>>>');
        
        setRows(newNotifications); // Set the rows with new data
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
  

  const handleClose = () => {
    setOpen(false);
    setDeleteId(null);
  };

  const handleDeleteNotification = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleDelete = async () => {
    const body = {
      NotificationID: deleteId,
      DeleteUID: 1,
    };

    try {
      const response = await axios.post(
        'https://apiforcornershost.cubisysit.com/api/api-delete-notification.php',
        body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data.status === 'Success') {
        setRows(rows.filter(row => row.NotificationID !== deleteId));
      } else {
        console.error('Failed to delete:', response.data);
      }
    } catch (error) {
      console.error('There was an error!', error);
    } finally {
      setOpen(false);
      setDeleteId(null);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (sortBy) => {
    const isAsc = orderBy === sortBy && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(sortBy);
    const sortedData = filteredRows.slice().sort(getComparator(isAsc ? 'desc' : 'asc', sortBy));
    setFilteredRows(sortedData);
  };

  const getComparator = (order, sortBy) => {
    return (a, b) => {
      if (a[sortBy] < b[sortBy]) return order === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return order === 'asc' ? 1 : -1;
      return 0;
    };
  };

  const SortableTableCell = ({ label, sortBy }) => (
    <TableCell onClick={() => handleSort(sortBy)} sx={{ fontWeight: 'bold', cursor: 'pointer' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <span>{label}</span>
        {orderBy === sortBy ? (
          order === 'asc' ? (
            <span>&#9650;</span> // Up arrow
          ) : (
            <span>&#9660;</span> // Down arrow
          )
        ) : (
          <span>&#8597;</span> // Up and down arrow
        )}
      </Box>
    </TableCell>
  );

  const handleDropdownOpen = (event, notification) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };
  const DropdownMenu = () => {
    const details = selectedNotification?.Details;
  
    return (
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem disableRipple>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ fontWeight: 600 }}>Data</Typography>
          </Box>
        </MenuItem>
        {selectedNotification ? (
          <MenuItem key={selectedNotification.NotificationID} onClick={handleDropdownClose}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <Typography variant='subtitle1'>Table: {selectedNotification.TableName}</Typography>
              <Typography variant='body2'>Action: {selectedNotification.ActionType}</Typography>
              <Typography variant='body2'>Name: {selectedNotification.Name}</Typography>
              {details ? (
                <Box sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><Typography variant='body2'><strong>Field</strong></Typography></TableCell>
                        <TableCell><Typography variant='body2'><strong>Data</strong></Typography></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.keys(details).map((key, index) => (
                        <TableRow key={index}>
                          <TableCell><Typography variant='body2'>{key}</Typography></TableCell>
                          <TableCell><Typography variant='body2'>{JSON.stringify(details[key])}</Typography></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              ) : (
                <Typography variant='body2'>No details available</Typography>
              )}
            </Box>
          </MenuItem>
        ) : (
          <MenuItem>
            <Typography variant='body2' sx={{ p: 2 }}>No details available</Typography>
          </MenuItem>
        )}
        <MenuItem
          disableRipple
          sx={{ py: 3.5, borderBottom: 0, borderTop: theme => `1px solid ${theme.palette.divider}` }}
        >
        </MenuItem>
      </Menu>
    );
  };
  

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error fetching data: {error}</Typography>;
  }

  return (
    <Card>
      <TableContainer>
      <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography
                variant="body2"
                sx={{ margin: 5, fontWeight: "bold", fontSize: 20 }}
              >
                Recent Activity
              </Typography>
              {/* <Button
          variant="contained"
          onClick={onDashboardClick}
          style={{ marginTop: 0 }}
        >
          Dashboard
        </Button> */}
            </Box>
           
          </Grid>
        <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
          <TableHead>
            <TableRow>
            <SortableTableCell label="Name" sortBy="Name" />
              <SortableTableCell label="Table Name" sortBy="TableName" />
              <SortableTableCell label="Action Type" sortBy="ActionType" />
              <SortableTableCell label="Created By" sortBy="Createddate" />
              <SortableTableCell label="Created Date" sortBy="CreatedDate" />
          
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="left" sx={{ fontWeight: 900 }}>{row.Details?.CName}</TableCell>
                  <TableCell align="left">{row.TableName}</TableCell>
                  <TableCell align="left">{row.ActionType}</TableCell>
                  <TableCell align="left">{row.Name}</TableCell>
                  <TableCell align="left">{row.CreatedDate}</TableCell>
                
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No Notifications Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

      </TableContainer>

      {/* Dialog for Delete Confirmation */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this notification?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default AllNotifications;
