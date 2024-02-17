import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { Paper, Button, Collapse, Card, CardContent, Typography, Grid } from '@mui/material';
import { Visibility } from '@mui/icons-material';

const TotalTodosPage = () => {
  const [todosPerUser, setTodosPerUser] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

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

  return (
    <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh' }}>
      <Navbar />
      <Paper style={{ backgroundColor: 'black', color: 'white' }}>
        <Grid container spacing={2} justifyContent="center">
          {todosPerUser.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item.userId}>
              <Card
                style={{
                  backgroundColor: 'black',
                  borderRadius: '10px',
                  padding: '5px',
                  margin: '5px',
                  height: 'fit-content',
                  transition: 'transform 0.3s',
                  border: '2px solid #0F6BAE',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <CardContent style={{ textAlign: 'center' }}>
                  <Typography style={{ color: '#83B8FF' }} variant="h6" component="h2">
                    User ID: {item.userId}
                  </Typography>
                  <Typography style={{ color: '#C6CDFF' }} gutterBottom>
                    User Name: {item.name}
                  </Typography>
                  <Typography style={{ color: '#C6CDFF' }} gutterBottom>
                    Total TODOS: {item.todos}
                  </Typography>
                  <Button
                    startIcon={<Visibility />} 
                    onClick={() => handleToggleTodos(item.userId)}
                    variant="outlined"
                    style={{ color: 'white', backgroundColor: 'black', '&:hover': { backgroundColor: '#0F6BAE' } }} 
                  >
                    {selectedUserId === item.userId ? 'Hide Todos' : 'View Todos'}
                  </Button>
                  <Collapse in={selectedUserId === item.userId}>
                    <div style={{ color: '#ADD8E6' }}>
                      <h4>Todos for {item.name}</h4>
                      <ul>
                        {item.todosData.map(todo => (
                          <li key={todo.id}>{todo.title}</li>
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