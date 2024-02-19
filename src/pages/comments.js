import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Toggle from 'react-toggle';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CssBaseline,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import 'react-toggle/style.css'; // Import the default styles for react-toggle

const Comments = () => {
  const storedDarkMode = typeof window !== 'undefined' && localStorage.getItem('darkMode') === 'true';
  const [darkMode, setDarkMode] = useState(storedDarkMode);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/comments');
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', newDarkMode);
    }
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <div>
      <CssBaseline />
      <Navbar />
      <ThemeProvider theme={theme}>
        <div style={{ background: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#333' }}>
          <div>
            <label>
              <Toggle checked={darkMode} onChange={toggleDarkMode} />
              {' '}
              Dark Mode
            </label>
          </div>
          <h1>ALL COMMENTS</h1>
          <div>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 'bold' }}>#</TableCell>
                    <TableCell style={{ fontWeight: 'bold' }}>Comment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {comments.map((comment, index) => (
                    <TableRow key={comment.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{comment.body}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
};

export default Comments;
