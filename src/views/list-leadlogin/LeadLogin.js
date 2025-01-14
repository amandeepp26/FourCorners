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
  Button,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import SearchIcon from "@mui/icons-material/Search";
import LoginIcon from "@mui/icons-material/Login";
import { useSnackbar } from "notistack";

const Loader = () => (
  <Backdrop
    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={true}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
);

const LeadLogin = ({ setShowTabAccount }) => {
  const router = useRouter();
  const [cookies, setCookie] = useCookies(["amr"]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoading, setGlobalLoading] = useState(false);

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
  const handleSubmit = async (row) => {
    event.preventDefault();
    setGlobalLoading(true);
  
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
  
        let url = "/";
        if (user.RoleID === 1) {
          url = "/";
        } else if (user.RoleID === 3) {
          url = "/SaleDashboard";
        } else {
          url = "/Telecalling";
        }
  
        // Clear the current page and navigate to the new URL
        document.body.innerHTML = ""; // Clear the page content
        window.location.replace(url); // Redirect to the specified URL
      } else {
        enqueueSnackbar(response.data.message, { variant: "error" });
      }
    } catch (error) {
      console.error("There was an error!", error);
      enqueueSnackbar("There was an error, Please contact admin", {
        variant: "error",
      });
    } finally {
      setGlobalLoading(false);
    }
  };
  
  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      {globalLoading && <Loader />}

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
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Mobile</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Username</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>User Role</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(searchQuery ? filteredRows : rows).map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ padding: "8px", fontSize: "0.75rem" }}>{row.Name}</TableCell>
                  <TableCell sx={{ padding: "8px", fontSize: "0.75rem" }}>{row.MobileNo}</TableCell>
                  <TableCell sx={{ padding: "8px", fontSize: "0.75rem" }}>{row.email}</TableCell>
                  <TableCell sx={{ padding: "8px", fontSize: "0.75rem" }}>{row.username}</TableCell>
                  <TableCell sx={{ padding: "8px", fontSize: "0.75rem" }}>
                    {row.UserRole || "N/A"}
                  </TableCell>
                  <TableCell sx={{ padding: "8px", fontSize: "0.875rem" }}>
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
                        "& .MuiButton-startIcon": {
                          color: "white",
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: "white" }} />
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default LeadLogin;
