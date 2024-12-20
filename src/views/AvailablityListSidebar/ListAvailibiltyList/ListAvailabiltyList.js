
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  CircularProgress,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  CardContent,
  Card,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

// Placeholder for No Data Icon
const NoDataIcon = () => (
  <Avatar alt="No Data" sx={{ width: 500, height: 'auto' }} src="/images/avatars/nodata.svg" />
);

const ListAvailabiltyList = ({ item }) => {
  const [wings, setWings] = useState([]);
  const [selectedWing, setSelectedWing] = useState(null);
  const [wingDetails, setWingDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(false);
  const [maxFlats, setMaxFlats] = useState(0);
  const [skuOptions, setSkuOptions] = useState([]);
  const [holdDetails, setHoldDetails] = useState('');
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [parkingData, setParkingData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Custom hook to manage modal z-index (SweetAlert2 styling fix)
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `.swal2-container { z-index: 9999 !important; }`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  useEffect(() => {
    const fetchParkingData = async () => {
      if (!item) return;
      try {
        const apiUrl = `https://apiforcornershost.cubisysit.com/api/api-fetch-parkingdata.php?ProjectID=${item.ProjectID}`;
        const response = await axios.get(apiUrl);
        if (response.data.status === "Success") {
          setParkingData(response.data.data);
        } else {
          setParkingData([]); // If no data, set parking data to an empty array
        }
      } catch (error) {
        console.error("Error fetching parking data:", error);
        setParkingData([]); // If error, set parking data to an empty array
      }
    };
    fetchParkingData();
  }, [item]);

  // Fetch wing data
  useEffect(() => {
    const fetchWings = async () => {
      if (!item) return;
      setDataAvailable(false); // Reset data availability to false when projectID changes
      setWingDetails({}); // Reset wing details
      setSelectedWing(null); // Reset selected wing
      setMaxFlats(0);
      try {
        const { data } = await axios.get(
          `https://apiforcornershost.cubisysit.com/api/api-fetch-projectwings.php?ProjectID=${item.ProjectID}`
        );
        if (data.status === 'Success') setWings(data.data);
      } catch (error) {
        console.error('Error fetching wings data:', error);
      }
    };
    fetchWings();
  }, [item]);


  useEffect(() => {
    const fetchSkuOptions = async () => {
      try {
        const { data } = await axios.get(
          'https://apiforcornershost.cubisysit.com/api/api-singel-projectskuid.php'
        );
        if (data.status === 'Success') setSkuOptions(data.data);
      } catch (error) {
        console.error('Error fetching SKU options:', error);
      }
    };
    fetchSkuOptions();
  }, []);


  const handleWingClick = async (wing) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://apiforcornershost.cubisysit.com/api/api-fetch-avilability.php?WingID=${wing.WingID}&ProjectID=${item.ProjectID}`
      );
      if (data.status === 'Success') {
        setWingDetails(data.data);
        setSelectedWing(wing);
        setMaxFlats(Math.max(...Object.values(data.data).map((flats) => flats.length)));
        setDataAvailable(true);
      
      } else {
        setDataAvailable(false);
      }
    } catch (error) {
      console.error('Error fetching wing details:', error);
      setDataAvailable(false);
    } finally {
      setLoading(false);
    }
  };


  const handleCellClick = (floorNo, flatNo) => {
    debugger;
    const flat = wingDetails[floorNo]?.[flatNo - 1];
    if (flat) {
      setSelectedFlat({
        floorNo,
        flatNo,
        skuID: flat.skuID,
        isOnHold:flat.skuID == 2 ? true: false,
      });
      setDialogOpen(true);
    }
  };

  // Handle SKU selection change
  const handleSkuChange = (event) => {
    setSelectedFlat((prevFlat) => ({
      ...prevFlat,
      skuID: event.target.value,
    }));
  };

  // Handle SKU update submit
  const handleSkuChangeSubmit = async () => {
    const { floorNo, flatNo, skuID } = selectedFlat;
    const currentFlat = wingDetails[floorNo]?.[flatNo - 1];
    if (!currentFlat) return;

    const requestData = {
      skuID,
      ModifyUID: 1,
      ProjectID: item.ProjectID,
      WingID: selectedWing.WingID,
      FloorNo: floorNo,
      FlatNo: currentFlat.FlatNo,
      Partyname: holdDetails,
    };

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!',
    });

    if (result.isConfirmed) {
      try {
        const { data } = await axios.post(
          'https://ideacafe-backend.vercel.app/api/proxy/api-update-projectsku.php',
          requestData
        );
        if (data.status === 'Success') {
          setWingDetails((prevDetails) => ({
            ...prevDetails,
            [floorNo]: prevDetails[floorNo].map((flat, index) =>
              index === flatNo - 1 ? { ...flat, skuID } : flat
            ),
          }));
          Swal.fire('Updated!', 'The Availability List has been updated successfully.', 'success');
          handleWingClick(selectedWing);
        } else {
          Swal.fire('Failed!', 'There was an issue updating the SKU ID.', 'error');
        }
      } catch (error) {
        console.error('Error updating SKU ID:', error);
        Swal.fire('Error!', 'An error occurred while updating the SKU ID.', 'error');
      }
    }
  };

  // Determine the background color for each cell based on SKU ID
  const getCellBackgroundColor = (skuID) => {
    switch (skuID) {
      case 1:
        return '#d4edda'; // Available
      case 2:
        return '#fff3cd'; // Hold
      case 3:
        return '#f8d7da'; // Sold
      case 4:
        return '#d6d6d6'; // Refurbished
      default:
        return '#ffffff'; // Default (empty)
    }
  };

  // Get status text based on SKU ID
  const getStatusText = (skuID) => {
    switch (skuID) {
      case 1:
        return 'Avl'; // Available
      case 2:
        return 'HLD'; // Hold
      case 3:
        return 'SLD'; // Sold
      default:
        return 'RFG'; // Refurbished
    }
  };

  // Render the table of availability
  const ProjectRoomTable = ({ data, maxFlats }) => {
    const headers = Array.from({ length: maxFlats }, (_, i) => `FlatNo ${i + 1}`);
    return (
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid black' }}>
            <th style={{ border: '1px solid black', padding: '8px' }}>FloorNo</th>
            {headers.map((header) => (
              <th key={header} style={{ border: '1px solid black', padding: '8px' }}>
                {header}
              </th>
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
                      onClick={() => {
                        const flat = flats[i] || {};
                        if (flat.skuID == 1 || flat.skuID == 2) {
                          handleCellClick(floorNo, i + 1);
                        }

                      }}
                    >
                      {flat.Area}<br />
                      {flat.Flat}<br />
                      <span style={{ color: '#000000' }}>{getStatusText(flat.skuID)}</span>
                      {flat.skuID === 2 && flat.Partyname && (
                        <div style={{ fontWeight: 'bold', color: 'orange' }}>
                          {flat.Partyname}
                        </div>
                      )}  </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
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

  const statusCounts = countStatuses();
  const countFlatsAndParking = () => {
    const flatCounts = { '1BHK': 0, '2BHK': 0, '3BHK': 0 };
  
    
    Object.values(wingDetails).forEach(flats => {
      flats.forEach(flat => {
        // Count flats by UnitytypeID
        switch (flat.UnittypeID) {
          case 1:
            flatCounts['1BHK']++;
            break;
          case 2:
            flatCounts['2BHK']++;
            break;
          case 3:
            flatCounts['3BHK']++;
            break;
          default:
            break;
        }
       
        

});
});

  
    return { flatCounts };
  };
  
  const { flatCounts } = countFlatsAndParking();
  
  const countParkingSpaces = () => {
    let soldCount = 0;
    let availableCount = 0;
  
    parkingData.forEach(parking => {
      if (parking.CProccess === 1) {
        soldCount++;
      } else {
        availableCount++;
      }
    });
  
    return { soldCount, availableCount, totalCount: parkingData.length };
  };
  
  // Call the function to get the counts
  const { soldCount, availableCount, totalCount } = countParkingSpaces();
  return (
    <>
      <Grid container justifyContent="center" spacing={2} sx={{ marginBottom: 5 }}>
        {wings.map((wing) => (
          <Grid item key={wing.WingID}>
            <Button
              variant="contained"
              onClick={() => handleWingClick(wing)}
              sx={{
                color: '#333333',
                fontSize: '0.6rem',
                backgroundColor: '#f0f0f0',
                minWidth: 'auto',
                minHeight: 20,
                '&:hover': {
                  backgroundColor: '#dcdcdc',
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
              <Grid 
  container 
  spacing={3} 
  justifyContent="center" 
  style={{ marginTop: '20px' }}
>
  {/* Group for Sold, Available, Hold, and Refuge */}
  <Grid item xs={12} sm={6} md={3}>
    <Card sx={{ padding: 2, border: '2px solid #d4edda', borderRadius: '8px', boxShadow: 2 }}>
      <CardContent>
        <Typography variant="body2" align="center">Sold : {statusCounts.SLD}</Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
    <Card sx={{ padding: 2, border: '2px solid #d4edda', borderRadius: '8px', boxShadow: 2 }}>
      <CardContent>
        <Typography variant="body2" align="center">Available : {statusCounts.Avl}</Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
    <Card sx={{ padding: 2, border: '2px solid #d4edda', borderRadius: '8px', boxShadow: 2 }}>
      <CardContent>
        <Typography variant="body2" align="center">Hold : {statusCounts.HLD}</Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
    <Card sx={{ padding: 2, border: '2px solid #d4edda', borderRadius: '8px', boxShadow: 2 }}>
      <CardContent>
        <Typography variant="body2" align="center">REFUGE (RFG): {statusCounts.RFG}</Typography>
      </CardContent>
    </Card>
  </Grid>

  {/* Group for 1BHK, 2BHK, and 3BHK */}
  <Grid item xs={12} sm={6} md={3}>
    <Card sx={{ padding: 2, border: '2px solid #d4edda', borderRadius: '8px', boxShadow: 2 }}>
      <CardContent>
        <Typography variant="body2" align="center">1BHK: {flatCounts['1BHK']}</Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
    <Card sx={{ padding: 2, border: '2px solid #d4edda', borderRadius: '8px', boxShadow: 2 }}>
      <CardContent>
        <Typography variant="body2" align="center">2BHK: {flatCounts['2BHK']}</Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
    <Card sx={{ padding: 2, border: '2px solid #d4edda', borderRadius: '8px', boxShadow: 2 }}>
      <CardContent>
        <Typography variant="body2" align="center">3BHK: {flatCounts['3BHK']}</Typography>
      </CardContent>
    </Card>
  </Grid>

  {/* Group for Parking */}
  <Grid item xs={12} sm={6} md={3}>
    <Card sx={{ padding: 2, border: '2px solid #d4edda', borderRadius: '8px', boxShadow: 2 }}>
      <CardContent>
        <Typography variant="body2" align="center">Sold Parking: {soldCount}</Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
    <Card sx={{ padding: 2, border: '2px solid #d4edda', borderRadius: '8px', boxShadow: 2 }}>
      <CardContent>
        <Typography variant="body2" align="center">Available Parking: {availableCount}</Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={6} md={3}>
    <Card sx={{ padding: 2, border: '2px solid #d4edda', borderRadius: '8px', boxShadow: 2 }}>
      <CardContent>
        <Typography variant="body2" align="center">Total Parking: {parkingData.length}</Typography>
      </CardContent>
    </Card>
  </Grid>
</Grid>


              {parkingData.length > 0 && (
               <div style={{ overflowX: 'auto', marginTop: '20px' }}>
               <table style={{
                 width: '100%',
                 borderCollapse: 'collapse',
                 backgroundColor: '#fff',
                 boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
               }}>
                 <thead>
                   <tr style={{
                     backgroundColor: '#f4f6f9',
                     borderBottom: '2px solid #ddd',
                   }}>
                     <th style={{
                       padding: '12px 15px',
                       textAlign: 'center',
                       fontWeight: 'bold',
                       color: '#444',
                       fontSize: '14px',
                     }}>
                       Parking No
                     </th>
                     <th style={{
                       padding: '12px 15px',
                       textAlign: 'center',
                       fontWeight: 'bold',
                       color: '#444',
                       fontSize: '14px',
                     }}>
                       Parking Availability
                     </th>
                   </tr>
                 </thead>
                 <tbody>
                   {parkingData.map((parking, index) => {
                     const rowColor = parking.CProccess === 1 ? '#f8d7da' : '#d4edda'; // Red for CProcess 1, Light Green for others
                     return (
                       <tr key={index} style={{ transition: 'background-color 0.3s', hover: { backgroundColor: '#f1f1f1' } }}>
                         <td style={{
                           padding: '10px 15px',
                           textAlign: 'center',
                           border: '1px solid #ddd',
                           backgroundColor: '#fafafa',
                           fontSize: '14px',
                         }}>
                           {index + 1}
                         </td>
                         <td style={{
                           padding: '10px 15px',
                           textAlign: 'center',
                           border: '1px solid #ddd',
                           backgroundColor: rowColor,
                           fontSize: '14px',
                         }}>
                           {parking.CProccess === 1 ? (
                             <>
                               <strong>{parking.Name} / {parking.FlatNo}</strong><br />
                               <span>{parking.ParkingAvilability}</span>
                             </>
                           ) : (
                             parking.ParkingAvilability
                           )}
                         </td>
                       </tr>
                     );
                   })}
                 </tbody>
               </table>
             </div>
              )}
            </>
          ) : (
            <NoDataIcon />
          )}
        </div>
      )}

      {/* Dialog for Editing */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Edit Flat</DialogTitle>
        <DialogContent>
          {selectedFlat && (
            <FormControl fullWidth>
              <Select
                value={selectedFlat.skuID || ''}
                onChange={handleSkuChange}
                autoWidth
              >
                {skuOptions.map((option) => (
                  <MenuItem key={option.skuID} value={option.skuID}>
                    {option.skuName}
                  </MenuItem>
                ))}
              </Select>

              {(!selectedFlat.isOnHold) && (
                <TextField
                  fullWidth
                  type="text"
                  name="Partyname"
                  label="Enter Party Name"
                  value={holdDetails}
                  onChange={(e) => setHoldDetails(e.target.value)}
                  onFocus={(e) => e.stopPropagation()}
                  style={{ marginTop: '8px' }}
                />
              )}
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await handleSkuChangeSubmit();
              setDialogOpen(false);
            }}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListAvailabiltyList;
