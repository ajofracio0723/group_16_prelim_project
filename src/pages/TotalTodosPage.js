import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { Paper, Button, Collapse, Card, CardContent, Typography, Grid } from '@mui/material';
import { Visibility } from '@mui/icons-material';

const TotalTodosPage = () => {
  const [todosPerUser, setTodosPerUser] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    }
  }, []);

  useEffect(() => {
    const fetchTodosPerUser = async () => {
      try {
        const [usersResponse, todosResponse] = await Promise.all([
          axios.get('https://jsonplaceholder.typicode.com/users'),
          axios.get('https://jsonplaceholder.typicode.com/todos')
        ]);

        const users = usersResponse.data;
        const todos = todosResponse.data;

        const todosByUser = todos.reduce((acc, todo) => {
          if (!acc[todo.userId]) {
            acc[todo.userId] = [];
          }
          acc[todo.userId].push(todo);
          return acc;
        }, {});

        const formattedTodosPerUser = Object.keys(todosByUser).map(userId => {
          const user = users.find(user => user.id === parseInt(userId));
          return {
            userId: parseInt(userId),
            name: user ? user.name : 'Unknown',
            todos: todosByUser[userId].length,
            todosData: todosByUser[userId]
          };
        });

        setTodosPerUser(formattedTodosPerUser);
      } catch (error) {
        console.error('Error fetching todos per user:', error);
      }
    };

    fetchTodosPerUser();
  }, []);

  const handleToggleTodos = (userId) => {
    setSelectedUserId((prevUserId) => (prevUserId === userId ? null : userId));
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  return (
    <div style={{ backgroundColor: darkMode ? 'black' : 'white', color: darkMode ? 'white' : 'black', minHeight: '100vh' }}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Paper style={{ backgroundColor: darkMode ? 'black' : 'white', color: darkMode ? 'white' : 'black', outline: darkMode ? '2px solid #0F6BAE' : '2px solid #555', padding: '20px' }}>
        <Grid container spacing={2} justifyContent="center">
          {todosPerUser.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item.userId}>
              <Card
                style={{
                  backgroundColor: darkMode ? 'black' : 'white',
                  borderRadius: '10px',
                  padding: '5px',
                  margin: '5px',
                  height: 'fit-content',
                  transition: 'transform 0.3s',
                  border: darkMode ? '2px solid #0F6BAE' : '2px solid #555',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <CardContent style={{ textAlign: 'center' }}>
                  <Typography style={{ color: darkMode ? '#83B8FF' : '#1E1E1E', fontWeight: 'bold' }} variant="h6" component="h2">
                    User ID: {item.userId}
                  </Typography>
                  <Typography style={{ color: darkMode ? '#C6CDFF' : '#555', fontWeight: 'bold' }} gutterBottom>
                    User Name: {item.name}
                  </Typography>
                  <Typography style={{ color: darkMode ? '#C6CDFF' : '#555', fontWeight: 'bold' }} gutterBottom>
                    Total TODOS: {item.todos}
                  </Typography>
                  <Button
                    startIcon={<Visibility />} 
                    onClick={() => handleToggleTodos(item.userId)}
                    variant="outlined"
                    style={{ color: darkMode ? 'white' : 'black', backgroundColor: darkMode ? 'black' : 'white', '&:hover': { backgroundColor: darkMode ? '#0F6BAE' : '#ddd' } }} 
                  >
                    {selectedUserId === item.userId ? 'Hide Todos' : 'View Todos'}
                  </Button>
                  <Collapse in={selectedUserId === item.userId}>
                    <div style={{ color: darkMode ? '#ADD8E6' : '#333', fontWeight: 'bold' }}>
                      <h4>Todos for {item.name}</h4>
                      <ul>
                        {item.todosData.map(todo => (
                          <li key={todo.id} style={{ color: darkMode ? '#ADD8E6' : '#333' }}>{todo.title}</li>
                        ))}
                      </ul>
                    </div>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </div>
  );
};

export default TotalTodosPage;
