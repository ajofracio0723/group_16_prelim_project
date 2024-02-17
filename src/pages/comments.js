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
    <div>
      <Navbar />
      <h1>ALL COMMENTS</h1>
      <div>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Comment</TableCell>
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
      <Button variant="outlined" style={{ marginTop: '20px' }}>
        View Comments
      </Button>
    </div>
  );
};

export default Comments;
