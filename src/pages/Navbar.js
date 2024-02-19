// Navbar.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
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
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={Link} href="/posts" onClick={toggleDrawer(false)} className={`${currentUrl === '/posts' ? styles.active : ''}`}>
        <ListItemText primary="Posts" />
      </ListItem>
      <ListItem button component={Link} href="/comments" onClick={toggleDrawer(false)} className={`${currentUrl === '/comments' ? styles.active : ''}`}>
        <ListItemText primary="Comments" />
      </ListItem>
      <ListItem button component={Link} href="/users" onClick={toggleDrawer(false)} className={`${currentUrl === '/users' ? styles.active : ''}`}>
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
        {drawerList}
      </Drawer>
    </div>
  );
};

export default Navbar;
