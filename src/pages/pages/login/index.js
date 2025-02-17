import {useEffect , useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import { useCookies } from "react-cookie";
// import MuiSnackbar from '../../../../src/@core/theme/overrides/snackbar';
import { Snackbar, Alert } from "@mui/material";
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled, useTheme } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import MuiFormControlLabel from '@mui/material/FormControlLabel';
import Google from 'mdi-material-ui/Google';
import Github from 'mdi-material-ui/Github';
import Twitter from 'mdi-material-ui/Twitter';
import Facebook from 'mdi-material-ui/Facebook';
import EyeOutline from 'mdi-material-ui/EyeOutline';
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline';
import themeConfig from 'src/configs/themeConfig';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration';
import axios from 'axios';

const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}));

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}));

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}));

const LoginPage = () => {
  const [values, setValues] = useState({
    username: '',
    password: '',
    showPassword: false
  });
  const [cookies, setCookie] = useCookies(["amr"]);
  const theme = useTheme();
  const router = useRouter();


  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    // debugger;
    // if (cookies && cookies.amr && cookies.amr.UserID) router.push('/');
  });


  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackbarOpen(false);
  };


  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = {
        username: values.username,
        password: values.password,
      };
  
      
      axios
        .post(
          "https://proxy-forcorners.vercel.app/api/proxy/api-login.php",
          formData,
          {
            headers: {
              "Content-Type": "application/json", 
            },
          }
        )
        .then((response) => {
          if (response.data.status === "Success") {
            const user = {
              FullName: response.data.data.Name,
              UserID: response.data.data.userid,
              RoleID: response.data.data.roleid,
              RoleName: response.data.data.rolename,
            };
            console.log(user, "SUBMITTED DATA");
            setCookie("amr", JSON.stringify(user), { path: "/" });

            // router.push('/SaleDashboard');
            console.log("bac");
            // return
            if (user.RoleID === 1) {
              router.push("/");
            } else if (user.RoleID === 3) {
              router.push("/SaleDashboard");
            } else {
              router.push("/Telecalling");
            }
            console.log("SUBMITTED DATA");
          } else {
            setIsSnackbarOpen(true);
            setSnackbarMessage(response.data.message);
          }
        })
        .catch((error) => {
          console.error("There was an error!", error);
          setIsSnackbarOpen(true);
          setSnackbarMessage("There was an error, Please contact admin");
        });
  
    } catch (error) {
      console.error('Login failed:', error);
      setIsSnackbarOpen(true);
      setSnackbarMessage('There was an error, Please contact admin');
    }
  };
  



  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>


          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="https://raw.githubusercontent.com/alokkaintura/forcorners/main/logo.png" alt="logo" style={{ maxWidth: '200px' }} />
          </Box>

          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5, textAlign: 'center' }}>
              Welcome to Four Corner
            </Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={handleSubmit}>
            <TextField
              autoFocus
              fullWidth
              id='username'
              label='username'
              sx={{ marginBottom: 4 }}
              value={values.username}
              onChange={handleChange('username')}
            />
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
              <OutlinedInput
                label='Password'
                id='auth-login-password'
                value={values.password}
                onChange={handleChange('password')}
                type={values.showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Button
              fullWidth
              size='large'
              variant='contained'
              sx={{ marginBottom: 7, marginTop: 5 }}
              type='submit'

            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
      <Snackbar open={isSnackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert
          // onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>

  );
};

LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>;

export default LoginPage;
