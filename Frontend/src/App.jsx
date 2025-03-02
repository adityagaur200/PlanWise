import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import Home from './Components/DashBoard/Home';
import SignUp from './Components/AuthPage/SignUp';
import LogIn from './Components/AuthPage/Login';
import TeamPage from './Components/Teams/TeamPage';
import ChatRoom from './Components/Teams/ChatRoom';
import NotificationPage from './Components/Notification/NotificationPage';
import TaskPage from './Components/TaskPage/TaskPage';

// Function to check if user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null; // Check if token exists
};

// Private Route Component
function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login and Signup Routes */}
        <Route path="/login" element={<LogIn />} />
        <Route path="/signUp" element={<SignUp />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="chat" element={<ChatRoom />} />
          <Route path="notification" element={<NotificationPage />} />
          <Route path="task" element={<TaskPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
