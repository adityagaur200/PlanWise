import React, { useState } from 'react'
import { Container, Stack, Typography, Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, Box, MenuItem } from '@mui/material'
import { PieChart } from '@mui/x-charts/PieChart'
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"

const Home = () => {
  const localizer = momentLocalizer(moment)
  
  // Define constants first
  const CALENDAR_EVENTS = [
    { 
      title: "Design Brief Review", 
      start: new Date(2025, 1, 18, 9, 0), 
      end: new Date(2025, 1, 18, 10, 0) 
    },
    { 
      title: "Typography & Layout", 
      start: new Date(2025, 1, 19, 10, 0), 
      end: new Date(2025, 1, 19, 11, 0) 
    },
  ]

  // Then initialize state with the constant
  const [events, setEvents] = useState(CALENDAR_EVENTS)
  const [openDialog, setOpenDialog] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
    assignee: '',
  })

  // Add assignees constant
  const ASSIGNEES = [
    'John Doe',
    'Jane Smith',
    'Mike Johnson',
    'Sarah Williams'
  ]

  // Add new state for calendar view
  const [calendarView, setCalendarView] = useState('month')
  // Add state for current date
  const [currentDate, setCurrentDate] = useState(new Date())

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({
      title: '',
      start,
      end,
      assignee: '',
    })
    setOpenDialog(true)
  }

  const handleAddEvent = () => {
    if (newEvent.title) {
      setEvents([...events, newEvent])
      setOpenDialog(false)
      setNewEvent({
        title: '',
        start: new Date(),
        end: new Date(),
        assignee: '',
      })
    }
  }

  const handleEventSelect = (event) => {
    const confirmDelete = window.confirm(`Would you like to delete "${event.title}"?`)
    if (confirmDelete) {
      setEvents(events.filter(e => e !== event))
    }
  }

  // Move data to constants
  const STATS_DATA = [
    { title: 'Total Tasks', count: 10, color: '#1976d2' },
    { title: 'In Progress', count: 5, color: '#f44336' },
    { title: 'Completed', count: 5, color: '#2e7d32' }
  ]

  const CHART_DATA = [
    { id: 0, value: 10, label: 'To Do' },
    { id: 1, value: 15, label: 'In Progress' },
    { id: 2, value: 20, label: 'Completed' },
  ]

  // Reusable stat box component
  const StatBox = ({ title, count, color }) => (
    <Container 
      sx={{
        width: '33%', 
        height: '150px', 
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
      }}
    >
      <Typography 
        sx={{ color: 'white' }} 
        fontSize={20} 
        fontWeight={600}
      >
        {title} : {count}
      </Typography>
    </Container>
  )

  // Add navigation handlers
  const handleNavigate = (newDate) => {
    setCurrentDate(newDate)
  }

  return (
    <Stack direction={'column'} spacing={4} sx={{ p: 3 }}  height={"95vh"} >
      {/* Stats Section */}
      <Stack direction={'row'} spacing={3}>
        {STATS_DATA.map((stat, index) => (
          <StatBox key={index} {...stat} />
        ))}
      </Stack>

      {/* Chart and Calendar Section */}
      <Stack direction={'row'} spacing={3} sx={{ alignItems: 'flex-start' }}>
        {/* Calendar Section */}
        <Box sx={{ flex: 2 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleEventSelect}
            view={calendarView}
            onView={setCalendarView}
            date={currentDate}
            onNavigate={handleNavigate}
            style={{ 
              height: 500,
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
            }}
          />
        </Box>

        {/* Chart Section */}
        <Box sx={{ flex: 1, backgroundColor: 'white', p: 2, borderRadius: '8px' }}>
          <PieChart
            series={[{ data: CHART_DATA }]}
            width={400}
            height={300}
            margin={{ top: 20, bottom: 80, left: 20, right: 20 }}
            slotProps={{
              legend: {
                direction: 'row',
                position: { vertical: 'bottom', horizontal: 'middle' },
                padding: { top: 40, bottom: 0, left: 0, right: 0 },
                itemMarkWidth: 20,
                itemMarkHeight: 20,
                markGap: 5,
                itemGap: 20,
              },
            }}
          />
        </Box>
      </Stack>

      {/* Add Event Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              fullWidth
            />
            <TextField
              select
              label="Assign To"
              value={newEvent.assignee}
              onChange={(e) => setNewEvent({ ...newEvent, assignee: e.target.value })}
              fullWidth
            >
              {ASSIGNEES.map((assignee) => (
                <MenuItem key={assignee} value={assignee}>
                  {assignee}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Start Time"
              type="datetime-local"
              value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')}
              onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="End Time"
              type="datetime-local"
              value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')}
              onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddEvent} variant="contained" color="primary">
            Add Event
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default Home
