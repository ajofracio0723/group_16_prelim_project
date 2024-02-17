import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, Button } from '@mui/material';

const Comments = () => {
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

  return (
    <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Navbar />
      <h1 style={{ color: '#83B8FF' }}>ALL COMMENTS</h1>
      <div style={{ width: '60%' }}>
        <Paper style={{ backgroundColor: 'black', color: 'white' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: '#C6CDFF', fontSize: '1.2rem', textAlign: 'center' }}>#</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comments.map((comment, index) => (
                <TableRow key={comment.id}>
                  <TableCell style={{ color: '#C6CDFF', fontSize: '1rem', textAlign: 'center' }}>{index + 1}</TableCell>
                  <TableCell style={{ color: 'white', fontSize: '1rem', textAlign: 'center' }}>{comment.body}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
      <Button
        variant="outlined"
        style={{
          color: 'white',
          borderColor: '#0F6BAE',
          marginTop: '20px',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#0F6BAE'; 
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
        }}
      >
        View Comments
      </Button>
    </div>
  );
};

export default Comments;