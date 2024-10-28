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
  IconButton,
  Dialog,
  DialogActions,
  ListItemAvatar,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Popover,
} from "@mui/material";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import SortIcon from "@mui/icons-material/Sort";
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useCookies } from "react-cookie";

const Sidebar = ({ onEdit, onItemClick, onCreate }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const [anchorElDots, setAnchorElDots] = useState(null);
  const [cookies] = useCookies(["amr"]);
  const userName = cookies.amr?.FullName || "User";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-campaigndata.php`
      );
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
          item.CampaignName?.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredRows(filteredData);
    }
  }, [searchQuery, rows]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredRows(rows);
  };

  const handleListItemClick = (item) => {
    onItemClick(item);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  };

  const formatTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}Z`);
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <Card sx={{ width: 330, padding: 5, height: 700, overflowY: "auto" }}>
      <Grid item xs={12} sx={{ marginBottom: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" sx={{ fontWeight: "bold", fontSize: 20 }}>
            All Campaigns
          </Typography>
          <Box display="flex" alignItems="center">
            <IconButton aria-label="create" sx={{ color: "grey" }} onClick={onCreate}>
              <AddIcon />
            </IconButton>
            <IconButton aria-label="filter" sx={{ color: "grey" }} onClick={() => setAnchorElFilter(true)}>
              <SortIcon />
            </IconButton>
            <IconButton aria-label="more" onClick={() => { /* handle download */ }} sx={{ color: "grey" }}>
              <MoreVertIcon />
            </IconButton>
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
              <IconButton aria-label="clear search" onClick={handleClearSearch} edge="end" sx={{ color: "grey" }}>
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

      {loading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : filteredRows.length === 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", mt: 2 }}>
          <ErrorOutlineIcon sx={{ fontSize: 40, mb: 2 }} />
          <Typography variant="h6">No data found</Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={onCreate} sx={{ mt: 2 }}>
            Create Campaign
          </Button>
        </Box>
      ) : (
        <List>
          {filteredRows.map((item) => (
            <React.Fragment key={item.CampaignID}>
              <Card sx={{ marginBottom: 2 }}>
                <ListItem disablePadding onClick={() => handleListItemClick(item)}>
                  <ListItemAvatar>
                    <Avatar
                      alt="John Doe"
                      sx={{ width: 40, height: 40, margin: 2 }}
                      src="/images/avatars/1.png"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" style={{ fontWeight: 600, fontSize: 13 }}>
                        {item?.CampaignName}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" style={{ fontSize: 10 }}>
                          Template Name: {item?.TName}
                        </Typography>
                        <Typography variant="body2" style={{ fontSize: 10 }}>
                          Project Name: {item?.ProjectName}
                        </Typography>
                        <Typography variant="body2" style={{ fontSize: 10 }}>
                          Date: {formatDate(item?.Date)} - Time: {formatTime(item?.Time)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </Card>
            </React.Fragment>
          ))}
        </List>
      )}

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => { /* Handle delete */ }} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default Sidebar;
