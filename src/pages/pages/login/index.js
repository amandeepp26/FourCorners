import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
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
  const theme = useTheme();
  const router = useRouter();

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
      
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

      
        if (response.ok) {
            const data = await response.json();
            const { user } = data;
            switch (user.role) {
                case 'admin':
                    window.location.href = '/admin-dashboard';
                    break;
                case 'employee':
                    window.location.href = '/employee-dashboard';
                    break;
                case 'manager':
                    window.location.href = '/manager-dashboard';
                    break;
                case 'seller':
                    window.location.href = '/seller-dashboard';
                    break;
                default:
                    console.error('Unknown role:', user.role);
            }
        } else {
            const data = await response.json();
            setErrorMessage(data.message); 
        }
    } catch (error) {
        console.error('Login failed:', error);
        setErrorMessage('Login failed. Please try again later.');
    }
};
  return (
    <Box className='content-center'>
    <Card sx={{ zIndex: 1 }}>
      <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
        <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="https://raw.githubusercontent.com/alokkaintura/forcorners/main/logo.png" alt="logo" style={{ maxWidth: '200px' }} />  </Box>
        <Box sx={{ mb: 6 }}>
          <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
            Welcome to Four Corner! 👋🏻
          </Typography>
          <Typography variant='body2'>Please sign-in to your account and start the adventure</Typography>
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
            sx={{ marginBottom: 7 , marginTop:5}}
            type='submit'
          
          >
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
    
  </Box>
  );
};

LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>;

export default LoginPage;
