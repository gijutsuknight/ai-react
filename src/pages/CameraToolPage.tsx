import * as React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CameraTool } from '../components/CameraTool';

export const CameraToolPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box component="main" sx={{ py: 4, flexGrow: 1 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4" component="h1">
            Camera Tool
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/')}>
            Back to dashboard
          </Button>
        </Box>
        <CameraTool />
      </Container>
    </Box>
  );
};

