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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
      <Navbar />
      <div style={{ minHeight: '100vh', padding: '20px' }}>
        {loading && <CircularProgress style={{ margin: '10px' }} />}
        {error && <Typography variant="h6" color="error">{error}</Typography>}
        {!loading && !error && (
          <div>
            <Typography variant="h4" component="div" style={{ marginBottom: '20px', color: '#333' }}>
              Posts
            </Typography>
            <Grid container spacing={2}>
              {posts.map((post) => (
                <Grid item key={post.id} xs={12} sm={6} md={4} lg={3}>
                  <Card style={{ height: '100%', border: '2px solid #0F6BAE' }}>
                    <CardContent style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Avatar src={`https://i.pravatar.cc/40?u=${post.id}`} alt="Avatar" style={{ marginRight: '10px' }} />
                      <Typography variant="h6" component="div">
                        {post.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {post.body}
                      </Typography> 
                      <Button
                        onClick={() => handleToggleComments(post.id)}
                        variant="outlined"
                        style={{ marginTop: '10px' }}
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
          <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="md">
            <DialogTitle>Comments</DialogTitle>
            <DialogContent>
              {comments.map((comment, index) => (
                <div key={comment.id} style={{ borderBottom: '2px solid #83B8FF', marginBottom: '10px', paddingBottom: '10px', backgroundColor: index % 2 === 0 ? '#F0F0F0' : 'transparent' }}>
                  <Typography variant="subtitle2">{comment.name}</Typography>
                  <Typography variant="body1" style={{ marginTop: '5px' }}>{comment.body}</Typography>
                </div>
              ))}
            </DialogContent>
            <DialogActions style={{ justifyContent: 'center' }}>
              <Button onClick={handleCloseDialog} color="primary" variant="contained">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Posts;
