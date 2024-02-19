import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PostIcon from '@mui/icons-material/Assignment';
import CommentIcon from '@mui/icons-material/Comment';
import UsersIcon from '@mui/icons-material/People';
import styles from './component/Navbar.module.css';

const Navbar = () => {
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setCurrentUrl(router.pathname);
  }, [router.pathname]);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerList = (
    <List>
      <ListItem button component={Link} href="/" onClick={toggleDrawer(false)} className={`${currentUrl === '/' ? styles.active : ''}`}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={Link} href="/posts" onClick={toggleDrawer(false)} className={`${currentUrl === '/posts' ? styles.active : ''}`}>
        <ListItemIcon>
          <PostIcon />
        </ListItemIcon>
        <ListItemText primary="Posts" />
      </ListItem>
      <ListItem button component={Link} href="/comments" onClick={toggleDrawer(false)} className={`${currentUrl === '/comments' ? styles.active : ''}`}>
        <ListItemIcon>
          <CommentIcon />
        </ListItemIcon>
        <ListItemText primary="Comments" />
      </ListItem>
      <ListItem button component={Link} href="/users" onClick={toggleDrawer(false)} className={`${currentUrl === '/users' ? styles.active : ''}`}>
        <ListItemIcon>
          <UsersIcon />
        </ListItemIcon>
        <ListItemText primary="Users" />
      </ListItem>
    </List>
  );

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Prelim Project
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <div className={styles.drawerBackground}>{drawerList}</div>
      </Drawer>
    </div>
  );
};

export default Navbar;
