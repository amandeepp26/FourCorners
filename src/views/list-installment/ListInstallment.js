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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import TablePagination from '@mui/material/TablePagination';

const ListInstallment = ({ rows, onEdit, onDelete }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRows, setFilteredRows] = useState([]);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

  useEffect(() => {
    const filteredData = rows.filter((row) => {
      return (
        String(row.PartyName).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.Mobile).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.ProjectID).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.Source).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.SourceName).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.SourceDescription).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    setFilteredRows(filteredData);
  }, [searchQuery, rows]);

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

  const handleEditButtonClick = (row) => {
    onEdit(row);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleDelete = async () => {
    const body = {
      InstallmentID:deleteId,
      DeleteUID: 1,
    };

    try {
      const response = await axios.post(
        "https://proxy-forcorners.vercel.app/api/proxy/api-delete-installmentdetails.php",
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "Success") {
        console.log("Deleted");
        setRows(prevRows => prevRows.filter(row => row.InstallmentID !== deleteId));
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

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error fetching data: {error.message}</Typography>;
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
              <TableCell>Project Name</TableCell>
              <TableCell>Sub Project</TableCell>
              <TableCell>Installment Type</TableCell>
              <TableCell>Particulars</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.length > 0 ? (
              filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.ProjectName}</TableCell>
                  <TableCell>{row.SubProject}</TableCell>
                  <TableCell>{row.InstallmentType}</TableCell>
                  <TableCell>{row.Particulars}</TableCell>
                  <TableCell sx={{ padding: '15px' }}>
                    <IconButton onClick={() => handleEditButtonClick(row)} aria-label="edit" sx={{ color: 'blue' }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDelete(row.InstallmentID)} aria-label="delete" sx={{ color: 'red' }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this installment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDelete(deleteId)} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ListInstallment;
