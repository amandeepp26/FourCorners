import React, { useState, useEffect } from "react";
import axios from "axios";
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
  ListItemAvatar,
  IconButton,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Button,
  Menu,
  ListItemIcon,
  Popover,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { Divider } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GetAppIcon from "@mui/icons-material/GetApp";
import SortIcon from "@mui/icons-material/Sort";
import { useCookies } from "react-cookie";
import { Dashboard } from "@mui/icons-material";


const Sidebar = ({ onEdit, onItemClick, onCreate , onDashboardClick}) => {
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
  const userid = cookies.amr?.UserID || 'Role';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-listcancelbooking.php?UserID=${userid}`
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
          item?.CName?.toLowerCase().includes(lowerCaseQuery) ||
          item?.Mobile?.toLowerCase().includes(lowerCaseQuery)
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


  const handleDelete = async () => {
    try {
      const response = await axios.post(
        "https://proxy-forcorners.vercel.app/api/proxy/api-delete-opportunity.php",
        {
          Tid: deleteId,
          DeleteUID: 1,
        }
      );
      if (response.data.status === "Success") {
        setRows(rows.filter((row) => row.Tid !== deleteId));
        console.log("Deleted successfully");
        setConfirmDelete(false);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      setError(error);
    }
  };

  const handleOpenConfirmDelete = (id) => {
    setDeleteId(id);
    setConfirmDelete(true);
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

  const getDateStatus = (bookingcancelCreateDate) => {
    const date = new Date(bookingcancelCreateDate);
    const now = new Date();
    
    const isCurrentMonth = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    const isPreviousMonth = date.getMonth() === now.getMonth() - 1 && date.getFullYear() === now.getFullYear();
  
    if (isCurrentMonth) {
      return "Cancel Booking";
    } else if (isPreviousMonth) {
      return "Cancel Booking";
    } else {
      return null;
    }
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
        sortedRows.sort(
          (a, b) =>
            new Date(a.NextFollowUpDate) - new Date(b.NextFollowUpDate)
        );
        break;
      case "desc":
        sortedRows.sort(
          (a, b) =>
            new Date(b.NextFollowUpDate) - new Date(a.NextFollowUpDate)
        );
        break;
      case "a-z":
        sortedRows.sort((a, b) => a?.CName?.localeCompare(b.CName));
        break;
      case "z-a":
        sortedRows.sort((a, b) => b?.CName?.localeCompare(a.CName));
        break;
      default:
        break;
    }
    setFilteredRows(sortedRows);
  };

  const jsonToCSV = (json) => {
    const header = Object.keys(json[0]).join(",");
    const values = json
      .map((obj) => Object.values(obj).join(","))
      .join("\n");
      return `${header}\n${values}`;
  };

  const handleDownload = () => {
    const csv = jsonToCSV(rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Telecalling.csv";
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
            All Cancel Booking
          </Typography>
          <Box display="flex" alignItems="center">
          <IconButton
              aria-label="filter"
              sx={{ color: "grey" }}
              onClick={onDashboardClick}
            >
              <Dashboard />
            </IconButton>
            <IconButton
              aria-label="filter"
              sx={{ color: "grey" }}
              onClick={handleFilterMenuOpen}
            >
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
              <MenuItem onClick={() => handleSortOptionChange("asc")}>
                Date Asc
              </MenuItem>
              <MenuItem onClick={() => handleSortOptionChange("desc")}>
                Date Desc
              </MenuItem>
              <MenuItem onClick={() => handleSortOptionChange("a-z")}>
                Name A-Z
              </MenuItem>
              <MenuItem onClick={() => handleSortOptionChange("z-a")}>
                Name Z-A
              </MenuItem>
            </Popover>
            <Popover
              id="menu"
              anchorEl={anchorElDots}
              open={Boolean(anchorElDots)}
              onClose={handleDotsMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleDownload}>
                <ListItemIcon>
                  <GetAppIcon fontSize="small" />
                </ListItemIcon>
                Download All Data
              </MenuItem>
            </Popover>
          </Box>
        </Box>
      </Grid>

      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={handleClearSearch}
                edge="end"
                sx={{ color: "grey" }}
              >
                <PersonIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px",
            "& fieldset": {
              borderRadius: "20px",
            },
          },
        }}
      />

      {filteredRows.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            mt: 2,
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 40, mb: 2 }} />
          <Typography variant="h6">No data found</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onCreate}
            sx={{ mt: 2 }}
          >
            Booking Cancel
          </Button>
        </Box>
      ) : (
        <>
          <List>
            {filteredRows
      .map((item) => (
        <React.Fragment key={item.bookingcancelID}>
          <Card sx={{ marginBottom: 2 }}>
            <ListItem disablePadding onClick={() => handleListItemClick(item)}>
              <ListItemAvatar>
                <Avatar
                  alt={item.Name}
                  sx={{ width: 40, height: 40, margin: 2 }}
                  src="/images/avatars/1.png"
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      variant="subtitle1"
                      style={{ fontWeight: 600, fontSize: 13 }}
                    >
                      {item?.TitleName} {item.bookingcancelName}
                    </Typography>
                  </div>
                }
                secondary={
                  <>                
                        <Typography variant="body2" style={{ fontSize: 10 ,fontWeight:600}}>
                          Remark: {item?.bookingcancelremarksRemark}
                        </Typography>
                        <Typography variant="body2" style={{ fontSize: 10,fontWeight:600 }}>
                          Followup Date: {item?.bookingcancelremarksDate}
                        </Typography>
                    <Typography variant="body2" style={{ fontSize: 10,fontWeight:600 }}>
                      Source Name: {item?.bookingcancelSourceName}
                    </Typography>
                  </>
                }
                secondaryTypographyProps={{ variant: "body2" }}
              />
              <Box display="flex" flexDirection="column" alignItems="flex-end">
                <IconButton aria-label="edit" sx={{ color: "blue" }}>
                  {getDateStatus(item.bookingcancelCreateDate) && (
                    <Chip
                      label={getDateStatus(item.bookingcancelCreateDate)}
                      size="small"
                      color={getDateStatus(item.bookingcancelCreateDate) === "New" ? "warning" : "default"}
                      style={{
                        fontSize: 8,
                        marginLeft: 8,
                        height: 20,
                      }}
                    />
                  )}
                </IconButton>
              </Box>
            </ListItem>
          </Card>
        </React.Fragment>
      ))}
      
          </List>
        </>
      )}

      <Dialog open={confirmDelete} onClose={handleCloseConfirmDelete}>
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default Sidebar;