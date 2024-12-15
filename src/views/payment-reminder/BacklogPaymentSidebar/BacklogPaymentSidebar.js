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
  MenuItem,
  IconButton,
  Popover,
  ListItemAvatar,
  Modal,
  Button,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
// import  Chip from '@mui/material';
import SortIcon from "@mui/icons-material/Sort";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GetAppIcon from "@mui/icons-material/GetApp";
import { useCookies } from "react-cookie";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BacklogPaymentSidebar = ({ onItemClick, onCreate }) => {
  const initialFormData = {
    AmountGiven: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [cookies, setCookie] = useCookies(["amr"]);
  const [modalOpen, setModalOpen] = useState(false);
  const [cashPaid, setCashPaid] = useState("");
  const [chequePaid, setChequePaid] = useState("");
  const userid = cookies.amr?.UserID || "Role";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-backlogreminder.php?UserID=${userid}`
        // https://apiforcornershost.cubisysit.com/api/api-fetch-backlog.php?UserID=${userid}
      );
      console.log("BACKLOG PAYEMent DTAA", response.data);
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
          item?.Name?.toLowerCase().includes(lowerCaseQuery) ||
          item?.Mobile?.toLowerCase().includes(lowerCaseQuery)
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
  const getDateStatus = (contactCreateDate) => {
    const date = new Date(contactCreateDate);
    const now = new Date();

    const isCurrentMonth =
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
    const isPreviousMonth =
      date.getMonth() === now.getMonth() - 1 &&
      date.getFullYear() === now.getFullYear();

    if (isCurrentMonth) {
      return "New";
    } else if (isPreviousMonth) {
      return "In Progress";
    } else {
      return null;
    }
  };
  const handleFilterMenuOpen = (event) => {
    setAnchorElFilter(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setAnchorElFilter(null);
  };
  const calculateBalance = () => {
    return totalCost - handleAddition();
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
          (a, b) => new Date(a.RemarkDate) - new Date(b.RemarkDate)
        );
        break;
      case "desc":
        sortedRows.sort(
          (a, b) => new Date(b.RemarkDate) - new Date(a.RemarkDate)
        );
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

  const handleModalOpen = (totalCost) => {
    setTotalCost(totalCost);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleAddition = () => {
    const cashPaidNumber = parseFloat(cashPaid) || 0;
    const chequePaidNumber = parseFloat(chequePaid) || 0;
    return cashPaidNumber + chequePaidNumber;
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, AmountGiven: date });
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
            Backlog Payment Reminder
          </Typography>
          <Box display="flex" alignItems="center">
            {/* <IconButton
              aria-label="filter"
              sx={{ color: "grey" }}
              onClick={onCreate}
            >
              <AddIcon />
            </IconButton> */}
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
          <Typography variant="h6">No data found</Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Try adjusting your search or filters.
          </Typography>
        </Box>
      ) : (
        <List>
          {filteredRows.map((item) => (
            <React.Fragment key={item.BookingID}>
              <Card sx={{ marginBottom: 2 }}>
                <ListItem
                  key={item.BookingID}
                  disablePadding
                  onClick={() => onItemClick(item)}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={item.Name}
                      sx={{ width: 40, height: 40, margin: 2 }}
                      src="/images/avatars/1.png"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" style={{  fontWeight: "bold"}}>
                       {item?.TitleName} {item.Name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" style={{ fontSize: 10,fontWeight:600 }}>
                          Remark: {item.RemarkName}
                        </Typography>
                        <Typography variant="body2" style={{ fontSize: 10,fontWeight:600 }}>
                          Date: {item.RemarkDate}
                        </Typography>
                        <Typography variant="body2" style={{ fontSize: 10,fontWeight:600 }}>
                        Remark amount: {item.Remarkamount}
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
    </Card>
  );
};

export default BacklogPaymentSidebar;
