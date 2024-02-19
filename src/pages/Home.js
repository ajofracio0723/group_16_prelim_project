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
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    }
  }, []);

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
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const Widget = ({ title, value, icon, color }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        style={{
          width: '24%',
          padding: '10px',
          backgroundColor: color,
          borderRadius: '8px',
          color: 'white',
          transition: 'transform 0.3s',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{title}</div>
        <div style={{ fontSize: '14px', marginTop: '4px' }}>{value}</div>
      </div>
    );
  };

  const ChartWrapper = ({ children, style }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        style={{
          ...style,
          transition: 'border-color 0.3s',
          borderColor: isHovered ? 'orange' : (style.borderColor || 'initial'),
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </div>
    );
  };

  const chartData = {
    labels: ['Users', 'Posts', 'Comments', 'Todos'],
    datasets: [
      {
        label: 'Data',
        data: [data.users, data.posts, data.comments, data.todos],
        backgroundColor: ['rgba(0, 100, 255, 0.6)', 'rgba(0, 200, 100, 0.6)', 'rgba(255, 150, 0, 0.6)', 'rgba(150, 0, 255, 0.6)'],
        borderColor: ['rgba(0, 100, 255, 1)', 'rgba(0, 200, 100, 1)', 'rgba(255, 150, 0, 1)', 'rgba(150, 0, 255, 1)'],
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: darkMode ? 'black' : 'white', color: darkMode ? 'white' : 'black' }}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <h1 style={{ textAlign: 'Left', marginTop: '20px', marginLeft: '20px' }}>
        Dashboard
      </h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', marginLeft: '20px', marginRight: '20px' }}>
        <Widget title="Total Users" value={data.users} icon="👥" color={darkMode ? 'rgba(0, 100, 255, 0.8)' : 'rgba(0, 100, 255, 0.5)'} />
        <Widget title="Total Posts" value={data.posts} icon="📝" color={darkMode ? 'rgba(0, 200, 100, 0.8)' : 'rgba(0, 200, 100, 0.5)'} />
        <Widget title="Total Comments" value={data.comments} icon="💬" color={darkMode ? 'rgba(255, 150, 0, 0.8)' : 'rgba(255, 150, 0, 0.5)'} />
        <Widget title="Total Todos" value={data.todos} icon="✅" color={darkMode ? 'rgba(150, 0, 255, 0.8)' : 'rgba(150, 0, 255, 0.5)'} />
      </div>
      <div style={{ flex: 1, marginBottom: '20px', display: 'flex', justifyContent: 'space-between', marginLeft: '20px', marginRight: '20px' }}>
        <ChartWrapper style={{ width: '32%', border: '2px solid', borderColor: darkMode ? 'white' : 'black', borderRadius: '8px', margin: '0 0 20px 0' }}>
          <Bar data={chartData} options={chartOptions} />
        </ChartWrapper>
        <ChartWrapper style={{ width: '32%', border: '2px solid', borderColor: darkMode ? 'white' : 'black', borderRadius: '8px', margin: '0 0 20px 0' }}>
          <Bar data={userTodosChartData} options={userTodosChartOptions} />
        </ChartWrapper>
        <ChartWrapper style={{ width: '32%', border: '2px solid', borderColor: darkMode ? 'white' : 'black', borderRadius: '8px', margin: '0 0 20px 0' }}>
          <Line data={userPostsChartData} options={userPostsChartOptions} />
        </ChartWrapper>
      </div>
      <div style={{ textAlign: 'center', marginBottom: '20px', marginLeft: '20px', marginRight: '20px' }}>
        <Button onClick={navigateToTotalTodosPage} variant="contained" color="primary" sx={{ minWidth: '200px' }}>
          View Total Todos
        </Button>
      </div>
    </div>
  );
};

export default Home;
