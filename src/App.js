import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import './styles/auth.css';
import './App.css';
import './styles/theme.css';
import './styles/layout.css';

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken || isTokenExpired(authToken)) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        {/* Add other protected routes here */}
      </Routes>
    </Router>
  );
};

export default App;
