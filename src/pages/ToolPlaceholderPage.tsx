import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import { useToolUsage } from '../hooks/useToolUsage';

export const ToolPlaceholderPage: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const { tools } = useToolUsage();

  const tool = tools.find((t) => t.id === toolId);

  if (!tool) {
    return (
      <Box component="main" sx={{ py: 4, flexGrow: 1 }}>
        <Container maxWidth="md">
          <Typography variant="h5" gutterBottom>
            Tool not found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            The requested tool does not exist. It may have been renamed or
            removed.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Back to dashboard
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ py: 4, flexGrow: 1 }}>
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom>
          {tool.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          This is a placeholder page for <strong>{tool.name}</strong>. Replace
          this content with the actual implementation of your tool when you are
          ready.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Description: {tool.description}
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Back to dashboard
        </Button>
      </Container>
    </Box>
  );
};

