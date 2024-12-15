import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  Avatar,
  Grid,
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  ListItemAvatar,
  IconButton,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Menu,
  ListItemIcon,
  Popover,
} from "@mui/material";
import axios from "axios";
import { Chip } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import FaceIcon from "@mui/icons-material/Face";
import { Divider } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GetAppIcon from "@mui/icons-material/GetApp";
import SortIcon from "@mui/icons-material/Sort";
import { useCookies } from "react-cookie";
import DashboardIcon from "@mui/icons-material/Dashboard";

const BacklogLoanReminderSidebar = ({ onEdit, onItemClick, onCreate, onDashboardClick }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const [anchorElDots, setAnchorElDots] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [cookies, setCookie] = useCookies(["amr"]);
  const userName = cookies.amr?.FullName || "User";
  const roleName = cookies.amr?.RoleName || "Admin";

  console.log(userName, "ye dekh username");
  console.log(roleName, "ye dekh rolname");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const userid = cookies.amr?.UserID || 'Role';

    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-backlogloan.php?UserID=${userid}`
      );
      console.log("API Response:", response.data);
      setRows(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase().trim();
    if (lowerCaseQuery === "") {
      setFilteredRows(rows);
    } else {
      const filteredData = rows.filter(
        (item) =>
   
            item.Name.toLowerCase().includes(lowerCaseQuery) ||
            item.Mobile.toLowerCase().includes(lowerCaseQuery) 
      );
      setFilteredRows(filteredData);
    }
    setPage(0);
  }, [searchQuery, rows]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredRows(rows);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenConfirmDelete = (id) => {
    setDeleteId(id);
    setConfirmDelete(true);
  };

  const getDateStatus = (contactCreateDate) => {
    const date = new Date(contactCreateDate);
    const now = new Date();

    const isCurrentMonth = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    const isPreviousMonth = date.getMonth() === now.getMonth() - 1 && date.getFullYear() === now.getFullYear();

    if (isCurrentMonth) {
      return "New";
    } else if (isPreviousMonth) {
      return "In Progress";
    } else {
      return null;
    }
  };

  const handleListItemClick = (item) => {
    onItemClick(item);
  };

  const handleCloseConfirmDelete = () => {
    setConfirmDelete(false);
    setDeleteId(null);
  };

  const handleFilterMenuOpen = (event) => {
    setAnchorElFilter(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setAnchorElFilter(null);
  };

  const handleDotsMenuOpen = (event) => {
    setAnchorElDots(event.currentTarget);
  };

  const handleDotsMenuClose = () => {
    setAnchorElDots(null);
  };

  const handleSortOptionChange = (option) => {
    setSortOption(option);
    setAnchorElFilter(null);
    sortData(option);
  };

  const sortData = (option) => {
    const sortedRows = [...filteredRows];
    switch (option) {
      case "asc":
        sortedRows.sort((a, b) => new Date(a.RemarkDate) - new Date(b.RemarkDate));
        break;
      case "desc":
        sortedRows.sort((a, b) => new Date(b.RemarkDate) - new Date(a.RemarkDate));
        break;
      case "a-z":
        sortedRows.sort((a, b) => a.Name.localeCompare(b.Name));
        break;
      case "z-a":
        sortedRows.sort((a, b) => b.Name.localeCompare(a.Name));
        break;
      default:
        break;
    }
    setFilteredRows(sortedRows);
  };

  const jsonToCSV = (json) => {
    const header = Object.keys(json[0]).join(",");
    const values = json.map((obj) => Object.values(obj).join(",")).join("\n");
    return `${header}\n${values}`;
  };

  const handleDownload = () => {
    const csv = jsonToCSV(rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "TodayLoan.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Card
      sx={{
       
        padding: 5,
        height: 700,
        overflowY: "auto",
      }}
    >
      <Grid item xs={12} sx={{ marginBottom: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: 20 }}>
            Backlog Loan Reminders
          </Typography>
          <Box display="flex" alignItems="center">
            <IconButton aria-label="filter" sx={{ color: "grey" }} onClick={onDashboardClick}>
              <DashboardIcon />
            </IconButton>
    
            <IconButton aria-label="filter" sx={{ color: "grey" }} onClick={handleFilterMenuOpen}>
              <SortIcon />
            </IconButton>
            <Popover
              id="sort-popover"
              open={Boolean(anchorElFilter)}
              anchorEl={anchorElFilter}
              onClose={handleFilterMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <MenuItem onClick={() => handleSortOptionChange("asc")}>Date Asc</MenuItem>
              <MenuItem onClick={() => handleSortOptionChange("desc")}>Date Desc</MenuItem>
              <MenuItem onClick={() => handleSortOptionChange("a-z")}>Name A-Z</MenuItem>
              <MenuItem onClick={() => handleSortOptionChange("z-a")}>Name Z-A</MenuItem>
            </Popover>
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <TextField
            fullWidth
            size="small"
            placeholder="Search by Party Name"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear search"
                    edge="end"
                    onClick={handleClearSearch}
                  >
                    <ErrorOutlineIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Grid>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Typography variant="body1" color="error">
            Error loading data. Please try again later.
          </Typography>
        </Box>
      ) : filteredRows.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Typography variant="body1">No loan reminders found.</Typography>
        </Box>
      ) : (
        <List>
          {filteredRows
            
            .map((row) => (
              <React.Fragment>
                <Card sx={{ marginBottom: 2 }}>
              <ListItem
                key={row.BookingremarkID}
            
                onClick={() => handleListItemClick(row)}
              >
                <ListItemAvatar>
                  <Avatar alt="John Doe"
                          sx={{ width: 40, height: 40, margin:2 }}
                          src="/images/avatars/1.png"/>
                   
                </ListItemAvatar>
                <ListItemText
                   primary={
                    <Typography
                    variant="subtitle1"
                    style={{ fontWeight: "bold" }}
                  >
                    
                   {row?.TitleName} {row?.Name}
                    </Typography>
                  }
                  secondary={
                    <Box display="flex" flexDirection="column">
                       
                      <Typography variant="body2" style={{ fontSize: 10,fontWeight:600 }}>
                      Remark amount: {row.Remarkamount}
                      </Typography>
                      <Typography variant="body2" style={{ fontSize: 10,fontWeight:600 }}>
                        Mobile: {row.Mobile}
                      </Typography>
                      <Typography variant="body2" style={{ fontSize: 10,fontWeight:600 }}>
                      Remark Date: {row.RemarkDate}
                      </Typography>
                    </Box>
                  }
                />
                <Box display="flex" alignItems="center">
                  {getDateStatus(row.contactCreateDate) && (
                    <Chip
                      label={getDateStatus(row.contactCreateDate)}
                      color={
                        getDateStatus(row.contactCreateDate) === "New"
                          ? "success"
                          : "warning"
                      }
                    />
                  )}
                 
                  <Menu
                    id="dots-menu"
                    anchorEl={anchorElDots}
                    open={Boolean(anchorElDots)}
                    onClose={handleDotsMenuClose}
                  >
                    <MenuItem onClick={handleDownload}>
                      <ListItemIcon>
                        <GetAppIcon />
                      </ListItemIcon>
                      <ListItemText primary="Download CSV" />
                    </MenuItem>
                  </Menu>
                </Box>
              </ListItem>
              </Card>
              </React.Fragment>
            ))}
          <Divider />
         
        </List>
      )}
    
    </Card>
  );
};

export default BacklogLoanReminderSidebar;
