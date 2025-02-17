import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import axios from "axios";
import Swal from "sweetalert2";
import CampaignIcon from '@mui/icons-material/Campaign';
import { useCookies } from "react-cookie";
import DOMPurify from "dompurify"; // Import DOMPurify for sanitization

const Listcampaign = ({ item, onDelete, onEdit, onHistoryClick }) => {
  console.log(item, "Campaign Data <<<>>>>>>");

  const [cookies] = useCookies(["amr"]);
  const [templates, setTemplates] = useState([]);

  // Fetch the campaign template data from the API
  useEffect(() => {
    if (item?.CampaignID) {
      fetchTemplates();
    }
  }, [item]);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-get-templates.php?CampaignID=${item?.CampaignID}`
      );
      if (response.data.status === "Success") {
        setTemplates(response.data.data || []);
      } else {
        setTemplates([]);
      }
    } catch (error) {
      console.error("Error fetching campaign templates:", error);
      setTemplates([]);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  };

  // Format time function
  const formatTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}Z`);
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${hours}:${minutes} ${ampm}`;
  };

  // Safely render the HTML content for templates
  const renderTemplateContent = (content) => {
    // Sanitize HTML content to prevent XSS attacks
    const sanitizedContent = DOMPurify.sanitize(content); // Sanitize HTML
    return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
  };

  // Display contact names extracted from the item
  const contactNames = item?.ContactNames ? item.ContactNames.split(',').map(contact => {
    const name = contact.split(' (ID:')[0]; // Remove ID part
    return name.trim();
  }) : [];

  return (
    <Card sx={{}}>
      <Paper sx={{ padding: 5 }}>
        <Box sx={{ width: "100%", display: "flex", alignItems: "center", padding: 5 }}>
          <CampaignIcon sx={{ width: 60, height: 60, mr: 6 }} />
          <Box sx={{ flex: "1 1" }}>
            <Typography variant="h6" sx={{ fontWeight: 500, fontSize: "1.0rem" }}>
              {item?.CampaignName}
            </Typography>
          </Box>
        </Box>

        {/* Display Campaign Information */}
        <Box sx={{ width: "100%", ml: 2 }}>
          <Grid container spacing={3} sx={{ mb: 6 }}>
          
            <Grid item xs={4}>
              <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                  Campaign Type
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                  {item?.TemplateTypeNames}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                  Template Name
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                {item?.TemplateNames}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                  Date
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                  {formatDate(item?.Date)}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                  Time
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                  {formatTime(item?.Time)}
                </Typography>
              </Card>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2, mb:4 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem", mb: 1 }}>
              Contacts:
            </Typography>
            {contactNames.map((contact, index) => (
              <Chip
                key={index}
                label={contact}
                sx={{
                  margin: 0.5,
                  backgroundColor: "#e0e0e0",
                  "&:hover": {
                    backgroundColor: "#dcdcdc",
                  },
                }}
              />
            ))}
          </Box>
          {/* Display Template Data */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {templates.length > 0 ? (
              templates.map((template, index) => (
                <Grid item xs={12} key={index}>
                  <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                      Template Name: {template.TemplateNames}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.7rem", marginTop: 1 }}>
                      Template Type: {template.TemplateTypeNames}
                    </Typography>
                    {/* Render the HTML content safely using dangerouslySetInnerHTML */}
                    <Box sx={{ marginTop: 2, maxHeight: "400px", overflowY: "auto", border: "1px solid #e0e0e0", padding: "10px" }}>
                      {renderTemplateContent(template.TemplateContents)}
                    </Box>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                  No templates found for this campaign.
                </Typography>
              </Grid>
            )}
          </Grid>

          {/* Display Contacts */}
          
        </Box>
      </Paper>
    </Card>
  );
};

export default Listcampaign;
