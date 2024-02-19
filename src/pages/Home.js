import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, Tooltip, Legend, LinearScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Navbar from './Navbar';
import Toggle from 'react-toggle';
import { Button } from '@mui/material';
import { CategoryScale, BarElement } from 'chart.js';
import { useRouter } from 'next/router';

import 'react-toggle/style.css';

ChartJS.register(
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

const Home = () => {
  const [data, setData] = useState({
    users: 0,
    posts: 0,
    comments: 0,
    todos: 0,
    todosPerUser: [],
  });

  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, postsResponse, commentsResponse, todosResponse] = await Promise.all([
          axios.get('https://jsonplaceholder.typicode.com/users'),
          axios.get('https://jsonplaceholder.typicode.com/posts'),
          axios.get('https://jsonplaceholder.typicode.com/comments'),
          axios.get('https://jsonplaceholder.typicode.com/todos'),
        ]);

        const users = usersResponse.data;
        const todos = todosResponse.data;

        const todosPerUser = users.map(user => {
          const userTodos = todos.filter(todo => todo.userId === user.id);
          return { userId: user.id, name: user.name, todos: userTodos.length, todosData: userTodos };
        });

        setData({
          users: users.length,
          posts: postsResponse.data.length,
          comments: commentsResponse.data.length,
          todos: todos.length,
          todosPerUser,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', newDarkMode);
    }
  };

  const chartData = {
    labels: ['Users', 'Posts', 'Comments', 'Todos'],
    datasets: [
      {
        label: 'Data',
        data: [data.users, data.posts, data.comments, data.todos],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'category',
        ticks: {
          color: darkMode ? 'white' : 'black',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: darkMode ? 'white' : 'black',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: darkMode ? 'white' : 'black',
        },
      },
    },
  };

  const userTodosChartData = {
    labels: data.todosPerUser.map(user => user.name),
    datasets: [
      {
        label: 'Total Todos per User',
        data: data.todosPerUser.map(user => user.todos),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const userTodosChartOptions = {
    scales: {
      x: {
        type: 'category',
        ticks: {
          color: darkMode ? 'white' : 'black',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: darkMode ? 'white' : 'black',
        },
      },
    },
  };

  const navigateToTotalTodosPage = () => {
    router.push('/TotalTodosPage');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: darkMode ? 'black' : 'white' }}>
      <Navbar />
      <h1 style={{ textAlign: 'Left', color: darkMode ? 'white' : 'black', marginTop: '20px' }}>
        Dashboard
      </h1>
      <div style={{ flex: 1, marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '48%', marginRight: '2%' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div style={{ width: '48%', marginLeft: '2%' }}>
          <Bar data={userTodosChartData} options={userTodosChartOptions} />
        </div>
      </div>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Button onClick={navigateToTotalTodosPage} variant="contained" color="primary" sx={{ minWidth: '200px' }}>
          View Total Todos
        </Button>
      </div>
      <label>
        <Toggle checked={darkMode} onChange={toggleDarkMode} />
        {' '}
        Dark Mode
      </label>
    </div>
  );
};

export default Home;
