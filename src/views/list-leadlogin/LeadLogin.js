import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TextField,
  InputAdornment,
  TableContainer,
  TablePagination,
  Button,
  CircularProgress,
  Backdrop,
  Typography
} from "@mui/material";
import { useRouter } from 'next/router';
import { useCookies } from "react-cookie";
import SearchIcon from "@mui/icons-material/Search";
import LoginIcon from "@mui/icons-material/Login";
import { useSnackbar } from 'notistack';

const Loader = () => (
  <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={true}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
);

const LeadLogin = ({ setShowTabAccount }) => {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["amr"]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoading, setGlobalLoading] = useState(false); // New state for global loading

  useEffect(() => {
    fetchData();
  }, []);


  
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://apiforcornershost.cubisysit.com/api/api-fetch-usermaster.php"
      );
      setRows(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    const query = event.target.value.toLowerCase();
    const filtered = rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(query)
      )
    );
    setFilteredRows(filtered);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getComparator = (order, sortBy) => {
    return (a, b) => {
      if (a[sortBy] < b[sortBy]) return order === "asc" ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return order === "asc" ? 1 : -1;
      return 0;
    };
  };

  const handleSort = (sortBy) => {
    const isAsc = orderBy === sortBy && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(sortBy);
    const sortedData = filteredRows.slice().sort(getComparator(order, sortBy));
    setFilteredRows(sortedData);
  };

  const SortableTableCell = ({ label, onClick }) => (
    <TableCell
      sx={{ fontWeight: "bold", fontSize: "1rem", cursor: "pointer" }}
      onClick={onClick}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {label}
        <span>&#8597;</span>
      </Box>
    </TableCell>
  );

  const handleSubmit = async (row) => {
    event.preventDefault();
    setGlobalLoading(true); // Start global loading

    try {
      const formData = {
        username: row?.username,
        admin: true,
      };

      const response = await axios.post(
        "https://proxy-forcorners.vercel.app/api/proxy/api-data-login.php",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "Success") {
        const user = {
          FullName: response.data.data.Name,
          UserID: response.data.data.userid,
          RoleID: response.data.data.roleid,
          RoleName: response.data.data.rolename,
        };

        

        setCookie("amr", JSON.stringify(user), { path: "/" });

        if (user.RoleID === 1) {
          router.push("/");
        } else if (user.RoleID === 3) {
          router.push("/SaleDashboard");
        } else {
          router.push("/Telecalling");
        }
        console.log("SUBMITTED DATA");
      } else {
        enqueueSnackbar(response.data.message, { variant: "error" });
      }
    } catch (error) {
      console.error("There was an error!", error);
      enqueueSnackbar("There was an error, Please contact admin", {
        variant: "error",
      });
    } finally {
      setGlobalLoading(false); // Stop global loading
    }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      {globalLoading && <Loader />} {/* Render loader when globalLoading is true */}

      <Card>
        <Box sx={{ padding: "16px", display: "flex", justifyContent: "flex-end" }}>
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
                borderRadius: "20px",
                "& fieldset": {
                  borderRadius: "20px",
                },
              },
            }}
          />
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
            <TableHead>
              <TableRow>
                <SortableTableCell label="Name" onClick={() => handleSort("Name")} />
                <SortableTableCell label="Mobile" onClick={() => handleSort("MobileNo")} />
                <SortableTableCell label="Email" onClick={() => handleSort("email")} />
                <SortableTableCell label="Username" onClick={() => handleSort("username")} />
                <SortableTableCell label="User Role" onClick={() => handleSort("UserRole")} />
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(searchQuery ? filteredRows : rows).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ padding: "8px", fontSize: "0.75rem" }}>
                    {row.Name}
                  </TableCell>
                  <TableCell sx={{ padding: "8px", fontSize: "0.75rem" }}>
                    {row.MobileNo}
                  </TableCell>
                  <TableCell sx={{ padding: "8px", fontSize: "0.75rem" }}>
                    {row.email}
                  </TableCell>
                  <TableCell sx={{ padding: "8px", fontSize: "0.75rem" }}>
                    {row.username}
                  </TableCell>
                  <TableCell sx={{ padding: "8px", fontSize: "0.75rem" }}>
                    {row.UserRole || "N/A"}
                  </TableCell>
                  <TableCell sx={{ padding: "8px", fontSize: "0.875rem", display: "flex", justifyContent: "space-around" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={!loading && <LoginIcon sx={{ color: "white" }} />}
                      onClick={() => handleSubmit(row)}
                      disabled={loading}
                      sx={{
                        textTransform: "none",
                        borderRadius: "20px",
                        padding: "6px 12px",
                        fontSize: "0.875rem",
                        color: "white",
                        '& .MuiButton-startIcon': {
                          color: "white",
                        },
                      }}
                    >
                      {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Login"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={searchQuery ? filteredRows.length : rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Box>
  );
};

export default LeadLogin;
