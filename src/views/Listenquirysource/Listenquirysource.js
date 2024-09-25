import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

const Listenquirysource = ({ rows, onEdit, onDelete }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRows, setFilteredRows] = useState([]);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [projectMaster, setProjectMaster] = useState([]);
  const [formData, setFormData] = useState({
    ProjectID: "",
    WingID: "", // Corrected: Changed WingData to WingID for selection
    Status: 1,
    CreateUID: 1,
  });
  const [telecallingData, setTelecallingData] = useState([]);
  const [wingData, setWingData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

  useEffect(() => {
    const filteredData = rows.filter((row) => {
      return (
        String(row.PartyName).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.Mobile).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.ProjectID).toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.Source).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.SourceName).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.SourceDescription).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    setFilteredRows(filteredData);
  }, [searchQuery, rows]);

  useEffect(() => {
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-dropdown-projectinfo.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setProjectMaster(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching project master data:", error);
      });
  }, []);

  useEffect(() => {
    if (formData.ProjectID) {
      axios
        .get(`https://apiforcornershost.cubisysit.com/api/api-fetch-projectwings.php?ProjectID=${formData.ProjectID}`)
        .then((response) => {
          if (response.data.status === "Success") {
            setWingData(response.data.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching wing data:", error);
        });
    }
  }, [formData.ProjectID]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        WingID: formData.WingID,
      });
      const response = await fetch(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-projectroom.php?${params}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTelecallingData(data.data);
    } catch (error) {
      console.error("Error fetching telecalling data:", error);
    } finally {
      setLoading(false);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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


  const jsonToCSV = (json) => {
    const header = Object.keys(json[0]).join(",");
    const values = json
      .map((obj) => Object.values(obj).join(","))
      .join("\n");
    return `${header}\n${values}`;
  };

  const handleDownload = () => {
    const csv = jsonToCSV(telecallingData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Project Details.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  return (
    <>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: 20 }}>
                Search to get the result of project details
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Project Name</InputLabel>
                <Select
                  value={formData.ProjectID}
                  onChange={handleInputChange}
                  name="ProjectID"
                  label="Project Name"
                >
                  {projectMaster.map((project) => (
                    <MenuItem key={project.ProjectID} value={project.ProjectID}>
                      {project.ProjectName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Wings</InputLabel>
                <Select
                  value={formData.WingID} // Corrected: Changed WingData to WingID
                  onChange={handleInputChange}
                  name="WingID" // Corrected: Changed WingData to WingID
                  label="Wings"
                >
                  {wingData.map((wing) => (
                    <MenuItem key={wing.WingID} value={wing.WingID}>
                      {wing.WingName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                sx={{ height: 'fit-content', marginTop: '16px' }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {telecallingData.length > 0 && (
        <Card sx={{mt:10}}>
          <Box sx={{ padding: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
              variant="contained"
              sx={{ marginRight: 3.5 }}
              onClick={handleDownload}
              style={{ marginBottom: "8px", float: "right" }}
            >
              Download Detail
            </Button>
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
              <TableHead>
                <TableRow>
                  <SortableTableCell label="Project Name" sortBy="ProjectName" />
                  <SortableTableCell label="Unit Type" sortBy="UnitType" />
                  <SortableTableCell label="Area" sortBy="Area" />
                  <SortableTableCell label="Flat No" sortBy="FlatNo" />
                  <SortableTableCell label="Party Name" sortBy="PartyName" />
                  <SortableTableCell label="SKU Name" sortBy="skuName" />
                </TableRow>
              </TableHead>
              <TableBody>
                {telecallingData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.ProjectName}</TableCell>
                      <TableCell>{row.UnittypeName}</TableCell>
                      <TableCell>{row.Area}</TableCell>
                      <TableCell>{row.FlatNo}</TableCell>
                      <TableCell>{row.Partyname}</TableCell>
                      <TableCell>{row.skuName}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={telecallingData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      )}

      {/* {telecallingData.length === 0 && (
        <Card>
          <CardContent>
            <Typography variant="body1">Data not found</Typography>
          </CardContent>
        </Card>
      )} */}
    </>
  );
};

export default Listenquirysource;
