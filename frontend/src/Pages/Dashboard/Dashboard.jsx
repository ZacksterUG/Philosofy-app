import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Container,
  CssBaseline,
  Paper
} from '@mui/material';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer,
    Brush,
    AreaChart,
    Area
  } from 'recharts';
import axios from 'axios';
import { createTheme, ThemeProvider  } from '@mui/material/styles';


const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9',
      },
      secondary: {
        main: '#f48fb1',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
    },
    shape: {
      borderRadius: 8,
    },
  });

const Dashboard = () => {
    const navigate = useNavigate();
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        navigate('/');
    };
  
    useEffect(() => {
        const fetchData = async () => {
          const token = localStorage.getItem('jwtToken');
          if (!token) {
            navigate('/');
            return;
          }
          console.log(token)
          try {
            const response = await axios.get('http://localhost:3000/testdata', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            console.log(response.data)
          } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
              localStorage.removeItem('jwtToken');
              navigate('/');
            }
            setError(err.response?.data?.message 
              || err.message 
              || 'Ошибка загрузки данных');
          } finally {
            setLoading(false);
          }
        };
  
        fetchData();
    }, [navigate]);
    
    if (loading) return <CircularProgress sx={{ mt: 4 }} />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        
       <ThemeProvider theme={darkTheme}>
        <CssBaseline />
       <Container 
         component="main" 
         sx={{
           height: '100vh',
           width: '100vw',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
         }}
       >
      <Box sx={{
        height: '100%',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '0',
        padding: '0',
        p: 3,
        backgroundColor: '#121212'
      }}>
        <Box sx={{ width: '100%', maxWidth: 1200, mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
            sx={{ float: 'right' }}
          >
            Выйти
          </Button>
        </Box>
   
        <Paper sx={{ 
          p: 3, 
          width: '100%', 
          maxWidth: 1200,
          backgroundColor: '#1e1e1e'
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ color: '#90caf9', textAlign: 'center' }}
          >
            Аналитика взаимодействий
          </Typography>
   
          <Box sx={{ height: '500px', 
                     mt: 3,         
                     display: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center', }}>
            <img src="/plot.png" alt="Plot" style={{ maxHeight: '100%', maxWidth: '100%'}} />
          </Box>
   
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 2, 
              color: '#aaa', 
              textAlign: 'center' 
            }}
          >
          </Typography>
        </Paper>
      </Box>
      </Container>
      </ThemeProvider>
    );
};

export default Dashboard;