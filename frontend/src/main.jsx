import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import axios from 'axios';

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('jwtToken');
  
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <App />
  </StrictMode>,
)
