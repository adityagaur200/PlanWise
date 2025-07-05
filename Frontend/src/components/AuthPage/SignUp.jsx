import { Box, Stack } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../../assests/logo.png';
import { SignupForm } from './SignUpUI/SignUpUi';
import { Login } from './SignUpUI/LogInui';

const SignUp = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      height="90vh"
      width="100vw"
    >
      <img src={logo} alt="logo" width={800} height={800} />
      <Box width="500px" height="500px" marginBottom="50px">
        {isLoginPage ? <Login /> : <SignupForm/>}
      </Box>
    </Stack>
  );
};

export default SignUp;
