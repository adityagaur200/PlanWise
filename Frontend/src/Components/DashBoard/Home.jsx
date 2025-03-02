import React, { useState, useEffect } from 'react';
import { 
  Container, Stack, Typography, Dialog, DialogTitle, DialogContent, 
  TextField, Button, DialogActions, Box, MenuItem 
} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const Home = () => {
    const localizer = momentLocalizer(moment);
    const [events, setEvents] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [users, setUsers] = useState([]);
    const [newEvent, setNewEvent] = useState({
          taskName: '',
          taskDescription: '',
          taskStatus: '',
          assignedTaskDate: '',
          assignedTaskTime: '',
          assignees: [],
          deadline: '',});
    const [calendarView, setCalendarView] = useState('month');
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
      const token = localStorage.getItem("token");
  
      fetch("http://localhost:3030/user/getusers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,},})
          .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
          })
          .then(data => {
          console.log("Fetched Users:", data); // Debugging output
          setUsers(data);
          }).catch(error => console.error("Error fetching users:", error));
          }, []);
  

        const handleSelectSlot = ({ start }) => {
          setNewEvent({
          ...newEvent,
          assignedTaskDate: moment(start).format('YYYY-MM-DD'),
          assignedTaskTime: moment(start).format('HH:mm'),
          });
          setOpenDialog(true);};

    const handleAddEvent = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found! User may not be logged in.");
      return;
    }
  
    try {
      console.log("Sending Task Data:", JSON.stringify(newEvent, null, 2));
  
      const response = await fetch("http://localhost:3030/api/Task/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
        credentials: "include",
      });
  
      console.log("Response Status:", response.status);
  
      if (response.status === 401) {
        console.error("Unauthorized: Invalid or expired token.");
        alert("Session expired. Please log in again.");
        return;
      }
  
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.warn("Unexpected response type:", contentType);
        return;
      }
  
      const responseData = await response.json();
      console.log("Response Data:", responseData);
  
      if (response.ok) {
        setEvents([...events, {
          title: newEvent.taskName,
          start: new Date(`${newEvent.assignedTaskDate}T${newEvent.assignedTaskTime}`),
          end: new Date(newEvent.deadline),
        }]);
        setOpenDialog(false);
        setNewEvent({ taskName: '', taskDescription: '', taskStatus: '', assignedTaskDate: '', assignedTaskTime: '', assignees: [], deadline: '' });
      } else {
        console.error("Failed to create task:", responseData);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };
  
  

  return (
    <Stack direction={'column'} spacing={4} sx={{ p: 3, height: "95vh" }}>
      {/* Stats Section */}
      <Stack direction={'row'} spacing={3}>
        {[{ title: 'Total Tasks', count: 10, color: '#1976d2' },{ title: 'In Progress', count: 5, color: '#f44336' }, { title: 'Completed', count: 5, color: '#2e7d32' }].map((stat, index) => (
          <Container key={index} sx={{ width: '33%', height: '150px', backgroundColor: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
            <Typography sx={{ color: 'white' }} fontSize={20} fontWeight={600}>{stat.title} : {stat.count}</Typography>
          </Container>
        ))}
      </Stack>

      {/* Chart and Calendar Section */}
      <Stack direction={'row'} spacing={3} sx={{ alignItems: 'flex-start' }}>
        <Box sx={{ flex: 2 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleSelectSlot}
            view={calendarView}
            onView={setCalendarView}
            date={currentDate}
            onNavigate={setCurrentDate}
            style={{ height: 500, backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}
          />
        </Box>
        <Box sx={{ 
            flex: 1, 
            backgroundColor: 'white', 
            p: 2, 
            borderRadius: '8px', 
            display: 'flex', 
            flexDirection: 'column', // Stack chart & legend vertically
            alignItems: 'center', 
            gap: 2 // Adds space between chart and legend
              }}>
        <PieChart
        series={[
            {
              data: [
                      { id: 0, value: 10, label: 'To Do' },
                      { id: 1, value: 15, label: 'In Progress' },
                      { id: 2, value: 20, label: 'Completed' }],
            }
            ]}
            width={350}
            height={200}
            />

 
        </Box>
    </Stack>

      {/* Add Event Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField label="Task Name" value={newEvent.taskName} onChange={(e) => setNewEvent({ ...newEvent, taskName: e.target.value })} fullWidth />
            <TextField label="Task Description" value={newEvent.taskDescription} onChange={(e) => setNewEvent({ ...newEvent, taskDescription: e.target.value })} fullWidth />
            <TextField select label="Task Status" value={newEvent.taskStatus} onChange={(e) => setNewEvent({ ...newEvent, taskStatus: e.target.value })} fullWidth>
              {['To Do', 'In Progress', 'Completed'].map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
            </TextField>
            <TextField label="Assign Date" type="date" value={newEvent.assignedTaskDate} onChange={(e) => setNewEvent({ ...newEvent, assignedTaskDate: e.target.value })} InputLabelProps={{ shrink: true }} fullWidth />
            <TextField 
               select 
                label="Assign To" 
                value={newEvent.assignees} 
                onChange={(e) => setNewEvent({ ...newEvent, assignees: [e.target.value] })} 
                fullWidth>
                {users.length > 0 ? (
                users.map(user => (
                <MenuItem key={user.id} value={user.username}>
                {user.username}
                </MenuItem>
                ))
                ) : (
                <MenuItem disabled>No users available</MenuItem>
                  )}
            </TextField>

            <TextField label="Deadline" type="datetime-local" value={newEvent.deadline} onChange={(e) => setNewEvent({ ...newEvent, deadline: e.target.value })} InputLabelProps={{ shrink: true }} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddEvent} variant="contained" color="primary">Add Task</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default Home;
