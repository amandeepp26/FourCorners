import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import axios from "axios";
import { useCookies } from "react-cookie";

const AddInstallment = ({ show, editData }) => {
  console.log(editData, "aagaya edit ka data");
  const [projectName, setProjectName] = useState("");
  const [nameofcompany, setNameOfCompany] = useState("");
  const [subproject, setSubProject] = useState("");
  const [installmenttype, setInstallmentType] = useState("");
  const [code, setCode] = useState("");
  const [paymentscheduleSlabwise, setPaymentScheduleSlabWise] = useState("");
  const [particulars, setParticulars] = useState("");
  const [percent, setPercent] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log(editData, "installment");
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://apiforcornershost.cubisysit.com/api/api-dropdown-projectmaster.php"
      );
      setRows(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrors(error);
    }
  };

  useEffect(() => {
    if (editData) {
      const {
        ProjectName,
        NameOfCompany,
        SubProject,
        InstallmentType,
        Code,
        PaymentScheduleSlabWise,
        Particulars,
        Percent,
        ProjectID,
      } = editData;
      setProjectName(ProjectName || "");
      setNameOfCompany(NameOfCompany || "");
      setSubProject(SubProject || "");
      setInstallmentType(InstallmentType || "");
      setCode(Code || "");
      setPaymentScheduleSlabWise(PaymentScheduleSlabWise || "");
      setParticulars(Particulars || "");
      setPercent(Percent || "");
      setSelectedProject(ProjectID || "");
    }
  }, [editData]);

  const handleChange = (event) => {
    const projectId = event.target.value;
    const selectedProj = rows.find(
      (project) => project.ProjectID === projectId
    );
    setSelectedProject(projectId);
    setProjectName(selectedProj ? selectedProj.ProjectName : "");
  };

  const [cookies, setCookie, removeCookie] = useCookies(["amr"]);
  const handleSubmit = () => {
    const formData = {
      CreateUID: cookies.amr?.UserID || 1,
      ProjectName: projectName,
      NameOfCompany: nameofcompany,
      SubProject: subproject,
      InstallmentType: installmenttype,
      Code: code,
      PaymentScheduleSlabWise: paymentscheduleSlabwise,
      Particulars: particulars,
      Percent: percent,
      Status: 1,
      ModifyUID: 1,
    };

    if (editData) {
      formData.InstallmentID = editData.InstallmentID;
      updateInstallment(formData);
    } else {
      insertInstallment(formData);
    }
  };

  const insertInstallment = (formData) => {
    axios
      .post(
        "https://proxy-forcorners.vercel.app/api/proxy/api-insert-installmentdetails.php",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.status === "Success") {
          show(false);
          resetFormFields();
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const updateInstallment = (formData) => {
    axios
      .post(
        "https://proxy-forcorners.vercel.app/api/proxy/api-update-installmentdetails.php",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.status === "Success") {
          show(false);
          resetFormFields();
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const resetFormFields = () => {
    setProjectName("");
    setNameOfCompany("");
    setSubProject("");
    setInstallmentType("");
    setCode("");
    setPaymentScheduleSlabWise("");
    setParticulars("");
    setPercent("");
  };

  return (
    <Card>
      <CardContent>
        <form>
          <Grid container spacing={7}>
            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ marginTop: 5, fontWeight: "bold", fontSize: 20 }}
                >
                  {editData
                    ? "Update Installment Details"
                    : "Add Installment Details"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={8} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Project Name</InputLabel>
                <Select
                  value={selectedProject}
                  onChange={handleChange}
                  label="Project Name"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {rows.map((project) => (
                    <MenuItem key={project.ProjectID} value={project.ProjectID}>
                      {project.ProjectName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                type="text"
                label="Name of Company"
                placeholder="Name of Company"
                value={nameofcompany}
                onChange={(e) => setNameOfCompany(e.target.value)}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                type="text"
                label="Sub Project"
                placeholder="Sub Project"
                value={subproject}
                onChange={(e) => setSubProject(e.target.value)}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                type="text"
                label="Installment Type"
                placeholder="Installment Type"
                value={installmenttype}
                onChange={(e) => setInstallmentType(e.target.value)}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                type="text"
                label="Code"
                placeholder="Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                type="text"
                label="Payment Schedules Lab Wise"
                placeholder="Payment Schedules Lab Wise"
                value={paymentscheduleSlabwise}
                onChange={(e) => setPaymentScheduleSlabWise(e.target.value)}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                type="text"
                label="Particulars"
                placeholder="Particulars"
                value={particulars}
                onChange={(e) => setParticulars(e.target.value)}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                type="text"
                label="Percent"
                placeholder="Percent"
                value={percent}
                onChange={(e) => setPercent(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                sx={{ marginRight: 3.5 }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddInstallment;
