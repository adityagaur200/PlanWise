import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import Home from './Components/DashBoard/Home'
import SignUp from './Components/AuthPage/SignUp'
import LogIn from './Components/AuthPage/Login'
import TeamPage from './Components/Teams/TeamPage'
import ChatRoom from './Components/Teams/ChatRoom'
import NotificationPage from './Components/Notification/NotificationPage'
import TaskPage from './Components/TaskPage/TaskPage'
import CompletedTaskPage from './Components/TaskPage/CompletedTaskPage'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/chat" element={<ChatRoom />} />
          <Route path="/notification" element={<NotificationPage />} />
          <Route path="/completed" element={<CompletedTaskPage />} />
          <Route path="/task" element={<TaskPage />} />
        </Route>
        <Route path="/login" element={<LogIn/>} />
        <Route path="/signUp" element={<SignUp />} />
        
       
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
