import * as React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useToolUsage } from '../hooks/useToolUsage';
import { ToolGrid } from '../components/ToolGrid';
import { Tool } from '../types/Tool';

export const DashboardPage: React.FC = () => {
  const { tools, incrementUsage } = useToolUsage();
  const navigate = useNavigate();

  const handleOpenTool = (tool: Tool) => {
    incrementUsage(tool.id);
    navigate(`/tools/${tool.id}`);
  };

  return (
    <Box component="main" sx={{ py: 4, flexGrow: 1 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Tool Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This page lists entry points for your testing tools. The most
            frequently used tools appear at the top. Replace placeholders with
            real tools as your needs evolve.
          </Typography>
        </Box>

        <ToolGrid tools={tools} onOpenTool={handleOpenTool} />
      </Container>
    </Box>
  );
};

