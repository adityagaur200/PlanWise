import React from 'react'
import { CiChat1 } from 'react-icons/ci'
import { Avatar, Box, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
const UserBar = () => {
  const navigate = useNavigate()

  return (
    <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} width={"90%"} border={"1px solid #e0e0e0"} borderRadius={2} m={1}>
        <Stack direction={'row'} spacing={2} alignItems={'center'} m={1}>
            <Avatar sx={{width:40,height:40}}/>
            <Stack direction={'column'} spacing={0} padding={0}>
                <Typography fontSize={16} fontWeight={600}>John Doe</Typography>
                <Typography fontSize={12} color={"GrayText"}>gdhen21@gmail.com</Typography>
            </Stack>
        </Stack>
        <Typography fontSize={16} fontWeight={600}>Role</Typography>
        <Box display={'flex'} sx={{marginRight: '5%'}}>
        <CiChat1 size={20} onClick={() => navigate('/chat')}/>
        </Box>
    </Stack>
  )
}

export default UserBar
