import { Typography,Avatar } from '@mui/material'
import React from 'react'

const NotificationBar = () => {

  return (
    <div style={{flexDirection:"row",height:"7vh",borderBottom:"1px solid #e0e0e0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginLeft:"2vh",gap:"2vh"}}>
      <Avatar src="https://via.placeholder.com/150" />
      <Typography variant="h6">Udit</Typography>
      </div>
      <Typography>New Notification</Typography>
      <div>
        <Typography fontSize={"6"}fontWeight={100} color={"gray"} >2025-02-21</Typography>
        <Typography  fontSize={"6"}fontWeight={100} color={"gray"}>Time</Typography>
      </div>
    </div>
  )
}

export default NotificationBar 
