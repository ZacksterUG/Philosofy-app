import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  CssBaseline
} from '@mui/material';
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
  
export default function Login() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('jwtToken')) {
            navigate('/dashboard');
        }
    }, []);
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        if (!login || !password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }
    
        try {
            setIsLoading(true);
            
            const response = await axios.post('http://localhost:3000/auth/login', {
                login,
                password
            });
      
            const data = response.data;

      
            if (response.statusText !== 'OK') {
                throw new Error(data.message || 'Ошибка авторизации');
            }
      
            // Сохраняем токен в localStorage
            localStorage.setItem('jwtToken', data.token);
            
            // Перенаправляем на защищенную страницу
            navigate('/dashboard');
          
        } catch (err) {
            if (err.response && err.status === 401) {
                setError('Неправильный логин или пароль');
            } else {
                setError(err.message || 'Ошибка соединения с сервером');
            }
        } finally {
            setIsLoading(false);
        }
      };
  
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container 
          component="main" 
          maxWidth="xs"
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              p: 4,
              bgcolor: 'background.paper',
              boxShadow: 6,
              borderRadius: 2,
            }}
          >
            <Typography 
              component="h1" 
              variant="h5"
              sx={{ 
                textAlign: 'center',
                mb: 3,
                color: 'primary.main'
              }}
            >
              Авторизация
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit}>
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2,
                    '& .MuiAlert-icon': { color: 'error.light' }
                  }}
                >
                  {error}
                </Alert>
              )}
  
              <TextField
                fullWidth
                margin="normal"
                label="Логин"
                variant="outlined"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                disabled={isLoading}
                InputProps={{
                  style: { color: '#fff' }
                }}
              />
  
              <TextField
                fullWidth
                margin="normal"
                label="Пароль"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                InputProps={{
                  style: { color: '#fff' }
                }}
              />
  
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Войти'
                )}
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  };