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
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';

const TabInfo = ({ setShowTabAccount , onEdit }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRows, setFilteredRows] = useState([]);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const debouncedFilter = setTimeout(() => {
      filterData();
    }, 300);

    return () => {
      clearTimeout(debouncedFilter);
    };
  }, [searchQuery, rows]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://apiforcornershost.cubisysit.com/api/api-fetch-companymaster.php');
      setRows(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
      setLoading(false);
    }
  };

  const filterData = () => {
    const filteredData = rows.filter((row) =>
      String(row.CompanyName).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(row.Gst).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(row.Website).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(row.Email).toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRows(filteredData);
  };

  const handleClose = () => {
    setOpen(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    const body = {
      CompanyID: deleteId,
      DeleteUID: 1,
    };

    try {
      const response = await axios.post(
        "https://proxy-forcorners.vercel.app/api/proxy/api-delete-companymaster.php",
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status === "Success") {
        setRows(rows.filter(row => row.CompanyID !== deleteId));
        setFilteredRows(filteredRows.filter(row => row.CompanyID !== deleteId));
      } else {
        console.error("Failed to delete:", response.data);
      }
    } catch (error) {
      console.error("There was an error!", error);
    } finally {
      setOpen(false);
      setDeleteId(null);
    }
  };

  const handleEdit = (rowData) => {
    setShowTabAccount(rowData);
    console.log(`Editing company with ID ${rowData.CompanyID}`);
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
    const newOrder = isAsc ? 'desc' : 'asc';
    setOrder(newOrder);
    setOrderBy(sortBy);

    const sortedData = filteredRows.slice().sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return newOrder === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return newOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredRows(sortedData);
  };

  const SortableTableCell = ({ label, onClick }) => (
    <TableCell sx={{ fontWeight: 'bold', fontSize: '2rem', cursor: 'pointer' }} onClick={onClick}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {label}
        <span>&#8597;</span>
      </Box>
    </TableCell>
  );

  const handleOpen = (CompanyID) => {
    setDeleteId(CompanyID);
    setOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" color="error">
          Error fetching data. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Card>
      <Box sx={{ padding: '16px', display: 'flex', justifyContent: 'flex-end' }}>
        <TextField
          size="small"
          placeholder="Search"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: '20px',
              "& fieldset": {
                borderRadius: '20px',
              },
            },
          }}
        />
      </Box>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
          <TableHead>
            <TableRow>
              <SortableTableCell label="Company Name" onClick={() => handleSort('CompanyName')} />
              <SortableTableCell label="GST" onClick={() => handleSort('Gst')} />
              <SortableTableCell label="Website" onClick={() => handleSort('Website')} />
              <SortableTableCell label="Email" onClick={() => handleSort('Email')} />
              <TableCell sx={{ fontWeight: 'bold', fontSize: '2rem' }}>Edit</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '2rem' }}>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.length > 0 ? (
              filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ padding: '8px', fontSize: '0.75rem' }}>
                    <Typography sx={{ padding: '8px', fontSize: '0.75rem' }}>{row.CompanyName}</Typography>
                  </TableCell>
                  <TableCell sx={{ padding: '8px', fontSize: '0.75rem' }}>
                    <Typography sx={{ padding: '8px', fontSize: '0.75rem' }}>{row.Gst}</Typography>
                  </TableCell>
                  <TableCell sx={{ padding: '8px', fontSize: '0.75rem' }}>
                    <Typography sx={{ padding: '8px', fontSize: '0.75rem' }}>{row.Website}</Typography>
                  </TableCell>
                  <TableCell sx={{ padding: '8px', fontSize: '0.75rem' }}>
                    <Typography sx={{ padding: '8px', fontSize: '0.75rem' }}>{row.Email}</Typography>
                  </TableCell>
                  <TableCell sx={{ padding: '8px', fontSize: '0.75rem' }}>
                    <IconButton onClick={() => onEdit(row)}>
                      <EditIcon sx={{ color: 'blue', fontSize: '2rem' }} />
                    </IconButton>
                  </TableCell>
                  <TableCell sx={{ padding: '8px', fontSize: '0.75rem' }}>
                    <IconButton onClick={() => handleOpen(row.CompanyID)}>
                      <DeleteIcon sx={{ color: 'red', fontSize: '2rem' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredRows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this company?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default TabInfo;
