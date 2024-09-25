import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Updateenquirysource  = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    NameOfCompany: '',
    ProjectName: '',
    Source: '',
    FromDate: null,
    ToDate: null,
    SourceName: '',
    SourceAddress: '',
    ActiveTillDate: null,
    ContactNumber: '',
    TotalCost: '',
    Status: 1, // Assuming status is always 1
    ModifyUID: 1, // Assuming a default value for ModifyUID
    ModifyDate: '', // Assuming this will be set automatically
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const response = await axios.post(`https://proxy-forcorners.vercel.app/api/proxy/api-singel-enquirysource.php?enquirysourceid=${id}`);
      if (response.data.status === 'Success') {
        const enquiry = response.data.data[0];
        setFormData({
          NameOfCompany: enquiry['NameOfCompany'],
          ProjectName: enquiry['ProjectName'],
          Source: enquiry['Source'],
          FromDate: new Date(enquiry['FromDate']),
          ToDate: new Date(enquiry['ToDate']),
          SourceName: enquiry['SourceName'],
          SourceAddress: enquiry['SourceAddress'],
          ActiveTillDate: new Date(enquiry['ActiveTillDate']),
          ContactNumber: enquiry['ContactNumber'],
          TotalCost: enquiry['TotalCost'],
          Status: 1,
          ModifyUID: 1,
          ModifyDate: '',
        });
        setLoading(false);
      } else {
        setError('Failed to fetch data');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const body = {
      ...formData,
      EnquirySourceID: id,
      ModifyDate: new Date().toISOString(), // Set current date as ModifyDate
    };

    try {
      const response = await axios.post(
        'https://proxy-forcorners.vercel.app/api/proxy/api-update-enquirysource.php',
        body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === 'Success') {
        setSubmitSuccess(true);
        setSubmitError(false);
        navigate('/');
      } else {
        setSubmitSuccess(false);
        setSubmitError(true);
      }
    } catch (error) {
      console.error('There was an error!', error);
      setSubmitSuccess(false);
      setSubmitError(true);
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
      <CardContent>
        <form>
          <Grid container spacing={7}>
            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box>
            <Typography
            variant="body2"
            sx={{ marginTop: 5, fontWeight: 'bold', fontSize: 20 }}
            >
            Update Enquiry Source Details
            </Typography>
            </Box>
            </Grid>
            <Grid item xs={8} sm={4}>
          <TextField
            fullWidth
            label="Name of Company"
            placeholder="Name of Company"
            value={formData.NameOfCompany}
            onChange={handleInputChange}
            name="NameOfCompany"
          />
        </Grid>

        <Grid item xs={8} sm={4}>
          <TextField
            fullWidth
            label="Project Name"
            placeholder="Project Name"
            value={formData.ProjectName}
            onChange={handleInputChange}
            name="ProjectName"
          />
        </Grid>

        <Grid item xs={8} sm={4}>
          <TextField
            fullWidth
            label="Source"
            placeholder="Source"
            value={formData.Source}
            onChange={handleInputChange}
            name="Source"
          />
        </Grid>

        <Grid item xs={8} sm={4}>
          <DatePicker
            selected={formData.FromDate}
            onChange={(date) => handleDateChange('FromDate', date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            customInput={
              <TextField
                fullWidth
                label="From Date"
                InputProps={{
                  readOnly: true,
                  sx: { width: '100%' },
                }}
              />
            }
          />
        </Grid>

        <Grid item xs={8} sm={4}>
          <DatePicker
            selected={formData.ToDate}
            onChange={(date) => handleDateChange('ToDate', date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            customInput={
              <TextField
                fullWidth
                label="To Date"
                InputProps={{
                  readOnly: true,
                  sx: { width: '100%' },
                }}
              />
            }
          />
        </Grid>

        <Grid item xs={8} sm={4}>
          <TextField
            fullWidth
            label="Source Name"
            placeholder="Source Name"
            value={formData.SourceName}
            onChange={handleInputChange}
            name="SourceName"
          />
        </Grid>

        <Grid item xs={8} sm={4}>
          <TextField
            fullWidth
            label="Source Address"
            placeholder="Source Address"
            value={formData.SourceAddress}
            onChange={handleInputChange}
            name="SourceAddress"
          />
        </Grid>

        <Grid item xs={8} sm={4}>
          <DatePicker
            selected={formData.ActiveTillDate}
            onChange={(date) => handleDateChange('ActiveTillDate', date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            customInput={
              <TextField
                fullWidth
                label="Active Till Date"
                InputProps={{
                  readOnly: true,
                  sx: { width: '100%' },
                }}
              />
            }
          />
        </Grid>

        <Grid item xs={8} sm={4}>
          <TextField
            fullWidth
            label="Contact Number"
            placeholder="Contact Number"
            value={formData.ContactNumber}
            onChange={handleInputChange}
            name="ContactNumber"
          />
        </Grid>

        <Grid item xs={8} sm={4}>
          <TextField
            fullWidth
            label="Total Cost"
            placeholder="Total Cost"
            value={formData.TotalCost}
            onChange={handleInputChange}
            name="TotalCost"
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            sx={{ marginRight: 3.5 }}
            onClick={handleSubmit}
          >
            Update
          </Button>
        </Grid>
      </Grid>
    </form>
  </CardContent>
</Card>
);
};

export default Updateenquirysource;
