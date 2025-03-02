import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Stack, Typography, Button, Divider } from '@mui/material';
import { GoHome } from 'react-icons/go';
import { AiOutlineTeam } from 'react-icons/ai';
import { BsListTask } from 'react-icons/bs';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { CiLogout } from 'react-icons/ci';

const Layout = () => {
  const [selectedOption, setSelectedOption] = useState('Home');
  const navigate = useNavigate(); // Initialize navigate function

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Redirect to login page
  };

  return (
    <Stack direction={'row'} sx={{ height: '100vh', width: '100%' }}>
      <Stack 
        direction={'column'} 
        width={'13%'} 
        gap={2} 
        marginTop={2} 
        marginLeft={2}
        sx={{ position: 'fixed' }}  
      >
        {[
          { icon: <GoHome size={20} />, label: 'Home', path: '/' },
          { icon: <AiOutlineTeam size={20} />, label: 'Team', path: '/team' },
          { icon: <BsListTask size={20} />, label: 'Tasks', path: '/task' },
          { icon: <IoMdNotificationsOutline size={20} />, label: 'Notification', path: '/notification' }
        ].map((item) => (
          <Button
            key={item.label}
            component={Link}
            to={item.path}
            onClick={() => setSelectedOption(item.label)}
            sx={{
              justifyContent: 'flex-start',
              padding: '8px 16px',
              borderRadius: '50px',
              gap: 1,
              textTransform: 'none',
              backgroundColor: selectedOption === item.label ? '#e0e0e0' : 'transparent',
              '&:hover': {
                backgroundColor: selectedOption === item.label ? '#e0e0e0' : '#f5f5f5',
              },
            }}
          >
            {item.icon}
            <Typography fontFamily={'monospace'}>
              {item.label}
            </Typography>
          </Button>
        ))}

        {/* Logout Button */}
        <Button
          onClick={handleLogout} // Call handleLogout on click
          sx={{
            justifyContent: 'flex-start',
            padding: '8px 16px',
            borderRadius: '50px',
            gap: 1,
            textTransform: 'none',
            color: 'red',
            '&:hover': { backgroundColor: '#ffebee' },
          }}
        >
          <CiLogout size={20} />
          <Typography fontFamily={'monospace'}>LogOut</Typography>
        </Button>
      </Stack>

      <Divider orientation="vertical" flexItem sx={{ height: '100vh', position: 'fixed', left: '15%' }} />
      
      <Stack sx={{ marginLeft: '16%', width: '84%', p: 2 }}>
        <Outlet /> {/* Child components render here */}
      </Stack>
    </Stack>
  );
};

export default Layout;
