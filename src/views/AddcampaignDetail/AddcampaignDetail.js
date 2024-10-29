import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Typography,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Swal from 'sweetalert2';
import { useCookies } from "react-cookie";

const AddcampaignDetails = () => {
  const [formData, setFormData] = useState({
    campaignName: '',
    campaignTypeID: '',
    templateID: '',
    date: '',
    time: '',
    CreateUID: 1, // Set default CreateUID or get from cookies if needed
    contactCids: [], // For storing selected contact CIDs
    ProjectID: 5, // Example ProjectID
  });
  
  const [campaignTypes, setCampaignTypes] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [contacts, setContacts] = useState([]); // State for contacts
  const [cookies] = useCookies(["amr"]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    fetchCampaignTypes();
    fetchTemplates();
    fetchContacts(); // Fetch contacts
  }, []);

  const fetchCampaignTypes = async () => {
    try {
      const response = await axios.get('https://apiforcornershost.cubisysit.com/api/api-fetch-campaigntypes.php');
      if (response.data.status === 'Success') {
        setCampaignTypes(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching campaign types:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('https://apiforcornershost.cubisysit.com/api/api-dropdown-template.php');
      if (response.data.status === 'Success') {
        setTemplates(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await axios.get('https://apiforcornershost.cubisysit.com/api/api-dropdown-contact.php');
      if (response.data.status === 'Success') {
        setContacts(response.data.data);
        // Automatically select all contacts
        const allCids = response.data.data.map(contact => contact.Cid);
        setFormData(prevData => ({ ...prevData, contactCids: allCids }));
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleContactChange = (event) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      contactCids: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      CampaignName: formData.campaignName,
      CampaignTypeID: parseInt(formData.campaignTypeID),
      TemplateID: parseInt(formData.templateID),
      Date: formData.date,
      Time: formData.time,
      CreateUID: formData.CreateUID,
      ContactCids: formData.contactCids,
      ProjectID: formData.ProjectID,
    }; 

    try {
      const response = await axios.post('https://proxy-forcorners.vercel.app/api/proxy/api-insert-compaigns.php', payload);

      if (response.data.status === 'Success') {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Data Submitted Successfully',
        });

        setFormData({
          campaignName: '',
          campaignTypeID: '',
          templateID: '',
          date: '',
          time: '',
          CreateUID: 1,
          contactCids: [],
          ProjectID: 5,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'An error occurred',
      });
    }
  };

  return (
    <Card sx={{ height: 'auto' }}>
      <CardContent>
        <Typography variant="h5" sx={{ marginBottom: 3 }}>
          Campaign Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Campaign Name"
                name="campaignName"
                value={formData.campaignName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Campaign Type</InputLabel>
                <Select
                  name="campaignTypeID"
                  value={formData.campaignTypeID}
                  onChange={handleChange}
                  required
                >
                  {campaignTypes.map((type) => (
                    <MenuItem key={type.CampaignTypeID} value={type.CampaignTypeID}>
                      {type.CampaignTypeName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Template</InputLabel>
                <Select
                  name="templateID"
                  value={formData.templateID}
                  onChange={handleChange}
                  required
                >
                  {templates.map((template) => (
                    <MenuItem key={template.templateID} value={template.templateID}>
                      {template.TName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Time"
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: "#9155FD", color: "#FFFFFF" }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
        <Snackbar open={submitSuccess} autoHideDuration={6000} onClose={() => setSubmitSuccess(false)}>
          <MuiAlert onClose={() => setSubmitSuccess(false)} severity="success" sx={{ width: '100%' }}>
            Data Submitted Successfully
          </MuiAlert>
        </Snackbar>
        <Snackbar open={!!submitError} autoHideDuration={6000} onClose={() => setSubmitError(null)}>
          <MuiAlert onClose={() => setSubmitError(null)} severity="error" sx={{ width: '100%' }}>
            {submitError}
          </MuiAlert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default AddcampaignDetails;
