import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Modal,
  Backdrop,
  Fade,
  Avatar,
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Error fetching posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
      setComments(response.data);
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      setComments([]);
    }
  };

  const handleToggleComments = async (postId) => {
    if (selectedPostId === postId) {
      setSelectedPostId(null);
      setComments([]);
    } else {
      setSelectedPostId(postId);
      await fetchComments(postId);
      setDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: darkMode ? 'black' : 'white', color: darkMode ? 'white' : '#333' }}>
        {loading && <CircularProgress style={{ margin: '10px' }} />}
        {error && <Typography variant="h6" color="error">{error}</Typography>}
        {!loading && !error && (
          <div>
            <Typography variant="h4" component="div" style={{ marginBottom: '20px', color: darkMode ? 'white' : '#333' }}>
              Posts
            </Typography>
            <Grid container spacing={2}>
              {posts.map((post) => (
                <Grid item key={post.id} xs={12} sm={6} md={4} lg={3}>
                  <Card style={{ height: '100%', border: `2px solid ${darkMode ? 'white' : '#0F6BAE'}`, backgroundColor: darkMode ? 'black' : 'transparent' }}>
                    <CardContent style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Avatar src={`https://i.pravatar.cc/40?u=${post.id}`} alt="Avatar" style={{ marginRight: '10px' }} />
                      <Typography variant="h6" component="div" style={{ color: darkMode ? 'white' : '#333' }}>
                        {post.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', color: darkMode ? 'white' : '#333' }}>
                        {post.body}
                      </Typography>
                      <Button
                        onClick={() => handleToggleComments(post.id)}
                        variant="outlined"
                        style={{ marginTop: '10px', borderColor: darkMode ? 'white' : '#0F6BAE', color: darkMode ? 'white' : '#0F6BAE' }}
                        startIcon={<CommentIcon />}
                      >
                        View Comments
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        )}

        {isDialogOpen && (
          <Modal
            open={isDialogOpen}
            onClose={handleCloseDialog}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Fade in={isDialogOpen}>
              <div style={{ backgroundColor: darkMode ? '#333' : 'white', padding: '20px', borderRadius: '8px', color: darkMode ? 'white' : '#333' }}>
                <Typography variant="h6" id="modal-title" style={{ color: darkMode ? '#ffffff' : '#0F6BAE', marginBottom: '20px' }}>
                  Comments
                </Typography>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ borderBottom: `1px solid ${darkMode ? '#555' : '#ddd'}`, padding: '10px', textAlign: 'left' }}>Name</th>
                      <th style={{ borderBottom: `1px solid ${darkMode ? '#555' : '#ddd'}`, padding: '10px', textAlign: 'left' }}>Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comments.map((comment, index) => (
                      <tr key={comment.id} style={{ borderBottom: `1px solid ${darkMode ? '#555' : '#ddd'}`, backgroundColor: darkMode ? '#202020' : '#F0F0F0' }}>
                        <td style={{ padding: '10px' }}>{comment.name}</td>
                        <td style={{ padding: '10px' }}>{comment.body}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ borderTop: `1px solid ${darkMode ? '#555' : '#ddd'}`, marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                  <Button
                    onClick={handleCloseDialog}
                    color="primary"
                    variant="contained"
                    style={{
                      backgroundColor: darkMode ? '#0F6BAE' : 'green',
                      color: darkMode ? '#ffffff' : darkMode ? '#0F6BAE' : 'black',
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </Fade>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Posts;
