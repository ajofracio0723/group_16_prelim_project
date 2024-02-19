import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, Tooltip, Legend, LinearScale, PointElement, CategoryScale, BarElement, LineElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import Navbar from './Navbar';
import Toggle from 'react-toggle';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';

import 'react-toggle/style.css';

ChartJS.register(
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
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
        const posts = postsResponse.data;

        const todosPerUser = users.map(user => {
          const userTodos = todos.filter(todo => todo.userId === user.id);
          const userPostsCount = posts.filter(post => post.userId === user.id).length;
          return { userId: user.id, name: user.name, todos: userTodos.length, todosData: userTodos, postsCount: userPostsCount };
        });

        setData({
          users: users.length,
          posts: posts.length,
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

  const Widget = ({ title, value, icon, color }) => (
    <div style={{ width: '24%', padding: '10px', backgroundColor: color, borderRadius: '8px' }}>
      <div style={{ fontSize: '24px', marginBottom: '8px', color: 'white' }}>{icon}</div>
      <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>{title}</div>
      <div style={{ fontSize: '14px', marginTop: '4px', color: 'white' }}>{value}</div>
    </div>
  );

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

  const userPostsChartData = {
    labels: data.todosPerUser.map(user => user.name),
    datasets: [
      {
        label: 'Total Posts per User',
        data: data.todosPerUser.map(user => user.postsCount),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const userPostsChartOptions = {
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Widget title="Total Users" value={data.users} icon="👥" color={darkMode ? 'rgba(255, 99, 132, 0.6)' : 'rgba(255, 99, 132, 0.3)'} />
        <Widget title="Total Posts" value={data.posts} icon="📝" color={darkMode ? 'rgba(54, 162, 235, 0.6)' : 'rgba(54, 162, 235, 0.3)'} />
        <Widget title="Total Comments" value={data.comments} icon="💬" color={darkMode ? 'rgba(255, 206, 86, 0.6)' : 'rgba(255, 206, 86, 0.3)'} />
        <Widget title="Total Todos" value={data.todos} icon="✅" color={darkMode ? 'rgba(75, 192, 192, 0.6)' : 'rgba(75, 192, 192, 0.3)'} />
      </div>
      <div style={{ flex: 1, marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '32%', marginRight: '2%' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div style={{ width: '32%', marginLeft: '2%' }}>
          <Bar data={userTodosChartData} options={userTodosChartOptions} />
        </div>
        <div style={{ width: '32%', marginLeft: '2%' }}>
          <Line data={userPostsChartData} options={userPostsChartOptions} />
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
