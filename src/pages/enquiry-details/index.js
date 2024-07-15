
import React, { useState, useEffect } from "react";
import { Button, Grid, CircularProgress, Alert } from "@mui/material";
import axios from "axios";
import LisListEnquiryt from "src/views/List-enquiry/ListEnquiry";
import AddEnquiryDetails from "src/views/add-enquirydetails/AddEnquiryDetails";
import UpdateCompanyMaster from "src/views/update-companyMaster/UpdateCompanyMaster";

const AccountSettings = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'account', 'update'
  const [rowDataToUpdate, setRowDataToUpdate] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://apiforcorners.cubisysit.com/api/api-fetch-companymaster.php"
      );
      console.log("API Response:", response.data);
      setRows(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">Error fetching data: {error.message}</Alert>;
  }

  const handleNavigation = () => {
    setActiveTab('account'); // Show TabAccount component
  };

  const handleEdit = (rowData) => {
    setActiveTab('update'); // Show UpdateCompanyMaster component
    setRowDataToUpdate(rowData); // Pass the selected row data
  };

  const handleSubmissionSuccess = () => {
    setActiveTab('list'); // Show TabInfo component after successful submission
    fetchData(); // Fetch updated data to display in TabInfo
  };

      const jsonToCSV = (json) => {
        const header = Object.keys(json[0]).join(",");
        const values = json
          .map((obj) => Object.values(obj).join(","))
          .join("\n");
        return `${header}\n${values}`;
      };

      const handleDownload = () => {
        const csv = jsonToCSV(rows);
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "data.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
  return (
    <>
      {activeTab === "list" && (
        <>
          <Grid item xs={12}>
            <Button
              variant="contained"
              sx={{ marginRight: 3.5 }}
              onClick={handleNavigation}
              style={{ marginBottom: "8px", float: "right" }}
            >
              Add
            </Button>

           
          </Grid>

          <Grid container spacing={6}>
            <Grid item xs={12}>
              <AddEnquiryDetails  />
            </Grid>
          </Grid>
        </>
      )}

      {activeTab === "account" && (
        
        <AddEnquiryDetails
          show={setActiveTab}
          onSubmitSuccess={handleSubmissionSuccess}
        />
      )}

      {/* {activeTab === "update" && (
        <UpdateCompanyMaster
          show={setActiveTab}
          rowData={rowDataToUpdate}
          onSubmitSuccess={handleSubmissionSuccess}
        />
      )} */}
    </>
  );
};

export default AccountSettings;
