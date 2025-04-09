import { useState } from 'react'
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login/Login';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Pages/Dashboard/Dashboard';

function App() {
      return (
          <Router>
              <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
          </Router>
      )
}

export default App
