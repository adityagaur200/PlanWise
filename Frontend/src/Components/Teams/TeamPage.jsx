import React from 'react'
import UserBar from './UserBar'
import { Box, Stack, Typography } from '@mui/material'

// Separate styles object for better maintainability
const styles = {
  container: {
    width: "100%",
    height: "100vh",
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
  },
  header: {
    width: "90%",
    padding: "10px 0",
    border: "1px solid #e0e0e0",
    borderRadius: 2,
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    zIndex: 1,
  },
  headerText: {
    display: 'flex',
    marginLeft: '10%',
  },
  roleText: {
    marginLeft: '30vw',
  },
  userListContainer: {
    width: "90%",
    flex: 1,
    overflowY: 'auto',
    border: "1px solid #e0e0e0",
    borderRadius: 2,
    marginTop: 2,
    padding: '10px 0',
  }
}

// Separate header component for better organization
const TableHeader = () => (
  <Box direction="row" spacing={2} sx={styles.header}>
    <Box sx={styles.headerText}>
      <Typography fontSize={20} fontWeight={600}>Name</Typography>
      <Typography fontSize={20} fontWeight={600} sx={styles.roleText}>Role</Typography>
    </Box>
  </Box>
)

// Main component
const TeamPage = () => {
  const numberOfUsers = 15;

  return (
    <Stack 
      direction="column" 
      alignItems="center"
      sx={styles.container}
    >
      <TableHeader />
      
      <Stack 
        direction="column" 
        spacing={1} 
        alignItems="center"
        sx={styles.userListContainer}
      >
        {[...Array(numberOfUsers)].map((_, index) => (
          <UserBar key={index} />
        ))}
      </Stack>
    </Stack>
  )
}

export default TeamPage
