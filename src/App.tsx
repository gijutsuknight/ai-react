import * as React from 'react';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { DashboardPage } from './pages/DashboardPage';
import { CameraToolPage } from './pages/CameraToolPage';
import { ToolPlaceholderPage } from './pages/ToolPlaceholderPage';

function App() {
  const appVersion = process.env.REACT_APP_VERSION ?? '-';

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Testing Tools Playground
          </Typography>
          <Typography variant="body2" component="div" sx={{ mr: 2 }}>
            v{appVersion}
          </Typography>
          <Typography variant="body2" component="div">
            Home · Tool Modules
          </Typography>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tools/camera-tool" element={<CameraToolPage />} />
        <Route path="/tools/:toolId" element={<ToolPlaceholderPage />} />
      </Routes>
    </Box>
  );
}

export default App;
