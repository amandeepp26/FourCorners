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

const OpenLoanReminderSidebar = ({ onEdit, onItemClick, onCreate, onDashboardClick }) => {
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
        `https://apiforcornershost.cubisysit.com/api/api-fetch-nextloan.php?UserID=${userid}`
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
          item?.Name?.toString().includes(lowerCaseQuery) ||
          item?.Remarkamount?.toString().includes(lowerCaseQuery)
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
        width: 390,
        padding: 5,
        height: 700,
        overflowY: "auto",
      }}
    >
      <Grid item xs={12} sx={{ marginBottom: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: 20 }}>
            Open Loan Reminders
          </Typography>
          <Box display="flex" alignItems="center">
            <IconButton aria-label="filter" sx={{ color: "grey" }} onClick={onDashboardClick}>
              <DashboardIcon />
            </IconButton>
            <IconButton aria-label="filter" sx={{ color: "grey" }} onClick={onCreate}>
              <AddIcon />
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
            No data found !
          </Typography>
        </Box>
      ) : filteredRows.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Typography variant="body1">No loan reminders found.</Typography>
        </Box>
      ) : (
        <List>
          {filteredRows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
              <ListItem
                key={row.BookingremarkID}
                button
                onClick={() => handleListItemClick(row)}
              >
                <ListItemAvatar>
                  <Avatar alt="John Doe"
                          sx={{ width: 40, height: 40, margin: 2 }}
                          src="/images/avatars/1.png"/>
                   
                </ListItemAvatar>
                <ListItemText
                  // primary={row.Name}
                  secondary={
                    <Box display="flex" flexDirection="column">
                        <Typography
                              variant="subtitle1"
                              style={{ fontWeight: 600, fontSize: 13 }}
                            >
                            {row.Name}
                            </Typography>
                      <Typography variant="body2" color="textSecondary">
                      Remark amount: {row.Remarkamount}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Mobile: {row.Mobile}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
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
            ))}
          <Divider />
          <Box display="flex" justifyContent="space-between" alignItems="center" padding={1}>
            <Typography variant="body2">
              Page {page + 1} of {Math.ceil(filteredRows.length / rowsPerPage)}
            </Typography>
            <Box display="flex" alignItems="center">
              <IconButton
                onClick={(e) => handleChangePage(e, page - 1)}
                disabled={page === 0}
              >
                {"<"}
              </IconButton>
              <TextField
                select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                variant="outlined"
                size="small"
                sx={{ width: 60 }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
              </TextField>
              <IconButton
                onClick={(e) => handleChangePage(e, page + 1)}
                disabled={page >= Math.ceil(filteredRows.length / rowsPerPage) - 1}
              >
                {">"}
              </IconButton>
            </Box>
          </Box>
        </List>
      )}
      <Dialog
        open={confirmDelete}
        onClose={handleCloseConfirmDelete}
        aria-labelledby="confirm-delete-dialog-title"
        aria-describedby="confirm-delete-dialog-description"
      >
        <DialogTitle id="confirm-delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-dialog-description">
            Are you sure you want to delete this loan reminder?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {
            // Implement delete logic here
            handleCloseConfirmDelete();
          }} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default OpenLoanReminderSidebar;
