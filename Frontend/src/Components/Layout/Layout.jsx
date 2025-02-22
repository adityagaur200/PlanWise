import React, { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Divider, Stack, Typography, Button } from '@mui/material'
import { GoHome } from 'react-icons/go'
import { AiOutlineTeam } from 'react-icons/ai'
import { BsListTask } from 'react-icons/bs'
import { BiTask } from 'react-icons/bi'
import { IoMdNotificationsOutline } from 'react-icons/io'
const Layout = () => {
  const [selectedOption, setSelectedOption] = useState('Home')

  return (
    <Stack direction={'row'} sx={{ height: '100vh', width: '100%' }}>
      <Stack 
        direction={'column'} 
        width={'13%'} 
        gap={2} 
        marginTop={2} 
        marginLeft={2}
        sx={{ position: 'fixed' }}  // Make navigation fixed
      >
        {[
          { icon: <GoHome size={20}/>, label: 'Home', path: '/' },
          { icon: <AiOutlineTeam size={20}/>, label: 'Team', path: '/team' },
          { icon: <BsListTask size={20}/>, label: 'Tasks', path: '/task' },
          { icon: <IoMdNotificationsOutline size={20}/>, label: 'Notification', path: '/notification' },
          { icon: <BiTask size={20}/>, label: 'Completed', path: '/completed' }
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
      </Stack>

      <Divider orientation="vertical" flexItem sx={{ height: '100vh', position: 'fixed', left: '15%' }} />
      
      <Stack sx={{ marginLeft: '16%', width: '84%', p: 2 }}>
        <Outlet /> {/* This is where child components will render */}
      </Stack>
    </Stack>
  )
}

export default Layout 