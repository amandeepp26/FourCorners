import React, { useState } from 'react';
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
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const Listsubprojectdetails = ({ rows, setRows, onEdit }) => {
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = async () => {
    const body = {
      SubProjectID: deleteId,
      deleteuid: 1,
    };

    try {
      const response = await axios.post(
        "https://proxy-forcorners.vercel.app/api/proxy/api-delete-subprojectmaster.php",
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "Success") {
        console.log("Deleted");
        setRows(prevRows => prevRows.filter(row => row.SubProjectID !== deleteId));
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

  const handleOpen = (SubProjectID) => {
    setDeleteId(SubProjectID);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeleteId(null);
  };

  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
          <TableHead>
            <TableRow>
              <TableCell>Project</TableCell>
              <TableCell>SubProject Name</TableCell>
              <TableCell>ResponsiblePerson</TableCell>
              <TableCell>TotalCarParking</TableCell>
              <TableCell>DefaultCarParkingsPerUnit</TableCell>
              <TableCell>FinancePostingInstallmentLetter</TableCell>
              <TableCell>Favorof</TableCell>
              <TableCell>FloorRiseEntries</TableCell>
              <TableCell>AdditionSubtractionInBasicRate</TableCell>
              <TableCell>CCEntries</TableCell>
              <TableCell>Particulars</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '2rem' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ fontWeight: 500 }}>{row.ProjectID}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{row.SubProjectName}</TableCell>
                  <TableCell>{row.ResponsiblePerson}</TableCell>
                  <TableCell>{row.TotalCarParking}</TableCell>
                  <TableCell>{row.DefaultCarParkingsPerUnit}</TableCell>
                  <TableCell>{row.FinancePostingInstallmentLetter}</TableCell>
                  <TableCell>{row.Favorof}</TableCell>
                  <TableCell>{row.FloorRiseEntries}</TableCell>
                  <TableCell>{row.AdditionSubtractionInBasicRate}</TableCell>
                  <TableCell>{row.CCEntries}</TableCell>
                  <TableCell>{row.Particulars}</TableCell>
                  <TableCell sx={{ padding: '15px', display: 'flex', justifyContent: 'space-around' }}>
                    <IconButton onClick={() => onEdit(row)} aria-label="edit" sx={{ color: 'blue' }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpen(row.SubProjectID)} aria-label="delete" sx={{ color: 'red' }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this subproject?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default Listsubprojectdetails;
