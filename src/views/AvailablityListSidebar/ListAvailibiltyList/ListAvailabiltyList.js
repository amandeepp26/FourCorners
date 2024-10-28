import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  CircularProgress,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  Card,
  TextField,
  CardContent,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import Swal from 'sweetalert2';

const NoDataIcon = () => (
  <Avatar
    alt="No Data"
    sx={{ width: 500, height: "auto" }}
    src="/images/avatars/nodata.svg"
  />
);

const ListAvailabiltyList = ({ item }) => {
  const router = useRouter();
  const [wings, setWings] = useState([]);
  const [selectedWing, setSelectedWing] = useState(null);
  const [wingDetails, setWingDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(true);
  const [maxFlats, setMaxFlats] = useState(0);
  const [editingCell, setEditingCell] = useState(null);
  const [skuOptions, setSkuOptions] = useState([]);
  const [parkingData, setParkingData] = useState([]);
  const [holdDetails, setHoldDetails] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      if (!item) return;
      try {
        const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-fetch-projectwings.php?ProjectID=${item.ProjectID}`;
        const response = await axios.get(apiUrl);
        if (response.data.status === "Success") {
          setWings(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching wings data:", error);
      }
    };
    fetchData();
  }, [item]);

  const handleWingClick = async (wing) => {
    try {
      setLoading(true);
      const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-fetch-avilability.php?WingID=${wing.WingID}&ProjectID=${item.ProjectID}`;
      const response = await axios.get(apiUrl);

      if (response.data.status === "Success") {
        const wingData = response.data.data;
        setWingDetails(wingData);
        setSelectedWing(wing);

        const maxFlats = Math.max(...Object.values(wingData).map(flats => flats.length));
        setMaxFlats(maxFlats);
        setDataAvailable(true);
      } else {
        setDataAvailable(false);
      }
    } catch (error) {
      console.error("Error fetching wing details:", error);
      setDataAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  const getCellBackgroundColor = (skuID) => {
    switch (skuID) {
      case 1:
        return '#d4edda'; 
      case 2:
        return '#fff3cd'; 
      case 3:
        return '#f8d7da';
      case 4:
        return '#d6d6d6'; 
      default:
        return '#ffffff'; 
    }
  };

  const getStatusText = (skuID) => {
    switch (skuID) {
      case 1:
        return 'Avl'; 
      case 2:
        return 'HLD'; 
      case 3:
        return 'SLD'; 
      default:
        return 'RFG'; 
    }
  };

  const fetchSkuOptions = async () => {
    try {
      const response = await axios.get(
        "https://apiforcornershost.cubisysit.com/api/api-singel-projectskuid.php"
      );
      if (response.data.status === "Success") {
        setSkuOptions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching SKU options:", error);
    }
  };
  useEffect(() => {
    console.log("Item:", item); 
    const fetchParkingData = async () => {
      if (!item) return;
      try {
        const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-fetch-parkingdata.php?ProjectID=${item.ProjectID}`;
        const response = await axios.get(apiUrl);
        if (response.data.status === "Success") {
          setParkingData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching parking data:", error);
      }
    };
    fetchParkingData();
  }, [item]);
  
  const handleCellClick = (floorNo, flatNo) => {
    setEditingCell({ floorNo, flatNo });
    setHoldDetails('');
    fetchSkuOptions();
  };

  const handleSkuChange = async (event) => {
    const newSkuID = event.target.value;
    const { floorNo, flatNo } = editingCell;
    const currentFlat = wingDetails[floorNo] && wingDetails[floorNo][flatNo - 1];
    const statusSkuID = currentFlat.skuID === 1 ? 2 : 1;

    const requestData = {
      skuID: statusSkuID,
      ModifyUID: 1,
      ProjectID: item.ProjectID,
      WingID: selectedWing.WingID,
      FloorNo: floorNo,
      FlatNo: currentFlat.FlatNo,
      Partyname: holdDetails,  
    };
    console.log("Sending the following data:", requestData);
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to update?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(
          "https://proxy-forcorners.vercel.app/api/proxy/api-update-projectsku.php",
          requestData
        );

        if (response.data.status === "Success") {
          setWingDetails((prevDetails) => ({
            ...prevDetails,
            [floorNo]: prevDetails[floorNo].map((flat, index) =>
              index === flatNo - 1 ? { ...flat, skuID: statusSkuID } : flat
            ),
          }));
          Swal.fire(
            'Updated!',
            'The Availability List has been updated successfully.',
            'success'
          );
          setEditingCell(null);
        } else {
          Swal.fire(
            'Failed!',
            'There was an issue updating the SKU ID.',
            'error'
          );
        }
      } catch (error) {
        console.error("Error updating SKU ID:", error);
        Swal.fire(
          'Error!',
          'An error occurred while updating the SKU ID.',
          'error'
        );
      }
    }
  };

  const getHeldPartyNames = () => {
    const partyNames = [];

    // Iterate over the wingDetails to find flats with HLD status
    Object.values(wingDetails).forEach(flats => {
      flats.forEach(flat => {
        if (flat.skuID === 2) { // Assuming 2 corresponds to HLD
          partyNames.push(flat.Partyname); // Collecting Partyname for HLD
        }
      });
    });

    return partyNames;
  };

  const countStatuses = () => {
    const counts = { Avl: 0, HLD: 0, RFG: 0, SLD: 0 };

    Object.values(wingDetails).forEach(flats => {
      flats.forEach(flat => {
        const status = getStatusText(flat.skuID);
        if (status in counts) {
          counts[status]++;
        }
      });
    });

    return counts;
  };
  const totalParking = parkingData.length;
  const ProjectRoomTable = ({ data, maxFlats }) => {
    const headers = Array.from({ length: maxFlats }, (_, i) => `FlatNo ${i + 1}`);
  
    return (
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid black' }}>
            <th style={{ border: '1px solid black', padding: '8px' }}>FloorNo</th>
            {headers.map((header) => (
              <th key={header} style={{ border: '1px solid black', padding: '8px' }}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(data).map((floorNo) => {
            const flats = data[floorNo];
            return (
              <tr key={floorNo}>
                <td style={{ border: '1px solid black', padding: '8px' }}>{floorNo}</td>
                {Array.from({ length: maxFlats }).map((_, i) => {
                  const flat = flats[i] || {};
                  const isEditing = editingCell && editingCell.floorNo === floorNo && editingCell.flatNo === i + 1;
                  return (
                    <td
                      key={i}
                      style={{
                        border: '1px solid black',
                        padding: '8px',
                        backgroundColor: getCellBackgroundColor(flat.skuID),
                        textAlign: 'center',
                        cursor: flat.skuID === 1 || flat.skuID === 2 ? 'pointer' : 'default',
                      }}
                      onClick={(e) => {
                        if (flat.skuID === 1 || flat.skuID === 2) {
                          if (e.target.tagName !== 'INPUT') {
                            handleCellClick(floorNo, i + 1);
                          }
                        }
                      }}
                    >
                      {isEditing ? (
                        <FormControl>
                          <Select
                            value={flat.skuID}
                            onChange={handleSkuChange}
                            autoWidth
                          >
                            {skuOptions.map((option) => (
                              <MenuItem key={option.skuID} value={option.skuID}>
                                {option.skuName}
                              </MenuItem>
                            ))}
                          </Select>
                          {flat.skuID === 1 && (
                            <TextField
                              fullWidth
                              type="text"
                              name="Partyname"
                              label="Enter Party Name"
                              value={holdDetails}
                              onChange={(e) => setHoldDetails(e.target.value)}
                              onFocus={(e) => e.stopPropagation()}
                              style={{ marginTop: '8px', width: '100%' }}
                            />
                          )}
                        </FormControl>
                      ) : (
                        <>
                          {flat.Area}<br />
                          {flat.Flat}<br />
                          <span style={{ color: '#000000' }}>{getStatusText(flat.skuID)}</span>
                          {/* Show Partyname if skuID is 2 */}
                          {flat.skuID === 2 && flat.Partyname && (
                            <div style={{ fontWeight: 'bold', color: 'orange' }}>
                              {flat.Partyname}
                            </div>
                          )}
                        </>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };
  

  const statusCounts = countStatuses();

  return (
    <>
      <Grid container justifyContent="center" spacing={2} sx={{ marginBottom: 5 }}>
        {wings.map((wing) => (
          <Grid item key={wing.WingID}>
            <Button
              variant="contained"
              onClick={() => handleWingClick(wing)}
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
              Wing {wing.WingName}
            </Button>
          </Grid>
        ))}
      </Grid>

      {loading && <CircularProgress />}

      {selectedWing && (
        <div>
          <h2>Details for {selectedWing.WingName}</h2>
          {dataAvailable ? (
            <>
              <ProjectRoomTable data={wingDetails} maxFlats={maxFlats} />
            
              <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>


<Grid>
  <Card sx={{ marginTop: 4, padding: 2, border: '2px solid #d4edda', borderRadius: '8px',  }}>
    <CardContent>
      <Typography variant="body2">Sold : {statusCounts.SLD}</Typography>
    </CardContent>
  </Card>
</Grid>
<Grid>
  <Card sx={{ marginTop: 4, padding: 2  , border: '2px solid #d4edda', borderRadius: '8px', }}>
    <CardContent>
      <Typography variant="body2">Available : {statusCounts.Avl}</Typography>
    </CardContent>
  </Card>
</Grid>
<Grid>
  <Card sx={{ marginTop: 4, padding: 2, border: '2px solid #d4edda', borderRadius: '8px',  }}>
    <CardContent>

      <Typography variant="body2">Hold : {statusCounts.HLD}</Typography>
    </CardContent>
  </Card>
</Grid>
<Grid>
  <Card sx={{ marginTop: 4, padding: 2, border: '2px solid #d4edda', borderRadius: '8px',   }}>
    <CardContent>
      <Typography variant="body2">REFUGE (RFG): {statusCounts.RFG}</Typography>
    </CardContent>
  </Card>
</Grid>
<Grid>
  <Card sx={{ marginTop: 4, padding: 2, border: '2px solid #d4edda', borderRadius: '8px',  }}>
    <CardContent>
      <Typography variant="body2">Total Parking : {totalParking}
      </Typography>
    </CardContent>
  </Card>
</Grid>
</Grid>
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            
              </Typography>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid black' }}>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Parking No</th>
                    <th style={{ border: '1px solid black', padding: '8px' }}>Parking avilability</th>
                  </tr>
                </thead>
                <tbody>
                  {parkingData.map((parking, index) => (
                  <tr key={index}>
                      <td style={{ border: '1px solid black', padding: '8px' }}>{index+1}</td>
                      <td style={{ border: '1px solid black', padding: '8px', backgroundColor: parking.CProcess === 1 ? '#f8d7da' : '#d4edda' }}>{parking.ParkingAvilability}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            
            </>
          ) : (
            <NoDataIcon />
          )}
        </div>
      )}
    </>
  );
};

export default ListAvailabiltyList;

