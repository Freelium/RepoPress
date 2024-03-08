import React from 'react';
import { AppBar, IconButton, Toolbar, Typography}  from '@mui/material';
import appIcon from './assets/images/logo.png';

const Header = () => {
  return (
    <AppBar position="sticky" sx={{height: '10vh'}}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="app">
          <img src={appIcon} alt="App Icon" style={{ width: 60, height: 60 }} />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          "Si viveret, uteretur RepoPress™" - Johannes Gutenberg
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
