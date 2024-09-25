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
  ListItemAvatar,
  IconButton,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Popover,
  ListItemIcon,
} from "@mui/material";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCookies } from "react-cookie";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GetAppIcon from "@mui/icons-material/GetApp";
import SortIcon from "@mui/icons-material/Sort";
import Swal from 'sweetalert2';
import DashboardIcon from '@mui/icons-material/Dashboard';
const SidebarContactDetails = ({ onEdit, onItemClick, onCreate ,onDashboardClick}) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cookies, setCookie] = useCookies(["amr"]); // Define cookies and setCookie function

  // Accessing cookie values
  const userName = cookies.amr?.FullName || 'User';
  const roleName = cookies.amr?.RoleName || 'Admin';
  const userid = cookies.amr?.UserID || 'Role';
  console.log(userName, 'ye dekh username');
  console.log(roleName, 'ye dekh rolname');
  console.log(userid, 'ye dekh roleide');

  const [filteredRows, setFilteredRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const [anchorElDots, setAnchorElDots] = useState(null);
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-contacts.php?UserID=${userid}`
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
    const lowerCaseQuery = searchQuery.toLowerCase().trim();
    if (lowerCaseQuery === "") {
      setFilteredRows(rows); // Reset to show all rows if searchQuery is empty
    } else {
      const filteredData = rows.filter((item) => {
        // Check if item exists and has CName and Mobile properties
        if (item && item.CName && typeof item.Mobile === "string") {
          return (
            item.CName.toLowerCase().includes(lowerCaseQuery) ||
            item.Mobile.toLowerCase().includes(lowerCaseQuery)
          );
        }
        return false; // Exclude items that don't have required properties or incorrect Mobile type
      });
      setFilteredRows(filteredData); // Filter rows based on searchQuery
    }
    setPage(0); // Reset pagination to the first page
  }, [searchQuery, rows]);
  

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchQuery(value);
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

  const handleDelete = async () => {
    try {
      const response = await axios.post(
        "https://proxy-forcorners.vercel.app/api/proxy/api-delete-contacts.php",
        {
          Cid: deleteId,
          DeleteUID: 1,
        }
      );
      if (response.data.status === "Success") {
        setRows(rows.filter((row) => row.Cid !== deleteId));
        console.log("Deleted successfully");
        setConfirmDelete(false);
        Swal.fire({
          title: 'Deleted!',
          text: 'Your data has been deleted.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      setError(error);
      Swal.fire({
        title: 'Error!',
        text: 'There was an error deleting the data.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
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
          (a, b) => new Date(a.CreateDate) - new Date(b.CreateDate)
        );
        break;
      case "desc":
        sortedRows.sort(
          (a, b) => new Date(b.CreateDate) - new Date(a.CreateDate)
        );
        break;
      case "a-z":
        sortedRows.sort((a, b) => {
          if (a && a.CName && b && b.CName) {
            return a.CName.localeCompare(b.CName);
          }
          return 0; // or handle differently, e.g., put items without Name at the end
        });
        break;
      case "z-a":
        sortedRows.sort((a, b) => {
          if (a && a.CName && b && b.CName) {
            return b.CName.localeCompare(a.CName);
          }
          return 0; // or handle differently, e.g., put items without Name at the end
        });
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
    a.download = "Contact.csv";
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
            All Contacts
          </Typography>
          <Box display="flex" alignItems="center">
          <IconButton
              aria-label="filter"
              sx={{ color: "grey" }}
              onClick={onDashboardClick}
            >
              <DashboardIcon />
            </IconButton>
            <IconButton
              aria-label="filter"
              sx={{ color: "grey" }}
              onClick={onCreate}
            >
              <AddIcon />
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

            {/* <IconButton
              aria-label="more"
              aria-controls="menu"
              aria-haspopup="true"
              onClick={handleDotsMenuOpen}
              sx={{ color: "grey" }}
            >
              <MoreVertIcon />
            </IconButton>
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
            </Popover> */}
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
            Create Telecalling
          </Button>
        </Box>
      ) : (
        <>
          <List>
            {filteredRows
             
              .map((item) => (
                <React.Fragment key={item.Cid}>
                  <Card sx={{ marginBottom: 2 }}>
                    <ListItem
                      disablePadding
                      onClick={() => handleListItemClick(item)}
                    >
                      <ListItemAvatar>
                        <Avatar
                          alt="John Doe"
                          sx={{ width: 40, height: 40, margin: 2 }}
                          src="/images/avatars/1.png"
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle1"
                            style={{ fontWeight: "bold" }}
                          >
                           {item.TitleName} {item.CName}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography
                              variant="body2"
                              style={{ fontSize: 10 }}
                            >
                              Phone: {item.Mobile}
                            </Typography>
                            <Typography
                              variant="body2"
                              style={{ fontSize: 10 }}
                            >
                              City: {item.CityName}
                            </Typography>
                            <Typography
                              variant="body2"
                              style={{ fontSize: 10 }}
                            >
                              Created At: {item.CreateDate}
                            </Typography>
                          </>
                        }
                        secondaryTypographyProps={{ variant: "body2" }}
                      />
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-end"
                      >
                        {/* <IconButton
                          aria-label="edit"
                          onClick={(event) => {
                            event.stopPropagation();
                            onEdit(item);
                          }}
                          sx={{ color: "blue" }}
                        >
                          <EditIcon />
                        </IconButton> */}
                        <IconButton
                          aria-label="delete"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleOpenConfirmDelete(item.Cid);
                          }}
                          sx={{ color: "red" }}
                        >
                          {/* <DeleteIcon /> */}
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

export default SidebarContactDetails;
