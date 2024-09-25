// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import Table from '@mui/material/Table';
// import TableRow from '@mui/material/TableRow';
// import TableHead from '@mui/material/TableHead';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import Typography from '@mui/material/Typography';
// import TableContainer from '@mui/material/TableContainer';
// import IconButton from '@mui/material/IconButton';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';

// const ProjectMasterDetails = () => {
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await axios.get('https://apiforcornershost.cubisysit.com/api/api-fetch-projectmaster.php');
//       console.log('API Response:', response.data);
//       setRows(response.data.data || []);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setError(error);
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (ProjectID) => {
//     console.log("id aaya", ProjectID);
//     const body = {
//       id: ProjectID,
//       deleteuid: 1,
//     };

//     try {
//       const response = await axios.post(
//         "https://proxy-forcorners.vercel.app/api/proxy/api-delete-projectmaster.php",
//         body,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.status === "Success") {
//         console.log("Deleted");
//         setRows(prevRows => prevRows.filter(row => row.id !== id));
//       } else {
//         console.error("Failed to delete:", response.data);
//       }
//     } catch (error) {
//       console.error("There was an error!", error);
//     }
//   };

//   if (loading) {
//     return <Typography>Loading...</Typography>;
//   }

//   if (error) {
//     return <Typography>Error fetching data: {error.message}</Typography>;
//   }

//   return (
//     <Card>
//       <TableContainer>
//         <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
//           <TableHead>
//             <TableRow>
//               <TableCell>CompanyID</TableCell>
//               <TableCell>ProjectTypeID</TableCell>
//               <TableCell>Project Name</TableCell>
//               <TableCell>Project Start Date</TableCell>
//               <TableCell>Rera Registration Number</TableCell>
//               <TableCell>State ID</TableCell>
//               <TableCell>Project Address</TableCell>
//               <TableCell>Action</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows.length > 0 ? (
//               rows.map((row, index) => (
//                 <TableRow key={index}>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//                       <Typography sx={{ fontWeight: 500 }}>{row.CompanyID}</Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell>{row.projecttypeid}</TableCell>
//                   <TableCell>{row.projectname}</TableCell>
//                   <TableCell>{row.projectstartdate}</TableCell>
//                   <TableCell>{row.reraregistrationnumber}</TableCell>
//                   <TableCell>{row.state}</TableCell>
//                   <TableCell>{row.projectaddress}</TableCell>
//                   <TableCell sx={{ padding: '15px', display: 'flex', justifyContent: 'space-around' }}>
//                     <IconButton onClick={() => handleEdit(row)} aria-label="edit" sx={{ color: 'blue' }}>
//                       <EditIcon />
//                     </IconButton>
//                     <IconButton onClick={() => handleDelete(row.ProjectID)} aria-label="delete" sx={{ color: 'red' }}>
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={8} align="center">
//                   No data available
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Card>
//   );
// };

// export default ProjectMasterDetails;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ProjectMasterDetails = ({ onEdit }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://apiforcornershost.cubisysit.com/api/api-fetch-projectmaster.php"
      );
      console.log("API Response: PROJECT MATER", response.data);
      setRows(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };

  const handleDelete = async (ProjectID) => {
    console.log("presss");
    console.log("id aaya", ProjectID);

    
    const body = {
      ProjectID: ProjectID,
      Deleteuid: 1,
    };

    try {
      const response = await axios.post(
        "https://proxy-forcorners.vercel.app/api/proxy/api-delete-projectmaster.php",
        body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "Success") {
        console.log("Deleted");
        // setRows((prevRows) =>
        //   prevRows.filter((row) => row.ProjectID !== ProjectID)
        // );
      } else {
        console.error("Failed to delete:", response.data);
      }
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error fetching data: {error.message}</Typography>;
  }

  return (
    <Card>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
          <TableHead>
            <TableRow>
              <TableCell>CompanyID</TableCell>
              <TableCell>ProjectType Name</TableCell>
              <TableCell>Project Name</TableCell>
              <TableCell>Project Start Date</TableCell>
              <TableCell>Rera Registration Number</TableCell>
              <TableCell>State Name</TableCell>
              <TableCell>Project Address</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                
                <TableRow key={index}>
                  <TableCell>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography sx={{ fontWeight: 500 }}>
                        {row.CompanyID}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{row.ProjectTypeName}</TableCell>
                  <TableCell>{row.ProjectName}</TableCell>
                  <TableCell>{row.projectstartdate}</TableCell>
                  <TableCell>{row.ReraRegistrationNumber}</TableCell>
                  <TableCell>{row.StateName}</TableCell>
                  <TableCell>{row.ProjectAddress}</TableCell>
                  <TableCell
                    sx={{
                      padding: "15px",
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    <IconButton
                      onClick={() => onEdit(row)}
                      aria-label="edit"
                      sx={{ color: "blue" }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(row.ProjectID)}
                      aria-label="delete"
                      sx={{ color: "red" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default ProjectMasterDetails;
