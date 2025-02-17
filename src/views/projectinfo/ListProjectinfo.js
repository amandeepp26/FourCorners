import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ApartmentIcon from '@mui/icons-material/Apartment';
import axios from "axios";
import Swal from 'sweetalert2';
import { useCookies } from "react-cookie";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
const Listprojectinfo = ({ item, onDelete, onEdit, onHistoryClick }) => {
  const [cookies] = useCookies(["amr"]);
  const [projectDetails, setProjectDetails] = useState(null);

  const fetchProjectDetails = async (projectID) => {
    try {
      const response = await axios.get(`https://apiforcornershost.cubisysit.com/api/api-fetch-projectdetails.php?ProjectID=${projectID}`);
      if (response.data.status === "Success") {
        setProjectDetails(response.data.data[0]);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to fetch project details!',
        });
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Please try again later.',
      });
    }
  };

  useEffect(() => {
    if (item && item.ProjectID) {
      fetchProjectDetails(item.ProjectID);
    }
  }, [item]);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(item);
    }
  };
  const isDetailsEmpty = projectDetails === null || Object.values(projectDetails).every(value => !value);

  if (isDetailsEmpty) {
    return <Typography>No project details available.</Typography>;
  }
  if (!projectDetails) {
    return <Typography>Loading project details...</Typography>;
  }

  return (
    <>
      <Grid container justifyContent="center" spacing={2} sx={{ marginBottom: 5 }}>
        <Grid item>
          <Button
            variant="contained"
            onClick={handleEdit}
            startIcon={<EditIcon />}
            sx={{
              color: "#333333",
              fontSize: "0.6rem",
              backgroundColor: "#f0f0f0",
              minWidth: "auto",
              minHeight: 20,
              "&:hover": {
                backgroundColor: "#dcdcdc",
              },
            }}
          >
            Edit Details
          </Button>
        </Grid>
      </Grid>

      <Card>
        <Paper sx={{ padding: 5 }}>
          <Box sx={{ width: "100%", display: "flex", alignItems: "center", padding: 5 }}>
            <ApartmentIcon style={{ fontSize: 30, textAlign: "center", width: 60, height: 60, mr: 6, color: '#b187fd' }} />
            <Box sx={{ flex: "1 1" }}>
              <Typography variant="h6" sx={{ fontWeight: 500, fontSize: "1.0rem" }}>
                {projectDetails.ProjectName}
              </Typography>
              <Typography sx={{ fontSize: "0.8rem" }}>
                Created By: {projectDetails.Name}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ width: "auto", display: "flex", alignItems: "center", justifyContent: "center", ml: 12, mt: 15 }}>
            <Grid container spacing={3}>
              {/* Project Code */}
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    Project Code
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {projectDetails.ProjectCode}
                  </Typography>
                </Card>
              </Grid>

              {/* Project Manager */}
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    Project Manager
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {projectDetails.Name} {/* Assuming Name refers to the project manager */}
                  </Typography>
                </Card>
              </Grid>

              {/* Area sqft */}
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    Area (sqft)
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {projectDetails.Areasqft}
                  </Typography>
                </Card>
              </Grid>

              {/* Video Link */}
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    Video Link
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    <a href={projectDetails.VideoLink} target="_blank" rel="noopener noreferrer">
                      {projectDetails.VideoLink}
                    </a>
                  </Typography>
                </Card>
              </Grid>

              {/* Virtual Link */}
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    Virtual Link
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    <a href={projectDetails.VirtualLink} target="_blank" rel="noopener noreferrer">
                      {projectDetails.VirtualLink}
                    </a>
                  </Typography>
                </Card>
              </Grid>

              {/* Launch Date */}
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    Launch Date
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {new Date(projectDetails.LaunchDate).toLocaleDateString()}
                  </Typography>
                </Card>
              </Grid>

              {/* Completion Date */}
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    Completion Date
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {new Date(projectDetails.CompletionDate).toLocaleDateString()}
                  </Typography>
                </Card>
              </Grid>

              {/* Possession Date */}
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    Possession Date
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {new Date(projectDetails.PossessionDate).toLocaleDateString()}
                  </Typography>
                </Card>
              </Grid>

              {/* Remarks */}
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    Unit Type 
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {projectDetails.Remark}
                  </Typography>
                </Card>
              </Grid>

              {/* CC */}
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    CC
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {projectDetails.Cc}
                  </Typography>
                </Card>
              </Grid>

              {/* OC */}
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    OC
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {projectDetails.Oc}
                  </Typography>
                </Card>
              </Grid>

              {/* Facebook Link */}
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    Facebook Link
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    <a href={projectDetails.FacebookLink} target="_blank" rel="noopener noreferrer">
                      {projectDetails.FacebookLink}
                    </a>
                  </Typography>
                </Card>
              </Grid>

              {/* Instagram Link */}
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    Instagram Link
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    <a href={projectDetails.InstagramLink} target="_blank" rel="noopener noreferrer">
                      {projectDetails.InstagramLink}
                    </a>
                  </Typography>
                </Card>
              </Grid>

              {/* Latitude */}
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                    Project Location 
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {projectDetails.Latitude}
                  </Typography>
                </Card>
              </Grid>

              {/* Description/Para */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
                 Email Paragraph
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                    {projectDetails.Para}
                  </Typography>
                </Card>
              </Grid>

              {/* Amenities */}
              <Grid item xs={12}>
  <Card variant="outlined" sx={{ borderRadius: 1, padding: "10px" }}>
    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
      Amenities
    </Typography>
    <Grid container spacing={2} sx={{ paddingLeft: 2, flexWrap: "wrap" }}>
      {projectDetails.AmenitiesNames.map((amenity, index) => (
        <Grid item key={index}>
          <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
            {`${index + 1}. ${amenity}`}
          </Typography>
        </Grid>
      ))}
    </Grid>
  </Card>
</Grid>


            </Grid>
          </Box>
        </Paper>
      </Card>
    </>
  );
};

export default Listprojectinfo;
