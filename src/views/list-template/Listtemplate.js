import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import EditIcon from "@mui/icons-material/Edit";
import GetAppIcon from "@mui/icons-material/GetApp";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Menu, MenuItem , Paper ,Box, Typography} from "@mui/material";

import Swal from "sweetalert2";
import axios from "axios";
import { useCookies } from "react-cookie";

const ListTemplate = ({ item, onEdit, onHistoryClick }) => {
  const [cookies] = useCookies(["amr"]);
  const [templateData, setTemplateData] = useState(null);
  
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-fetch-template.php?Tid=${item.templateID}`;
      const response = await axios.get(apiUrl);

      if (response.data.status === "Success") {
        console.log(response.data.data[0], "Single template data fetched");
        setTemplateData(response.data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching single template data:", error);
    }
  };

  const fetchProject = () => {
    axios
      .get("https://apiforcornershost.cubisysit.com/api/api-fetch-projectmaster.php")
      .then((response) => {
        if (response.data.status === "Success") {
          setProjectTypeData(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching project data:", error);
      });
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(item); // Pass item to parent component for editing
    }
  };

  const handleHistoryClick = () => {
    if (onHistoryClick) {
      onHistoryClick(item); // Pass item to parent component for showing history
    }
  };

  const downloadCSV = () => {
    // Adjust the CSV download according to your template data
    const csvData = [
      {
        "T Name": templateData?.TName || "",
        "Para": templateData?.para || "",
        "File": templateData?.file || "",
        "URL": templateData?.url || "",
        "Status": templateData?.Status || "",
        "Create UID": templateData?.CreateUID || "",
        "Create Date": templateData?.CreateDate || "",
      },
    ];

    const jsonToCSV = (json) => {
      const header = Object.keys(json[0]).join(",");
      const values = json.map((obj) => Object.values(obj).join(",")).join("\n");
      return `${header}\n${values}`;
    };

    const csv = jsonToCSV(csvData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlenavigate = () => {
    window.location.href = "/opportunity/";
  };

  return (
    <Card sx={{}}>
    <Paper sx={{ padding: 5 }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          padding: 5,
        }}
      >
        {/* Avatar (if needed) */}
        {/* <Avatar
          alt="John Doe"
          sx={{ width: 60, height: 60, mr: 6 }}
          src="/images/avatars/1.png"
        /> */}
        <Box sx={{ flex: "1 1" }}>
          <Typography variant="h6" sx={{ fontWeight: 500, fontSize: "1.0rem" }}>
            {item?.CName}
          </Typography>
          <Typography sx={{ fontSize: "0.8rem" }}>
            {item?.Mobile}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ width: "100%", display: "flex", alignItems: "center", ml: 20 }}>
        {/* Source Name */}
        <div style={{ mr: 5 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#333333",
              fontSize: "0.7rem",
              minWidth: "auto",
              padding: "5px",
              backgroundColor: "#f0f0f0",
              borderRadius: 2,
              minHeight: 20,
              marginLeft: 2,
              "&:hover": {
                backgroundColor: "#dcdcdc",
              },
            }}
          >
            Source Name: {item?.SourceName}
          </Typography>
        </div>
        {/* Location */}
        <div style={{ marginRight: 5 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#333333",
              fontSize: "0.7rem",
              minWidth: "auto",
              padding: "5px",
              borderRadius: 2,
              minHeight: 20,
              marginLeft: 2,
              backgroundColor: "#f0f0f0",
              "&:hover": {
                backgroundColor: "#dcdcdc",
              },
            }}
          >
            Location: {item?.Location}
          </Typography>
        </div>
        {/* Attended By */}
        <div style={{ marginRight: 5 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#333333",
              fontSize: "0.7rem",
              minWidth: "auto",
              padding: "5px",
              borderRadius: 2,
              minHeight: 20,
              marginLeft: 2,
              backgroundColor: "#f0f0f0",
              "&:hover": {
                backgroundColor: "#dcdcdc",
              },
            }}
          >
            Attended By: {item?.TelecallAttendedByName}
          </Typography>
        </div>
      </Box>

      {/* Additional Details */}
      <Box
        sx={{
          width: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ml: 12,
          mt: 15,
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 1,
                padding: "10px",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                Template Name
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                {item?.TName}
              </Typography>
            </Card>
          </Grid>
     
          <Grid item xs={4}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 1,
                padding: "10px",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                Template Type
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                {item?.templatetypeName}
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={4}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 1,
                padding: "10px",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                Para
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                {item?.para}
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={4}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 1,
                padding: "10px",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                File
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                {item?.file}
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={4}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 1,
                padding: "10px",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                URL
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                {item?.url}
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={4}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 1,
                padding: "10px",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                Status
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                {item?.Status}
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={4}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 1,
                padding: "10px",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
           Project Name
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                {item?.ProjectName}
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={4}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 1,
                padding: "10px",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                Create Date
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                {item?.CreateDate}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  </Card>
  );
};

export default ListTemplate;
