import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
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

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

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

  useEffect(() => {
    // Check if running on the client side
    if (typeof window !== 'undefined') {
      // Retrieve dark mode state from localStorage, default to 'false' if not present
      const savedDarkMode = localStorage.getItem('darkMode');
      setDarkMode(savedDarkMode === 'true');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => {
      // Check if running on the client side
      if (typeof window !== 'undefined') {
        // Save dark mode state to localStorage
        localStorage.setItem('darkMode', String(!prevDarkMode));
      }
      return !prevDarkMode;
    });
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <div>
      <CssBaseline />
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <ThemeProvider theme={theme}>
      <div style={{ backgroundColor: darkMode ? '#303030' : 'white', color: darkMode ? 'white' : 'black' }}>
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
