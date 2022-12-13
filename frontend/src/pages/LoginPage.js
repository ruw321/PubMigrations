import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { postLogin } from '../fetcher';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login';

const { createHash } = require('crypto');
const clientId = '140984611088-pm8bh960crv1jd1u4lsb634s8qft40qn.apps.googleusercontent.com';
const appID = '1187958105181399';
function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}

function componentClicked() {
}
const responseFacebook = (response) => {
  window.localStorage.setItem('Authenticated', 'True');
  window.location = '/';
}

const theme = createTheme();

export default function LoginPage() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const hashedPassword = hash(data.get('password')) // hash created previously created upon sign up
    const result = await postLogin(data.get('email'), hashedPassword);
    if (result.result === "user successfully logged in") {
      window.localStorage.setItem('Authenticated', 'True');
      window.location = '/';
    } else {
      window.localStorage.setItem('Authenticated', 'False');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        &nbsp;
        <Grid
          container
          spacing={4}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: '100vh' }}
        >
          <Grid item>
          <Typography variant="body1" color="text.secondary" align="center">
            {'OR'}
          </Typography>
          </Grid>
          <Grid item style={{height:'90%', width:'60%'}}>
            <GoogleOAuthProvider clientId={clientId}>
              <GoogleLogin
                size="large"
                onSuccess={() => {
                  window.localStorage.setItem('Authenticated', 'True');
                  window.location = '/';
                }}
                onError={() => {
                  window.localStorage.setItem('Authenticated', 'False');
                }}
                width={"220"}
              />
            </GoogleOAuthProvider>
          </Grid>
          <Grid item style={{height:'100%', width:'60%'}}>
            <FacebookLogin
              appId={appID}
              autoLoad={false}
              fields="name,email,picture"
              onClick={componentClicked}
              callback={responseFacebook}
              size={'small'}
            />
          </Grid>
        </Grid>

      </Container>
    </ThemeProvider>
  );
}