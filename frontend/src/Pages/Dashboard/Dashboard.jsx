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
    const [selectedRange, setSelectedRange] = useState({
        startIndex: 1,
        endIndex: 20
    });
    const [zoomDialogOpen, setZoomDialogOpen] = useState(false);
    const timerRef = useRef(null);
    

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
            setChartData(response.data);
          } catch (err) {
            if (err.response?.status === 401) {
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

    const handleBrushChange = useCallback((e) => {
        if (e.startIndex === undefined || e.endIndex === undefined) return;
        
        // Очищаем предыдущий таймер
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        console.log('1')
    
        // Устанавливаем новый таймер
        timerRef.current = setTimeout(() => {
          setSelectedRange({
            startIndex: e.startIndex,
            endIndex: e.endIndex,           
          });
        }, 500);
    }, []);

    useEffect(() => {
        return () => {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
        };
    }, []);
    
    const handleZoomClick = () => {
      setZoomDialogOpen(true);
    };

    const getFilteredData = () => {
      if (!selectedRange || !chartData) return chartData;
      return chartData.slice(selectedRange.startIndex, selectedRange.endIndex + 1);
    };

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
   
          <Box sx={{ height: '500px', mt: 3 }}>
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}
            margin={{ 
                bottom: 0 // Увеличиваем нижний отступ для места под Brush и подпись
              }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis 
                dataKey="comments" 
                stroke="#90caf9"
                tick={{ textAnchor: 'end', fontSize: 12 }}
                label={{value: 'Комментарии', dy: -30}}
                interval={30}
              />
              <YAxis 
                dataKey="likes"
                stroke="#90caf9"
                height={100}
                tick={{ fill: '#90caf9' }}
                label={{value: 'Лайки', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e1e1e',
                  border: '1px solid #333',
                  color: '#fff'
                }}
              />

              <Line type="monotone"
                    dataKey="likes"
                    strokeWidth={0} 
                    dot={{
                      fill: "#90caf9",
                      r: 3,               // Размер точек
                      strokeWidth: 0      // Убираем обводку точек
                    }}
              />
            </LineChart>
            </ResponsiveContainer>

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